import useSWR from "swr";

import { pipe } from "fp-ts/lib/function";
import { match, tryCatch } from "fp-ts/lib/Option";
import { API_URL } from "../../lib/constants";
import { cn, getFontSize, textFetcher } from "../../lib/helpers";
import { InscriptionResponse } from "../../lib/types";
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
    return <div>Error loading inscription content. {error?.message}</div>;
  if (!data || isLoading) return <></>;

  return pipe(
    tryCatch(() => JSON.parse(data)),
    match(
      () => <RenderText {...props} text={data} />,
      (content) => <InscriptionRenderJson {...props} json={content} />
    )
  );
};

function showGradient(length: number) {
  return length > 20;
}

export const RenderText = (props: {
  inscription: InscriptionResponse;
  text: string;
  className?: string;
}) => {
  return (
    <div className="relative flex aspect-square w-full justify-center overflow-hidden bg-[#F2F0ED] p-3">
      <p
        className={cn(
          "inline-block w-full whitespace-pre-wrap",
          contentLengthClassName(props.inscription.content_length)
        )}
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

export function contentLengthClassName(contentLength: number) {
  if (contentLength < 10) return "text-[1.375em] text-center self-center";
  if (contentLength < 50) return "text-[20px] text-center self-center";
  return "text-sm tracking-tight";
}
