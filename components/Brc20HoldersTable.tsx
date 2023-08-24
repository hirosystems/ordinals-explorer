"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useUpdate } from "react-use";
import useSWR from "swr";

import { useHasMounted } from "../lib/hooks";
import {
  Brc20HolderResponse,
  Brc20TokenResponse,
  ListResponse,
} from "../lib/types";
import { cn, fetcher, formatDateTime, humanReadableCount } from "../lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./Select";
import { inscriptionSortOptions } from "./Sort";
import { TimeAgo } from "./TimeAgo";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./Tooltip";



const Brc20HoldersTable = () => {
  const [page, setPage] = useState(0);
  function updatePage(delta: number) {
    setPage((prev) => prev + delta);
  }

  const [rowsPerPage, setRowsPerPage] = useState("20");
  const limit = parseInt(rowsPerPage);

  const params = new URLSearchParams({
    // sort_by: "tx_count",
    // order: "desc",
    count: rowsPerPage,
    offset: offset.toString(),
  });

  const { data, error, isLoading } = useSWR<ListResponse<Brc20TokenResponse>>(
    `https://api.dev.hiro.so/ordinals/brc-20/tokens/${}`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  if (!data) return null;
  if (error) return <span>Something went wrong ʕ•̠͡•ʔ</span>;
  if (data && "error" in data)
    // todo: add better error component
    return (
      <span>
        Something went wrong ʕ•̠͡•ʔ
        <br />
        {/* {data.error}: {data.message} */}
      </span>
    );

  const isLastPage = (page + 1) * limit >= 100; // todo: fix!!!!
  // const isLastPage = (page + 1) * limit >= data.total;
  const isOnlyPage = page === 0 && isLastPage;

  return (
    <TooltipProvider delayDuration={150}>
      {/* todo: stats? */}
      {/* <div className="grid grid-cols-3 rounded-lg border border-neutral-0">
        <div className="border-r border-neutral-0 p-3">x</div>
        <div className="border-r border-neutral-0 p-3">y</div>
        <div className="p-3 ">z</div>
      </div> */}

      <div className="space-y-2 rounded-lg border border-neutral-0 p-7 pt-6">
        <h2 className="text-2xl">What is BRC-20?</h2>
        <p className="text-neutral-600">
          BRC-20 is a new token standard (
          <Link
            className="text-neutral-400 underline"
            href="https://twitter.com/domodata/status/1633658974686855168"
            target="_blank"
          >
            and experiment by @domodata
          </Link>
          ) on the Ordinals and the Bitcoin network. It allows users to create,
          mint, and transfer fungibe tokens &mdash; similar to ERC-20 on
          Ethereum. The{" "}
          <Link
            className="text-neutral-400 underline"
            href="https://domo-2.gitbook.io/brc-20-experiment/"
            target="_blank"
          >
            protocol
          </Link>{" "}
          is built on top of Ordinals.
        </p>
        <Link
          className="block text-center text-neutral-300 underline"
          href="https://www.hiro.so/books/a-developers-guide-to-bitcoin-ordinals"
          target="_blank"
        >
          Read more
        </Link>
      </div>

      {/* todo: add balance lookup */}
      {/* <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4 rounded-lg border border-neutral-0 p-7 pt-6">
          <h2 className="text-xl">BRC-20 Balance Lookup</h2>
          <div className="flex space-x-1.5">
            <div className="group relative inline-block text-neutral-300 focus-within:text-neutral-600">
              <input
                className="rounded-[3px] bg-neutral-0 px-2 py-1.5 ps-[38px] text-sm text-neutral-600 placeholder-neutral-300"
                type="text"
                placeholder="Address search"
                title="Search for BRC-20 balance by address"
              />
              <div className="absolute bottom-0 left-2.5 top-0 flex items-center">
                <SearchIcon className="h-5 w-5 " fontSize={32} />
              </div>
            </div>
            <button className="rounded border-2 border-neutral-50 px-3 text-sm text-neutral-600 shadow-sm transition-shadow hover:shadow">
              Lookup Balance
            </button>
          </div>
        </div>
      </div> */}

      {/* todo: ? switch to react table and allow sorting filters column removal etc. -- shadcn/ui */}
      <div className="flex-1 rounded-lg border border-neutral-0">
        <div className="mb-3 space-y-2 p-4">
          <h2 className="text-2xl">Popular BRC-20 Tokens</h2>
          <p className="text-neutral-300">
            Displaying the most used BRC-20 tokens that have been minted, and
            transferred frequently
          </p>
        </div>

        {/* todo: filter row */}
        {/* <div className="ps-[67px]">
          <div className="group relative inline-block text-neutral-200 focus-within:text-neutral-400">
            <input
              className="rounded border-2 border-neutral-0 px-2 py-1.5 ps-[38px] text-sm text-neutral-500 placeholder-neutral-300"
              type="text"
              placeholder="Ticker search"
              title="Search for BRC-20 token by ticker"
              maxLength={4}
            />
            <div className="absolute bottom-0 left-2.5 top-0 flex items-center">
              <SearchIcon className="h-5 w-5 " fontSize={32} />
            </div>
          </div>
        </div> */}

        <div className="w-full overflow-scroll">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-neutral-0 text-sm text-neutral-300">
                <th className="w-1/4 px-4 py-2 text-start font-normal">
                  token
                </th>
                <th className="w-1/4 px-4 py-2 text-start font-normal">
                  % minted
                </th>
                {/* todo: use holders count instead */}
                <th className="w-1/4 px-4 py-2 text-start font-normal">
                  supply minted
                </th>
                {/* todo: use tx count instead */}
                <th className="w-1/4 px-4 py-2 text-start font-normal">
                  supply remaining
                </th>
                {/* <th className="w-1/4 px-4 py-2 text-start font-normal">
                  # holders
                </th> */}
                {/* <th className="w-1/4 px-4 py-2 text-start font-normal">
                  # transactions
                </th> */}
                <th className="width-[1px] whitespace-nowrap px-4 py-2 text-start font-normal">
                  date deployed
                </th>
              </tr>
            </thead>
            <tbody>
              {data.results.map((i, index) => (
                <Brc20TokenRow key={i?.ticker ?? index} token={i as any} />
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-row-reverse py-0.5 pl-3 pr-2 text-sm">
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
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
            <div className="font-['Aeonik_Mono'] tracking-tight">
              {/* {page * limit + 1}-
                {isLastPage ? data.total : (page + 1) * limit} of {data.total} */}
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
      </div>
    </TooltipProvider>
  );
};

const Brc20HolderRow = ({ holder }: { holder: Brc20HolderResponse }) => {
  return (
    <tr className="group border-b border-neutral-0 bg-white font-['Aeonik_Mono'] text-sm text-neutral-500 transition-colors hover:bg-neutral-0 hover:text-black">
      <td className="px-3 py-2.5 text-black">
        <Link
          className="flex items-center"
          href={`/protocols/brc-20/${token.ticker}`}
        >
          <div className="flex h-12 w-12 flex-col items-center justify-center rounded-full bg-neutral-50 text-neutral-200">
            <div className="leading-none">BRC</div>
            <div className="text-lg leading-none">20</div>
          </div>
          <div className="flex flex-col px-2">
            <span className="text-lg">{token.ticker}</span>
            {/* todo: maybe add seconds row for nicer design */}
            {/* <div className="pb-1 text-neutral-300 transition-colors group-hover:text-neutral-400">
              {token.tx_count} txs
            </div> */}
          </div>
        </Link>
      </td>
      <td className="px-3 text-start">
        <div className="inline-block">
          <div className="flex shrink flex-col items-end">
            <span>{progress}% Minted</span>
            <div className="flex justify-center">
              <progress max="100" value={progress} className="sr-only" />
              <div className="relative h-1.5 w-32 overflow-hidden rounded-full bg-neutral-0">
                <div
                  className="absolute h-1.5 bg-mint"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className="text-neutral-400">
              {/* todo: add minted supply again */}
              {/* {progress < 100 && (
                <>
                  <Tooltip>
                    <TooltipTrigger>
                      {humanReadableCount(Number(token.minted_supply), 1)}
                    </TooltipTrigger>
                    <TooltipContent variant="light">
                      {token.minted_supply}
                    </TooltipContent>
                  </Tooltip>
                  /
                </>
              )} */}
              <Tooltip>
                <TooltipTrigger>
                  <span className="text-neutral-300">
                    {humanReadableCount(Number(token.max_supply), 1)}
                  </span>
                </TooltipTrigger>
                <TooltipContent variant="light">
                  {token.max_supply}
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </td>
      <td className=" px-3 text-start">
        {Number(token.minted_supply) > 0 ? (
          token.minted_supply
        ) : (
          <span className="text-neutral-100">&mdash;</span>
        )}
      </td>
      <td className=" px-3 text-start">
        {remainingSupply > 0 ? (
          remainingSupply
        ) : (
          <span className="text-neutral-100">&mdash;</span>
        )}
      </td>
      {/* todo: add tx count and holders count */}
      {/* <td className="hidden px-3 text-right lg:table-cell">
        {token.tx_count} txs
      </td> */}
      <td className="width-[1px] whitespace-nowrap px-3">
        <div className="flex flex-col items-end">
          Deployed
          <Tooltip>
            <TooltipTrigger>
              <TimeAgo
                className="tracking-tight"
                date={deployedTime}
                tooltip={false}
              />
            </TooltipTrigger>
            <TooltipContent variant="light">
              {formatDateTime(token.deploy_timestamp)}
            </TooltipContent>
          </Tooltip>
        </div>
      </td>
    </tr>
  );
};


export default Brc20HoldersTable;
