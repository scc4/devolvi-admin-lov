
import { toast as sonnerToast } from "sonner"
import type { ExternalToast } from "sonner" // Import the exact type from sonner

// According to sonner's API, we need to define our own Toast type since it's not exported
export type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
  // Include other properties from sonner's toast function
  id?: string | number
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
  // Fix cancel type to match Action interface (onClick is required)
  cancel?: {
    label: string
    onClick: () => void
  }
  onDismiss?: () => void
  onAutoClose?: () => void
  className?: string
  [key: string]: any
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
      } as ExternalToast)
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
  } as ExternalToast)
}
