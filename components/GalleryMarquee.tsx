import { useSetAtom } from "jotai";
import { useEffect } from "react";
import useSWR from "swr";

import { API_URL } from "../lib/constants";
import { fetcher } from "../lib/helpers";
import { lastInscriptionDataAtom } from "../lib/store";
import { InscriptionResponse, ListResponse } from "../lib/types";
import InscriptionCard from "./inscriptions/InscriptionCard";
import Error from "./Error";
import Marquee from "./Marquee";

const GalleryMarquee = (props: { params?: URLSearchParams }) => {
  const { data, error, isLoading } = useSWR<ListResponse<InscriptionResponse>>(
    `${API_URL}/inscriptions`,
    fetcher
  );

  if (error) return <Error error={error} />;

  const previews = data ? data.results : Array(12).fill(null); // skeleton values

  return (
    <Marquee>
      {previews.slice(0, 12).map((i, index) => (
        <InscriptionCard key={index} inscription={i} />
      ))}
    </Marquee>
  );
};

export default GalleryMarquee;
