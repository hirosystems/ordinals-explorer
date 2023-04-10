"use client";

import useSWR from "swr";
import { API_URL } from "../lib/constants";

import { fetcher } from "../lib/helpers";
import { InscriptionResponse } from "../pages/api/ordinals/v1/inscriptions";
import CtaLink from "./CtaLink";
import InscriptionCard from "./InscriptionCard";
import Loading from "./Loading";

const SatsListWrapper = ({ bid }: { bid: string }) => {
  const { data, error, isLoading } = useSWR<{
    results: InscriptionResponse[];
    total: number;
  }>(
    `${API_URL}/inscriptions?from_sat_coinbase_height=${bid}&to_sat_coinbase_height=${bid}`,
    fetcher
  );

  if (error) return <span>Something went wrong ʕ•̠͡•ʔ</span>;
  if (!data || isLoading) return <Loading className="h-full" />;

  // todo: make this nicer
  if (!data.results?.length) return <span></span>;

  return (
    <div className="py-4">
      <div className="pt-4 grid grid-cols-3 md:grid-cols-5 gap-4">
        {data.results.map((i, index) => (
          <InscriptionCard key={index} {...i} />
        ))}
      </div>
      <div className="mt-16 mb-32 flex justify-around">
        <CtaLink href={`/explore?cf=${bid}&ct=${bid}`}>
          Explore inscriptions from block #{bid} &rarr;
        </CtaLink>
      </div>
    </div>
  );
};

export default SatsListWrapper;
