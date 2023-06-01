import { InscriptionResponse } from "../../lib/types";
import Iframe from "./Iframe";
import InscriptionRenderImage from "./InscriptionRenderImage";
import InscriptionRenderJson, {
  WithContentJson,
} from "./InscriptionRenderJson";

const InscriptionRender = (props: {
  inscription: InscriptionResponse;
  className?: string;
}) => {
  if (props.inscription.content_type.startsWith("image/")) {
    return <InscriptionRenderImage inscription={props.inscription} />;
  }

  if (props.inscription.content_type.startsWith("application/json")) {
    return WithContentJson(props, InscriptionRenderJson);
  }

  return <Iframe {...props} src={`/preview/${props.inscription.id}`} />;
};

export default InscriptionRender;
