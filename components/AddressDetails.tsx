"use client";

import useSWR from "swr";

import { API_URL } from "../lib/constants";
import { fetcher } from "../lib/utils";
import { InscriptionResponse, ListResponse } from "../lib/types";
import Ellipsis from "./Ellipsis";
import InscriptionCard from "./inscriptions/InscriptionCard";
import Loading from "./Loading";

const AddressDetails = (params: { aid: string }) => {
  const { data, error, isLoading } = useSWR<ListResponse<InscriptionResponse>>(
    // todo: increase limit to 60
    `${API_URL}/inscriptions?limit=20&address=${params.aid}`,
    fetcher
  );

  if (error) return <span>Something went wrong ʕ•̠͡•ʔ</span>;
  if (!params.aid) return <div>404</div>;
  if (!data) return <Loading />;

  // todo: add pagination to allow viewing all inscriptions? or link to explore page
  return (
    <div className="flex flex-col items-center justify-between rounded-lg border p-4 pt-10">
      <h1 className="text-3xl">
        Address{" "}
        <span className="rounded-md border-2 bg-neutral-0 px-2 py-1 text-neutral-700">
          <Ellipsis text={params.aid} />
        </span>
      </h1>
      {data.results.length ? (
        <h2 className="mt-8 self-start text-xl">Inscriptions ({data.total})</h2>
      ) : (
        <p className="my-3">No inscriptions currently owned by this address</p>
        // todo: maybe add ownership history of address?
      )}
      <div className="mt-4 grid grid-cols-3 gap-4 md:grid-cols-4">
        {data.results.map((i, index) => (
          <InscriptionCard key={index} inscription={i} />
        ))}
      </div>

      {/* todo: complete address filtering in explore page */}
      {/* <div className="mt-16 mb-8 flex justify-around">
        <CtaLink href={`/explore?address=`}>
          Explore inscriptions by <Address address={params.aid} /> &rarr;
        </CtaLink>
      </div> */}
    </div>
  );
};

export default AddressDetails;
