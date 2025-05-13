
import { type Toast, toast as sonnerToast } from "sonner"

export type ToastProps = Toast & {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

// Use interface to define the returned object structure
export interface UseToastReturn {
  toast: (props: ToastProps) => void
  dismiss: (toastId?: string) => void
  toasts: any[]
}

// Create a custom hook that returns properties
export const useToast = (): UseToastReturn => {
  return {
    toast: ({ title, description, variant, ...props }: ToastProps) => {
      sonnerToast(title, {
        description,
        className: variant === "destructive" ? "bg-destructive text-destructive-foreground" : undefined,
        ...props,
      })
    },
    dismiss: sonnerToast.dismiss,
    toasts: [],
  }
}

// Export the toast function directly
export const toast = ({ title, description, variant, ...props }: ToastProps) => {
  sonnerToast(title, {
    description,
    className: variant === "destructive" ? "bg-destructive text-destructive-foreground" : undefined,
    ...props,
  })
}
