"use client";

import { useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { buscarCep } from "@/lib/cep";
import type { Cliente } from "@/generated/prisma/client";

export function ClienteFields({ defaultValues }: { defaultValues?: Cliente }) {
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [cepNaoEncontrado, setCepNaoEncontrado] = useState(false);
  const enderecoRef = useRef<HTMLInputElement>(null);
  const bairroRef = useRef<HTMLInputElement>(null);
  const cidadeRef = useRef<HTMLInputElement>(null);
  const estadoRef = useRef<HTMLInputElement>(null);
  const numeroRef = useRef<HTMLInputElement>(null);

  async function handleCepBlur(e: React.FocusEvent<HTMLInputElement>) {
    const cep = e.target.value;
    if (cep.replace(/\D/g, "").length !== 8) return;

    setBuscandoCep(true);
    setCepNaoEncontrado(false);
    const resultado = await buscarCep(cep);
    setBuscandoCep(false);

    if (!resultado) {
      setCepNaoEncontrado(true);
      return;
    }

    if (enderecoRef.current) enderecoRef.current.value = resultado.logradouro;
    if (bairroRef.current) bairroRef.current.value = resultado.bairro;
    if (cidadeRef.current) cidadeRef.current.value = resultado.localidade;
    if (estadoRef.current) estadoRef.current.value = resultado.uf;
    numeroRef.current?.focus();
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="Tipo" required>
          <Select name="tipo" defaultValue={defaultValues?.tipo ?? "FISICA"}>
            <option value="FISICA">Pessoa Física</option>
            <option value="JURIDICA">Pessoa Jurídica</option>
          </Select>
        </Field>
        <Field label="Nome / Razão Social" required className="sm:col-span-2">
          <Input name="nome" required defaultValue={defaultValues?.nome} />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="CPF / CNPJ">
          <Input name="documento" defaultValue={defaultValues?.documento ?? ""} />
        </Field>
        <Field label="Telefone">
          <Input name="telefone" defaultValue={defaultValues?.telefone ?? ""} />
        </Field>
        <Field label="WhatsApp">
          <Input name="whatsapp" defaultValue={defaultValues?.whatsapp ?? ""} />
        </Field>
      </div>

      <Field label="E-mail">
        <Input type="email" name="email" defaultValue={defaultValues?.email ?? ""} />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Field label="CEP">
          <div className="relative">
            <Input
              name="cep"
              defaultValue={defaultValues?.cep ?? ""}
              onBlur={handleCepBlur}
              placeholder="00000-000"
            />
            {buscandoCep && (
              <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-nexa-gray" />
            )}
          </div>
          {cepNaoEncontrado && (
            <p className="mt-1 text-xs text-red-600">CEP não encontrado. Preencha manualmente.</p>
          )}
        </Field>
        <Field label="Número">
          <Input ref={numeroRef} name="numero" defaultValue={defaultValues?.numero ?? ""} />
        </Field>
        <Field label="Bairro">
          <Input ref={bairroRef} name="bairro" defaultValue={defaultValues?.bairro ?? ""} />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Field label="Endereço" className="sm:col-span-2">
          <Input ref={enderecoRef} name="endereco" defaultValue={defaultValues?.endereco ?? ""} />
        </Field>
        <Field label="Cidade">
          <Input ref={cidadeRef} name="cidade" defaultValue={defaultValues?.cidade ?? ""} />
        </Field>
        <Field label="Estado (UF)">
          <Input ref={estadoRef} name="estado" maxLength={2} defaultValue={defaultValues?.estado ?? ""} />
        </Field>
      </div>

      <Field label="Observações">
        <Textarea name="observacoes" rows={3} defaultValue={defaultValues?.observacoes ?? ""} />
      </Field>
    </div>
  );
}
