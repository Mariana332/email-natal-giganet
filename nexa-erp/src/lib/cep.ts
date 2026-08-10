export type CepResult = {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
};

/** Looks up a Brazilian CEP via ViaCEP. Returns null if not found or on network failure. */
export async function buscarCep(cep: string): Promise<CepResult | null> {
  const digits = cep.replace(/\D/g, "");
  if (digits.length !== 8) return null;

  try {
    const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.erro) return null;
    return {
      logradouro: data.logradouro ?? "",
      bairro: data.bairro ?? "",
      localidade: data.localidade ?? "",
      uf: data.uf ?? "",
    };
  } catch {
    return null;
  }
}
