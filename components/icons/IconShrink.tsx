import { CSSProperties } from "react";

const IconShrink = (params: { className?: string; style?: CSSProperties }) => {
  return (
    <svg
      className={params.className}
      style={params.style}
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
    >
      <path
        stroke="#0D0C0C"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth=".764"
        d="M14.697.735H1.249c-.337 0-.61.328-.61.733v13.203c0 .405.273.734.61.734h13.448c.338 0 .611-.329.611-.734V1.468c0-.405-.273-.733-.611-.733Z"
      />
      <path
        stroke="#0D0C0C"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth=".764"
        d="M10.756 5.034H5.19c-.14 0-.253.136-.253.304v5.464c0 .168.114.304.253.304h5.566c.14 0 .253-.136.253-.304V5.338c0-.168-.113-.304-.253-.304Z"
      />
    </svg>
  );
};

export default IconShrink;
