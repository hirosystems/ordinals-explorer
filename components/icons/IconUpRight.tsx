import { CSSProperties } from "react";

const IconUpRight = (params: { className?: string; style?: CSSProperties }) => {
  return (
    <svg
      className={params.className}
      style={params.style}
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="10"
      fill="none"
    >
      <path
        stroke="#0D0C0C"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth=".943"
        d="M1.893.6h7.393v7.394M.66 9.226 9.286.6"
      />
    </svg>
  );
};

export default IconUpRight;
