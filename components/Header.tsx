"use client";

import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./HoverCard";

const Header = ({ children }: { children?: React.ReactNode }) => {
  return (
    <header className="flex justify-between px-6 md:px-10 py-8 w-full max-w-[88rem] mx-auto">
      <a href="/">
        <img src="/logo.svg" alt="Hiro Ordinals Beta" />
      </a>
      {children}
      {/* todo: explore button, stats, hiro.so */}
      <div className="hidden sm:block">
        <HoverCard openDelay={0}>
          <HoverCardTrigger className="px-3.5 py-2.5 rounded-md cursor-default hover:bg-neutral-0">
            Explore
          </HoverCardTrigger>
          <HoverCardContent className="flex flex-col p-1">
            <Link
              href="/explore"
              className="px-3.5 py-2.5 rounded-md hover:bg-neutral-0"
            >
              All inscriptions
            </Link>
            <Link
              href="/period"
              className="px-3.5 py-2.5 rounded-md hover:bg-neutral-0"
            >
              By halving period
            </Link>
          </HoverCardContent>
        </HoverCard>
        <Link
          href="/stats"
          className="px-3.5 py-2.5 rounded-md hover:bg-neutral-0"
        >
          Stats
        </Link>
        <Link
          target="_blank"
          href="https://hiro.so"
          className="px-3.5 py-2.5 rounded-md text-neutral-300 hover:text-neutral-500"
        >
          hiro.so
          <ArrowUpRight className="inline" size={16} />
        </Link>
      </div>
    </header>
  );
};

export default Header;
