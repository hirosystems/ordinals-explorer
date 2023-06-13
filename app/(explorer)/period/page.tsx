"use client";

import { motion } from "framer-motion";
import useSWR from "swr";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import Loading from "../../../components/Loading";
import { fetcher } from "../../../lib/utils";
import { useHasMounted } from "../../../lib/hooks";
import { HomepageResponse } from "../../../lib/types";

export default function Home() {
  const hasMounted = useHasMounted();

  // todo: push down to components
  const { data, error, isLoading } = useSWR<HomepageResponse>(
    "/api/homepage",
    fetcher
  );

  if (error) return "Something went wrong ʕ•̠͡•ʔ Please try reloading the page";
  if (!hasMounted || isLoading || !data)
    return <Loading className="min-h-screen" />;

  return (
    <>
      <Header />
      <main className="mx-auto flex max-w-5xl flex-col items-center justify-between space-y-6 p-6">
        {/* Halving Periods Section */}
        {/* todo: quick intro to ordinals and link to handbook */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <p className="mt-20 text-center text-sm uppercase">Halving Periods</p>
          <div className="mx-auto mb-4 mt-3 h-12 w-0 border border-dashed border-l-black"></div>
          <div className="grid auto-rows-fr grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
            {data &&
              Object.entries(data.periods).map(([p, v]) => (
                <motion.a
                  key={p}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.05 * parseInt(p) }}
                  href={`/period/${p}`}
                  className="group rounded-md border px-5 py-4 transition-[background,border] duration-150 hover:border-neutral-400 hover:bg-neutral-50"
                >
                  <h2 className="mb-3 underline">Period {p}</h2>
                  <span className="inline-block transition-transform group-hover:translate-x-1">
                    {v} Inscribed sats
                  </span>
                </motion.a>
              ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.2 }}
              className="cursor-default rounded-md border border-dashed px-5 py-4 text-neutral-400"
            >
              <h2 className="mb-3 underline">Period 4</h2>
              <p>
                Estimated to start{" "}
                <span className="whitespace-nowrap">March 18, 2024</span>
              </p>
            </motion.div>
          </div>
          <div className="mx-auto mt-10 max-w-lg space-y-4">
            <p>
              Bitcoin is partitioned into periods in which the block reward is
              adjusted. These periods are referred to as &quot;Halving
              Periods&quot;. Every 210,000 blocks the block reward is halved.
            </p>
            <p>
              Currently, the reward per block is 6.25 BTC. This means
              62,500,000,000 satoshis are added to the total supply of Bitcoin,
              for every block that is mined to the canonical chain.
            </p>
          </div>
        </motion.div>
      </main>
      <Footer />
    </>
  );
}
