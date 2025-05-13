
import * as React from "react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { UserRow } from "@/types/user"
import { useUsers } from "@/hooks/useUsers"

interface ResetPasswordDialogProps {
  user: UserRow | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ResetPasswordDialog({
  user,
  open,
  onOpenChange,
}: ResetPasswordDialogProps) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Use the hook with simplified resetPassword function
  const { resetPassword } = useUsers();

  const validatePassword = () => {
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres")
      return false
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem")
      return false
    }
    setError(null)
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (!validatePassword()) return

    setIsLoading(true)
    try {
      // Use the simplified resetPassword function
      const result = await resetPassword(user.id, password);

      if (!result.success) {
        throw new Error(result.error?.message || "Erro ao alterar a senha");
      }

      toast({
        title: "Senha alterada com sucesso",
        description: "A nova senha foi definida para o usuário."
      })

      onOpenChange(false)
      setPassword("")
      setConfirmPassword("")
    } catch (error: any) {
      console.error("Error resetting password:", error)
      toast({
        title: "Erro ao alterar senha",
        description: error.message || "Ocorreu um erro ao alterar a senha do usuário.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Alterar Senha</DialogTitle>
          <DialogDescription>
            Digite a nova senha para o usuário {user?.name || user?.email}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Nova Senha
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite a nova senha"
              required
              minLength={6}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirme a Nova Senha
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Digite a nova senha novamente"
              required
              minLength={6}
            />
          </div>
          {error && (
            <div className="text-sm text-red-500">{error}</div>
          )}
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Alterando..." : "Alterar Senha"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
