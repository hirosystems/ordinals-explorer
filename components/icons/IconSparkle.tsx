import { CSSProperties } from "react";

const IconSparkle = (params: { className?: string; style?: CSSProperties }) => {
  return (
    <svg
      className={params.className}
      style={params.style}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
    >
      <path
        stroke="currentColor"
        strokeLinecap="square"
        strokeLinejoin="bevel"
        strokeWidth=".85"
        d="m10.445 13.3109-1.42085 3.8556c-.04206.1133-.11778.2111-.217.2801s-.21718.106-.33804.106c-.12085 0-.23881-.037-.33803-.106s-.17494-.1668-.217-.2801l-1.42087-3.8556c-.02999-.0814-.07728-.1553-.13861-.2166-.06132-.0613-.13523-.1086-.21661-.1386l-3.85561-1.4209c-.11331-.042-.21102-.1178-.28003-.217-.069-.0992-.10599-.2171-.10599-.338 0-.1209.03699-.2388.10599-.338.06901-.0993.16672-.175.28003-.217l3.85561-1.42091c.08138-.02999.15529-.07728.21661-.1386.06133-.06133.10862-.13524.13861-.21662l1.42087-3.85561c.04206-.1133.11778-.21102.217-.28002.09922-.06901.21718-.10599.33803-.10599.12086 0 .23882.03698.33804.10599.09922.069.17494.16672.217.28002L10.445 8.64867c.03.08138.0773.15529.1386.21662.0614.06132.1353.10861.2166.1386l3.8557 1.42091c.1133.042.211.1177.28.217.069.0992.106.2171.106.338 0 .1209-.037.2388-.106.338-.069.0992-.1667.175-.28.217l-3.8557 1.4209c-.0813.03-.1552.0773-.2166.1386-.0613.0613-.1086.1352-.1386.2166Zm2.7603-11.80369v3.55293m1.777-1.77676h-3.553m5.3281 2.36807v2.36862m1.1848-1.18456h-2.3686"
      />
    </svg>
  );
};

export default IconSparkle;
