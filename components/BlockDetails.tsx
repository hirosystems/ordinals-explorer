"use client";

import useSWR from "swr";

import { API_URL } from "../lib/constants";
import { fetcher } from "../lib/utils";
import { InscriptionResponse, ListResponse } from "../lib/types";
import CtaLink from "./CtaLink";
import InscriptionCard from "./inscriptions/InscriptionCard";
import Loading from "./Loading";

const BlockDetails = (params: { bid: string }) => {
  const { data, error, isLoading } = useSWR<ListResponse<InscriptionResponse>>(
    // todo: increase limit to 60
    `${API_URL}/inscriptions?limit=20&genesis_block=${params.bid}`,
    fetcher
  );

  if (error) return <span>Something went wrong ʕ•̠͡•ʔ</span>;
  if (!params.bid) return <div>404</div>;
  if (!data) return <Loading />;

  // todo: add pagination to allow viewing all inscriptions? or link to explore page
  return (
    <div className="flex flex-col items-center justify-between rounded-lg border p-4 pt-10">
      <h1 className="text-3xl">Block #{params.bid}</h1>
      {data.results.length ? (
        <>
          <p className="my-3 hidden break-all uppercase md:block">
            Block Hash: {data.results[0].genesis_block_hash}
          </p>
          <h2 className="mt-8 self-start text-xl">
            Inscriptions ({data.total})
          </h2>
        </>
      ) : (
        <p className="my-3">No inscriptions from transactions in this block</p>
      )}

      <div className="mt-4 grid grid-cols-3 gap-4 md:grid-cols-4">
        {data.results.map((i, index) => (
          <InscriptionCard key={index} inscription={i} />
        ))}
      </div>

      <div className="mb-8 mt-16 flex justify-around">
        <CtaLink href={`/explore?hf=${params.bid}&ht=${params.bid}`}>
          Explore inscriptions from block #{params.bid} &rarr;
        </CtaLink>
      </div>
    </div>
  );
};

export default BlockDetails;
