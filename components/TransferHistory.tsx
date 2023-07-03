"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ReactTimeAgo from "react-time-ago";
import { useUpdate } from "react-use";
import useSWR from "swr";
import { API_URL } from "../lib/constants";
import {
  InscriptionResponse,
  InscriptionTransferResponse,
  ListResponse,
} from "../lib/types";
import { cn, fetcher, formatDateTime } from "../lib/utils";
import CopyButton from "./CopyButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./Select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./Tooltip";

TimeAgo.addDefaultLocale(en);

const TransferHistory = (props: { inscription: InscriptionResponse }) => {
  const update = useUpdate();

  const [rowsPerPage, setRowsPerPage] = useState("10");
  const limit = parseInt(rowsPerPage);

  const pathname = usePathname();
  const url = new URL(window.location.href);
  const searchParams = new URLSearchParams(url.search);

  const page = parseInt(searchParams.get("p") ?? "0");
  const offset = page * limit;

  function updatePage(offset: number) {
    searchParams.set("p", `${page + offset}`);
    window.history.pushState({}, "", `${pathname}?${searchParams.toString()}`);
    update(); // force re-render
  }

  const params = new URLSearchParams({
    limit: rowsPerPage,
    offset: offset.toString(),
  });
  const { data, error, isLoading } = useSWR<
    | ListResponse<InscriptionTransferResponse>
    | {
        // todo: add more generic api error response type
        error: string;
        message: string;
        statusCode: number;
      }
  >(
    `${API_URL}/inscriptions/${
      props.inscription.id
    }/transfers?${params.toString()}`,
    fetcher,
    { keepPreviousData: true }
  );

  if (!data) return null;
  if (error) return <span>Something went wrong ʕ•̠͡•ʔ</span>;
  if (data && "error" in data)
    // todo: add better error component
    return (
      <span>
        Something went wrong ʕ•̠͡•ʔ
        <br />
        {data.error}: {data.message}
      </span>
    );

  const isLastPage = (page + 1) * limit >= data.total;
  const isOnlyPage = page === 0 && isLastPage;

  return (
    <motion.div
      className="flex flex-col p-2"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={{ duration: 0.1 }}
    >
      <h2 className="my-4 text-xl">Transfer History</h2>
      <div className="max-w-full">
        <div className="relative overflow-x-auto rounded-t-[4px]">
          <table className="w-full border-collapse rounded-t-[4px] border border-neutral-50">
            <thead className="w-full table-fixed">
              <tr>
                <th className="rounded-tl-[4px] bg-neutral-0 px-4 py-2 text-left text-sm font-normal uppercase">
                  Date
                </th>
                <th className="bg-neutral-0 px-4 py-2 text-left text-sm font-normal uppercase">
                  Transferred To
                </th>
                <th className="rounded-tr-[4px] bg-neutral-0 px-4 py-2 text-left text-sm font-normal uppercase">
                  TxId
                </th>
                {/* todo: add loading dot component */}
                {/* {isLoading && (
                  <span className="absolute right-2 top-2">
                    <Loading />
                  </span>
                )} */}
              </tr>
            </thead>
            <tbody>
              {data.results.map((transfer: InscriptionTransferResponse, i) => (
                <TransferRow
                  transfer={transfer}
                  isGenisis={isLastPage && i === data.results.length - 1}
                  previousAddress={data.results[i + 1]?.address}
                  key={transfer?.output ?? i}
                />
              ))}
            </tbody>
          </table>
        </div>
        {/* Spacer */}
        <div className="h-1 w-full border-x" />
        <div className="flex items-center justify-between rounded-b-[4px] border py-0.5 pl-3 pr-2 text-sm">
          {/* Responsive legend */}
          <div className="text-neutral-500 ">
            <span className="hidden sm:inline">
              <sup title="Inscription genesis">+</sup> Inscription genesis
            </span>
          </div>
          <div className="flex items-center space-x-6">
            {/* Page size selector */}
            <Select value={rowsPerPage} onValueChange={setRowsPerPage}>
              <SelectTrigger
                className={cn(
                  "hidden sm:flex",
                  isOnlyPage && "text-neutral-200"
                )}
                disabled={isOnlyPage}
              >
                <div className="space-x-3">
                  <label htmlFor="rows">Rows per page:</label>
                  <span>
                    [<SelectValue />]
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent id="rows" className="text-sm">
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <div className="font-['Aeonik_Mono'] tracking-tight">
              {page * limit + 1}-{isLastPage ? data.total : (page + 1) * limit}{" "}
              of {data.total}
            </div>
            {/* Pagination */}
            <div className="grid grid-cols-2">
              {page > 0 ? (
                <motion.button
                  className="self-center rounded-[50%] bg-transparent p-1.5 text-neutral-500 transition-colors hover:bg-neutral-0"
                  whileTap={{
                    scale: 0.8,
                  }}
                  onClick={() => updatePage(-1)}
                  title="Previous page"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </motion.button>
              ) : (
                <button
                  className="cursor-default self-center rounded-[50%] p-1.5 text-neutral-200"
                  disabled={true}
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </button>
              )}
              {isLastPage ? (
                <button
                  className="cursor-default self-center rounded-[50%] p-1.5 text-neutral-200"
                  disabled={true}
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              ) : (
                <motion.button
                  className="self-center rounded-[50%] bg-transparent p-1.5 text-neutral-500 transition-colors hover:bg-neutral-0"
                  whileTap={{
                    scale: 0.8,
                  }}
                  onClick={() => updatePage(+1)}
                  title="Next page"
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </motion.button>
              )}
            </div>
          </div>
        </div>
        {/* Responsive legend */}
        <div className="mx-2 my-2 text-sm sm:hidden">
          <sup title="Inscription genesis">+</sup> Inscription genesis
        </div>
      </div>
    </motion.div>
  );
};

