"use client";

import type { Result } from "@/lib/types";
import { useActionState } from "react";

export function ActionForm({
  action,
  children,
  className,
}: {
  action: (state: Result | null, formData: FormData) => Promise<Result>;
  children: React.ReactNode;
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  return (
    <form action={formAction} className={`grid gap-4 ${className ?? ""}`}>
      {state && !state.ok ? (
        <p role="alert" className="rounded-lg bg-red-50 px-4 py-3 text-base text-red-950 ring-1 ring-red-800">
          {state.error}
        </p>
      ) : null}
      {state?.ok && state.message ? (
        <p role="status" className="rounded-lg bg-emerald-50 px-4 py-3 text-base text-emerald-950 ring-1 ring-emerald-800">
          {state.message}
        </p>
      ) : null}
      {state?.ok && state.devLink ? (
        <p className="rounded-lg bg-amber-50 px-4 py-3 text-base break-all">
          示範登入連結：{" "}
          <a className="font-medium underline" href={state.devLink}>
            {state.devLink}
          </a>
        </p>
      ) : null}
      <div className={`grid gap-4 ${pending ? "opacity-70" : ""}`} aria-busy={pending}>
        {children}
      </div>
    </form>
  );
}
