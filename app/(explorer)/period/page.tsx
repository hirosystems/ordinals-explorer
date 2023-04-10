"use client";

import { motion } from "framer-motion";
import useSWR from "swr";
import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import Loading from "../../../components/Loading";
import { fetcher } from "../../../lib/helpers";
import { useHasMounted } from "../../../lib/hooks";
import { HomepageResponse } from "../../../pages/api/homepage";

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
      <main className="flex flex-col justify-between items-center max-w-5xl p-6 mx-auto space-y-6">
        {/* Halving Periods Section */}
        {/* todo: quick intro to ordinals and link to handbook */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <p className="mt-20 text-sm text-center uppercase">Halving Periods</p>
          <div className="mx-auto mt-3 mb-4 h-12 w-0 border border-dashed border-l-black"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 auto-rows-fr gap-2">
            {data &&
              Object.entries(data.periods).map(([p, v]) => (
                <motion.a
                  key={p}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.05 * parseInt(p) }}
                  href={`/period/${p}`}
                  className="px-5 py-4 border rounded-md transition-[background,border] duration-150 group hover:bg-neutral-50 hover:border-neutral-400"
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
              className="px-5 py-4 border border-dashed rounded-md text-neutral-400 cursor-default"
            >
              <h2 className="mb-3 underline">Period 4</h2>
              <p>
                Estimated to start{" "}
                <span className="whitespace-nowrap">March 18, 2024</span>
              </p>
            </motion.div>
          </div>
          <div className="mt-10 mx-auto max-w-lg space-y-4">
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
