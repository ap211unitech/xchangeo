import { X } from "lucide-react";
import { Unbounded } from "next/font/google";

const font = Unbounded({
  subsets: ["cyrillic-ext"],
  weight: ["200", "300", "400"],
});

type Props = { isFull?: boolean };

export const XchangeoLogo = ({ isFull = false }: Props) => (
  <>
    <svg width="0" height="0">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop stopColor="#ff6ec4" offset="0%" />
          <stop stopColor="#7873f5" offset="100%" />
        </linearGradient>
      </defs>
    </svg>
    <div className={`flex items-center ${font.className}`}>
      <div className="relative size-20">
        <X className="absolute inset-0 h-full w-full -rotate-6 stroke-[1]" style={{ stroke: "url(#gradient)" }} />
        <X className="absolute inset-0 h-full w-full rotate-6 stroke-[1]" style={{ stroke: "url(#gradient)" }} />
      </div>
      {isFull && <p className="relative -top-0.5 -left-4 text-4xl text-[#7873f5]">changeo</p>}
    </div>
  </>
);
