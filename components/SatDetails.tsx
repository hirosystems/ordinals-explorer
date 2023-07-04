"use client";

import useSWR from "swr";

import { API_URL } from "../lib/constants";
import { SatResponse } from "../lib/types";
import { fetcher } from "../lib/utils";
import InscriptionCard from "./inscriptions/InscriptionCard";

import Loading from "./Loading";
import RarityTag from "./RarityTag";
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
    <div className="flex flex-col items-center justify-between rounded-lg border px-4 py-12">
      <h1 className="text-3xl">Sat {params.sid}</h1>

      {data.inscription_id && (
        <div className="my-6 flex flex-col items-center">
          <h2 className="mb-3 mt-8 uppercase">Inscription</h2>
          {/* todo: fix inscription preview sizing from growing too large */}
          <Inscription id={data.inscription_id} />
        </div>
      )}

      <table className="border-collapse text-sm">
        <tbody>
          <tr className="flex flex-col space-y-0.5 border-b py-4 md:table-row">
            <td className="whitespace-nowrap px-2 pr-20 uppercase underline md:py-3 md:no-underline">
              Sat Rarity
            </td>
            <td className="break-all px-2 uppercase md:py-2">
              <RarityTag rarity={data.rarity} />
            </td>
          </tr>
          {/* todo: Coinbase Timestamp? */}
          <tr className="flex flex-col space-y-0.5 border-b py-4 md:table-row">
            <td className="whitespace-nowrap px-2 pr-20 uppercase underline md:py-3 md:no-underline">
              Name
            </td>
            <td className="break-all px-2 md:py-2">{data.name}</td>
          </tr>
          <tr className="flex flex-col space-y-0.5 border-b py-4 md:table-row">
            <td className="whitespace-nowrap px-2 pr-20 uppercase underline md:py-3 md:no-underline">
              Coinbase Height
            </td>
            <td className="break-all px-2 md:py-2">{data.coinbase_height}</td>
          </tr>
          <tr className="flex flex-col space-y-0.5 border-b py-4 md:table-row">
            <td className="whitespace-nowrap px-2 pr-20 uppercase underline md:py-3 md:no-underline">
              Decimal
            </td>
            <td className="break-all px-2 md:py-2">{data.decimal}</td>
          </tr>
          <tr className="flex flex-col space-y-0.5 border-b py-4 md:table-row">
            <td className="whitespace-nowrap px-2 pr-20 uppercase underline md:py-3 md:no-underline">
              Degree
            </td>
            <td className="break-all px-2 md:py-2">{data.degree}</td>
          </tr>
          <tr className="flex flex-col space-y-0.5 border-b py-4 md:table-row">
            <td className="whitespace-nowrap px-2 pr-20 uppercase underline md:py-3 md:no-underline">
              Percentile
            </td>
            {/* todo: something looks wrong here */}
            <td className="break-all px-2 md:py-2">{data.percentile}</td>
          </tr>
          <tr className="flex flex-col space-y-0.5 border-b py-4 md:table-row">
            <td className="whitespace-nowrap px-2 pr-20 uppercase underline md:py-3 md:no-underline">
              Cycle
            </td>
            <td className="break-all px-2 md:py-2">{data.cycle}</td>
          </tr>
          <tr className="flex flex-col space-y-0.5 py-4 md:table-row">
            <td className="whitespace-nowrap px-2 pr-20 uppercase underline md:py-3 md:no-underline">
              Offset
            </td>
            <td className="break-all px-2 md:py-2">{data.offset}</td>
          </tr>
        </tbody>
        {/* todo: add period? not in api, needs sat coinbase height, or calculate it */}
      </table>
    </div>
  );
};

export default SatDetails;
