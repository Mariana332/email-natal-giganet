"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export function RevenueChart({
  data,
}: {
  data: { mes: string; receita: number; despesa: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#59c5ca" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#59c5ca" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorDespesa" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#666666" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#666666" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="mes" tick={{ fontSize: 12, fill: "#666666" }} axisLine={false} tickLine={false} />
        <YAxis
          tick={{ fontSize: 12, fill: "#666666" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `R$${v}`}
        />
        <Tooltip
          formatter={
            ((value: unknown) =>
              Number(Array.isArray(value) ? value[0] : value).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              })) as any
          }
          contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 13 }}
        />
        <Area type="monotone" dataKey="receita" name="Receita" stroke="#59c5ca" fill="url(#colorReceita)" strokeWidth={2} />
        <Area type="monotone" dataKey="despesa" name="Despesa" stroke="#666666" fill="url(#colorDespesa)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
