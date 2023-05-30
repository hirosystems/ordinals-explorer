"use client";

import useSWR from "swr";

import { API_URL } from "../lib/constants";
import { fetcher } from "../lib/helpers";
import { SatResponse } from "../lib/types";
import InscriptionCard from "./inscriptions/InscriptionCard";

import Loading from "./Loading";
import WithInscription from "./WithInscription";

const Inscription = ({ id }: { id: string }) =>
  WithInscription(id, InscriptionCard);

const SatDetails = (params: { sid: string }) => {
  const { data, error, isLoading } = useSWR<SatResponse>(
    `${API_URL}/sats/${params.sid}`,
    fetcher
  );

  if (error) return <span>Something went wrong ʕ•̠͡•ʔ</span>;
  if (!params.sid) return <div>404</div>;
  if (!data) return <Loading />;

  // todo: add pagination to allow viewing all inscriptions? or link to explore page
  return (
    <div className="border px-4 py-12 rounded-lg flex flex-col justify-between items-center">
      <h1 className="text-3xl">Sat {params.sid}</h1>

      {data.inscription_id && (
        <div className="my-6 flex flex-col items-center">
          <h2 className="mt-8 mb-3 uppercase">Inscription</h2>
          <Inscription id={data.inscription_id} />
        </div>
      )}

      <table className="text-sm border-collapse">
        <tbody>
          <tr className="flex flex-col md:table-row py-4 space-y-0.5 border-b">
            <td className="uppercase md:py-3 px-2 pr-20 whitespace-nowrap underline md:no-underline">
              Sat Rarity
            </td>
            <td className="uppercase md:py-2 break-all">
              <span className="px-1 py-0.5 bg-neutral-400 text-white rounded-[4px]">
                {/* todo: fancy rarity component */}
                {data.rarity}
              </span>
            </td>
          </tr>
          {/* todo: Coinbase Timestamp? */}
          <tr className="flex flex-col md:table-row py-4 space-y-0.5 border-b">
            <td className="uppercase md:py-3 px-2 pr-20 whitespace-nowrap underline md:no-underline">
              Name
            </td>
            <td className="md:py-2 px-2 break-all">{data.name}</td>
          </tr>
          <tr className="flex flex-col md:table-row py-4 space-y-0.5 border-b">
            <td className="uppercase md:py-3 px-2 pr-20 whitespace-nowrap underline md:no-underline">
              Coinbase Height
            </td>
            <td className="md:py-2 px-2 break-all">{data.coinbase_height}</td>
          </tr>
          <tr className="flex flex-col md:table-row py-4 space-y-0.5 border-b">
            <td className="uppercase md:py-3 px-2 pr-20 whitespace-nowrap underline md:no-underline">
              Decimal
            </td>
            <td className="md:py-2 px-2 break-all">{data.decimal}</td>
          </tr>
          <tr className="flex flex-col md:table-row py-4 space-y-0.5 border-b">
            <td className="uppercase md:py-3 px-2 pr-20 whitespace-nowrap underline md:no-underline">
              Degree
            </td>
            <td className="md:py-2 px-2 break-all">{data.degree}</td>
          </tr>
          <tr className="flex flex-col md:table-row py-4 space-y-0.5 border-b">
            <td className="uppercase md:py-3 px-2 pr-20 whitespace-nowrap underline md:no-underline">
              Percentile
            </td>
            {/* todo: something looks wrong here */}
            <td className="md:py-2 px-2 break-all">{data.percentile}</td>
          </tr>
          <tr className="flex flex-col md:table-row py-4 space-y-0.5 border-b">
            <td className="uppercase md:py-3 px-2 pr-20 whitespace-nowrap underline md:no-underline">
              Cycle
            </td>
            <td className="md:py-2 px-2 break-all">{data.cycle}</td>
          </tr>
          <tr className="flex flex-col md:table-row py-4 space-y-0.5">
            <td className="uppercase md:py-3 px-2 pr-20 whitespace-nowrap underline md:no-underline">
              Offset
            </td>
            <td className="md:py-2 px-2 break-all">{data.offset}</td>
          </tr>
        </tbody>
        {/* todo: add period? not in api, needs sat coinbase height, or calculate it */}
      </table>
    </div>
  );
};

export default SatDetails;
