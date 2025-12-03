"use client";

import { useEffect, useState } from "react";
import { useToastContext } from "@/lib/providers/ToastProvider";
import { ToastContainer } from "./Toast";

export const ToastWrapper = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { toasts, removeToast } = useToastContext();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <ToastContainer toasts={toasts} onClose={removeToast} />;
};
