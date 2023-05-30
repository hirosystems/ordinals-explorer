import { InscriptionResponse } from "../../lib/types";
import useSWR from "swr";
import { fetcher } from "../../lib/helpers";
import { API_URL } from "../../lib/constants";

const InscriptionRenderJson = ({
  inscription,
}: {
  inscription: InscriptionResponse;
}) => {
  const { data, error, isLoading } = useSWR(
    `${API_URL}/inscriptions/${inscription.id}/content`,
    fetcher
  );

  if (error) return <div>Error loading inscription content.</div>;
  if (!data || isLoading) return <div>Loading...</div>;

  const content = data as JSON;
  const string = JSON.stringify(content, null, 1)
    .replace(/^\{/, "")
    .replace(/\}$/, "")
    .trim();

  return (
    <div className="p-1 w-full h-full bg-[#F2F0ED]">
      <pre className="text-xs">{string}</pre>
    </div>
  );
};

export default InscriptionRenderJson;
