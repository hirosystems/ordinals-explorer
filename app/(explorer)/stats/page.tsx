"use client";

import { motion } from "framer-motion";
import useSWR from "swr";
import Charts from "../../../components/Charts";
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
      <main className="w-full flex flex-col justify-between items-center min-h-screen max-w-5xl p-6 mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="w-full max-w-3xl"
        >
          <h2 className="mt-20 text-2xl text-center ">
            Number of Ordinal Inscriptions
          </h2>
          {/* todo: enable touch on charts (currently not possible to scroll or zoom while touching chart area) */}
          <Charts data={data?.graph} dataCumulative={data?.graphCumulative} />
        </motion.div>
        <p className="text-sm text-neutral-500">
          The numbers shown in these charts are not updated in real-time.
        </p>
      </main>
      <Footer />
    </>
  );
}
