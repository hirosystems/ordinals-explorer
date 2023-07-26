"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import { SearchIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import ReactTimeAgo from "react-time-ago";
import { useUpdate } from "react-use";
import useSWR from "swr";
import Footer from "../../../../components/Footer";
import Header from "../../../../components/Header";
import { inscriptionSortOptions } from "../../../../components/Sort";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../../components/Tooltip";
import { useHasMounted } from "../../../../lib/hooks";
import { cn, fetcher, formatDateTime } from "../../../../lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/Select";

// SEARCH PARAMS MAP
// s: sort
// o: order
// p: page
// t: ticker (search)

// todo: move to global first file
TimeAgo.addDefaultLocale(en);

const EXAMPLE_DATA = [
  {
    ticker: "oxbt",
    image_url: null,
    limit_per_mint: 200000000,
    max_supply: 200000000,
    minted_supply: 200000000,
    remaining_supply: 0,
    mint_progress: 100,
    holder_count: 17000,
    tx_count: 99064,
    deploy_ts: "2023-05-11T05:15:31.000Z",
  },
  {
    ticker: "ordi",
    image_url: "https://bis-brc20.fra1.digitaloceanspaces.com/icons/ordi.png",
    limit_per_mint: 1000,
    max_supply: 21000000,
    minted_supply: 21000000,
    remaining_supply: 0,
    mint_progress: 100,
    holder_count: 12667,
    tx_count: 62506,
    deploy_ts: "2023-03-08T04:16:31.000Z",
  },
  {
    ticker: "mxrc",
    image_url: null,
    limit_per_mint: 100000000,
    max_supply: 100000000,
    minted_supply: 100000000,
    remaining_supply: 0,
    mint_progress: 100,
    holder_count: 9157,
    tx_count: 39143,
    deploy_ts: "2023-05-26T02:06:43.000Z",
  },
  {
    ticker: "btoc",
    image_url: null,
    limit_per_mint: 21000000,
    max_supply: 21000000,
    minted_supply: 21000000,
    remaining_supply: 0,
    mint_progress: 100,
    holder_count: 16179,
    tx_count: 35267,
    deploy_ts: "2023-05-22T13:42:58.000Z",
  },
  {
    ticker: "zbit",
    image_url: null,
    limit_per_mint: 21000000,
    max_supply: 21000000,
    minted_supply: 21000000,
    remaining_supply: 0,
    mint_progress: 100,
    holder_count: 8457,
    tx_count: 35001,
    deploy_ts: "2023-05-07T15:32:12.000Z",
  },
  {
    ticker: "vmpx",
    image_url: "https://bis-brc20.fra1.digitaloceanspaces.com/icons/vmpx.jpg",
    limit_per_mint: 420,
    max_supply: 108624000,
    minted_supply: 108624000,
    remaining_supply: 0,
    mint_progress: 100,
    holder_count: 8260,
    tx_count: 27895,
    deploy_ts: "2023-05-07T19:05:28.000Z",
  },
  {
    ticker: "lger",
    image_url: "https://bis-brc20.fra1.digitaloceanspaces.com/icons/lger.png",
    limit_per_mint: 21000000,
    max_supply: 21000000,
    minted_supply: 21000000,
    remaining_supply: 0,
    mint_progress: 100,
    holder_count: 3145,
    tx_count: 13813,
    deploy_ts: "2023-06-05T07:39:43.000Z",
  },
  {
    ticker: "nals",
    image_url: null,
    limit_per_mint: 1000,
    max_supply: 21000000,
    minted_supply: 21000000,
    remaining_supply: 0,
    mint_progress: 100,
    holder_count: 2233,
    tx_count: 12822,
    deploy_ts: "2023-03-09T18:03:55.000Z",
  },
  {
    ticker: "pepe",
    image_url: "https://bis-brc20.fra1.digitaloceanspaces.com/icons/pepe.jpg",
    limit_per_mint: 1000,
    max_supply: 42069000,
    minted_supply: 42069000,
    remaining_supply: 0,
    mint_progress: 100,
    holder_count: 4455,
    tx_count: 12348,
    deploy_ts: "2023-03-09T05:00:23.000Z",
  },
  {
    ticker: "whee",
    image_url: null,
    limit_per_mint: 1000,
    max_supply: 21000000,
    minted_supply: 21000000,
    remaining_supply: 0,
    mint_progress: 100,
    holder_count: 4064,
    tx_count: 12085,
    deploy_ts: "2023-05-10T05:06:18.000Z",
  },
  {
    ticker: "sats",
    image_url: null,
    limit_per_mint: 100000000,
    max_supply: 2100000000000000,
    minted_supply: 625916906176782.1,
    remaining_supply: 1474083093823218,
    mint_progress: 29.80556696079915,
    holder_count: 23767,
    tx_count: 11495,
    deploy_ts: "2023-03-09T05:32:14.000Z",
  },
  {
    ticker: "$ore",
    image_url: null,
    limit_per_mint: 21000000,
    max_supply: 21000000,
    minted_supply: 21000000,
    remaining_supply: 0,
    mint_progress: 100,
    holder_count: 3762,
    tx_count: 9617,
    deploy_ts: "2023-05-16T05:43:54.000Z",
  },
  {
    ticker: "drac",
    image_url: null,
    limit_per_mint: 1260,
    max_supply: 106824000,
    minted_supply: 106824000,
    remaining_supply: 0,
    mint_progress: 100,
    holder_count: 2924,
    tx_count: 8692,
    deploy_ts: "2023-05-06T23:34:51.000Z",
  },
  {
    ticker: "psat",
    image_url: null,
    limit_per_mint: 10000000,
    max_supply: 10000000,
    minted_supply: 10000000,
    remaining_supply: 0,
    mint_progress: 100,
    holder_count: 2012,
    tx_count: 8558,
    deploy_ts: "2023-05-10T11:21:14.000Z",
  },
  {
    ticker: "frvr",
    image_url: null,
    limit_per_mint: 10000000,
    max_supply: 10000000,
    minted_supply: 10000000,
    remaining_supply: 0,
    mint_progress: 100,
    holder_count: 1930,
    tx_count: 7935,
    deploy_ts: "2023-04-04T14:23:41.000Z",
  },
  {
    ticker: "$og$",
    image_url: null,
    limit_per_mint: 21000000,
    max_supply: 21000000,
    minted_supply: 21000000,
    remaining_supply: 0,
    mint_progress: 100,
    holder_count: 3003,
    tx_count: 7825,
    deploy_ts: "2023-03-15T03:18:02.000Z",
  },
  {
    ticker: "moon",
    image_url: "https://bis-brc20.fra1.digitaloceanspaces.com/icons/moon.jpg",
    limit_per_mint: 1000,
    max_supply: 100000000,
    minted_supply: 100000000,
    remaining_supply: 0,
    mint_progress: 100,
    holder_count: 5006,
    tx_count: 7745,
    deploy_ts: "2023-03-10T00:43:33.000Z",
  },
  {
    ticker: "meme",
    image_url: "https://bis-brc20.fra1.digitaloceanspaces.com/icons/meme.jpg",
    limit_per_mint: 1,
    max_supply: 99999,
    minted_supply: 99999,
    remaining_supply: 0,
    mint_progress: 100,
    holder_count: 4883,
    tx_count: 7449,
    deploy_ts: "2023-03-08T12:44:22.000Z",
  },
  {
    ticker: "biso",
    image_url: null,
    limit_per_mint: 210000000,
    max_supply: 210000000,
    minted_supply: 210000000,
    remaining_supply: 0,
    mint_progress: 100,
    holder_count: 1580,
    tx_count: 6914,
    deploy_ts: "2023-05-09T12:51:36.000Z",
  },
  {
    ticker: "piza",
    image_url: "https://bis-brc20.fra1.digitaloceanspaces.com/icons/piza.jpg",
    limit_per_mint: 1000,
    max_supply: 21000000,
    minted_supply: 21000000,
    remaining_supply: 0,
    mint_progress: 100,
    holder_count: 1459,
    tx_count: 6532,
    deploy_ts: "2023-03-15T16:49:41.000Z",
  },
] as const;

