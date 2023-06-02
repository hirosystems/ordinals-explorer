import useSWR from "swr";

import { API_URL } from "../../lib/constants";
import { InscriptionResponse } from "../../lib/types";
import { fetcher, getFontSize, textFetcher } from "../../lib/helpers";
import InscriptionRenderJson from "./InscriptionRenderJson";

const InscriptionRenderText = (props: {
  inscription: InscriptionResponse;
  className?: string;
}) => {
  const { data, error, isLoading } = useSWR<string>(
    `${API_URL}/inscriptions/${props.inscription.id}/content`,
    textFetcher
  );

  if (error)
    return (
      <div>Error loading inscription content. {JSON.stringify(error)}</div>
    );
  if (!data || isLoading) return <div>Loading...</div>;

  try {
    const content = JSON.parse(data);
    return <InscriptionRenderJson {...props} content={content} />;
  } catch (e) {
    if (e instanceof SyntaxError) return <ContentText {...props} text={data} />; // not JSON, just text
    return <div>Error {JSON.stringify(e)}</div>;
  }
};

function showGradient(length: number) {
  return length > 20;
}

const ContentText = (props: {
  inscription: InscriptionResponse;
  text: string;
  className?: string;
}) => {
  return (
    <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-[#F2F0ED] p-3">
      <p
        className="inline-block w-full whitespace-pre-wrap break-all text-center"
        style={{ fontSize: getFontSize(props.inscription.content_length) }}
      >
        {props.text}
      </p>
      {showGradient(props.inscription.content_length) && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(rgba(242, 240, 237, 0),rgba(242, 240, 237, 0),rgba(242, 240, 237, 1))",
          }}
        />
      )}
    </div>
  );
};

export default InscriptionRenderText;
