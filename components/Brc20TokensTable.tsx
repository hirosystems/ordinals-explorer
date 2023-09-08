"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";

import { SearchIcon } from "lucide-react";
import Image from "next/image";
import { useHasMounted } from "../lib/hooks";
import { Brc20TokenResponse, ListResponse } from "../lib/types";
import { cn, fetcher, formatDateTime, humanReadableCount } from "../lib/utils";
import Loading from "./Loading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./Select";
import { TimeAgo } from "./TimeAgo";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./Tooltip";
import TruncatingTooltip from "./TruncatingTooltip";
import { API_BETA_URL } from "../lib/constants";

const TOKEN_THUMBNAIL_MAP = {
  ordi: "/brc20/ordi.png",
  meme: "/brc20/meme.png",
  punk: "/brc20/punk.png",
  pepe: "/brc20/pepe.png",
} as Record<string, string>;

const DEFAULT_ROWS_PER_PAGE = "10";

const Brc20TokensTable = () => {
  const [page, setPage] = useState(0);
  const [ticker, setTicker] = useState<string>("");

  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
  const limit = parseInt(rowsPerPage);

  const offset = page * limit;

  const params = new URLSearchParams({
    ticker,
    limit: rowsPerPage,
    offset: offset.toString(),
  });
  if (!ticker) params.delete("ticker");

  const { data, error, isLoading } = useSWR<ListResponse<Brc20TokenResponse>>(
    `${API_BETA_URL}/brc-20/tokens?${params.toString()}`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  if (!data) return <Loading />;
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

  // const isLastPage = (page + 1) * limit >= data.total;
  const isLastPage = (page + 1) * limit >= 1000; // todo: fix when better total exists
  const isOnlyPage = page === 0 && isLastPage;

  return (
    <TooltipProvider delayDuration={150}>
      <div className="group relative ms-3 inline-block text-neutral-200 focus-within:text-neutral-400">
        <input
          className="w-44 rounded bg-neutral-0 px-2 py-1.5 ps-[38px] text-sm text-neutral-500 placeholder-neutral-300"
          type="text"
          placeholder="Ticker search"
          title="Search for BRC-20 token by ticker"
          maxLength={4}
          onChange={(e) => setTicker(e.target.value)}
        />
        <div className="absolute bottom-0 left-2.5 top-0 flex items-center">
          <SearchIcon className="h-5 w-5 text-neutral-200" fontSize={32} />
        </div>
      </div>

      <Table data={data} isLoading={isLoading} />

      {data.results.length ? (
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
                <SelectItem value={DEFAULT_ROWS_PER_PAGE}>
                  {DEFAULT_ROWS_PER_PAGE}
                </SelectItem>
                <SelectItem value="25">25</SelectItem>
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
                  onClick={() => setPage((p) => p - 1)}
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
                  onClick={() => setPage((p) => p + 1)}
                  title="Next page"
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </motion.button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="cursor-default pb-12 pt-10 text-center text-neutral-300">
          <span className="rounded-md bg-neutral-0 px-1 py-0.5">No tokens</span>
        </div>
      )}
    </TooltipProvider>
  );
};

export const Brc20EarliestTokensTable = () => {
  const EARLIEST_TOKENS = [
    {
      token: {
        id: "b61b0172d95e266c18aea0c624db987e971a5d6d4ebc2aaed85da4642d635735i0",
        number: 348020,
        block_height: 779832,
        tx_id:
          "b61b0172d95e266c18aea0c624db987e971a5d6d4ebc2aaed85da4642d635735",
        address:
          "bc1pxaneaf3w4d27hl2y93fuft2xk6m4u3wc4rafevc6slgd7f5tq2dqyfgy06",
        ticker: "ordi",
        max_supply: "21000000.000000000000000000",
        mint_limit: "1000.000000000000000000",
        decimals: 18,
        deploy_timestamp: 1678248991000,
        minted_supply: "21000000.000000000000000000",
      },
      supply: {
        max_supply: "21000000.000000000000000000",
        minted_supply: "21000000.000000000000000000",
        holders: 12891,
      },
    },
    {
      token: {
        id: "307ffac5d20fc188f723706f85d75c926550d536f5fd1113839586f38542971ci0",
        number: 352242,
        block_height: 779887,
        tx_id:
          "307ffac5d20fc188f723706f85d75c926550d536f5fd1113839586f38542971c",
        address:
          "bc1pxwx69grfcccaphd6xa0fmrz3pqthftatmzvwa807r450j7n29mpqsmd28p",
        ticker: "meme",
        max_supply: "99999.000000000000000000",
        mint_limit: "1.000000000000000000",
        decimals: 18,
        deploy_timestamp: 1678279462000,
        minted_supply: "99999.000000000000000000",
      },
      supply: {
        max_supply: "99999.000000000000000000",
        minted_supply: "99999.000000000000000000",
        holders: 4908,
      },
    },
    {
      token: {
        id: "2782fcc4173baddd337b6adaaca11535daa821ab6c234d8eee22257260ea7d07i0",
        number: 356204,
        block_height: 779964,
        tx_id:
          "2782fcc4173baddd337b6adaaca11535daa821ab6c234d8eee22257260ea7d07",
        address:
          "bc1p7pceefkw20p0uch3mk2x5rx8ylag4gpky7vl6390wgdtwpc8rqcqtk3paa",
        ticker: "punk",
        max_supply: "10000.000000000000000000",
        mint_limit: "1.000000000000000000",
        decimals: 18,
        deploy_timestamp: 1678333933000,
        minted_supply: "10000.000000000000000000",
      },
      supply: {
        max_supply: "10000.000000000000000000",
        minted_supply: "10000.000000000000000000",
        holders: 2269,
      },
    },
    {
      token: {
        id: "54d5fe82f5d284363fec6ae6137d0e5263e237caf15211078252c0d95af8943ai0",
        number: 356777,
        block_height: 779969,
        tx_id:
          "54d5fe82f5d284363fec6ae6137d0e5263e237caf15211078252c0d95af8943a",
        address:
          "bc1pfku4w9trutsz6eyqw4h3xm5k4xdw4e2xt2lr3nm7esa86kttmgzsxswqke",
        ticker: "pepe",
        max_supply: "42069000.000000000000000000",
        mint_limit: "1000.000000000000000000",
        decimals: 18,
        deploy_timestamp: 1678338023000,
        minted_supply: "42069000.000000000000000000",
      },
      supply: {
        max_supply: "42069000.000000000000000000",
        minted_supply: "42069000.000000000000000000",
        holders: 4431,
      },
    },
  ] as const;
  const data = {
    results: EARLIEST_TOKENS.map((r) => r.token),
  } as ListResponse<Brc20TokenResponse>;
  return (
    <TooltipProvider delayDuration={150}>
      <Table data={data} isLoading={false} />
    </TooltipProvider>
  );
};

const Table = ({
  data,
  isLoading,
}: {
  data: ListResponse<Brc20TokenResponse>;
  isLoading: boolean;
}) => (
  <div className="w-full overflow-scroll">
    <table className={cn("w-full min-w-[640px]", isLoading && "opacity-50")}>
      <thead>
        <tr className="border-b border-neutral-0 text-sm text-neutral-300">
          <th className="w-1/4 px-4 py-2 text-start font-normal">token</th>
          <th className="w-1/4 px-4 py-2 text-start font-normal">% minted</th>
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
);

const Brc20TokenRow = ({ token }: { token: Brc20TokenResponse }) => {
  const progress = Math.round(
    (Number(token.minted_supply) / Number(token.max_supply)) * 100
  );
  const deployedTime = new Date(token.deploy_timestamp);
  const remainingSupply =
    Number(token.max_supply) - Number(token.minted_supply);

  const thumbnail: string | undefined = TOKEN_THUMBNAIL_MAP[token.ticker];

  return (
    <tr className="group border-b border-neutral-0 bg-white font-['Aeonik_Mono'] text-sm text-neutral-500 transition-colors hover:bg-[#F6F5F3] hover:text-black">
      <td className="px-3 py-2.5 text-black">
        <Link
          className="flex items-center"
          href={`/protocols/brc-20/${token.ticker}`}
        >
          <div className="flex h-12 w-12 flex-col items-center justify-center overflow-hidden rounded-full bg-neutral-50 text-neutral-200">
            {thumbnail ? (
              <img src={thumbnail} alt={`${token.ticker} thumbnail`} />
            ) : (
              <>
                <div className="leading-none">BRC</div>
                <div className="text-lg leading-none">20</div>
              </>
            )}
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
          <TruncatingTooltip num={token.minted_supply} />
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

export default Brc20TokensTable;
