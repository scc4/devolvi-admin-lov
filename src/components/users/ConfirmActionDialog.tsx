
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ReactNode, useEffect } from "react";

interface ConfirmActionDialogProps {
  open: boolean;
  action: "delete" | "deactivate" | "invite";
  user: { name: string | null, email: string | null };
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmActionDialog({ open, action, user, onConfirm, onCancel }: ConfirmActionDialogProps) {
  let message: ReactNode = "";
  switch (action) {
    case "delete":
      message = <>Deseja realmente excluir o usuário <b>{user.name}</b>? Esta ação é irreversível.</>;
      break;
    case "deactivate":
      message = <>Deseja inativar o usuário <b>{user.name}</b>?</>;
      break;
    case "invite":
      message = <>Deseja reenviar o convite para <b>{user.name}</b> ({user.email})?</>;
      break;
    default:
      message = "";
  }

  // Enhanced cleanup when dialog is closed
  useEffect(() => {
    if (!open) {
      // Clean up any lingering portal elements and reset pointer-events
      const cleanup = () => {
        document.body.style.pointerEvents = '';
        const overlays = document.querySelectorAll('[data-radix-portal]');
        overlays.forEach(overlay => {
          if (!overlay.contains(document.activeElement)) {
            (overlay as HTMLElement).style.display = 'none';
          }
        });
      };
      
      // Execute cleanup with a small delay to ensure dialog animations complete
      const timeoutId = setTimeout(cleanup, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [open]);

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
            <Button variant="outline" onClick={onConfirm}>Inativar</Button>
          )}
          {action === "invite" && (
            <Button variant="outline" onClick={onConfirm}>Reenviar convite</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
