"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useUpdate } from "react-use";
import useSWR from "swr";

import { useHasMounted } from "../lib/hooks";
import { Brc20TokenResponse, ListResponse } from "../lib/types";
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

// SEARCH PARAMS MAP
// s: sort
// o: order
// p: page
// t: ticker (search)

// todo: move to global first file

const Brc20Homepage = () => {
  const hasMounted = useHasMounted();
  const update = useUpdate();
  const pathname = usePathname();

  const [ticker, setTicker] = useState<string | null>(null);

  const [rowsPerPage, setRowsPerPage] = useState("20");
  const limit = parseInt(rowsPerPage);

  const url = new URL(window.location.href);
  const searchParams = new URLSearchParams(url.search); // useSearchParams() doesn't work here when manually useUpdating

  // basic parameters
  const sort = searchParams.get("s") ?? "genesis_block_height"; // genesis_block_height, rarity
  const order = searchParams.get("o") ?? "desc"; // asc, desc
  const sortKey = `${sort}-${order}` as keyof typeof inscriptionSortOptions;
  const page = parseInt(searchParams.get("p") ?? "0");

  const offset = page * limit;

  function updateSort(value: string) {
    const [s, o] = value.split("-");
    searchParams.set("s", s);
    searchParams.set("o", o);
    window.history.pushState({}, "", `${pathname}?${searchParams.toString()}`);
    update(); // force re-render
  }

  function updateParam(key: string, value: string | null) {
    searchParams.delete(key);
    if (value) searchParams.set(key, value);
    window.history.pushState({}, "", `${pathname}?${searchParams.toString()}`);
    update(); // force re-render
  }

  function updatePage(offset: number) {
    searchParams.set("p", `${page + offset}`);
    window.history.pushState({}, "", `${pathname}?${searchParams.toString()}`);
    update(); // force re-render
  }

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
    `https://api.dev.hiro.so/ordinals/brc-20/tokens?${params.toString()}`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  // EXAMPLE DATA
  const data = {
    limit: 20,
    offset: 0,
    total: 13291,
    results: [
      {
        id: "b61b0172d95e266c18aea0c624db987e971a5d6d4ebc2aaed85da4642d635735i0",
        number: 348020,
        block_height: 779832,
        tx_id:
          "b61b0172d95e266c18aea0c624db987e971a5d6d4ebc2aaed85da4642d635735",
        address:
          "bc1pxaneaf3w4d27hl2y93fuft2xk6m4u3wc4rafevc6slgd7f5tq2dqyfgy06",
        ticker: "ordi",
        max_supply: "21000000",
        minted_supply: "10000000",
        deploy_timestamp: 1682670526000,
        mint_limit: "1000",
        decimals: 18,
      },
      {
        id: "307ffac5d20fc188f723706f85d75c926550d536f5fd1113839586f38542971ci0",
        number: 352242,
        block_height: 779887,
        tx_id:
          "307ffac5d20fc188f723706f85d75c926550d536f5fd1113839586f38542971c",
        address:
          "bc1pxwx69grfcccaphd6xa0fmrz3pqthftatmzvwa807r450j7n29mpqsmd28p",
        ticker: "meme",
        max_supply: "99999",
        minted_supply: "10000000",
        deploy_timestamp: 1682670526000,
        mint_limit: "1",
        decimals: 18,
      },
      {
        id: "2782fcc4173baddd337b6adaaca11535daa821ab6c234d8eee22257260ea7d07i0",
        number: 356204,
        block_height: 779964,
        tx_id:
          "2782fcc4173baddd337b6adaaca11535daa821ab6c234d8eee22257260ea7d07",
        address:
          "bc1p7pceefkw20p0uch3mk2x5rx8ylag4gpky7vl6390wgdtwpc8rqcqtk3paa",
        ticker: "punk",
        max_supply: "10000",
        minted_supply: "10000000",
        deploy_timestamp: 1682670526000,
        mint_limit: "1",
        decimals: 18,
      },
      {
        id: "54d5fe82f5d284363fec6ae6137d0e5263e237caf15211078252c0d95af8943ai0",
        number: 356777,
        block_height: 779969,
        tx_id:
          "54d5fe82f5d284363fec6ae6137d0e5263e237caf15211078252c0d95af8943a",
        address:
          "bc1pfku4w9trutsz6eyqw4h3xm5k4xdw4e2xt2lr3nm7esa86kttmgzsxswqke",
        ticker: "pepe",
        max_supply: "42069000",
        minted_supply: "10000000",
        deploy_timestamp: 1682670526000,
        mint_limit: "1000",
        decimals: 18,
      },
      {
        id: "7845e5c3c81fa10ab153db26bd6a5928e86ccf326cf7e7d931f430282d4d0970i0",
        number: 356831,
        block_height: 779970,
        tx_id:
          "7845e5c3c81fa10ab153db26bd6a5928e86ccf326cf7e7d931f430282d4d0970",
        address:
          "bc1p2xmduzppdyw05xj9zk2v0fqwwhga84kvnzg3fue27646rmqlverqd9lxf6",
        ticker: "BRUH",
        max_supply: "1000000000",
        minted_supply: "10000000",
        deploy_timestamp: 1682670526000,
        mint_limit: "100000",
        decimals: 18,
      },
      {
        id: "afd28d245def0a2e6be86852e8aa327214d0c94a04f5539b268e43e67d1a33f1i0",
        number: 357023,
        block_height: 779970,
        tx_id:
          "afd28d245def0a2e6be86852e8aa327214d0c94a04f5539b268e43e67d1a33f1",
        address:
          "bc1pr04rlk3u7hpkg86cry7sqrapxh3tgxvvq0y604djdrp6q7rayg6srw2fmp",
        ticker: "gold",
        max_supply: "24000",
        minted_supply: "10000000",
        deploy_timestamp: 1682670526000,
        mint_limit: "1",
        decimals: 18,
      },
      {
        id: "86a2613d62a319408f1d110bdff70612b961293c47e7cfc9833281ea8c14532ai0",
        number: 357051,
        block_height: 779971,
        tx_id:
          "86a2613d62a319408f1d110bdff70612b961293c47e7cfc9833281ea8c14532a",
        address:
          "bc1p2xmduzppdyw05xj9zk2v0fqwwhga84kvnzg3fue27646rmqlverqd9lxf6",
        ticker: "APE",
        max_supply: "10000",
        minted_supply: "10000000",
        deploy_timestamp: 1682670526000,
        mint_limit: "1",
        decimals: 18,
      },
      {
        id: "bd0d31746fd7551adedcbdc97b03f6927a1798bf8d9dad9fec0b6b140ef43d99i0",
        number: 357053,
        block_height: 779971,
        tx_id:
          "bd0d31746fd7551adedcbdc97b03f6927a1798bf8d9dad9fec0b6b140ef43d99",
        address:
          "bc1ptpr32s7vwa8cxlavlp85etn8hncm2tztqsmacqq3mcyg8fgjydzsm29yfd",
        ticker: "BAYC",
        max_supply: "10000",
        minted_supply: "10000000",
        deploy_timestamp: 1682670526000,
        mint_limit: "1",
        decimals: 18,
      },
      {
        id: "d1f83be6de1a87a1754c6a1ff3e8ccd6c30cf671a16de74e23a6df10d06e5ffci0",
        number: 357087,
        block_height: 779971,
        tx_id:
          "d1f83be6de1a87a1754c6a1ff3e8ccd6c30cf671a16de74e23a6df10d06e5ffc",
        address:
          "bc1p75za8cfrhwx5vsaeygpv8k8lw93zyr7zqvlm7s8h8rstnrj7wlzq2j4wnz",
        ticker: "<10K",
        max_supply: "9999",
        minted_supply: "10000000",
        deploy_timestamp: 1682670526000,
        mint_limit: "1",
        decimals: 18,
      },
      {
        id: "9b664bdd6f5ed80d8d88957b63364c41f3ad4efb8eee11366aa16435974d9333i0",
        number: 357097,
        block_height: 779971,
        tx_id:
          "9b664bdd6f5ed80d8d88957b63364c41f3ad4efb8eee11366aa16435974d9333",
        address:
          "bc1prtawdt82wfgrujx6d0heu0smxt4yykq440t447wan88csf3mc7csm3ulcn",
        ticker: "sats",
        max_supply: "2100000000000000",
        minted_supply: "10000000",
        deploy_timestamp: 1682670526000,
        mint_limit: "100000000",
        decimals: 18,
      },
      {
        id: "89b7cb6aa57d439b9541b169a95096db30c726b7beee9ef8af34edc942795e6ei0",
        number: 357274,
        block_height: 779972,
        tx_id:
          "89b7cb6aa57d439b9541b169a95096db30c726b7beee9ef8af34edc942795e6e",
        address:
          "bc1pf7ers4m5xh48qu03flpf5szku53crxkv4ynckna4pqfczzjcel8svred2t",
        ticker: "sato",
        max_supply: "13370000",
        minted_supply: "10000000",
        deploy_timestamp: 1682670526000,
        mint_limit: "1337",
        decimals: 18,
      },
      {
        id: "d1c47ad2edf07857e24ca96b38c65e95c58ef13a37d0918a26069c4f0fb1b7afi0",
        number: 358611,
        block_height: 779976,
        tx_id:
          "d1c47ad2edf07857e24ca96b38c65e95c58ef13a37d0918a26069c4f0fb1b7af",
        address:
          "bc1p3efs6kjehmcqwarn0nrwk9qufalyxzh3z09hffx3esqe49nvms7sv4qwuh",
        ticker: "fake",
        max_supply: "21000000",
        minted_supply: "10000000",
        deploy_timestamp: 1682670526000,
        mint_limit: "1000",
        decimals: 18,
      },
      {
        id: "540325361cf8bea427f72e30f2edee31373d6398cf8473ee332f0cbacf504b20i0",
        number: 358612,
        block_height: 779976,
        tx_id:
          "540325361cf8bea427f72e30f2edee31373d6398cf8473ee332f0cbacf504b20",
        address:
          "bc1p3efs6kjehmcqwarn0nrwk9qufalyxzh3z09hffx3esqe49nvms7sv4qwuh",
        ticker: "rare",
        max_supply: "21000000",
        minted_supply: "10000000",
        deploy_timestamp: 1682670526000,
        mint_limit: "1000",
        decimals: 18,
      },
      {
        id: "747a1670bc807a98e6a302760eb66495dcf888f78e22f3873bae4789a05dd3e6i0",
        number: 359045,
        block_height: 779977,
        tx_id:
          "747a1670bc807a98e6a302760eb66495dcf888f78e22f3873bae4789a05dd3e6",
        address:
          "bc1pgvqgle8alv7jgj7am23ls7ct4jdw78yklphw2p4ynqjst8qcmdtsjh4az0",
        ticker: "ROD",
        max_supply: "69000000000",
        minted_supply: "10000000",
        deploy_timestamp: 1682670526000,
        mint_limit: "42000000",
        decimals: 18,
      },
      {
        id: "25a4540bd99611dc9aaec2951394ccb7453d52b09c2fa37b90df74621d2f236ci0",
        number: 359046,
        block_height: 779977,
        tx_id:
          "25a4540bd99611dc9aaec2951394ccb7453d52b09c2fa37b90df74621d2f236c",
        address:
          "bc1prce72sf3j4h8jakkd4hw8laxrg6qn7usff98kdwlwepznqx7ufhsmd9yut",
        ticker: "x",
        max_supply: "21000000",
        minted_supply: "10000000",
        deploy_timestamp: 1682670526000,
        mint_limit: "1000",
        decimals: 18,
      },
      {
        id: "4911fa027c8f0e0259b877dc0069499da9b394910643dcee5e49f1fd8ebe333bi0",
        number: 359085,
        block_height: 779978,
        tx_id:
          "4911fa027c8f0e0259b877dc0069499da9b394910643dcee5e49f1fd8ebe333b",
        address:
          "bc1pya7jmmnz57x9vwtk2kj4c6azec52r0l5z09l4lhzq6yzf0uu9n4q9ds8aq",
        ticker: "bits",
        max_supply: "21000000",
        minted_supply: "10000000",
        deploy_timestamp: 1682670526000,
        mint_limit: "1000",
        decimals: 18,
      },
      {
        id: "c7ee58a761f23d68b4a35c16f25e96fe9317a63d8a951eff9773099ba08cb6adi0",
        number: 359088,
        block_height: 779978,
        tx_id:
          "c7ee58a761f23d68b4a35c16f25e96fe9317a63d8a951eff9773099ba08cb6ad",
        address:
          "bc1p0lclulmsuas4xgfkhq8gcdc9gq528ct6yshn38pcdu6cpzwds3eqkx7l97",
        ticker: "doge",
        max_supply: "1000000000000",
        minted_supply: "10000000",
        deploy_timestamp: 1682670526000,
        mint_limit: "4200",
        decimals: 18,
      },
      {
        id: "68c2a47b6c687039da5178c89af0038907d97691dcc7cfdbdb93592444671721i0",
        number: 359098,
        block_height: 779979,
        tx_id:
          "68c2a47b6c687039da5178c89af0038907d97691dcc7cfdbdb93592444671721",
        address:
          "bc1p0lclulmsuas4xgfkhq8gcdc9gq528ct6yshn38pcdu6cpzwds3eqkx7l97",
        ticker: "HAMS",
        max_supply: "1000000000000",
        minted_supply: "10000000",
        deploy_timestamp: 1682670526000,
        mint_limit: "4200",
        decimals: 18,
      },
      {
        id: "2059ef7438edec1a8da0845e2aedce946aeff9d4255b3b2df8043115030afb75i0",
        number: 359149,
        block_height: 779981,
        tx_id:
          "2059ef7438edec1a8da0845e2aedce946aeff9d4255b3b2df8043115030afb75",
        address:
          "bc1pwl706l2krc4t2ajwrxduvr9u7h2z80058p3qcuj9u9qgtrm6lmhsy82arj",
        ticker: "dick",
        max_supply: "69696969",
        minted_supply: "10000000",
        deploy_timestamp: 1682670526000,
        mint_limit: "10000",
        decimals: 18,
      },
      {
        id: "5e0e9e85129821ada1e605454c7dce852f5f3a51e9f4c669f6c979c48af96ed5i0",
        number: 359151,
        block_height: 779981,
        tx_id:
          "5e0e9e85129821ada1e605454c7dce852f5f3a51e9f4c669f6c979c48af96ed5",
        address:
          "bc1pwl706l2krc4t2ajwrxduvr9u7h2z80058p3qcuj9u9qgtrm6lmhsy82arj",
        ticker: "btc",
        max_supply: "21000000",
        minted_supply: "10000000",
        deploy_timestamp: 1682670526000,
        mint_limit: "1000",
        decimals: 18,
      },
    ],
  };

  if (!hasMounted) return null; // todo: fix this?

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

const Brc20TokenRow = ({ token }: { token: Brc20TokenResponse }) => {
  const progress = Math.round(
    (Number(token.minted_supply) / Number(token.max_supply)) * 100
  );
  const deployedTime = new Date(token.deploy_timestamp);
  const remainingSupply =
    Number(token.max_supply) - Number(token.minted_supply);

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

export default Brc20Homepage;
