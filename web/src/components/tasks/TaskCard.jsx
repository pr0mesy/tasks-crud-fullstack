import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Circle, ArrowUpCircle, CheckCircle2 } from "lucide-react";

const statusConfig = {
  pendente: { label: "Pendente", icon: Circle, color: "bg-muted text-muted-foreground" },
  em_progresso: { label: "Em Progresso", icon: ArrowUpCircle, color: "bg-accent text-accent-foreground" },
  concluida: { label: "Concluída", icon: CheckCircle2, color: "bg-primary/10 text-primary" },
};

const priorityConfig = {
  baixa: { label: "Baixa", color: "bg-secondary text-secondary-foreground" },
  media: { label: "Média", color: "bg-amber-100 text-amber-700" },
  alta: { label: "Alta", color: "bg-red-100 text-red-600" },
};

export default function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const status = statusConfig[task.status] || statusConfig.pendente;
  const priority = priorityConfig[task.priority] || priorityConfig.media;
  const StatusIcon = status.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="group p-5 hover:shadow-md transition-all duration-200 border border-border/60">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <button
              onClick={() => {
                const next = task.status === "pendente"
                  ? "em_progresso"
                  : task.status === "em_progresso"
                  ? "concluida"
                  : "pendente";
                onStatusChange(task, next);
              }}
              className="mt-0.5 shrink-0 transition-transform hover:scale-110"
            >
              <StatusIcon
                className={`w-5 h-5 ${
                  task.status === "concluida"
                    ? "text-primary"
                    : task.status === "em_progresso"
                    ? "text-accent-foreground"
                    : "text-muted-foreground"
                }`}
              />
            </button>
            <div className="min-w-0 flex-1">
              <h3
                className={`font-medium leading-snug ${
                  task.status === "concluida"
                    ? "line-through text-muted-foreground"
                    : "text-foreground"
                }`}
              >
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="secondary" className={`text-xs font-medium ${priority.color}`}>
                  {priority.label}
                </Badge>
                <Badge variant="secondary" className={`text-xs font-medium ${status.color}`}>
                  {status.label}
                </Badge>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Pencil className="w-4 h-4 mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(task)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>
    </motion.div>
  );
}