"use client";

import Link from "next/link";
import useSWR from "swr";

import CtaLink from "../../components/CtaLink";
import Footer from "../../components/Footer";
import GalleryPreview from "../../components/GalleryPreview";
import Header from "../../components/Header";
import Intro from "../../components/Intro";
import Loading from "../../components/Loading";
import SearchBar from "../../components/SearchBar";
import { fetcher } from "../../lib/helpers";
import { useHasMounted } from "../../lib/hooks";
import { HomepageResponse } from "../../pages/api/homepage";

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
      <main className="flex flex-col justify-between items-center min-h-screen max-w-5xl p-6 mx-auto space-y-6">
        {/* Intro Section */}
        <div className="max-w-2xl mx-auto space-y-10">
          {/* todo: wrap in motion */}
          <Intro />
          <div>
            <SearchBar />
            <Link
              href="/explore"
              className="mt-4 text-neutral-300 flex justify-center"
            >
              or explore all
            </Link>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="w-full">
          <p className="mt-20 text-sm text-center uppercase">
            Latest Inscriptions
          </p>
          <div className="mx-auto mt-3 mb-4 h-12 w-0 border border-dashed border-l-black"></div>
          <GalleryPreview />

          <div className="mt-16 flex justify-around">
            <CtaLink href="/explore">
              Explore all, sort, and filter &rarr;
            </CtaLink>
          </div>
        </div>

        <div className="w-full py-8">
          <hr className="border-dashed border-neutral-200" />
        </div>

        <div className="grid md:grid-cols-2 w-full gap-5">
          <div className="p-8 border border-neutral-0 rounded-[6px]">
            <div className="rounded bg-neutral-0 w-16 h-16 pl-2 flex items-center text-xl overflow-hidden">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-neutral-300 to-neutral-0 pointer-events-none select-none">
                #8030
              </span>
            </div>
            <h4 className="mt-7 text-2xl">Looking to make an inscription?</h4>
            <p className="mt-4">
              Download{" "}
              <a
                href="https://wallet.hiro.so/"
                target="_blank"
                className="text-neutral-300"
              >
                Hiro Wallet
              </a>{" "}
              and try{" "}
              <a
                href="https://gamma.io/"
                target="_blank"
                className="text-neutral-300"
              >
                Gamma.io
              </a>
            </p>
          </div>
          <div className="p-8 border border-neutral-0 rounded-[6px]">
            <div className="rounded bg-neutral-0 w-16 h-16 flex justify-center items-center pointer-events-none">
              <img src="/b-illustration.svg" alt="Bitcoin Icon" />
            </div>
            <h4 className="mt-7 text-2xl">What are Ordinals?</h4>
            <p className="mt-4">
              Ordinal Inscriptions, similar to NFTs, are digital assets
              inscribed on a satoshi, the lowest denomination of a Bitcoin
              (BTC).{" "}
              <a
                href="https://www.hiro.so/blog/what-are-bitcoin-ordinals "
                target="_blank"
                className="text-neutral-300"
              >
                Learn more.
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
