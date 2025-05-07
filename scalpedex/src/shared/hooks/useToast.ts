// /src/shared/hooks/useToast.ts
import { toast } from 'sonner';

export function useToast() {
  const showSuccess = (message: string, options?: any) => {
    toast.success(message, options);
  };
  
  const showError = (message: string, options?: any) => {
    toast.error(message, options);
  };
  
  const showInfo = (message: string, options?: any) => {
    toast(message, options);
  };
  
  const showWarning = (message: string, options?: any) => {
    toast.warning(message, options);
  };
  
  const showCustom = (render: (id: string) => React.ReactNode, options?: any) => {
    toast.custom(render, options);
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