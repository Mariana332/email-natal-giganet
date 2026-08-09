const COLORS = {
  teal: "bg-nexa-teal/15 text-nexa-teal-dark",
  green: "bg-emerald-100 text-emerald-700",
  red: "bg-red-100 text-red-700",
  yellow: "bg-amber-100 text-amber-700",
  gray: "bg-gray-100 text-gray-600",
  blue: "bg-sky-100 text-sky-700",
  purple: "bg-violet-100 text-violet-700",
};

export function Badge({
  children,
  color = "gray",
}: {
  children: React.ReactNode;
  color?: keyof typeof COLORS;
}) {
  return <span className={`badge ${COLORS[color]}`}>{children}</span>;
}