type EXAMPLE_ROW_TYPE = (typeof EXAMPLE_DATA)[0];

const Page = () => {
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
    sort_by: "tx_count",
    order: "desc",
    count: rowsPerPage,
    offset: offset.toString(),
  });

  const { data, error, isLoading } = useSWR<any>(
    `https://api.bestinslot.xyz/v3/brc20/tickers?${params.toString()}`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  if (!hasMounted) return null; // todo: fix this?

  // if (!data) return null;
  // if (error) return <span>Something went wrong ʕ•̠͡•ʔ</span>;
  // if (data && "error" in data)
  //   // todo: add better error component
  //   return (
  //     <span>
  //       Something went wrong ʕ•̠͡•ʔ
  //       <br />
  //       {data.error}: {data.message}
  //     </span>
  //   );

  const isLastPage = (page + 1) * limit >= 100; // todo: fix!!!!
  // const isLastPage = (page + 1) * limit >= data.total;
  const isOnlyPage = page === 0 && isLastPage;

  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-stretch justify-between space-y-6 p-6">
        <h1 className="text-2xl">BRC-20 Tokens</h1>
        <p className="text-sm">
          Et labore aute ipsum incididunt do occaecat duis cillum velit. Sint in
          pariatur sint. Nisi et tempor consequat labore nisi proident sit.
          Voluptate qui eu eiusmod do ad nostrud occaecat consectetur duis velit
          pariatur. Lorem Lorem aliqua consectetur mollit occaecat veniam dolore
          excepteur sunt sint sint non non. Reprehenderit culpa sit occaecat
          consequat. Nostrud dolor culpa in{" "}
          <a href="" className="text-neutral-500 underline">
            link to standard
          </a>{" "}
          cillum dolore consectetur laborum magna aute qui et nisi.
        </p>
        <div className="flex-1">
          <table className="w-full text-sm ">
            <thead className="my-2 bg-neutral-100">
              <tr className="p-0.5">
                <th className="rounded-l-md font-normal">
                  <div className="group relative flex text-neutral-200 focus-within:text-neutral-300">
                    <span className="sr-only">Token name / Ticker</span>
                    <input
                      className="m-1 rounded-[3px] px-2 py-1.5 ps-8 text-neutral-600"
                      type="text"
                      placeholder="Ticker search"
                      title="Search for BRC-20 token by ticker"
                      maxLength={4}
                    />
                    <div className="absolute left-2.5 flex h-full items-center">
                      <SearchIcon className="h-5 w-5 " fontSize={32} />
                    </div>
                  </div>
                </th>
                <th className="font-normal">Max Supply</th>
                <th className="font-normal">Mint Progress</th>
                <th className="font-normal">Holders</th>
                <th className="font-normal">Txs</th>
                <th className="rounded-r-md font-normal">Deployed</th>
              </tr>
            </thead>

            {EXAMPLE_DATA.map((i, index) => (
              <Brc20TokenRow key={i?.ticker ?? index} token={i as any} />
            ))}
          </table>
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
      </main>
      <Footer />
    </>
  );
};

