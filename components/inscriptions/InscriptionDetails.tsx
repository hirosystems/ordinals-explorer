"use client";

import Link from "next/link";
import useSWR from "swr";

import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { API_URL } from "../../lib/constants";
import { fetcher, formatDateTime } from "../../lib/helpers";
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
          <div className="flex items-center space-x-2">
            <h2 className="my-2 text-2xl">Inscription #{data.number}</h2>
            <Link
              href={`https://ordinals.com/inscription/${data.id}`}
              className="relative rounded bg-neutral-0 px-1 py-1 transition-colors hover:bg-neutral-50"
              title="View on ordinals.com"
              target="_blank"
            >
              <ExternalLinkIcon />
            </Link>
          </div>
          <table className="w-full border-collapse text-sm">
            <tbody>
              <tr className="flex flex-col border-b pl-3 md:table-row md:py-3 md:pl-0 md:align-middle">
                <td className="whitespace-nowrap pr-8 pt-2.5 text-neutral-400 md:py-2.5 md:text-black">
                  <span className="uppercase">Type</span>
                </td>
                <td className="group break-all pb-2.5 align-middle md:py-1.5">
                  <span className="uppercase">{data.content_type}</span>
                </td>
              </tr>
              <tr className="flex flex-col border-b pl-3 md:table-row md:py-3 md:pl-0 md:align-middle">
                <td className="whitespace-nowrap pr-8 pt-2.5 text-neutral-400 md:py-2.5 md:text-black">
                  <span className="uppercase">Content Length</span>
                </td>
                <td className="group break-all pb-2.5 align-middle md:py-1.5">
                  {data.content_length}
                </td>
              </tr>
              <tr className="flex flex-col border-b pl-3 md:table-row md:py-3 md:pl-0 md:align-middle">
                <td className="whitespace-nowrap pr-8 pt-2.5 text-neutral-400 md:py-2.5 md:text-black">
                  <span className="uppercase">Sat</span>
                </td>
                <td className="group break-all pb-2.5 align-middle md:py-1.5">
                  <CopyButton text={data.sat_ordinal}>
                    <Link
                      className="underline"
                      href={`/sat/${data.sat_ordinal}`}
                    >
                      {data.sat_ordinal}
                    </Link>
                  </CopyButton>
                </td>
              </tr>
              <tr className="flex flex-col border-b pl-3 md:table-row md:py-3 md:pl-0 md:align-middle">
                <td className="whitespace-nowrap pr-8 pt-2.5 text-neutral-400 md:py-2.5 md:text-black">
                  <span className="uppercase">Sat Rarity</span>
                </td>
                <td className="group break-all pb-2.5 align-middle md:py-1.5">
                  <span className="rounded-[4px] bg-neutral-400 px-1 py-0.5 uppercase text-white">
                    {/* todo: fancy rarity component */}
                    {data.sat_rarity}
                  </span>
                </td>
              </tr>
              <tr className="flex flex-col border-b pl-3 md:table-row md:py-3 md:pl-0 md:align-middle">
                <td className="whitespace-nowrap pr-8 pt-2.5 text-neutral-400 md:py-2.5 md:text-black">
                  <span className="uppercase">ID</span>
                </td>
                <td className="group break-all pb-2.5 align-middle md:py-1.5">
                  <CopyButton>{data.id}</CopyButton>
                </td>
              </tr>
              <tr className="flex flex-col border-b pl-3 md:table-row md:py-3 md:pl-0 md:align-middle">
                <td className="whitespace-nowrap pr-8 pt-2.5 text-neutral-400 md:py-2.5 md:text-black">
                  <span className="uppercase">Owned By</span>
                  {/* todo: add help tooltip to explain what an address is and how utxo ownership works */}
                </td>
                <td className="group break-all pb-2.5 align-middle md:py-1.5">
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
              <tr className="flex flex-col border-b pl-3 md:table-row md:py-3 md:pl-0 md:align-middle">
                <td className="whitespace-nowrap pr-8 pt-2.5 text-neutral-400 md:py-2.5 md:text-black">
                  <span className="uppercase">Inscribed By</span>
                  {/* todo: add help tooltip to explain what an address is and how utxo ownership works */}
                </td>
                <td className="group break-all pb-2.5 align-middle md:py-1.5">
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
              <tr className="flex flex-col border-b pl-3 md:table-row md:py-3 md:pl-0 md:align-middle">
                <td className="whitespace-nowrap pr-8 pt-2.5 text-neutral-400 md:py-2.5 md:text-black">
                  <span className="uppercase">Inscription TxId</span>
                </td>
                <td className="group break-all pb-2.5 align-middle md:py-1.5">
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
              <tr className="flex flex-col border-b pl-3 md:table-row md:py-3 md:pl-0 md:align-middle">
                <td className="whitespace-nowrap pr-8 pt-2.5 text-neutral-400 md:py-2.5 md:text-black">
                  <span className="uppercase">Inscription Date</span>
                </td>
                <td className="group break-all pb-2.5 align-middle md:py-1.5">
                  <span className="uppercase">
                    {formatDateTime(data.genesis_timestamp)}
                  </span>
                </td>
              </tr>
              {wasTransferred && (
                <tr className="flex flex-col border-b pl-3 md:table-row md:py-3 md:pl-0 md:align-middle">
                  <td className="whitespace-nowrap pr-8 pt-2.5 text-neutral-400 md:py-2.5 md:text-black">
                    <span className="uppercase">Last Transfer Date</span>
                  </td>
                  <td className="group break-all pb-2.5 align-middle md:py-1.5">
                    <span className="uppercase">
                      {new Intl.DateTimeFormat("default", {
                        dateStyle: "long",
                        timeStyle: "medium",
                      }).format(new Date(data.timestamp))}
                    </span>
                  </td>
                </tr>
              )}
              <tr className="flex flex-col border-b pl-3 md:table-row md:py-3 md:pl-0 md:align-middle">
                <td className="whitespace-nowrap pr-8 pt-2.5 text-neutral-400 md:py-2.5 md:text-black">
                  <span className="uppercase">Inscription Height</span>
                </td>
                <td className="group break-all pb-2.5 align-middle md:py-1.5">
                  <Link
                    href={`/block/${data.genesis_block_height}`}
                    className="underline"
                  >
                    {data.genesis_block_height}
                  </Link>
                </td>
              </tr>
              <tr className="flex flex-col border-b pl-3 md:table-row md:py-3 md:pl-0 md:align-middle">
                <td className="whitespace-nowrap pr-8 pt-2.5 text-neutral-400 md:py-2.5 md:text-black">
                  <span className="uppercase">Inscription Fee</span>
                </td>
                <td className="group break-all pb-2.5 align-middle md:py-1.5">
                  {data.genesis_fee}
                </td>
              </tr>
              <tr className="flex flex-col border-b pl-3 md:table-row md:py-3 md:pl-0 md:align-middle">
                <td className="whitespace-nowrap pr-8 pt-2.5 text-neutral-400 md:py-2.5 md:text-black">
                  <span className="uppercase">Output</span>
                </td>
                <td className="group break-all pb-2.5 align-middle md:py-1.5">
                  <CopyButton>{data.output}</CopyButton>
                </td>
              </tr>
              <tr className="flex flex-col pl-3 md:table-row md:py-3 md:pl-0 md:align-middle">
                <td className="whitespace-nowrap pr-8 pt-2.5 text-neutral-400 md:py-2.5 md:text-black">
                  <span className="uppercase">Offset</span>
                </td>
                <td className="group break-all pb-2.5 align-middle md:py-1.5">
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
