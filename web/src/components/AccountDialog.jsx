import React, { useEffect, useState } from "react";
import { apiRequest } from "@/api/httpClient";
import { useAuth } from "@/lib/AuthContext";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Lock, LogOut } from "lucide-react";
import { toast } from "sonner";

export default function AccountDialog({ open, onOpenChange }) {
  const { logout } = useAuth();
  const [user, setUser] = useState(null);
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    apiRequest("/account/me")
      .then((account) => {
        setUser(account);
        setNewEmail(account?.email || "");
      })
      .catch((error) => toast.error(error.message || "Erro ao carregar conta."));
  }, [open]);

  const handleEmailChange = async (event) => {
    event.preventDefault();
    if (!newEmail.trim()) return;

    setLoading(true);
    try {
      const updatedUser = await apiRequest("/account/me", {
        method: "PUT",
        body: { email: newEmail },
      });
      setUser(updatedUser);
      setNewEmail(updatedUser?.email || "");
      toast.success("E-mail atualizado. Entre novamente.");
      logout();
    } catch (error) {
      toast.error(error.message || "Erro ao atualizar e-mail.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (event) => {
    event.preventDefault();

    if (!currentPassword) {
      toast.error("Informe a senha atual.");
      return;
    }

    if (!newPassword || newPassword !== confirmPassword) {
      toast.error("As senhas nao coincidem.");
      return;
    }

    setLoading(true);
    try {
      await apiRequest("/account/me/password", {
        method: "PUT",
        body: {
          currentPassword,
          newPassword,
        },
      });
      toast.success("Senha atualizada!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error.message || "Erro ao atualizar senha.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Minha Conta
          </DialogTitle>
        </DialogHeader>

        <div className="bg-muted/50 rounded-lg p-4 space-y-1">
          <p className="text-sm font-medium text-foreground">{user?.email || "-"}</p>
          <p className="text-xs text-muted-foreground capitalize">
            Perfil: {user?.role || "ROLE_USER"}
          </p>
        </div>

        <Separator />

        <form onSubmit={handleEmailChange} className="space-y-3">
          <Label className="flex items-center gap-1.5 text-sm font-medium">
            <Mail className="w-3.5 h-3.5" /> Trocar e-mail
          </Label>
          <Input
            type="email"
            value={newEmail}
            onChange={(event) => setNewEmail(event.target.value)}
            placeholder="novo@email.com"
            autoComplete="email"
          />
          <Button type="submit" size="sm" variant="outline" disabled={loading} className="w-full">
            Atualizar e-mail
          </Button>
        </form>

        <Separator />

        <form onSubmit={handlePasswordChange} className="space-y-3">
          <Label className="flex items-center gap-1.5 text-sm font-medium">
            <Lock className="w-3.5 h-3.5" /> Trocar senha
          </Label>
          <Input
            type="password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            placeholder="Senha atual"
            autoComplete="current-password"
          />
          <Input
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder="Nova senha"
            autoComplete="new-password"
          />
          <Input
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="Confirmar nova senha"
            autoComplete="new-password"
          />
          <Button type="submit" size="sm" variant="outline" disabled={loading} className="w-full">
            Atualizar senha
          </Button>
        </form>

        <Separator />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => logout()}
          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sair da conta
        </Button>
      </DialogContent>
    </Dialog>
  );
}
