import React from "react";
import { ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function EmptyState({ onAdd }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center mb-5">
        <ClipboardList className="w-8 h-8 text-accent-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">
        Nenhuma tarefa ainda
      </h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-xs">
        Comece criando sua primeira tarefa para organizar suas atividades.
      </p>
      <Button onClick={onAdd}>
        <Plus className="w-4 h-4 mr-2" />
        Nova Tarefa
      </Button>
    </div>
  );
}