
import { useToast as useToastHook } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";

export const useToast = useToastHook;

// Enhanced toast with error logging
export const toast = {
  ...sonnerToast,
  error: (message: string, error?: any) => {
    if (error) {
      console.error(`Toast Error: ${message}`, error);
    } else {
      console.error(`Toast Error: ${message}`);
    }
    return sonnerToast.error(message);
  }
};
