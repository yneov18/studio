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


export const CustomOilDerrick = (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
        <path d="M2 22h20" />
        <path d="M8 22L12 4l4 18" />
        <path d="M9.5 14h5" />
        <path d="M7.5 8h9" />
        <path d="M11 4V2.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5V4h-3z" />
        <path d="M12 4c-1.5 0-2.7 1.2-2.7 2.7 0 .8.3 1.5.9 2 .6.5 1.4.8 2.3.8s1.7-.3 2.3-.8c.6-.5.9-1.2.9-2C14.7 5.2 13.5 4 12 4z" />
        <path d="M12 2c.28 0 .5.22.5.5S12.28 3 12 3s-.5-.22-.5-.5.22-.5.5-.5z" />
    </svg>
);