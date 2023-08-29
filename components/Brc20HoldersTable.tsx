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

const data = {
  results: [
    {
      address: "bc1pvwh2dl6h388x65rqq47qjzdmsqgkatpt4hye6daf7yxvl0z3xjgq247aq8",
      overall_balance: "2000.00000",
    },
    {
      address: "bc1pvwh2dl6h388x65rqq47qjzdmsqgkatpt4hye6daf7yxvl0z3xjgq247aq8",
      overall_balance: "2000.00000",
    },
    {
      address: "bc1pvwh2dl6h388x65rqq47qjzdmsqgkatpt4hye6daf7yxvl0z3xjgq247aq8",
      overall_balance: "2000.00000",
    },
    {
      address: "bc1pvwh2dl6h388x65rqq47qjzdmsqgkatpt4hye6daf7yxvl0z3xjgq247aq8",
      overall_balance: "2000.00000",
    },
    {
      address: "bc1pvwh2dl6h388x65rqq47qjzdmsqgkatpt4hye6daf7yxvl0z3xjgq247aq8",
      overall_balance: "2000.00000",
    },
  ],
};

const Brc20HoldersTable = ({ ticker }: { ticker: string }) => {
  const [page, setPage] = useState(0);
  function updatePage(delta: number) {
    setPage((prev) => prev + delta);
  }

  const [rowsPerPage, setRowsPerPage] = useState("20");
  const limit = parseInt(rowsPerPage);
  const offset = page * limit;

  const params = new URLSearchParams({
    // sort_by: "tx_count",
    // order: "desc",
    count: rowsPerPage,
    offset: offset.toString(),
  });

  const {
    data: unused,
    error,
    isLoading,
  } = useSWR<ListResponse<Brc20TokenResponse>>(
    `https://api.dev.hiro.so/ordinals/brc-20/tokens/${ticker}/holders?${params.toString()}`,
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
    <div className="flex flex-col rounded-lg border border-neutral-0">
      <div className="p-4 pb-1">
        <h2 className="text-2xl">Holders</h2>
      </div>

      <div className="w-full overflow-scroll">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-neutral-0 text-sm text-neutral-300">
              <th className="px-4 py-2 text-start font-normal">address</th>
              <th className="px-4 py-2 text-start font-normal">balance</th>
            </tr>
          </thead>
          <tbody>
            {data.results.map((i, index) => (
              <Brc20HolderRow
                key={i?.address ?? index}
                address={i.address}
                balance={i.overall_balance}
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
  );
};

const Brc20HolderRow = ({
  address,
  balance,
}: {
  address: string;
  balance: string;
}) => {
  return (
    <tr className="border-b border-neutral-0 font-['Aeonik_Mono'] text-sm text-neutral-500">
      <td className="px-4 py-2">{address}</td>
      <td className="px-4 py-2">{balance}</td>
    </tr>
  );
};

export default Brc20HoldersTable;
