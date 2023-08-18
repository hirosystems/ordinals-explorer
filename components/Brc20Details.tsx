"use client";

import useSWR from "swr";
import {
  fetcher,
  formatDate,
  formatDateTime,
  humanReadableCount,
} from "../lib/utils";
import { TimeAgo } from "./TimeAgo";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./Tooltip";

const EXAMPLE_DATA = {
  token: {
    id: "38c46a8bf7ec90bc7f6b797e7dc84baa97f4e5fd4286b92fe1b50176d03b18dci0",
    number: 5,
    block_height: 775617,
    tx_id: "1095cf209e372bcd7a9205ccbe0a6036faf56a3efacf50a97cdf35b02ba2c739",
    address: "bc1p3cyx5e2hgh53w7kpxcvm8s4kkega9gv5wfw7c4qxsvxl0u8x834qf0u2td",
    ticker: "PEPE",
    max_supply: "21000000",
    mint_limit: null,
    decimals: 18,
    deploy_timestamp: 1677803510000,
    minted_supply: "0",
  },
  supply: { max_supply: "21000000", minted_supply: "0", holders: 0 },
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

  const progress = Math.round(
    (Number(EXAMPLE_DATA.token.minted_supply) /
      Number(EXAMPLE_DATA.token.max_supply)) *
      100
  );

  const deploymentDate = new Date(EXAMPLE_DATA.token.deploy_timestamp);

  return (
    <TooltipProvider delayDuration={150}>
      <div className="flex flex-col items-stretch justify-between px-4 py-12">
        <div className="flex flex-col rounded-lg border border-neutral-0 p-7 sm:flex-row sm:space-x-9">
          <div className="flex basis-2/5 flex-col items-center space-y-6 sm:items-start">
            <div className="flex items-end space-x-3 ">
              <h1 className=" text-5xl uppercase leading-[75%]">
                {params.ticker}
              </h1>
              <div className="b-3 rounded-md border-2 border-sky-400 bg-sky-100 px-1 text-base leading-tight text-sky-600">
                BRC-20
              </div>
            </div>
            <div className="flex w-full max-w-[320px] flex-col pb-10 pt-4 text-sm sm:self-auto sm:p-0">
              <span className="text-neutral-400">{progress}% Minted</span>
              <div className="flex justify-center">
                <progress max="100" value={progress} className="sr-only" />
                {/* todo: componetize progress, with classname for width */}
                <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-neutral-0">
                  <div
                    className="absolute h-1.5 bg-mint"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <div className="self-end text-neutral-400">
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
                      {humanReadableCount(
                        Number(EXAMPLE_DATA.token.max_supply),
                        1
                      )}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent variant="light">
                    {EXAMPLE_DATA.token.max_supply}
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-4 text-sm">
            <div className="space-y-6">
              <div className="flex flex-col">
                <div className="text-neutral-300">deployment date</div>
                {/* todo: add tooltip */}
                <time
                  dateTime={new Date(
                    EXAMPLE_DATA.token.deploy_timestamp
                  ).toISOString()}
                >
                  {formatDate(EXAMPLE_DATA.token.deploy_timestamp)}
                </time>
              </div>
              <div className="flex flex-col">
                <div className="text-neutral-300">limit per mint</div>
                <div>
                  {EXAMPLE_DATA.token.mint_limit ? (
                    EXAMPLE_DATA.token.mint_limit
                  ) : (
                    <span className="text-neutral-200">N/A</span>
                  )}
                </div>
              </div>
              {/* todo: add holders */}
              {/* <div className="flex flex-col">
                <div className="text-neutral-300">deployment date</div>
                <div>{EXAMPLE_DATA.token.deploy_timestamp}</div>
              </div> */}
            </div>
            <div className="space-y-6">
              <div className="flex flex-col">
                <div className="text-neutral-300">max supply</div>
                <div>{EXAMPLE_DATA.token.max_supply}</div>
              </div>
              <div className="flex flex-col">
                <div className="text-neutral-300">minted supply</div>
                <div>{EXAMPLE_DATA.token.minted_supply}</div>
              </div>
              {/* todo: add holders */}
              {/* <div className="flex flex-col">
                <div className="text-neutral-300">deployment date</div>
                <div>{EXAMPLE_DATA.token.deploy_timestamp}</div>
              </div> */}
            </div>
          </div>
        </div>
        <div className="mt-6" />
        <div className="flex space-x-9 rounded-lg border border-neutral-0 p-7">
          <div className="todo-mb-3 space-y-2">
            <h2 className="text-2xl">Holders</h2>
            <p className="italic text-neutral-300">coming soon...</p>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default BrcDetails;
