"use client";

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Toaster as Sonner } from "sonner";
import type { ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-slate-950 group-[.toaster]:border-slate-200 group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-slate-500",
          actionButton:
            "group-[.toast]:bg-slate-900 group-[.toast]:text-slate-50",
          cancelButton:
            "group-[.toast]:bg-slate-100 group-[.toast]:text-slate-500",
          success:
            "group-[.toaster]:bg-emerald-50 group-[.toaster]:text-emerald-800 group-[.toaster]:border-emerald-200",
          error:
            "group-[.toaster]:bg-red-50 group-[.toaster]:text-red-800 group-[.toaster]:border-red-200",
          warning:
            "group-[.toaster]:bg-yellow-50 group-[.toaster]:text-yellow-800 group-[.toaster]:border-yellow-200",
          info: "group-[.toaster]:bg-blue-50 group-[.toaster]:text-blue-800 group-[.toaster]:border-blue-200",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
