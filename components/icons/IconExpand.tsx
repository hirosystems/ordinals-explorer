import { CSSProperties } from "react";

const IconExpand = (params: { className?: string; style?: CSSProperties }) => {
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
        fill="#fff"
        fillOpacity=".3"
        stroke="#0D0C0C"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth=".764"
        d="M14.856.854H1.408c-.337 0-.61.328-.61.733V14.79c0 .405.273.734.61.734h13.448c.338 0 .611-.329.611-.734V1.587c0-.405-.274-.733-.611-.733Z"
      />
      <path fill="#fff" fillOpacity=".3" d="M8.89 4.076h3.397v3.397" />
      <path
        stroke="#0D0C0C"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth=".764"
        d="M8.89 4.076h3.397v3.397"
      />
      <path fill="#fff" fillOpacity=".3" d="M7.374 12.302H3.977V8.905" />
      <path
        stroke="#0D0C0C"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth=".764"
        d="M7.374 12.302H3.977V8.905"
      />
    </svg>
  );
};

export default IconExpand;
