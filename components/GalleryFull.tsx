import useSWR from "swr";
import { API_URL } from "../lib/constants";
import { fetcher } from "../lib/utils";
import { InscriptionResponse, ListResponse } from "../lib/types";
import InscriptionCard from "./inscriptions/InscriptionCard";
import Error from "./Error";

// const limit = 60; // LCM of 3, 4, 5, 6
const limit = 20; // todo: increase limit on api end

// todo: add more common mime types
// From https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types
const mimeTypes = {
  // Safe Images https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types#image_types
  image: [
    "image/apng",
    "image/avif",
    "image/gif",
    "image/jpg",
    "image/jpeg",
    "image/png",
    "image/svg+xml",
    "image/webp",
  ],
  audio: ["audio/midi", "audio/mod", "audio/mpeg"],
  video: ["video/mp4", "video/webm"],
  text: ["text/html", "text/markdown", "text/plain"],
  binary: [
    "application/epub+zip",
    "application/json",
    "application/pdf",
    "application/pgp-signature",
  ],
} as const;

export type V1InscriptionsOptions = {
  page: number;
  order: string;
  order_by: string;

  rarity: string[];
  file_type: string[];
  mime_type: string[];

  from_number: number | null;
  to_number: number | null;

  from_genesis_block_height: number | null;
  to_genesis_block_height: number | null;

  from_genesis_timestamp: number | null;
  to_genesis_timestamp: number | null;

  from_sat_coinbase_height: number | null;
  to_sat_coinbase_height: number | null;
};

const GalleryFull = ({
  apiOptions,
  renderEmpty,
  children,
}: {
  apiOptions: V1InscriptionsOptions;
  renderEmpty?: () => React.ReactElement;
  children?: React.ReactNode;
}) => {
  const page = apiOptions.page;
  const offset = page * limit;

  const params = new URLSearchParams([
    // basic params
    ["limit", limit.toString()],
    ["offset", offset.toString()],
    ["order", apiOptions.order],
    ["order_by", apiOptions.order_by],

    // optional range params
    ...apiOptions.rarity.map((r) => ["rarity", r]),
    ...apiOptions.mime_type.map((m) => ["mime_type", m]),
    ...(apiOptions.file_type
      .flatMap((f) =>
        f in mimeTypes
          ? mimeTypes[f as keyof typeof mimeTypes].map((m) => ["mime_type", m])
          : null
      )
      .filter(Boolean) as [string, string][]),
  ]);

  // optional params
  const optional = [
    "from_number",
    "to_number",
    "from_genesis_block_height",
    "to_genesis_block_height",
    "from_genesis_timestamp",
    "to_genesis_timestamp",
    "from_sat_coinbase_height",
    "to_sat_coinbase_height",
  ] as const;
  for (const p of optional) {
    if (apiOptions[p]) params.append(p, `${apiOptions[p]}`);
  }

  // todo: use ref to track the latest number of results to avoid flickering when switching between a filter with no results and another filter with no results

  const { data, error, isLoading } = useSWR<ListResponse<InscriptionResponse>>(
    `${API_URL}/inscriptions?${params.toString()}`,
    fetcher
  );

  // if (error) return <Error error={error} />;
  if (!error && data && "message" in data && typeof data.message === "string") {
    return <Error message={data.message} />;
  }

  if (data && data.results.length === 0) {
    return (
      <div className="flex flex-grow items-center justify-center">
        {renderEmpty?.() ?? "No results"}
      </div>
    );
  }

  // todo: use number of previous results as limit value, so when results only show few elements the loading skeleton doesn't interfere / flash around
  const items = data?.results ?? Array(limit).fill(null); // skeleton values

  return (
    <>
      <div className="grid grid-cols-3 gap-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 3xl:grid-cols-6">
        {items.map((i, index) => (
          <InscriptionCard key={i?.id ?? index} inscription={i} light />
        ))}
      </div>
      {children}
    </>
  );
};

export default GalleryFull;
