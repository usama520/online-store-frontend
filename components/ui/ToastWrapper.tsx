"use client";

import { useSyncExternalStore } from "react";
import { useToastContext } from "@/lib/providers/ToastProvider";
import { ToastContainer } from "./Toast";

// Subscribe returns a no-op unsubscribe
const emptySubscribe = () => () => {};

export const ToastWrapper = () => {
  const { toasts, removeToast } = useToastContext();
  // Track hydration without useEffect + setState
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!isMounted) {
    return null;
  }

  return <ToastContainer toasts={toasts} onClose={removeToast} />;
};
