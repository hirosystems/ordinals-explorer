import Link from "next/link";
import Brc20TokensTable, { Brc20EarliestTokensTable } from "./Brc20TokensTable";

const Brc20Homepage = () => {
  return (
    <>
      {/* todo: stats? */}
      {/* <div className="grid grid-cols-3 rounded-lg border border-neutral-0">
        <div className="border-r border-neutral-0 p-3">x</div>
        <div className="border-r border-neutral-0 p-3">y</div>
        <div className="p-3 ">z</div>
      </div> */}

      <div className="space-y-5 rounded-lg border border-neutral-0 p-7 pt-6 text-center">
        <h2 className="text-3xl">What is BRC-20?</h2>
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
          is built on top of Ordinals and uses the JSON content of inscriptions
          to store interaction information.
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

      {/* todo: border-b-0 is an ugly fix */}
      <div className="flex-1 overflow-hidden rounded-lg border border-b-0 border-neutral-0">
        <div className="mb-3 space-y-2 p-4">
          <h2 className="text-2xl">Earliest BRC-20 Tokens</h2>
          <p className="text-neutral-300">
            Displaying the first deployed BRC-20 tokens
          </p>
        </div>

        <Brc20EarliestTokensTable />
      </div>

      <div className="flex-1 overflow-hidden rounded-lg border border-neutral-0">
        <div className="mb-3 space-y-2 p-4">
          <h2 className="text-2xl">Latest Active BRC-20 Tokens</h2>
          <p className="text-neutral-300">
            Displaying the most recently used BRC-20 tokens
          </p>
        </div>

        <Brc20TokensTable />
      </div>
    </>
  );
};

export default Brc20Homepage;
