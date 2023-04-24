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
      // eslint-disable-next-line @next/next/no-img-element
      <img
        alt={`Inscription #${inscription.number}`}
        src={`${API_URL}/inscriptions/${inscription.id}/content`}
        style={{ imageRendering: "pixelated" }}
        className="w-full"
        width="100%"
        height="100%"
      />
    );
  }

  return <Iframe src={`/preview/${inscription.id}`} />;
};

export default InscriptionRender;
