"use client";

import { Search as SearchIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import useSWR from "swr";

import { API_URL } from "@/lib/constants";
import { cn } from "@/lib/helpers";

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
  return results
    .filter((r) => !!r)
    .map(
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
      <div className="inline-block w-9 h-9 rounded border border-neutral-100 text-[8px] text-center leading-8">
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

  return (
    <div
      className={cn(
        "search-bar-container relative text-neutral-400 transition-colors h-12 mb-10",
        isFocused && "focused"
      )}
    >
      <div className="search-bar-box absolute w-full p-[1px] bg-gradient-to-b from-neutral-0 to-neutral-200 rounded-[5px]">
        <div className=" bg-white m-0 p-5 pt-10 w-full text-neutral-400 transition-colors rounded-[4px]">
          {groupedResult && isFocused
            ? Object.entries(groupedResult).map(([type, results]) =>
                results.length ? (
                  <div key={type}>
                    <p className="uppercase text-neutral-300 mt-3 mb-1">
                      {type}
                    </p>

                    {results.map((result) => (
                      <Link
                        className={cn(
                          "flex items-center gap-2 p-3 border-2 border-transparent rounded hover:bg-neutral-0 whitespace-nowrap overflow-hidden text-ellipsis leading-5",
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
                        {type === GoToTypes.Block && <BlockLink {...result} />}
                      </Link>
                    ))}
                  </div>
                ) : null
              )
            : null}
          {search.length && searchResults === null ? (
            <p className="text-neutral-300 uppercase mt-5">
              ¯\_(ツ)_/¯ No results
            </p>
          ) : null}
        </div>
      </div>
      <div className="absolute w-full p-5">
        <div className="flex gap-4">
          <SearchIcon className="text-neutral-300" />
          <input
            ref={searchInputRef}
            className="w-full outline-none font-normal placeholder:text-neutral-300"
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
  );
};

export default SearchBar;
