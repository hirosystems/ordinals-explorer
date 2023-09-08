import { CSSProperties } from "react";

const IconUnicorn = (params: { className?: string; style?: CSSProperties }) => {
  return (
    <svg
      className={params.className}
      style={params.style}
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="16"
      fill="none"
    >
      <path
        stroke="currentColor"
        strokeLinecap="square"
        strokeLinejoin="bevel"
        strokeMiterlimit="10"
        strokeWidth=".85"
        d="M7.2109 6.00157 1.12229.72137C.92811.55317.64241.77084.75372 1.00212l3.47916 7.25936M2.50096 4.24854l.45049-1.7253m1.04916 4.72443.72322-3.11643m5.53957 8.39656v2.3442"
      />
      <path
        stroke="currentColor"
        strokeLinecap="square"
        strokeLinejoin="bevel"
        strokeWidth=".85"
        d="m17.3577 11.4827-6.3794-5.61753c-.0037 1.42479-.2337 2.56016-.2152 2.61582L9.17384 6.27702c-.1781-.24736-.30549-.52193-.38094-.80763l-.46751.17315c-.15089.05566-.29435.13234-.42669.22634L.97388 10.8247l1.20835 2.763c.1917.4366.6555.6877 1.12548.6061l5.37141-.9239c.54171-.0928 1.03148-.3822 1.37408-.8126l1.9343-2.4278"
      />
      <path
        stroke="currentColor"
        strokeLinecap="square"
        strokeLinejoin="bevel"
        strokeWidth=".85"
        d="M12.9695 4.30927c-.6196-.50956-1.4235-.70621-2.1879-.56522.0025.01237.0062.02474.0087.03711l.0185-.00495-.0086.05813c.1348.68766.1805 1.38892.1781 2.03082l5.333 4.69614 3.4124-.69881-6.7554-5.55322h.0012Z"
      />
      <path
        stroke="currentColor"
        strokeLinecap="square"
        strokeLinejoin="bevel"
        strokeWidth=".85"
        d="M10.7644 8.48102c-.0371-.11007.8769-4.32631-.8039-6.78382L8.95622 3.77007c-.3933.81257-.31043 1.77604.21892 2.50822l1.58926 2.20397v-.00124Z"
      />
    </svg>
  );
};

export default IconUnicorn;
