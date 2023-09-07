"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";

import { Brc20BalanceResponse, ListResponse } from "../lib/types";
import { cn, fetcher, truncateAmount } from "../lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./Select";
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";
import { API_BETA_URL } from "../lib/constants";

const Brc20BalancesTable = ({ address }: { address: string }) => {
  const [page, setPage] = useState(0);
  function updatePage(delta: number) {
    setPage((prev) => prev + delta);
  }

  const [rowsPerPage, setRowsPerPage] = useState("10");
  const limit = parseInt(rowsPerPage);
  const offset = page * limit;

  const params = new URLSearchParams({
    limit: rowsPerPage,
    offset: offset.toString(),
  });
  const { data, error, isLoading } = useSWR<ListResponse<Brc20BalanceResponse>>(
    `${API_BETA_URL}/brc-20/balances/${address}?${params.toString()}`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  if (!data || !data.results.length) return null;
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

  const isLastPage = (page + 1) * limit >= data.total;
  const isOnlyPage = page === 0 && isLastPage;

  return (
    <div className="flex flex-col">
      <div className="space-x-3 pb-1">
        <h2 className="inline text-2xl">BRC-20 Balances</h2>
        <span className="text-neutral-300">({data.total})</span>
      </div>

      <div className="w-full overflow-scroll">
        <table
          className={cn("w-full min-w-[240px]", isLoading && "opacity-50")}
        >
          <thead>
            <tr className="border-b border-neutral-0 text-sm text-neutral-300">
              <th className="px-2 py-2 text-start font-normal">address</th>
              <th className="px-2 py-2 text-end font-normal">balance</th>
            </tr>
          </thead>
          <tbody>
            {data.results.map((i, index) => (
              <Brc20BalanceRow
                key={i?.ticker ?? index}
                ticker={i.ticker}
                balance={i.overall_balance}
                transferrable={i.transferrable_balance}
                available={i.available_balance}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-row-reverse py-0.5 pl-3 pr-2 text-sm">
        <div className="flex items-center space-x-6">
          {/* Page size selector */}
          <Select value={rowsPerPage} onValueChange={setRowsPerPage}>
            <SelectTrigger
              className={cn("hidden sm:flex", isOnlyPage && "text-neutral-200")}
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
  );
};

const Brc20BalanceRow = ({
  ticker,
  balance,
  transferrable,
  available,
}: {
  ticker: string;
  balance: string;
  transferrable: string;
  available: string;
}) => {
  const truncatedBalance = truncateAmount(balance, 2);

  return (
    <tr className="border-b border-neutral-0 font-['Aeonik_Mono'] text-sm text-neutral-500 hover:bg-neutral-0">
      <td className="px-2 py-2">
        <Link href={`/protocols/brc-20/${ticker}`}>{ticker}</Link>
      </td>
      <td className="px-2 py-2 text-end">
        <Tooltip>
          <TooltipTrigger>
            {truncatedBalance}
            {balance === truncatedBalance || <>&hellip;</>}
          </TooltipTrigger>
          <TooltipContent variant="light">{balance}</TooltipContent>
        </Tooltip>
      </td>
    </tr>
  );
};

export default Brc20BalancesTable;
