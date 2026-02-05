// /src/shared/hooks/useToast.ts
import { toast } from 'sonner';

export function useToast() {
  const showSuccess = (message: string, options?: Record<string, unknown>) => {
    toast.success(message, options);
  };

  const showError = (message: string, options?: Record<string, unknown>) => {
    toast.error(message, options);
  };

  const showInfo = (message: string, options?: Record<string, unknown>) => {
    toast(message, options);
  };

  const showWarning = (message: string, options?: Record<string, unknown>) => {
    toast.warning(message, options);
  };
  
  const showCustom = (render: (id: string | number) => React.ReactNode, options?: Record<string, unknown>) => {
    toast.custom(render as Parameters<typeof toast.custom>[0], options);
  };
  
  return {
    success: showSuccess,
    error: showError,
    info: showInfo,
    warning: showWarning,
    custom: showCustom,
    dismiss: toast.dismiss
  };
}