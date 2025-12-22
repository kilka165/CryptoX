import Image from "next/image";

type Props = {
  symbol?: string;
  logoUrl?: string | null;
  size?: number;
};

export function CryptoIcon({ symbol, logoUrl, size = 20 }: Props) {
  if (!symbol) {
    return (
      <div
        className="flex items-center justify-center rounded-full bg-slate-700 text-xs font-semibold text-slate-400"
        style={{ width: size, height: size }}
      >
        ?
      </div>
    );
  }

  if (!logoUrl) {
    const upper = symbol.toUpperCase();
    return (
      <div
        className="flex items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-white"
        style={{ width: size, height: size }}
      >
        {upper[0]}
      </div>
    );
  }

  return (
    <Image
      src={logoUrl}
      alt={symbol}
      width={size}
      height={size}
      className="rounded-full"
      unoptimized
    />
  );
}
