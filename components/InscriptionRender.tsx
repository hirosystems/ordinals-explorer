import { API_URL } from "../lib/constants";
import { InscriptionResponse } from "../lib/types";
import Iframe from "./Iframe";

const InscriptionRender = ({
  inscription,
}: {
  inscription: InscriptionResponse;
}) => {
  if (inscription.content_type.startsWith("image/")) {
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
  }

  return <Iframe src={`/preview/${inscription.id}`} />;
};

export default InscriptionRender;
