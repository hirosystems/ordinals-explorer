import { CSSProperties } from "react";

const IconAudio = (params: { className?: string; style?: CSSProperties }) => {
  return (
    <svg
      className={params.className}
      style={params.style}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 23 18"
    >
      <path
        stroke="#8C877D"
        strokeLinecap="square"
        strokeLinejoin="bevel"
        strokeWidth="1.417"
        d="M1.585 12.95V5.814h5.352l5.352-4.46V17.41l-5.352-4.46H1.585ZM19.425 3.807a7.137 7.137 0 0 1 0 11.15"
      />
    </svg>
  );
};

export default IconAudio;
