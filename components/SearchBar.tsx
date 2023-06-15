"use client";

import { Search as SearchIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { motion } from "framer-motion";

import { API_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

import "./SearchBar.css";
import Thumbnail from "./Thumbnail";

enum GoToTypes {
  Inscription = "inscription",
  Block = "block",
  Sat = "sat",
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

const SearchBar = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [selected, setSelected] = useState(0);
  const [searchResults, setSearchResults] = useState<SearchResult[] | null>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  let searches: SearchTypes[] = [];
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

  const groupedResult = searchResults?.reduce(
    (acc, r) => ({
      ...acc,
      [r.type]: acc[r.type].concat(r),
    }),
    {
      [GoToTypes.Inscription]: [],
      [GoToTypes.Sat]: [],
      [GoToTypes.Block]: [],
    } as GroupedResults
  );

  // todo: maybe switch to refs, right now the components are re-rendered on input click (visible in shadow re-rendering)
  //      or potentially it would work to push down the search logic into a child component
  return (
    <div
      className={cn(
        "search-bar-container relative z-20 mb-10 h-12 text-neutral-400 transition-colors",
        isFocused && "focused"
      )}
    >
      {/* search bar input */}
      <div className="absolute w-full p-[1px]">
        <div className="relative z-40 rounded-[4px] bg-white p-[18px]">
          <div className="flex gap-4 ">
            <SearchIcon className="text-neutral-300" />
            <input
              ref={searchInputRef}
              className="w-full font-normal outline-none placeholder:text-neutral-300"
              type="text"
              value={search}
              onChange={(ev) => setSearch(ev.target.value.trim().toLowerCase())}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search by inscription, sat, or block"
            />
          </div>
        </div>
      </div>
      {/* 1 px wrapper for gradient border */}
      <motion.div
        layout
        transition={{ duration: 0.1 }}
        className="search-bar-box absolute z-30 min-h-[62px] w-full overflow-hidden rounded-[5px] bg-gradient-to-b from-neutral-0 to-neutral-200 p-[1px] transition-[box-shadow]"
      >
        {/* search results content */}
        <div className="m-0 w-full overflow-hidden rounded-[4px] bg-white text-neutral-400 transition-colors">
          <div className="m-5 mt-[54px]">
            <div
              className={cn("space-y-1.5", isFocused ? "visible" : "hidden")}
            >
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
                            {type === GoToTypes.Sat && <SatLink {...result} />}
                            {type === GoToTypes.Block && (
                              <BlockLink {...result} />
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
            <p className="mt-5 uppercase text-neutral-300">
              ¯\_(ツ)_/¯ No results
            </p>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
};

export default SearchBar;
