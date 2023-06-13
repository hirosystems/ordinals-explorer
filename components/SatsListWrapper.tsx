"use client";

import useSWR from "swr";

import { API_URL } from "../lib/constants";
import { fetcher } from "../lib/utils";
import { InscriptionResponse, ListResponse } from "../lib/types";
import CtaLink from "./CtaLink";
import InscriptionCard from "./inscriptions/InscriptionCard";
import Loading from "./Loading";

const SatsListWrapper = ({ bid }: { bid: string }) => {
  const { data, error, isLoading } = useSWR<ListResponse<InscriptionResponse>>(
    `${API_URL}/inscriptions?from_sat_coinbase_height=${bid}&to_sat_coinbase_height=${bid}`,
    fetcher
  );

  if (error) return <span>Something went wrong ʕ•̠͡•ʔ</span>;
  if (!data || isLoading) return <Loading className="h-full" />;

  // todo: make this nicer
  if (!data.results?.length) return <span></span>;

  return (
    <div className="py-4">
      <div className="grid grid-cols-3 gap-4 pt-4 md:grid-cols-5">
        {data.results.map((i, index) => (
          <InscriptionCard key={index} inscription={i} />
        ))}
      </div>
      <div className="mb-32 mt-16 flex justify-around">
        <CtaLink href={`/explore?cf=${bid}&ct=${bid}`}>
          Explore inscriptions from block #{bid} &rarr;
        </CtaLink>
      </div>
    </div>
  );
};

export default SatsListWrapper;
