import { JsonView, defaultStyles } from "react-json-view-lite";
import useSWR from "swr";

import { useToggle } from "react-use";
import { API_URL } from "../../lib/constants";
import { cn, fetcher } from "../../lib/helpers";
import { InscriptionResponse } from "../../lib/types";
import Error from "../Error";
import "./json-viewer.css";

export const WithContentJson = (
  props: { inscription: InscriptionResponse }, // todo: is this a good pattern?
  Content: React.ComponentType<any>
) => {
  const { data, error, isLoading } = useSWR<InscriptionResponse>(
    `${API_URL}/inscriptions/${props.inscription.id}/content`,
    fetcher
  );

  if (error) return <span>Something went wrong ʕ•̠͡•ʔ</span>;
  if (!data) return <></>;

  return <Content {...props} content={data} />;
};

const InscriptionRenderJson = (props: {
  inscription: InscriptionResponse;
  content: any;
  className?: string;
}) => {
  try {
    const json = cleanJsonString(props.content);

    let badge =
      props.content?.p ??
      props.content?.protocol?.name ??
      props.content?.protocol;
    badge = badge?.replace(/\-/g, "");

    // todo: add tooltip for badge showing protocol name and info, links to protocol page?
    return (
      <JsonViewer
        {...props}
        text={json}
        content={props.content}
        protocol={badge}
      />
    );
  } catch (e) {
    // todo: add more fallbacks?
    return <Error error={e} />;
  }
};

const JsonViewer = (props: {
  text: string;
  content: object;
  protocol?: string;
  className?: string;
}) => {
  const [isJsonViewEnabled, toggleJsonView] = useToggle(false);

  return (
    <div
      className={cn(
        "relative aspect-square w-full bg-[#F2F0ED]",
        props.className
      )}
    >
      {isJsonViewEnabled ? (
        <div
          className="h-full w-full overflow-scroll bg-gray-100 pb-7 pt-1 font-['Aeonik_Mono'] text-sm leading-[1.15rem] tracking-tight"
          onClick={(e) => e.preventDefault()} // prevent click through (e.g. when used in links)
        >
          <JsonView data={props.content} style={defaultStyles} />
        </div>
      ) : (
        <>
          <pre className="h-full w-full overflow-scroll p-0.5 pl-2 font-['Aeonik_Mono'] text-sm leading-[1.15rem] tracking-tight">
            {props.text}
          </pre>
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(rgba(242, 240, 237, 0),rgba(242, 240, 237, 0),rgba(242, 240, 237, 1))",
            }}
          />
        </>
      )}
      <div className="absolute bottom-1 left-1 flex space-x-0.5 text-xs uppercase text-neutral-0">
        {props.protocol && (
          <div className="rounded border border-neutral-400 bg-neutral-400 px-1 py-0.5 leading-none shadow-[0_1px_2px_0_rgba(0,0,0,0.2)]">
            {props.protocol}
          </div>
        )}
        <button
          className={cn(
            "rounded border border-neutral-400 px-1 py-0.5 leading-none shadow-[0_1px_2px_0_rgba(0,0,0,0.2)] transition-colors",
            isJsonViewEnabled
              ? "border-slate-500 bg-slate-300 text-slate-700  hover:bg-slate-200"
              : "bg-neutral-400 hover:border-neutral-300 hover:bg-neutral-300"
          )}
          onClick={(e) => {
            toggleJsonView();
            e.preventDefault();
          }}
        >
          <div className="text-[13px] leading-[12px]">
            <span className="mr-0.5">{"{"}</span>
            <span className="">{"}"}</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default InscriptionRenderJson;

function cleanJsonString(content: any) {
  const json = JSON.stringify(content, null, 1)
    .replace(/^[\{\}]/gm, "")
    .replace(/[\{\}]*,*$/gm, "")
    .replace(/\n\s*\n/gm, "\n");

  try {
    return json
      .replace(/(?<!\\)"/g, "") // remove all unescaped double quotes
      .replace(/(?<!\\)\\/g, "") // remove all unescaped escape characters
      .replace(/\n\s/g, "\n")
      .trim();
  } catch (e) {
    // fallback solution without lookbehind (not supported in some recent versions of safari)
    return json.replace(/\n\s/g, "\n").trim();
  }
}
