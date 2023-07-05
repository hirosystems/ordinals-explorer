import { API_URL } from "../../lib/constants";
import { cn } from "../../lib/utils";
import { InscriptionResponse } from "../../lib/types";

const InscriptionRenderImage = ({
  inscription,
  className,
}: {
  inscription: InscriptionResponse;
  className?: string;
}) => {
  // todo: background image with hidden semantic element better?
  return (
    <div
      className={cn("flex items-center justify-center bg-[#F2F0ED]", className)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt={`Inscription #${inscription.number}`}
        src={`${API_URL}/inscriptions/${inscription.id}/content`}
        style={{ imageRendering: "pixelated" }}
        width="100%"
        height="100%"
      />
    </div>
  );
};

export default InscriptionRenderImage;
