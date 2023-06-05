"use client";

import Link from "next/link";
import useSWR from "swr";

import { API_URL } from "../../lib/constants";
import { fetcher } from "../../lib/helpers";
import { InscriptionResponse } from "../../lib/types";
import CopyButton from "../CopyButton";
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
          <table className="w-full border-collapse text-sm">
            <tbody>
              <tr className="flex flex-col space-y-0.5 border-b py-3 md:table-row">
                <td className="whitespace-nowrap pr-8 uppercase text-neutral-400 md:text-black">
                  Type
                </td>
                <td className="group flex min-h-[38px] items-center break-all uppercase">
                  {data.content_type}
                </td>
              </tr>
              <tr className="flex flex-col space-y-0.5 border-b py-3 md:table-row">
                <td className="whitespace-nowrap pr-8 uppercase text-neutral-400 md:text-black">
                  Content Length
                </td>
                <td className="group flex min-h-[38px] items-center break-all">
                  {data.content_length}
                </td>
              </tr>
              <tr className="flex flex-col space-y-0.5 border-b py-3 md:table-row">
                <td className="whitespace-nowrap pr-8 uppercase text-neutral-400 md:text-black">
                  Sat
                </td>
                <td className="group flex min-h-[38px] items-center break-all">
                  <Link className="underline" href={`/sat/${data.sat_ordinal}`}>
                    {data.sat_ordinal}
                  </Link>
                </td>
              </tr>
              <tr className="flex flex-col space-y-0.5 border-b py-3 md:table-row">
                <td className="whitespace-nowrap pr-8 uppercase text-neutral-400 md:text-black">
                  Sat Rarity
                </td>
                <td className="group flex min-h-[38px] items-center break-all">
                  <span className="rounded-[4px] bg-neutral-400 px-1 py-0.5 uppercase text-white">
                    {/* todo: fancy rarity component */}
                    {data.sat_rarity}
                  </span>
                </td>
              </tr>
              <tr className="flex flex-col space-y-0.5 border-b py-3 md:table-row">
                <td className="whitespace-nowrap pr-8 uppercase text-neutral-400 md:text-black">
                  ID
                </td>
                <td className="group flex min-h-[38px] items-center break-all">
                  <CopyButton>{data.id}</CopyButton>
                </td>
              </tr>
              <tr className="flex flex-col space-y-0.5 border-b py-3 md:table-row">
                <td className="whitespace-nowrap pr-8 uppercase text-neutral-400 md:text-black">
                  Owned By
                  {/* todo: add help tooltip to explain what an address is and how utxo ownership works */}
                </td>
                <td className="group flex min-h-[38px] items-center break-all">
                  <CopyButton text={data.address}>
                    <Link
                      className="underline"
                      href={`/address/${data.address}`}
                    >
                      {data.address}
                    </Link>
                  </CopyButton>
                </td>
              </tr>
              <tr className="flex flex-col space-y-0.5 border-b py-3 md:table-row">
                <td className="whitespace-nowrap pr-8 uppercase text-neutral-400 md:text-black">
                  Inscribed By
                  {/* todo: add help tooltip to explain what an address is and how utxo ownership works */}
                </td>
                <td className="group flex min-h-[38px] items-center break-all">
                  <CopyButton text={data.genesis_address}>
                    <Link
                      className="underline"
                      href={`/address/${data.genesis_address}`}
                    >
                      {data.genesis_address}
                    </Link>
                  </CopyButton>
                </td>
              </tr>
              <tr className="flex flex-col space-y-0.5 border-b py-3 md:table-row">
                <td className="whitespace-nowrap pr-8 uppercase text-neutral-400 md:text-black">
                  Inscription TxId
                </td>
                <td className="group flex min-h-[38px] items-center break-all">
                  <CopyButton text={data.genesis_tx_id}>
                    <div>
                      <Link
                        className="underline"
                        href={`https://mempool.space/tx/${data.genesis_tx_id}`}
                        target="_blank"
                      >
                        {data.genesis_tx_id}
                      </Link>
                      <span className="ml-1">↗</span>
                    </div>
                  </CopyButton>
                </td>
              </tr>
              {/* todo: add Inscription Date */}
              <tr className="flex flex-col space-y-0.5 border-b py-3 md:table-row">
                <td className="whitespace-nowrap pr-8 uppercase text-neutral-400 md:text-black">
                  Inscription Date
                </td>
                <td className="group flex min-h-[38px] items-center break-all uppercase">
                  {new Intl.DateTimeFormat("default", {
                    dateStyle: "long",
                    timeStyle: "medium",
                  }).format(new Date(data.genesis_timestamp))}
                </td>
              </tr>
              {wasTransferred && (
                <tr className="flex flex-col space-y-0.5 border-b py-3 md:table-row">
                  <td className="whitespace-nowrap pr-8 uppercase text-neutral-400 md:text-black">
                    Last Transfer Date
                  </td>
                  <td className="group flex min-h-[38px] items-center break-all">
                    {new Intl.DateTimeFormat("default", {
                      dateStyle: "long",
                      timeStyle: "medium",
                    }).format(new Date(data.timestamp))}
                  </td>
                </tr>
              )}
              <tr className="flex flex-col space-y-0.5 border-b py-3 md:table-row">
                <td className="whitespace-nowrap pr-8 uppercase text-neutral-400 md:text-black">
                  Inscription Height
                </td>
                <td className="group flex min-h-[38px] items-center break-all">
                  <Link
                    href={`/block/${data.genesis_block_height}`}
                    className="underline"
                  >
                    {data.genesis_block_height}
                  </Link>
                </td>
              </tr>
              <tr className="flex flex-col space-y-0.5 border-b py-3 md:table-row">
                <td className="whitespace-nowrap pr-8 uppercase text-neutral-400 md:text-black">
                  Inscription Fee
                </td>
                <td className="group flex min-h-[38px] items-center break-all">
                  {data.genesis_fee}
                </td>
              </tr>
              <tr className="flex flex-col space-y-0.5 border-b py-3 md:table-row">
                <td className="whitespace-nowrap pr-8 uppercase text-neutral-400 md:text-black">
                  Output
                </td>
                <td className="group flex min-h-[38px] items-center break-all">
                  <CopyButton>{data.output}</CopyButton>
                </td>
              </tr>
              <tr className="flex flex-col space-y-0.5 py-3 md:table-row">
                <td className="whitespace-nowrap pr-8 uppercase text-neutral-400 md:text-black">
                  Offset
                </td>
                <td className="group flex min-h-[38px] items-center break-all">
                  {data.offset}
                </td>
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
