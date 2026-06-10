"use client";

import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export const AlertDialog = AlertDialogPrimitive.Root;
export const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
export const AlertDialogCancel = AlertDialogPrimitive.Cancel;
export const AlertDialogAction = AlertDialogPrimitive.Action;

export function AlertDialogContent({
  className,
  title,
  description,
  children
}: AlertDialogPrimitive.AlertDialogContentProps & { title: string; description: string }) {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Overlay className="dialog-overlay" />
      <AlertDialogPrimitive.Content className={cn("dialog-content dialog-content-sm", className)}>
        <AlertDialogPrimitive.Title>{title}</AlertDialogPrimitive.Title>
        <AlertDialogPrimitive.Description className="muted">{description}</AlertDialogPrimitive.Description>
        <div className="dialog-actions">{children}</div>
      </AlertDialogPrimitive.Content>
    </AlertDialogPrimitive.Portal>
  );
}

export function ConfirmDelete({
  title,
  description,
  onConfirm,
  trigger
}: {
  title: string;
  description: string;
  onConfirm: () => void | Promise<void>;
  trigger: ReactNode;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent title={title} description={description}>
        <AlertDialogCancel asChild><Button variant="secondary">取消</Button></AlertDialogCancel>
        <AlertDialogAction asChild><Button variant="danger" onClick={onConfirm}>确认</Button></AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  );
}
