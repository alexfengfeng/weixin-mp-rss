import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "ghost" | "danger";
  size?: "default" | "sm" | "icon";
};

export function Button({ className, variant = "default", size = "default", ...props }: ButtonProps) {
  return <button className={cn("ui-button", `ui-button-${variant}`, `ui-button-${size}`, className)} {...props} />;
}

export function LinkButton({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & Pick<ButtonProps, "variant" | "size">) {
  return <a className={cn("ui-button", `ui-button-${variant}`, `ui-button-${size}`, className)} {...props} />;
}
