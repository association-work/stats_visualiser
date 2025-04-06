import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type TypographyProps = {
  children: ReactNode;
  className?: string;
};

export const Typography = {
  Caption: ({ children, className }: TypographyProps) => (
    <p className={twMerge("text-caption font-base", className)}>{children}</p>
  ),
  Body: ({ children, className }: TypographyProps) => (
    <p className={twMerge("text-body font-base", className)}>{children}</p>
  ),
  BodyLg: ({ children, className }: TypographyProps) => (
    <p className={twMerge("text-bodyLg font-base", className)}>{children}</p>
  ),
};
