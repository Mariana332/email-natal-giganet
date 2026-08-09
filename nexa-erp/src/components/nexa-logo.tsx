export function NexaMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
      <path d="M6 8 L20 8 L42 40 L28 40 Z" fill="#59c5ca" />
      <path d="M6 8 L20 8 L20 40 L6 40 Z" fill="#59c5ca" opacity="0.35" />
      <path d="M30 8 H42 V40 L30 24 Z" fill="#ffffff" opacity="0.9" />
    </svg>
  );
}

export function NexaWordmark({
  className = "",
  light = true,
}: {
  className?: string;
  light?: boolean;
}) {
  return (
    <div className={`font-heading leading-none ${className}`}>
      <div
        className={`text-xl font-extrabold tracking-wide ${
          light ? "text-white" : "text-nexa-black"
        }`}
      >
        NEXA
      </div>
      <div className="flex items-center gap-1">
        <span className="h-px w-3 bg-nexa-teal" />
        <span className="text-[10px] font-bold tracking-[0.3em] text-nexa-teal">
          PRINT
        </span>
        <span className="h-px w-3 bg-nexa-teal" />
      </div>
    </div>
  );
}

export function NexaLogo({
  className = "",
  light = true,
}: {
  className?: string;
  light?: boolean;
}) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <NexaMark />
      <NexaWordmark light={light} />
    </div>
  );
}
