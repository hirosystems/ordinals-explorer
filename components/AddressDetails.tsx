"use client";

import useSWR from "swr";
import { API_URL } from "../lib/constants";

import { fetcher } from "../lib/helpers";
import { InscriptionResponse } from "../pages/api/ordinals/v1/inscriptions/[iid]";
import Ellipsis from "./Ellipsis";
import CtaLink from "./CtaLink";
import InscriptionCard from "./InscriptionCard";
import Loading from "./Loading";

const AddressDetails = (params: { aid: string }) => {
  const { data, error, isLoading } = useSWR<{
    results: InscriptionResponse[];
    total: number;
  }>(
    // todo: increase limit to 60
    `${API_URL}/inscriptions?limit=20&address=${params.aid}`,
    fetcher
  );

  if (error) return <span>Something went wrong ʕ•̠͡•ʔ</span>;
  if (!params.aid) return <div>404</div>;
  if (!data) return <Loading />;

  // todo: add pagination to allow viewing all inscriptions? or link to explore page
  return (
    <div className="border p-4 pt-10 rounded-lg flex flex-col justify-between items-center">
      <h1 className="text-3xl">
        Address{" "}
        <span className="border-2 px-2 py-1 rounded-md text-neutral-700 bg-neutral-0">
          <Ellipsis text={params.aid} />
        </span>
      </h1>
      {data.results.length ? (
        <h2 className="mt-8 text-xl self-start">Inscriptions ({data.total})</h2>
      ) : (
        <p className="my-3">
          No inscriptions in locations controller by this address
        </p>
      )}
      <div className="mt-4 grid grid-cols-3 md:grid-cols-4 gap-4">
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
