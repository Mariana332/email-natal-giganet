import { Suspense } from "react";
import { LoginForm } from "./login-form";
import { NexaLogo } from "@/components/nexa-logo";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full">
      <div className="relative hidden flex-1 flex-col justify-between bg-nexa-black p-12 lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(89,197,202,0.25), transparent 40%), radial-gradient(circle at 80% 70%, rgba(89,197,202,0.15), transparent 45%)",
          }}
        />
        <NexaLogo className="relative z-10" />
        <div className="relative z-10 max-w-md">
          <h1 className="font-heading text-3xl font-extrabold text-white">
            Sua ideia impressa com{" "}
            <span className="text-nexa-teal">velocidade e qualidade.</span>
          </h1>
          <p className="mt-4 text-sm text-white/60">
            Gestão completa da sua gráfica: orçamentos, produção, financeiro
            e estoque em um só lugar.
          </p>
        </div>
        <p className="relative z-10 text-xs text-white/40">
          © {new Date().getFullYear()} Nexa Print — Sistema de Gestão
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center bg-background p-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex justify-center lg:hidden">
            <NexaLogo light={false} />
          </div>
          <h2 className="font-heading text-2xl font-bold text-nexa-black">
            Entrar
          </h2>
          <p className="mt-1 text-sm text-nexa-gray">
            Acesse o painel de gestão da gráfica.
          </p>

          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
