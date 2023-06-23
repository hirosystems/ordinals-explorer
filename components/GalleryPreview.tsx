"use client"

import { useSetAtom } from "jotai";
import { useEffect } from "react";
import useSWR from "swr";

import { API_URL } from "../lib/constants";
import { fetcher } from "../lib/utils";
import { lastInscriptionDataAtom } from "../lib/store";
import { InscriptionResponse, ListResponse } from "../lib/types";
import InscriptionCard from "./inscriptions/InscriptionCard";

const GalleryPreview = () => {
  const setLastInscriptionData = useSetAtom(lastInscriptionDataAtom);

  const { data, error, isLoading } = useSWR<ListResponse<InscriptionResponse>>(
    `${API_URL}/inscriptions`,
    fetcher
  );

  useEffect(() => {
    if (data?.results?.length) {
      setLastInscriptionData({
        number: data.results[0].number.toString(),
        date: new Date(data.results[0].timestamp),
      });
    }
  }, [data, setLastInscriptionData]);

  if (error) return <span>Something went wrong ʕ•̠͡•ʔ</span>;

  const previews = data ? data.results : Array(12).fill(null); // skeleton values

  return (
    <>
      <div className="grid grid-cols-3 gap-4 md:grid-cols-4">
        {previews.slice(0, 12).map((i, index) => (
          <InscriptionCard key={index} inscription={i} />
        ))}
      </div>
      {/* todo: re-add figma link to full feed */}
      {/* <div className="my-4 text-center underline">
        <a href="/inscriptions">More</a>
      </div> */}
    </>
  );
};

export default GalleryPreview;
