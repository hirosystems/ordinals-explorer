"use client";

import useSWR from "swr";
import { Brc20TokenDetailsResponse } from "../lib/types";
import { fetcher, formatDate, humanReadableCount } from "../lib/utils";
import Loading from "./Loading";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./Tooltip";
import Brc20HoldersTable from "./Brc20HoldersTable";
import Error from "./Error";

const BrcDetails = (params: { ticker: string }) => {
  const { data, error, isLoading } = useSWR<Brc20TokenDetailsResponse>(
    `https://api.beta.hiro.so/ordinals/brc-20/tokens/${params.ticker}`,
    fetcher
  );

  if (error || (data && !data.token)) return <Error error={error ?? data} />;
  if (!params.ticker) return <div>404</div>;
  if (!data) return <Loading />;

  const progress = Math.round(
    (Number(data.token.minted_supply) / Number(data.token.max_supply)) * 100
  );

  return (
    <TooltipProvider delayDuration={150}>
      <div className="flex flex-col items-stretch justify-between px-4 py-12">
        <div className="flex flex-col rounded-lg border border-neutral-0 p-7 sm:flex-row sm:space-x-9">
          <div className="flex basis-2/5 flex-col items-center space-y-6 sm:items-start">
            <div className="flex items-end space-x-3 ">
              <h1 className=" text-5xl leading-[75%]">{params.ticker}</h1>
              <div className="b-3 rounded-md border-2 border-sky-400 bg-sky-100 px-1 text-base leading-tight text-sky-600">
                BRC-20
              </div>
            </div>
            <div className="flex w-full max-w-[320px] flex-col pb-10 pt-4 text-sm sm:self-auto sm:p-0">
              {/* todo: componetize progress, with classname for width */}
              <span className="text-neutral-400">{progress}% Minted</span>
              <div className="flex justify-center">
                <progress max="100" value={progress} className="sr-only" />
                <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-neutral-0">
                  <div
                    className="absolute h-1.5 bg-mint"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
              <div className="self-end text-neutral-400">
                {progress < 100 && (
                  <>
                    <Tooltip>
                      <TooltipTrigger>
                        {humanReadableCount(
                          Number(data.token.minted_supply),
                          1
                        )}
                      </TooltipTrigger>
                      <TooltipContent variant="light">
                        {data.token.minted_supply}
                      </TooltipContent>
                    </Tooltip>
                    /
                  </>
                )}
                <Tooltip>
                  <TooltipTrigger>
                    <span className="text-neutral-300">
                      {humanReadableCount(Number(data.token.max_supply), 1)}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent variant="light">
                    {data.token.max_supply}
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-4 text-sm">
            <div className="space-y-6">
              <div className="flex flex-col">
                <div className="text-neutral-300">deployment date</div>
                <time
                  dateTime={new Date(data.token.deploy_timestamp).toISOString()}
                >
                  {formatDate(data.token.deploy_timestamp)}
                </time>
              </div>
              <div className="flex flex-col">
                <div className="text-neutral-300">limit per mint</div>
                <div>
                  {data.token.mint_limit ? (
                    data.token.mint_limit
                  ) : (
                    <span className="text-neutral-200">N/A</span>
                  )}
                </div>
              </div>
              {/* todo: add holders count & add tx count */}
              {/* <div className="flex flex-col">
                <div className="text-neutral-300">deployment date</div>
                <div>{data.token.deploy_timestamp}</div>
              </div> */}
            </div>
            <div className="space-y-6">
              <div className="flex flex-col">
                <div className="text-neutral-300">max supply</div>
                <div>{data.token.max_supply}</div>
              </div>
              <div className="flex flex-col">
                <div className="text-neutral-300">minted supply</div>
                {/* todo: reenable */}
                {/* <div>{data.token.minted_supply}</div> */}
                <div>{data.supply.minted_supply}</div>
              </div>
              {/* todo: add holders */}
              {/* <div className="flex flex-col">
                <div className="text-neutral-300">deployment date</div>
                <div>{data.token.deploy_timestamp}</div>
              </div> */}
            </div>
          </div>
        </div>
        <div className="mt-6" />
        <Brc20HoldersTable ticker={params.ticker} />
      </div>
    </TooltipProvider>
  );
};

export default BrcDetails;
