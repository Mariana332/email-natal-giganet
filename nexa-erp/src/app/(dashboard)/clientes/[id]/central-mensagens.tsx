"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Send, MessageSquareText, Trash2 } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { registrarMensagem, excluirMensagem } from "../mensagens-actions";
import type { DirecaoMensagem } from "@/generated/prisma/enums";

export type Template = { id: string; nome: string; conteudo: string };
export type MensagemItem = {
  id: string;
  conteudo: string;
  direcao: DirecaoMensagem;
  data: string;
  usuario: string | null;
};

export function CentralMensagens({
  clienteId,
  clienteNome,
  telefone,
  templates,
  mensagens,
}: {
  clienteId: string;
  clienteNome: string;
  telefone: string | null;
  templates: Template[];
  mensagens: MensagemItem[];
}) {
  const router = useRouter();
  const [texto, setTexto] = useState("");
  const [mostrarRecebida, setMostrarRecebida] = useState(false);
  const [textoRecebida, setTextoRecebida] = useState("");
  const [pending, startTransition] = useTransition();

  function aplicarTemplate(id: string) {
    const t = templates.find((x) => x.id === id);
    if (!t) return;
    setTexto(t.conteudo.replaceAll("{nome}", clienteNome));
  }

  function enviar() {
    if (!texto.trim() || !telefone) return;
    const url = buildWhatsAppUrl(telefone, texto);
    const conteudo = texto;
    setTexto("");
    startTransition(() => {
      registrarMensagem(clienteId, conteudo, "ENVIADA").then(() => router.refresh());
    });
    if (url) window.open(url, "_blank");
  }

  function registrarRecebida() {
    if (!textoRecebida.trim()) return;
    const conteudo = textoRecebida;
    setTextoRecebida("");
    setMostrarRecebida(false);
    startTransition(() => {
      registrarMensagem(clienteId, conteudo, "RECEBIDA").then(() => router.refresh());
    });
  }

  function excluir(id: string) {
    startTransition(() => {
      excluirMensagem(id, clienteId).then(() => router.refresh());
    });
  }

  return (
    <div className="mt-6 rounded-xl border border-nexa-gray-light bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-heading text-base font-bold text-nexa-black">
          <MessageSquareText className="h-4 w-4 text-nexa-teal-dark" /> Central de Mensagens
        </h2>
        <button
          type="button"
          onClick={() => setMostrarRecebida((v) => !v)}
          className="text-xs font-semibold text-nexa-teal-dark hover:underline"
        >
          + Registrar resposta do cliente
        </button>
      </div>

      {!telefone && (
        <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Cadastre um telefone ou WhatsApp para este cliente para poder enviar mensagens.
        </p>
      )}

      {mostrarRecebida && (
        <div className="mb-4 space-y-2 rounded-lg border border-nexa-gray-light bg-nexa-gray-light/20 p-3">
          <textarea
            value={textoRecebida}
            onChange={(e) => setTextoRecebida(e.target.value)}
            rows={2}
            placeholder="O que o cliente respondeu?"
            className="w-full rounded-lg border border-nexa-gray-light bg-white px-3 py-2 text-sm text-nexa-black outline-none focus:border-nexa-teal"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setMostrarRecebida(false)}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-nexa-gray hover:bg-nexa-gray-light/60"
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={!textoRecebida.trim() || pending}
              onClick={registrarRecebida}
              className="rounded-lg bg-nexa-teal px-3 py-1.5 text-xs font-semibold text-nexa-black hover:bg-nexa-teal-dark disabled:opacity-50"
            >
              Registrar
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {templates.length > 0 && (
          <select
            onChange={(e) => {
              if (e.target.value) aplicarTemplate(e.target.value);
              e.target.value = "";
            }}
            defaultValue=""
            className="w-full rounded-lg border border-nexa-gray-light bg-white px-3 py-2 text-sm text-nexa-black outline-none focus:border-nexa-teal"
          >
            <option value="" disabled>
              Usar um modelo de mensagem...
            </option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nome}
              </option>
            ))}
          </select>
        )}
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={3}
          placeholder="Escreva a mensagem..."
          className="w-full rounded-lg border border-nexa-gray-light bg-white px-3 py-2 text-sm text-nexa-black outline-none focus:border-nexa-teal"
        />
        <div className="flex justify-end">
          <button
            type="button"
            disabled={!texto.trim() || !telefone || pending}
            onClick={enviar}
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50"
          >
            <Send className="h-4 w-4" /> Enviar por WhatsApp
          </button>
        </div>
      </div>

      <div className="mt-5 space-y-2 border-t border-nexa-gray-light pt-4">
        {mensagens.length === 0 && (
          <p className="text-sm text-nexa-gray">Nenhuma mensagem registrada ainda.</p>
        )}
        {mensagens.map((m) => (
          <div
            key={m.id}
            className={`group rounded-lg p-2.5 text-sm ${
              m.direcao === "ENVIADA" ? "bg-nexa-teal/10" : "bg-nexa-gray-light/50"
            }`}
          >
            <div className="flex items-center justify-between text-xs text-nexa-gray">
              <span>
                {m.direcao === "ENVIADA" ? "Enviada" : "Recebida"}
                {m.usuario ? ` · ${m.usuario}` : ""} · {m.data}
              </span>
              <button
                type="button"
                onClick={() => excluir(m.id)}
                className="text-nexa-gray opacity-0 transition group-hover:opacity-100 hover:text-red-600"
                title="Excluir registro"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <p className="mt-1 whitespace-pre-wrap text-nexa-charcoal">{m.conteudo}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
