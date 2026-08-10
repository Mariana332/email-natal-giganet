"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";

type Resultado = { id: string; nome: string; subtitulo: string };

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [aberto, setAberto] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [clientes, setClientes] = useState<Resultado[]>([]);
  const [fornecedores, setFornecedores] = useState<Resultado[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setAberto(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => {
      setCarregando(true);
      fetch(`/api/busca?q=${encodeURIComponent(query)}`, { signal: controller.signal })
        .then((res) => (res.ok ? res.json() : { clientes: [], fornecedores: [] }))
        .then((data) => {
          setClientes(data.clientes ?? []);
          setFornecedores(data.fornecedores ?? []);
        })
        .catch(() => {})
        .finally(() => setCarregando(false));
    }, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  const buscaAtiva = query.trim().length >= 2;
  const clientesVisiveis = buscaAtiva ? clientes : [];
  const fornecedoresVisiveis = buscaAtiva ? fornecedores : [];
  const semResultados =
    buscaAtiva && !carregando && clientesVisiveis.length === 0 && fornecedoresVisiveis.length === 0;

  function irPara(href: string) {
    setAberto(false);
    setQuery("");
    router.push(href);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-nexa-gray" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setAberto(true);
          }}
          onFocus={() => setAberto(true)}
          placeholder="Buscar por nome, CPF/CNPJ, CEP, e-mail, telefone..."
          className="w-full rounded-lg border border-nexa-gray-light bg-nexa-gray-light/30 py-2 pl-9 pr-8 text-sm text-nexa-black outline-none transition focus:border-nexa-teal focus:bg-white focus:ring-2 focus:ring-nexa-teal/30"
        />
        {carregando && (
          <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-nexa-gray" />
        )}
      </div>

      {aberto && buscaAtiva && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-96 overflow-y-auto rounded-xl border border-nexa-gray-light bg-white py-1 shadow-lg">
          {clientesVisiveis.length > 0 && (
            <div>
              <p className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-nexa-gray">
                Clientes
              </p>
              {clientesVisiveis.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => irPara(`/clientes/${c.id}`)}
                  className="flex w-full flex-col items-start px-3 py-2 text-left text-sm hover:bg-nexa-gray-light/40"
                >
                  <span className="font-medium text-nexa-black">{c.nome}</span>
                  {c.subtitulo && <span className="text-xs text-nexa-gray">{c.subtitulo}</span>}
                </button>
              ))}
            </div>
          )}
          {fornecedoresVisiveis.length > 0 && (
            <div>
              <p className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-nexa-gray">
                Fornecedores
              </p>
              {fornecedoresVisiveis.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => irPara(`/fornecedores/${f.id}`)}
                  className="flex w-full flex-col items-start px-3 py-2 text-left text-sm hover:bg-nexa-gray-light/40"
                >
                  <span className="font-medium text-nexa-black">{f.nome}</span>
                  {f.subtitulo && <span className="text-xs text-nexa-gray">{f.subtitulo}</span>}
                </button>
              ))}
            </div>
          )}
          {semResultados && (
            <p className="px-3 py-4 text-center text-sm text-nexa-gray">Nenhum resultado encontrado.</p>
          )}
        </div>
      )}
    </div>
  );
}
