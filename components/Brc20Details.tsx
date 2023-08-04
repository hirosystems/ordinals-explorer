"use client";

import useSWR from "swr";
import { fetcher, formatDateTime } from "../lib/utils";
import { TimeAgo } from "./TimeAgo";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./Tooltip";

const EXAMPLE_DATA = {
  data: {
    ticker: "oxbt",
    image_url: null,
    limit_per_mint: 200000000,
    max_supply: 200000000,
    minted_supply: 200000000,
    mint_progress: 100,
    holder_count: 16816,
    tx_count: 99960,
    deploy_ts: "2023-05-11T05:15:31.000Z",
  },
  block_height: 800372,
} as const;

const BrcDetails = (params: { ticker: string }) => {
  const { data, error, isLoading } = useSWR<any>(
    `https://api.bestinslot.xyz/v3/brc20/ticker_info?ticker=${params.ticker}`,
    fetcher
  );

  // if (error) return <span>Something went wrong ʕ•̠͡•ʔ</span>;
  // if (!params.ticker) return <div>404</div>;
  // if (!data) return <Loading />;

  // todo: add pagination to allow viewing all inscriptions? or link to explore page
  const deploymentDate = Date.parse(EXAMPLE_DATA.data.deploy_ts);

  return (
    <div className="flex flex-col items-center justify-between rounded-lg border px-4 py-12">
      <h1 className="flex items-center justify-center space-x-3 text-3xl">
        {/* todo: uppercase ticker? */}
        <span className="underline">{params.ticker}</span>
        <span className="rounded-md border-2 border-neutral-100 bg-neutral-0 px-1 text-xl text-neutral-300">
          BRC20
        </span>
      </h1>

      <div className="mt-6" />

      <table className="border-collapse text-sm">
        <tbody>
          <tr className="border-b py-8">
            <td className="whitespace-nowrap px-2 py-3 pr-20 uppercase">
              Deployment Date
            </td>
            <td className="break-all px-2 py-2 text-right">
              <TooltipProvider delayDuration={150}>
                <Tooltip>
                  <TooltipTrigger>
                    <TimeAgo
                      className="tracking-tight"
                      date={deploymentDate}
                      tooltip={false}
                    />
                  </TooltipTrigger>
                  <TooltipContent variant="light">
                    {formatDateTime(deploymentDate)}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </td>
          </tr>

          <tr className="border-b py-8">
            <td className="whitespace-nowrap px-2 py-3 pr-20 uppercase">
              Mint Progress
            </td>
            <td className="break-all px-2 py-2 text-right">
              {EXAMPLE_DATA.data.mint_progress}%
            </td>
          </tr>

          <tr className="border-b py-8">
            <td className="whitespace-nowrap pl-8 pr-20 uppercase text-neutral-500 underline md:py-1 md:no-underline">
              {/* todo: move prefixed dash into a css :before rule for more semantic html tables */}
              - Max Supply
            </td>
            <td className="break-all px-2 py-2 text-right text-neutral-500">
              {EXAMPLE_DATA.data.max_supply}
            </td>
          </tr>

          <tr className="border-b py-8">
            <td className="whitespace-nowrap pl-8 pr-20 uppercase text-neutral-500 underline md:py-1 md:no-underline">
              - Minted Supply
            </td>
            <td className="break-all px-2 py-2 text-right text-neutral-500">
              {EXAMPLE_DATA.data.minted_supply}
            </td>
          </tr>

          <tr className="border-b py-8">
            <td className="whitespace-nowrap pl-8 pr-20 uppercase text-neutral-500 underline md:py-1 md:no-underline">
              - Limit Per Mint
            </td>
            <td className="break-all px-2 py-2 text-right text-neutral-500">
              {EXAMPLE_DATA.data.limit_per_mint}
            </td>
          </tr>

          <tr className="border-b py-8">
            <td className="whitespace-nowrap px-2 py-3 pr-20 uppercase">
              Holder Count
            </td>
            <td className="break-all px-2 py-2 text-right">
              {EXAMPLE_DATA.data.holder_count}
            </td>
          </tr>

          <tr className="border-b py-8">
            <td className="whitespace-nowrap px-2 py-3 pr-20 uppercase">
              Transaction Count
            </td>
            <td className="break-all px-2 py-2 text-right">
              {EXAMPLE_DATA.data.tx_count}
            </td>
          </tr>
        </tbody>
        {/* todo: add period? not in api, needs sat coinbase height, or calculate it */}
      </table>
    </div>
  );
};

export default BrcDetails;
