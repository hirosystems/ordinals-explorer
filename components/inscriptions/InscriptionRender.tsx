import { API_URL } from "../../lib/constants";
import { InscriptionResponse } from "../../lib/types";
import Iframe from "./Iframe";
import InscriptionRenderImage from "./InscriptionRenderImage";
import InscriptionRenderJson from "./InscriptionRenderJson";

const InscriptionRender = ({
  inscription,
}: {
  inscription: InscriptionResponse;
}) => {
  if (inscription.content_type.startsWith("image/")) {
    return <InscriptionRenderImage inscription={inscription} />;
  }

  if (inscription.content_type.startsWith("application/json")) {
    return <InscriptionRenderJson inscription={inscription} />;
  }

  return <Iframe src={`/preview/${inscription.id}`} />;
};

export default InscriptionRender;
