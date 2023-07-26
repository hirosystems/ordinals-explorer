import { CSSProperties } from "react";

const IconFlame = (params: { className?: string; style?: CSSProperties }) => {
  return (
    <svg
      className={params.className}
      style={params.style}
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="16"
      fill="none"
    >
      <path
        stroke="currentColor"
        strokeLinecap="square"
        strokeLinejoin="bevel"
        strokeWidth=".85"
        d="M10.3351 9.984a3.7396 3.7396 0 0 1-3.1089 3.1089"
      />
      <path
        stroke="currentColor"
        strokeLinecap="square"
        strokeLinejoin="bevel"
        strokeWidth=".85"
        d="M2.6417 4.0672C1.5386 5.729.636 7.6345.636 9.411a6.0174 6.0174 0 0 0 6.0172 6.0173 6.0173 6.0173 0 0 0 6.0172-6.0173c0-3.725-2.5788-6.5902-4.6705-8.6748L5.5071 5.9726 2.6417 4.0672Z"
      />
    </svg>
  );
};

export default IconFlame;
