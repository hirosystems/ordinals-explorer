import { InscriptionResponse } from "../../lib/types";
import Iframe from "./Iframe";
import InscriptionRenderImage from "./InscriptionRenderImage";
import InscriptionRenderJson, {
  WithContentJson,
} from "./InscriptionRenderJson";
import InscriptionRenderText from "./InscriptionRenderText";

const InscriptionRender = (props: {
  inscription: InscriptionResponse;
  className?: string;
}) => {
  if (props.inscription.content_type.startsWith("image/")) {
    return <InscriptionRenderImage {...props} />;
  }

  if (props.inscription.content_type.startsWith("application/json")) {
    return WithContentJson(props, InscriptionRenderJson);
  }

  if (props.inscription.content_type.startsWith("text/")) {
    return <InscriptionRenderText {...props} />;
  }

  return <Iframe {...props} src={`/preview/${props.inscription.id}`} />;
};

export default InscriptionRender;
