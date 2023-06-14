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

  if (props.inscription.content_type.startsWith("text/html")) {
    return <Iframe {...props} src={`/preview/${props.inscription.id}`} />;
  }

  if (props.inscription.content_type.startsWith("text/")) {
    // also handles json parseable content from plain text
    return <InscriptionRenderText {...props} />;
  }

  // todo: add overlay without pointer events with a variant of the render component
  //       that can be used for non-clickable iframes (aka cards with links)
  //       this would need to go in the iframe component (wrap in div and add absoolute inset-0 overlay)
  return <Iframe {...props} src={`/preview/${props.inscription.id}`} />;
};

export default InscriptionRender;
