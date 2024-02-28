"use client";

import useSWR from "swr";
import { API_URL } from "../lib/constants";
import { InscriptionResponse, ListResponse, SatResponse } from "../lib/types";
import { fetcher } from "../lib/utils";
import Loading from "./Loading";
import RarityTag from "./RarityTag";
import WithInscription from "./WithInscription";
import InscriptionCard from "./inscriptions/InscriptionCard";

const Inscription = ({ id }: { id: string }) =>
  WithInscription(id, InscriptionCard);

const SatDetails = ({ sid }: { sid: string }) => {
  const { data: satData, error: satError } = useSWR<SatResponse>(
    `${API_URL}/sats/${sid}`,
    fetcher
  );
  const params = new URLSearchParams({
    from_sat_ordinal: sid,
    to_sat_ordinal: sid,
  });
  const { data: inscriptionData, error: inscriptionError } = useSWR<
    ListResponse<InscriptionResponse>
  >(`${API_URL}/inscriptions?${params.toString()}`, fetcher);

  if (!sid) return <div>404</div>;
  if (satError || inscriptionError)
    return <span>Something went wrong ʕ•̠͡•ʔ</span>;
  if (!satData || !inscriptionData) return <Loading />;

  return (
    <div className="flex flex-col items-center justify-between rounded-lg border px-4 py-12">
      <h1 className="text-3xl">Sat {sid}</h1>

      <h2 className="mt-8 text-center uppercase">
        Inscription{inscriptionData?.results.length > 1 && "s"}
      </h2>

      {/* todo: add pagination for sats with many inscriptions, or link to explore page */}
      {satData.inscription_id && inscriptionData?.results.length == 1 ? (
        <div className="mb-8 mt-4 flex w-1/2 flex-col items-stretch sm:w-1/3 md:w-1/3 lg:w-2/5">
          <Inscription id={satData.inscription_id} />
        </div>
      ) : (
        <div className="mb-8 mt-4 flex w-full flex-wrap justify-center">
          {inscriptionData?.results.map((inscription) => (
            <div
              key={inscription.id}
              className="mb-8 flex flex-col p-1.5 sm:w-1/3 md:w-1/3"
            >
              <InscriptionCard inscription={inscription} />
            </div>
          ))}
        </div>
      )}

      <table className="border-collapse text-sm">
        <tbody>
          <tr className="flex flex-col space-y-0.5 border-b py-4 md:table-row">
            <td className="whitespace-nowrap px-2 pr-20 uppercase underline md:py-3 md:no-underline">
              Sat Rarity
            </td>
            <td className="break-all px-2 uppercase md:py-2">
              <RarityTag rarity={satData.rarity} />
            </td>
          </tr>
          {/* todo: Coinbase Timestamp? */}
          <tr className="flex flex-col space-y-0.5 border-b py-4 md:table-row">
            <td className="whitespace-nowrap px-2 pr-20 uppercase underline md:py-3 md:no-underline">
              Name
            </td>
            <td className="break-all px-2 md:py-2">{satData.name}</td>
          </tr>
          <tr className="flex flex-col space-y-0.5 border-b py-4 md:table-row">
            <td className="whitespace-nowrap px-2 pr-20 uppercase underline md:py-3 md:no-underline">
              Coinbase Height
            </td>
            <td className="break-all px-2 md:py-2">
              {satData.coinbase_height}
            </td>
          </tr>
          <tr className="flex flex-col space-y-0.5 border-b py-4 md:table-row">
            <td className="whitespace-nowrap px-2 pr-20 uppercase underline md:py-3 md:no-underline">
              Decimal
            </td>
            <td className="break-all px-2 md:py-2">{satData.decimal}</td>
          </tr>
          <tr className="flex flex-col space-y-0.5 border-b py-4 md:table-row">
            <td className="whitespace-nowrap px-2 pr-20 uppercase underline md:py-3 md:no-underline">
              Degree
            </td>
            <td className="break-all px-2 md:py-2">{satData.degree}</td>
          </tr>
          <tr className="flex flex-col space-y-0.5 border-b py-4 md:table-row">
            <td className="whitespace-nowrap px-2 pr-20 uppercase underline md:py-3 md:no-underline">
              Percentile
            </td>
            {/* todo: something looks wrong here */}
            <td className="break-all px-2 md:py-2">{satData.percentile}</td>
          </tr>
          <tr className="flex flex-col space-y-0.5 border-b py-4 md:table-row">
            <td className="whitespace-nowrap px-2 pr-20 uppercase underline md:py-3 md:no-underline">
              Cycle
            </td>
            <td className="break-all px-2 md:py-2">{satData.cycle}</td>
          </tr>
          <tr className="flex flex-col space-y-0.5 py-4 md:table-row">
            <td className="whitespace-nowrap px-2 pr-20 uppercase underline md:py-3 md:no-underline">
              Offset
            </td>
            <td className="break-all px-2 md:py-2">{satData.offset}</td>
          </tr>
        </tbody>
        {/* todo: add period? not in api, needs sat coinbase height, or calculate it */}
      </table>
    </div>
  );
};

export default SatDetails;
