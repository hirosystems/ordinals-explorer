"use client";

import { API_BETA_URL, API_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Search as SearchIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import Thumbnail from "./Thumbnail";

enum GoToTypes {
  Inscription = "inscription",
  Block = "block",
  Sat = "sat",
  Brc20 = "brc20",
}
type SearchTypes = {
  type: GoToTypes;
  search: string;
};
type SearchResult = {
  id: string;
  type: GoToTypes;
  index: number;
  link: string;
  text: string;
  secondaryText?: string;
  contentType: string;
};
type GroupedResults = {
  [key in GoToTypes]: SearchResult[];
};

// the order of the regex matters we wan't to keep Inscription > Sat > Block
// it's reflected in the results `index` prop to handle arrow up/down selection
const searchRegexes: Readonly<{ type: GoToTypes; reg: RegExp }[]> = [
  {
    type: GoToTypes.Inscription,
    reg: /^[0-9a-f]{0,64}i[0-9]+$/,
  },
  {
    type: GoToTypes.Inscription,
    reg: /^\d+$/,
  },
  {
    type: GoToTypes.Sat,
    reg: /^\d+$/,
  },
  {
    type: GoToTypes.Block,
    reg: /^\d+$/,
  },
  {
    type: GoToTypes.Brc20,
    reg: /.{1,4}$/i,
  },
] as const;

async function searchFetcher(searches: SearchTypes[]) {
  const fetchPromises = searches.map(async ({ type, search }) => {
    if (type === GoToTypes.Inscription) {
      const res = await fetch(`${API_URL}/inscriptions/${search}`);
      if (res.status !== 200) return null;
      const result = await res.json();
      return {
        type,
        id: result.id,
        link: `/inscription/${result.id}`,
        content_type: result.content_type,
        text: result.number,
        secondaryText: result.id,
      };
    }
    if (type === GoToTypes.Sat) {
      return {
        type,
        id: search,
        link: `/sat/${search}`,
        text: search,
        secondaryText: null,
      };
    }
    if (type === GoToTypes.Block) {
      const res = await fetch(`${API_URL}/`);
      if (res.status !== 200) return null;
      const result = await res.json();
      if (Number(search) > Number(result.block_height)) return null;

      return {
        type,
        id: search,
        link: `/block/${search}`,
        text: search,
        secondaryText: null,
      };
    }
    if (type === GoToTypes.Brc20) {
      const res = await fetch(`${API_BETA_URL}/brc-20/tokens/${search}`);
      if (res.status !== 200) return null;
      const result = await res.json();
      return {
        type,
        id: result.token.id,
        link: `/protocols/brc-20/${result.token.ticker}`,
        content_type: result.content_type,
        text: result.token.ticker,
        secondaryText: result.token.id,
      };
    }
    return null;
  });

  const results = await Promise.all(fetchPromises);
  return results.filter(Boolean).map(
    (r, i): SearchResult => ({
      id: `${r!.id}`,
      index: i,
      link: r!.link,
      text: `${r!.text}`,
      secondaryText: r!.secondaryText,
      contentType: r!.content_type,
      type: r!.type,
    })
  );
}

const InscriptionLink = (props: SearchResult) => {
  return (
    <>
      <div className="inline-block h-9 w-9 rounded border border-neutral-100 text-center text-[8px] leading-8">
        <Thumbnail
          inscription={{
            id: props.id,
            content_type: props.contentType,
          }}
        />
      </div>
      <p>
        <span className="text-neutral-300">
          ID {props.id.slice(0, 4)}...{props.id.slice(62)}{" "}
        </span>
        <span className="text-neutral-800"> &rarr; #{props.text}</span>
      </p>
    </>
  );
};

const SatLink = (props: SearchResult) => {
  return <p className="text-neutral-800">#{props.text}</p>;
};

const BlockLink = (props: SearchResult) => {
  return <p className="text-neutral-800">#{props.text}</p>;
};

const Brc20Link = (props: SearchResult) => {
  return (
    <p className="text-neutral-800">
      {props.text.toUpperCase()}{" "}
      <span className="text-sm text-neutral-300">{props.secondaryText}</span>
    </p>
  );
};

const SearchBar = (props: { className?: string; small?: boolean }) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selected, setSelected] = useState(0);
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const searches: SearchTypes[] = [];
  for (const { reg, type } of searchRegexes) {
    if (reg.test(search)) {
      searches.push({ type, search });
    }
  }

  const { data, error, isLoading } = useSWR(searches, searchFetcher);
  useEffect(() => {
    if (isLoading) return;
    if (error || !data) {
      setSearchResults([]);
      return;
    }
    if (data.length === 0) {
      setSearchResults(null);
      return;
    }
    setSelected(0);
    setSearchResults(data);
  }, [data, error, isLoading]);

  const select = useCallback(
    (delta: 1 | -1) => {
      if (!searchResults) return;
      const newValue = selected + delta;
      if (newValue < 0 || newValue >= searchResults.length) return;
      setSelected(selected + delta);
    },
    [setSelected, selected, searchResults]
  );

  const onKeydown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFocused) {
        e.preventDefault();
        searchInputRef.current?.blur();
      } else if (e.key === "Enter") {
        const selectedItem = searchResults?.find((l) => l.index === selected);
        if (!selectedItem) return;
        e.preventDefault();
        setIsFocused(false);
        router.push(selectedItem.link);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        select(1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        select(-1);
      }
    },
    [isFocused, searchResults, router, select, selected]
  );

  useEffect(() => {
    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, [onKeydown]);

  // CMD+K to focus search input
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const groupedResult = searchResults?.reduce(
    (acc, r) => ({
      ...acc,
      [r.type]: acc[r.type].concat(r),
    }),
    {
      [GoToTypes.Inscription]: [],
      [GoToTypes.Sat]: [],
      [GoToTypes.Block]: [],
      [GoToTypes.Brc20]: [],
    } as GroupedResults
  );

  // todo: maybe switch to refs, right now the components are re-rendered on input click (visible in shadow re-rendering)
  //      or potentially it would work to push down the search logic into a child component
  return (
    <div
      className={cn(
        // height given manually, since the search bar is absolutely positioned
        "search-bar-container group relative z-20 h-10 text-neutral-400 transition-[box-shadow,opacity]",
        isFocused && "focused",
        !isFocused && props.small && "opacity-80",
        props.className
      )}
    >
      <div
        className={cn(
          "absolute z-30 w-full rounded-[4px] bg-gradient-to-b from-neutral-0 to-neutral-200 p-[1px] transition-[box-shadow] group-hover:shadow-[0_6px_14px_0_#8c877d4d]",
          props.small
            ? "shadow-[0px_3px_6px_0px_#f2f0ed]"
            : "shadow-[0px_6px_14px_0px_#f2f0ed]",
          isFocused && "shadow-[0_6px_14px_0_#8c877d4d]"
        )}
      >
        <div className="overflow-hidden rounded-[3px] bg-white">
          {/* Search bar */}
          <div className="relative flex items-center ">
            {/* Search input */}
            <input
              ref={searchInputRef}
              className={cn(
                "flex-1 font-normal outline-none placeholder:text-neutral-300",
                props.small ? "p-[9px] ps-[40px] text-sm" : "p-[17px] ps-[58px]"
              )}
              type="text"
              value={search}
              onChange={(ev) => setSearch(ev.target.value.trim().toLowerCase())}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search by inscription, sat, block, or BRC-20 token"
            />
            {/* CMD K badge */}
            <div
              className={cn(
                "cursor-default whitespace-nowrap rounded border border-neutral-300 bg-gradient-to-b from-neutral-0 to-neutral-100 px-1.5 pb-0.5 font-['Aeonik_Mono'] text-xs text-neutral-950 opacity-40",
                props.small ? "mx-2" : "mx-5"
              )}
            >
              {/* todo: switch to two separate keyboard key looking badges for each key */}
              <span className="relative top-[1px] me-[5px] text-sm">⌘</span>K
            </div>
            {/* Search icon wrapper */}
            <div
              className={cn(
                "absolute left-0 top-0 flex h-full items-center ps-5 text-neutral-300",
                props.small ? "ps-3" : "ps-5"
              )}
            >
              <SearchIcon size={props.small ? 20 : 26} />
            </div>
          </div>
          {/* Search results */}
          <motion.div
            animate={{
              height: isFocused && searchResults?.length ? "auto" : 0,
            }}
            className="m-0 h-0 w-full rounded-[4px] bg-white text-neutral-400 transition-colors"
          >
            <div className={cn(props.small ? "p-3" : "p-5", "pt-0")}>
              <div className={cn("space-y-1.5")}>
                {groupedResult
                  ? Object.entries(groupedResult).map(([type, results]) =>
                      results.length ? (
                        <div key={type}>
                          <p className="relative z-50 uppercase text-neutral-300">
                            {type}
                          </p>
                          {results.map((result) => (
                            <Link
                              className={cn(
                                "flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap rounded border-2 border-transparent p-2 leading-5 transition-colors hover:bg-neutral-0",
                                result.index === selected && "border-peach"
                              )}
                              key={result.id}
                              href={result.link}
                              onMouseDown={(e) => {
                                // avoid loosing focus on the input
                                e.preventDefault();
                              }}
                            >
                              {type === GoToTypes.Inscription && (
                                <InscriptionLink {...result} />
                              )}
                              {type === GoToTypes.Sat && (
                                <SatLink {...result} />
                              )}
                              {type === GoToTypes.Block && (
                                <BlockLink {...result} />
                              )}
                              {type === GoToTypes.Brc20 && (
                                <Brc20Link {...result} />
                              )}
                            </Link>
                          ))}
                        </div>
                      ) : null
                    )
                  : null}
              </div>
            </div>
            {search.length && searchResults === null ? (
              <p className="mt-5 px-5 pb-3 uppercase text-neutral-300">
                ¯\_(ツ)_/¯ No results
              </p>
            ) : null}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
