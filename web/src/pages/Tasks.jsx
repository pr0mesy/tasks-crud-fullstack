import React, { useState } from "react";
import { tasksApi } from "@/api/tasksApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, ListTodo, UserCircle } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import TaskCard from "@/components/tasks/TaskCard";
import TaskFormDialog from "@/components/tasks/TaskFormDialog";
import EmptyState from "@/components/tasks/EmptyState";
import AccountDialog from "@/components/AccountDialog";

export default function Tasks() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todas");
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: tasksApi.list,
  });

  const showMutationError = (error) => {
    toast.error(error.message || "Erro ao salvar tarefa.");
  };

  const createMutation = useMutation({
    mutationFn: tasksApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setDialogOpen(false);
      toast.success("Tarefa criada!");
    },
    onError: showMutationError,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => tasksApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setDialogOpen(false);
      setEditingTask(null);
      toast.success("Tarefa atualizada!");
    },
    onError: showMutationError,
  });

  const deleteMutation = useMutation({
    mutationFn: tasksApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Tarefa excluida!");
    },
    onError: showMutationError,
  });

  const handleSubmit = (formData) => {
    if (editingTask) {
      updateMutation.mutate({ id: editingTask.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleDelete = (task) => {
    deleteMutation.mutate(task.id);
  };

  const handleStatusChange = (task, newStatus) => {
    updateMutation.mutate({ id: task.id, data: { ...task, status: newStatus } });
  };

  const openNewDialog = () => {
    setEditingTask(null);
    setDialogOpen(true);
  };

  const filtered = tasks.filter((task) => {
    const normalizedSearch = search.toLowerCase();
    const matchesSearch =
      !normalizedSearch ||
      task.title?.toLowerCase().includes(normalizedSearch) ||
      task.description?.toLowerCase().includes(normalizedSearch);
    const matchesStatus = statusFilter === "todas" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const counts = {
    todas: tasks.length,
    pendente: tasks.filter((task) => task.status === "pendente").length,
    em_progresso: tasks.filter((task) => task.status === "em_progresso").length,
    concluida: tasks.filter((task) => task.status === "concluida").length,
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
              <ListTodo className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Tarefas</h1>
              <p className="text-sm text-muted-foreground">
                {counts.todas} tarefa{counts.todas !== 1 && "s"} | {counts.concluida} concluida{counts.concluida !== 1 && "s"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setAccountOpen(true)}
              aria-label="Minha conta"
            >
              <UserCircle className="w-4 h-4" />
            </Button>
            <Button onClick={openNewDialog} size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Nova
            </Button>
          </div>
        </div>

        {tasks.length > 0 && (
          <div className="space-y-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar tarefas..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs value={statusFilter} onValueChange={setStatusFilter}>
              <TabsList className="w-full grid grid-cols-4">
                <TabsTrigger value="todas">
                  Todas <span className="ml-1.5 text-xs opacity-60">{counts.todas}</span>
                </TabsTrigger>
                <TabsTrigger value="pendente">
                  Pendente <span className="ml-1.5 text-xs opacity-60">{counts.pendente}</span>
                </TabsTrigger>
                <TabsTrigger value="em_progresso">
                  Progresso <span className="ml-1.5 text-xs opacity-60">{counts.em_progresso}</span>
                </TabsTrigger>
                <TabsTrigger value="concluida">
                  Feitas <span className="ml-1.5 text-xs opacity-60">{counts.concluida}</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState onAdd={openNewDialog} />
        ) : filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-16 text-sm">
            Nenhuma tarefa encontrada.
          </p>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <TaskFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editingTask}
        onSubmit={handleSubmit}
      />
      <AccountDialog open={accountOpen} onOpenChange={setAccountOpen} />
    </div>
  );
}
