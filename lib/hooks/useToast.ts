import { useToastContext, ToastType } from "../providers/ToastProvider";

export const useToast = () => {
  const { addToast } = useToastContext();

  const showToast = (message: string, type: ToastType = "info") => {
    addToast(message, type);
  };

  const showSuccess = (message: string) => {
    addToast(message, "success");
  };

  const showError = (message: string) => {
    addToast(message, "error");
  };

  const showInfo = (message: string) => {
    addToast(message, "info");
  };

  return {
    showToast,
    showSuccess,
    showError,
    showInfo,
  };
};