export default TransferHistory;

const TransferRow = ({
  transfer,
  isGenisis: isGenesis,
  previousAddress, // todo?
}: {
  transfer?: InscriptionTransferResponse;
  isGenisis: boolean;
  previousAddress?: string;
}) => {
  if (!transfer) {
    // loading skeleton
    return (
      <tr className="font-['Aeonik_Mono'] text-sm leading-tight tracking-tight">
        <td className="border border-neutral-50 px-3 py-1.5 text-left md:w-1 md:whitespace-nowrap" />
        <td className="group max-w-[200px] overflow-hidden text-ellipsis border border-neutral-50 px-4 py-2 text-left" />
        <td className="group max-w-[200px] overflow-hidden text-ellipsis border border-neutral-50 px-4 py-2" />
      </tr>
    );
  }

  return (
    <tr className="font-['Aeonik_Mono'] text-sm leading-tight tracking-tight">
      {/* "w-1 whitespace-nowrap" let's the column shrink to fit content */}
      <td className="border border-neutral-50 px-3 py-1.5 text-left md:w-1 md:whitespace-nowrap">
        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger className="text-left">
              <ReactTimeAgo
                className="tracking-tight"
                date={transfer.timestamp}
                tooltip={false}
              />
              <sup
                className={cn("invisible", isGenesis && "visible")}
                title="Inscription genesis"
              >
                +
              </sup>
            </TooltipTrigger>
            <TooltipContent variant="light">
              {formatDateTime(transfer.timestamp)}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </td>
      {/* <td className="max-w-[200px] overflow-hidden text-ellipsis border border-neutral-50 px-4 py-2"> */}
      {/* todo: maybe just not show from address */}
      {/* todo: depulicate param isGenesis, as we can detect from presence of previousAddress if genesis */}
      {/* {previousAddress ? (
          <CopyButton text={transfer.address}>
            {previousAddress.slice(0, 6)}&hellip;{previousAddress.slice(-6)}
          </CopyButton>
        ) : (
          <span className="bg-neutral-400 text-white">origin</span>
        )}
      </td> */}
      <td className="group max-w-[200px] overflow-hidden text-ellipsis border border-neutral-50 px-4 py-2 text-left">
        <CopyButton text={transfer.address} className="flex">
          <span className="min-w-0 overflow-hidden text-ellipsis">
            {transfer.address}
          </span>
        </CopyButton>
      </td>
      <td className="group max-w-[200px] overflow-hidden text-ellipsis border border-neutral-50 px-4 py-2">
        <CopyButton text={transfer.tx_id} className="flex">
          <div className="overflow-hidden text-ellipsis">
            <Link
              className="underline"
              href={`https://mempool.space/tx/${transfer.tx_id}`}
              target="_blank"
            >
              <span className="min-w-0 overflow-hidden text-ellipsis">
                {transfer.tx_id}
              </span>
            </Link>
          </div>
          <span className="relative -left-1.5">↗</span>
        </CopyButton>
      </td>
    </tr>
  );
};
