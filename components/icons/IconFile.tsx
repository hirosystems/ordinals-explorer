import { CSSProperties } from "react";

const IconFile = (params: { className?: string; style?: CSSProperties }) => {
  return (
    <svg
      className={params.className}
      style={params.style}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 30"
    >
      <path
        stroke="#8C877D"
        strokeLinecap="square"
        strokeLinejoin="bevel"
        d="M22.308 28.97H1.692a1.145 1.145 0 0 1-1.146-1.146V2.625A1.145 1.145 0 0 1 1.692 1.48h13.744l8.018 8.018v18.326a1.145 1.145 0 0 1-1.146 1.145Z"
      />
      <path
        fill="#8C877D"
        d="M5.06 18.623v-2.234h2.117v-.584H5.06v-1.708h2.504v-.584h-3.14v5.11h.636ZM11.352 13.513H8.476v.526H9.6v4.058H8.476v.526h2.876v-.526h-1.117V14.04h1.117v-.526ZM15.56 18.623v-.584h-2.293v-4.526h-.634v5.11h2.927ZM19.82 18.623v-.584h-2.605v-1.723h2.109v-.584h-2.11v-1.635h2.512v-.584H16.58v5.11h3.24Z"
      />
      <path
        stroke="#8C877D"
        strokeWidth=".44"
        d="M5.06 18.623v-2.234h2.117v-.584H5.06v-1.708h2.504v-.584h-3.14v5.11h.636ZM11.352 13.513H8.476v.526H9.6v4.058H8.476v.526h2.876v-.526h-1.117V14.04h1.117v-.526ZM15.56 18.623v-.584h-2.293v-4.526h-.634v5.11h2.927ZM19.82 18.623v-.584h-2.605v-1.723h2.109v-.584h-2.11v-1.635h2.512v-.584H16.58v5.11h3.24Z"
      />
      <path
        stroke="#8C877D"
        strokeLinecap="square"
        strokeLinejoin="bevel"
        d="M15.436 1.871v7.626h7.606"
      />
    </svg>
  );
};

export default IconFile;
