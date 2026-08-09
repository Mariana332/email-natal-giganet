import Link from "next/link";
import type { ButtonHTMLAttributes } from "react";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed";

const variants = {
  primary: "bg-nexa-teal text-nexa-black hover:bg-nexa-teal-dark hover:text-white",
  secondary:
    "bg-white text-nexa-charcoal border border-nexa-gray-light hover:bg-nexa-gray-light/60",
  danger: "bg-red-50 text-red-600 hover:bg-red-100",
  ghost: "text-nexa-charcoal hover:bg-nexa-gray-light/60",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
}) {
  return (
    <button
      {...props}
      className={`${base} ${variants[variant]} ${className}`}
    />
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  className = "",
  children,
}: {
  href: string;
  variant?: keyof typeof variants;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </Link>
  );
}
