import type { SVGProps } from "react";

export const OilDerrick = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M4 22h16" />
    <path d="M9 22V8.43" />
    <path d="M15 22V8.43" />
    <path d="M17.5 8.43H6.5" />
    <path d="M12 8.43V2" />
    <path d="M9 5.43l3 -3.43l3 3.43" />
    <path d="M10.5 8.43h3" />
  </svg>
);