const Brc20TokenRow = ({ token }: { token: EXAMPLE_ROW_TYPE }) => {
  const progress = Math.round((token.minted_supply / token.max_supply) * 100);
  const deployedTime = Date.parse(token.deploy_ts);
  return (
    <tr className="bg-white text-end font-['Aeonik_Mono'] text-neutral-500 transition-colors hover:bg-neutral-0 hover:text-black">
      <td className="border-b border-neutral-100 text-start text-black">
        <Link
          className="flex px-3 py-1.5 ps-[38px]"
          href={`/protocols/brc20/${token.ticker}`}
        >
          {token.ticker}
        </Link>
      </td>
      <td className="border-b border-neutral-100 px-3 py-1.5 text-end">
        {token.max_supply}
      </td>
      <td className="border-b border-neutral-100 px-3 py-1.5 text-center">
        <span>{progress}%</span>
        <div className="flex justify-center">
          <progress max="100" value={progress} className="sr-only" />
          <div className="relative h-1 w-20 overflow-hidden rounded-full bg-neutral-0">
            <div
              className="absolute h-1 bg-sky"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </td>
      <td className="border-b border-neutral-100 px-3 py-1.5">
        {token.holder_count}
      </td>
      <td className="border-b border-neutral-100 px-3 py-1.5">
        {token.tx_count}
      </td>
      <td className="border-b border-neutral-100 px-3 py-1.5">
        <TooltipProvider delayDuration={150}>
          <Tooltip>
            <TooltipTrigger>
              <ReactTimeAgo
                className="tracking-tight"
                date={deployedTime}
                tooltip={false}
              />
            </TooltipTrigger>
            <TooltipContent variant="light">
              {formatDateTime(deployedTime)}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </td>
    </tr>
  );
};

export default Page;
