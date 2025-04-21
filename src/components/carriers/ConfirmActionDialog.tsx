
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import type { Carrier } from "@/types/carrier";

interface ConfirmActionDialogProps {
  open: boolean;
  action: "delete" | "deactivate";
  carrier: Carrier;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmActionDialog({ open, action, carrier, onConfirm, onCancel }: ConfirmActionDialogProps) {
  let message: ReactNode = "";
  switch (action) {
    case "delete":
      message = <>Deseja realmente excluir a transportadora <b>{carrier.name}</b>? Esta ação é irreversível.</>;
      break;
    case "deactivate":
      message = <>Deseja desativar a transportadora <b>{carrier.name}</b>?</>;
      break;
    default:
      message = "";
  }
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirme a ação</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
          {action === "delete" && (
            <Button variant="destructive" onClick={onConfirm}>Excluir</Button>
          )}
          {action === "deactivate" && (
            <Button variant="outline" onClick={onConfirm}>Desativar</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
