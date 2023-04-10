import { CSSProperties } from "react";

const IconVideo = (params: { className?: string; style?: CSSProperties }) => {
  return (
    <svg
      className={params.className}
      style={params.style}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 26 25"
    >
      <rect
        width="22.877"
        height="22.877"
        x="1.561"
        y="1.341"
        stroke="#8C877D"
        strokeWidth="1.2"
        rx="11.438"
      />
      <path
        stroke="#8C877D"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
        d="m16.986 12.78-6.118-3.974v7.947l6.118-3.973Z"
      />
    </svg>
  );
};

export default IconVideo;
