import { API_URL } from "../../lib/constants";
import { InscriptionResponse } from "../../lib/types";

const InscriptionRenderImage = ({
  inscription,
}: {
  inscription: InscriptionResponse;
}) => {
  // todo: background image with hidden semantic element better?
  return (
    <div className="w-full h-full flex justify-center items-center bg-[#F2F0ED]">
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
