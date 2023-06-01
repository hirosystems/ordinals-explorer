"use client";

import Link from "next/link";
import useSWR from "swr";

import { API_URL } from "../../lib/constants";
import { fetcher } from "../../lib/helpers";
import { InscriptionResponse } from "../../lib/types";
import Loading from "./../Loading";
import TransferHistory from "./../TransferHistory";
import InscriptionRender from "./InscriptionRender";

const InscriptionDetails = (params: { iid: string }) => {
  const { data, error, isLoading } = useSWR<
    | InscriptionResponse
    | {
        // todo: add more generic api error response type
        error: string;
        message: string;
        statusCode: number;
      }
  >(`${API_URL}/inscriptions/${params.iid}`, fetcher);

  if (!params.iid) return <div>404</div>;

  if (error) return <span>Something went wrong ʕ•̠͡•ʔ</span>;
  if (!data) return <Loading />;
  if ("error" in data)
    return (
      <span>
        Something went wrong ʕ•̠͡•ʔ
        <br />
        {data.error}: {data.message}
      </span>
    );
  // todo: reusable error component (maybe including loading)

  // todo: add better check (could be the same if transferred in same block?)
  const wasTransferred = data.timestamp !== data.genesis_timestamp;

  return (
    <>
      <div className="flex flex-col md:flex-row md:space-x-8">
        {/* <div className="font-mono text-center break-words">{params.iid}</div> */}
        <div className="flex-auto basis-[384px]">
          <div className="mx-auto mb-16 max-w-[65%] overflow-hidden rounded-md sm:max-w-[55%] md:mb-0 md:w-0 md:min-w-full md:max-w-none lg:border lg:p-10 xl:p-16 ">
            <InscriptionRender
              className="overflow-hidden rounded-md"
              inscription={data}
            />
          </div>
        </div>

        {/* todo: add links to linkeable data, add copy icon to copy to clipboard elements (see figma) */}
        <div className="flex-initial">
          <h2 className="my-2 text-2xl">Inscription #{data.number}</h2>
          <table className="w-full border-collapse text-sm uppercase">
            <tbody>
              <tr className="flex flex-col space-y-0.5 border-b py-3 md:table-row">
                <td className="whitespace-nowrap pr-8 underline md:py-2 md:no-underline">
                  Type
                </td>
                <td className="flex items-center space-x-2 break-all md:py-2">
                  {data.content_type}
                </td>
              </tr>
              <tr className="flex flex-col space-y-0.5 border-b py-3 md:table-row">
                <td className="whitespace-nowrap pr-8 underline md:py-2 md:no-underline">
                  Content Length
                </td>
                <td className="break-all md:py-2">{data.content_length}</td>
              </tr>
              <tr className="flex flex-col space-y-0.5 border-b py-3 md:table-row">
                <td className="whitespace-nowrap pr-8 underline md:py-2 md:no-underline">
                  Sat
                </td>
                <td className="break-all md:py-2">
                  <Link href={`/sat/${data.sat_ordinal}`} className="underline">
                    {data.sat_ordinal}
                  </Link>
                </td>
              </tr>
              <tr className="flex flex-col space-y-0.5 border-b py-3 md:table-row">
                <td className="whitespace-nowrap pr-8 underline md:py-2 md:no-underline">
                  Sat Rarity
                </td>
                <td className="break-all md:py-2">
                  <span className="rounded-[4px] bg-neutral-400 px-1 py-0.5 text-white">
                    {/* todo: fancy rarity component */}
                    {data.sat_rarity}
                  </span>
                </td>
              </tr>
              <tr className="flex flex-col space-y-0.5 border-b py-3 md:table-row">
                <td className="whitespace-nowrap pr-8 underline md:py-2 md:no-underline">
                  ID
                </td>
                <td className="break-all md:py-2">{data.id}</td>
              </tr>
              <tr className="flex flex-col space-y-0.5 border-b py-3 md:table-row">
                <td className="whitespace-nowrap pr-8 underline md:py-2 md:no-underline">
                  Owned By
                  {/* todo: add help tooltip to explain what an address is and how utxo ownership works */}
                </td>
                <td className="break-all md:py-2">
                  <Link href={`/address/${data.address}`} className="underline">
                    {data.address}
                  </Link>
                </td>
              </tr>
              <tr className="flex flex-col space-y-0.5 border-b py-3 md:table-row">
                <td className="whitespace-nowrap pr-8 underline md:py-2 md:no-underline">
                  Inscribed By
                  {/* todo: add help tooltip to explain what an address is and how utxo ownership works */}
                </td>
                <td className="break-all md:py-2">
                  <Link
                    href={`/address/${data.genesis_address}`}
                    className="underline"
                  >
                    {data.genesis_address}
                  </Link>
                </td>
              </tr>
              <tr className="flex flex-col space-y-0.5 border-b py-3 md:table-row">
                <td className="whitespace-nowrap pr-8 underline md:py-2 md:no-underline">
                  Inscription TxId
                </td>
                <td className="break-all underline md:py-2">
                  <Link
                    href={`https://mempool.space/tx/${data.genesis_tx_id}`}
                    target="_blank"
                  >
                    {data.genesis_tx_id} ↗
                  </Link>
                </td>
              </tr>
              {/* todo: add Inscription Date */}
              <tr className="flex flex-col space-y-0.5 border-b py-3 md:table-row">
                <td className="whitespace-nowrap pr-8 underline md:py-2 md:no-underline">
                  Inscription Date
                </td>
                <td className="break-all md:py-2">
                  {new Intl.DateTimeFormat("default", {
                    dateStyle: "long",
                    timeStyle: "medium",
                  }).format(new Date(data.genesis_timestamp))}
                </td>
              </tr>
              {wasTransferred && (
                <tr className="flex flex-col space-y-0.5 border-b py-3 md:table-row">
                  <td className="whitespace-nowrap pr-8 underline md:py-2 md:no-underline">
                    Last Transfer Date
                  </td>
                  <td className="break-all md:py-2">
                    {new Intl.DateTimeFormat("default", {
                      dateStyle: "long",
                      timeStyle: "medium",
                    }).format(new Date(data.timestamp))}
                  </td>
                </tr>
              )}
              <tr className="flex flex-col space-y-0.5 border-b py-3 md:table-row">
                <td className="whitespace-nowrap pr-8 underline md:py-2 md:no-underline">
                  Inscription Height
                </td>
                <td className="break-all md:py-2">
                  <Link
                    href={`/block/${data.genesis_block_height}`}
                    className="underline"
                  >
                    {data.genesis_block_height}
                  </Link>
                </td>
              </tr>
              <tr className="flex flex-col space-y-0.5 border-b py-3 md:table-row">
                <td className="whitespace-nowrap pr-8 underline md:py-2 md:no-underline">
                  Inscription Fee
                </td>
                <td className="break-all md:py-2">{data.genesis_fee}</td>
              </tr>
              <tr className="flex flex-col space-y-0.5 border-b py-3 md:table-row">
                <td className="whitespace-nowrap pr-8 underline md:py-2 md:no-underline">
                  Output
                </td>
                <td className="break-all md:py-2">{data.output}</td>
              </tr>
              <tr className="flex flex-col space-y-0.5 py-3 md:table-row">
                <td className="whitespace-nowrap pr-8 underline md:py-2 md:no-underline">
                  Offset
                </td>
                <td className="break-all md:py-2">{data.offset}</td>
              </tr>
            </tbody>
            {/* todo: add period? not in api, needs sat coinbase height, or calculate it */}
          </table>
        </div>
      </div>
      {/* todo: complete transfer history */}
      {wasTransferred && (
        <div className="mt-10">
          <TransferHistory inscription={data} />
        </div>
      )}
    </>
  );
};

export default InscriptionDetails;
