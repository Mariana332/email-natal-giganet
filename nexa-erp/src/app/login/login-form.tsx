"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { loginAction } from "./actions";

export function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [state, action, pending] = useActionState(loginAction, {
    error: null,
  });

  return (
    <form action={action} className="mt-6 space-y-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      <div>
        <label className="mb-1 block text-sm font-medium text-nexa-charcoal">
          E-mail
        </label>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="voce@nexaprint.com.br"
          className="w-full rounded-lg border border-nexa-gray-light bg-white px-3 py-2 text-sm outline-none focus:border-nexa-teal focus:ring-2 focus:ring-nexa-teal/30"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-nexa-charcoal">
          Senha
        </label>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className="w-full rounded-lg border border-nexa-gray-light bg-white px-3 py-2 text-sm outline-none focus:border-nexa-teal focus:ring-2 focus:ring-nexa-teal/30"
        />
      </div>

      {state.error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-nexa-teal px-4 py-2.5 text-sm font-semibold text-nexa-black transition hover:bg-nexa-teal-dark hover:text-white disabled:opacity-60"
      >
        {pending ? "Entrando..." : "Entrar"}
      </button>

      <p className="text-center text-xs text-nexa-gray">
        Acesso restrito à equipe Nexa Print.
      </p>
    </form>
  );
}
