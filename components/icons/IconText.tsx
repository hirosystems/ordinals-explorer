import { CSSProperties } from "react";

const IconText = (params: { className?: string; style?: CSSProperties }) => {
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
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M22.308 28.97H1.692a1.145 1.145 0 0 1-1.146-1.146V2.625A1.145 1.145 0 0 1 1.692 1.48h13.744l8.018 8.018v18.326a1.145 1.145 0 0 1-1.146 1.145Z"
      />
      <path
        stroke="#8C877D"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.436 1.871v7.626h7.606"
      />
      <path
        fill="#8C877D"
        d="M7.07 19.311v-4.98h1.825v-.643H4.548v.642h1.824v4.981h.699ZM10.362 19.311l1.55-2.362 1.567 2.362h.828L12.37 16.38l1.816-2.692h-.803l-1.447 2.178-1.446-2.178h-.82l1.816 2.74-1.936 2.884h.812ZM17.486 19.311v-4.98h1.824v-.643h-4.347v.642h1.824v4.981h.699Z"
      />
      <path
        stroke="#8C877D"
        strokeWidth=".551"
        d="M7.07 19.311v-4.98h1.825v-.643H4.548v.642h1.824v4.981h.699ZM10.362 19.311l1.55-2.362 1.567 2.362h.828L12.37 16.38l1.816-2.692h-.803l-1.447 2.178-1.446-2.178h-.82l1.816 2.74-1.936 2.884h.812ZM17.486 19.311v-4.98h1.824v-.643h-4.347v.642h1.824v4.981h.699Z"
      />
    </svg>
  );
};

export default IconText;
