import { SVGProps } from "react";

export const LP = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" width="1em" height="1em" {...props}>
    <title>LP Token</title>

    {/* Circular background */}
    <circle cx="22" cy="22" r="22" fill="white" fillOpacity="0.9" />

    {/* Outer ring for contrast */}
    <circle cx="22" cy="22" r="20" stroke="#2a5ada" strokeWidth="2" fill="none" />

    {/* LP letters */}
    <text
      x="50%"
      y="50%"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize="20"
      fontWeight="bold"
      fill="#2a5ada"
      fontFamily="Arial, sans-serif"
    >
      LP
    </text>
  </svg>
);
