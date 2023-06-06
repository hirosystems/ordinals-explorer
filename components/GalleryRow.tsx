import useSWR from "swr";

import { API_URL } from "../lib/constants";

import { InscriptionResponse, ListResponse } from "../lib/types";
import { fetcher } from "../lib/utils";
import InscriptionCard from "./inscriptions/InscriptionCard";

const GalleryRow = (props: { params?: URLSearchParams }) => {
  const { data, error, isLoading } = useSWR<ListResponse<InscriptionResponse>>(
    `${API_URL}/inscriptions?${props.params?.toString() ?? ""}`,
    fetcher
  );

  if (error) return <span>Something went wrong ʕ•̠͡•ʔ</span>;

  const previews = data ? data.results : Array(12).fill(null); // skeleton values

  return (
    <div className="relative">
      <div className=" flex flex-row gap-4 overflow-scroll">
        {previews.slice(0, 12).map((i, index) => (
          <div className="mb-3 shrink-0 basis-1/5" key={index}>
            <InscriptionCard inscription={i} className="w-full" />
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 right-0 top-0 w-20 bg-gradient-to-r from-transparent to-white" />
    </div>
  );
};

export default GalleryRow;
