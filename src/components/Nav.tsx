"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentProps } from "react";

export function Nav({ children }: { children: React.ReactNode }) {
  return (
    <nav className="w-full h-14 flex flex-row justify-center items-center gap-6 px-4">
      {children}
    </nav>
  );
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, "className">) {
  const pathname = usePathname();
  return (
    <Link
      {...props}
      className={`p-4 hover:text-slate-500 text-xl font-semibold ${
        pathname === props.href ? "text-blue-600" : "text-slate-600"
      }`}
    />
  );
}
