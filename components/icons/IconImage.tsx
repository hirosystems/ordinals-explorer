import { CSSProperties } from "react";

const IconImage = (params: { className?: string; style?: CSSProperties }) => {
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
        d="M22.308 28.97H1.692a1.145 1.145 0 0 1-1.146-1.146V2.625A1.145 1.145 0 0 1 1.692 1.48h13.744l8.018 8.018v18.326a1.146 1.146 0 0 1-1.146 1.145Z"
      />
      <path
        stroke="#8C877D"
        strokeLinecap="square"
        strokeLinejoin="bevel"
        d="M15.436 1.871v7.626h7.606"
      />
      <path
        stroke="#8C877D"
        d="m1 20.5 4.002-4.699a1 1 0 0 1 1.447-.08l6.183 5.833a1 1 0 0 0 1.073.195l3.502-1.468a1 1 0 0 1 .71-.024L23 22"
      />
      <circle cx="16.733" cy="14.5" r=".5" stroke="#8C877D" />
    </svg>
  );
};

export default IconImage;
