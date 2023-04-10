"use client";

import { usePathname } from "next/navigation";
import { useUpdate } from "react-use";

import DateFilter from "../../../components/DateFilter";
import Filter from "../../../components/Filter";
import Footer from "../../../components/Footer";
import GalleryFull, {
  V1InscriptionsOptions,
} from "../../../components/GalleryFull";
import Header from "../../../components/Header";
import RangeFilter from "../../../components/RangeFilter";

import Sort, { sortOptions } from "../../../components/Sort";
import { useHasMounted } from "../../../lib/hooks";

const fParams = ["image", "video", "audio", "text", "binary"];
const rParams = [
  ["common", "Any sat that is not the first sat of its block"],
  ["uncommon", "The first sat of each block"],
  ["rare", "The first sat of each difficulty adjustment period"],
  ["epic", "The first sat of each halving period"],
  ["legendary", "The first sat of each cycle"],
  ["mythic", "The first sat of the genesis block"],
];

// todo: usecallback etc. for better performance?

// SEARCH PARAMS MAP
// s: sort
// o: order
// p: page
// f: file type
// m: mime type (comma separated) // todo
// r: rarity
// df: inscription date start
// dt: inscription date end
// cf: coinbase date start
// ct: coinbase date end
// nf: inscription number start
// nt: inscription number end
// hf: inscription height start
// ht: inscription height end
// sf: sat ordinal start
// st: sat ordinal end

const Page = () => {
  const hasMounted = useHasMounted();
  const update = useUpdate();
  const pathname = usePathname();

  if (!hasMounted) return null; // todo: fix this?

  const url = new URL(window.location.href);
  const searchParams = new URLSearchParams(url.search); // useSearchParams() doesn't work here when manually useUpdating

  // basic parameters
  const sort = searchParams.get("s") ?? "genesis_block_height"; // genesis_block_height, rarity
  const order = searchParams.get("o") ?? "desc"; // asc, desc
  const sortKey = `${sort}-${order}` as keyof typeof sortOptions;
  const page = parseInt(searchParams.get("p") ?? "0");

  // array filter parameters
  const fSelected = new Set(searchParams.getAll("f"));
  const rSelected = new Set(searchParams.getAll("r"));

  // range filter parameters
  const dStart = searchParams.get("df");
  const dEnd = searchParams.get("dt");
  const cStart = searchParams.get("cf");
  const cEnd = searchParams.get("ct");
  const nStart = searchParams.get("nf");
  const nEnd = searchParams.get("nt");
  const hStart = searchParams.get("hf");
  const hEnd = searchParams.get("ht");

  // todo: add all other filters
  const arrayCount = fSelected.size + rSelected.size;
  const paramsCount = [
    dStart,
    dEnd,
    cStart,
    cEnd,
    nStart,
    nEnd,
    hStart,
    hEnd,
  ].filter(Boolean).length; // todo: rather count each range param as 1 filter max?
  const filterCount = arrayCount + paramsCount;

  function toggle(key: string, type: string) {
    const set = new Set(searchParams.getAll(key));
    set.has(type) ? set.delete(type) : set.add(type); // toggle
    searchParams.delete(key);
    set.forEach((value) => searchParams.append(key, value));
    searchParams.delete("p"); // changing filters resets page to 0
    window.history.pushState({}, "", `${pathname}?${searchParams.toString()}`);
    update(); // force re-render
  }

  function updateSort(value: string) {
    const [s, o] = value.split("-");
    searchParams.set("s", s);
    searchParams.set("o", o);
    window.history.pushState({}, "", `${pathname}?${searchParams.toString()}`);
    update(); // force re-render
  }

  function updateRange(key: string, start: string | null, end: string | null) {
    searchParams.delete(`${key}f`);
    searchParams.delete(`${key}t`);
    if (start) searchParams.set(`${key}f`, start);
    if (end) searchParams.set(`${key}t`, end);
    window.history.pushState({}, "", `${pathname}?${searchParams.toString()}`);
    update(); // force re-render
  }

  function updatePage(offset: number) {
    searchParams.set("p", `${page + offset}`);
    window.history.pushState({}, "", `${pathname}?${searchParams.toString()}`);
    update(); // force re-render
  }

  function clear() {
    window.history.pushState({}, "", pathname);
    update(); // force re-render
  }

  // yep, this is messy
  function renderEmpty() {
    if (filterCount > 0)
      return (
        <div className="flex-grow uppercase text-neutral-400">
          No matching results for the filters selected.
          <button
            className="big-button block my-6 mx-auto px-5 py-3 border bg-neutral-500 broder-2 border-black text-white rounded-[4px]"
            onClick={clear}
          >
            {/* todo: clear button color state, hover, etc. */}
            Clear Filters ({filterCount})
          </button>
        </div>
      );
    return (
      <div>
        <p>¯\_(ツ)_/¯</p>
        <p className="uppercase">No results</p>
      </div>
    );
  }

  const apiOptions = {
    page,
    order,
    order_by: sort,

    mime_type: [] as string[], // todo: allow addition comma separated mime types
    file_type: Array.from(fSelected),
    rarity: Array.from(rSelected),

    from_number: nStart ? parseInt(nStart) : null,
    to_number: nEnd ? parseInt(nEnd) : null,
    from_genesis_block_height: hStart ? parseInt(hStart) : null,
    to_genesis_block_height: hEnd ? parseInt(hEnd) : null,
    from_genesis_timestamp: dStart ? Date.parse(dStart) : null,
    to_genesis_timestamp: dEnd ? Date.parse(dEnd) : null,
    from_sat_coinbase_height: cStart ? parseInt(cStart) : null,
    to_sat_coinbase_height: cEnd ? parseInt(cEnd) : null,
  } as V1InscriptionsOptions;

  return (
    <>
      <Header />
      <main className="w-full max-w-[104rem] mx-auto flex-grow">
        <div className="flex">
          {/* FILTERS */}
          <div className="hidden md:block ml-6 text-xs whitespace-nowrap min-w-[210px]">
            <div className="space-y-2">
              <div className="py-1 uppercase">Filter</div>
              <hr className="border-dashed border-neutral-300" />
            </div>
            <div className="mt-5"></div>
            <Filter
              defaultOpen={true}
              name="File Types"
              options={fParams}
              onClick={(t) => toggle("f", t)}
              selected={fSelected}
            />
            <hr className="my-3 border-dashed border-neutral-200" />
            <Filter
              name="Rarity"
              options={rParams}
              onClick={(t) => toggle("r", t)}
              selected={rSelected}
            />
            <hr className="my-3 border-dashed border-neutral-200" />
            {/* todo: clear date filters unapplied state when clear is called (e.g. via key prop) */}
            <DateFilter
              name="Inscription Date"
              start={dStart}
              end={dEnd}
              onApply={(f, t) => updateRange("d", f, t)}
            />
            <hr className="my-3 border-dashed border-neutral-200" />
            <RangeFilter
              name="Inscription Number"
              start={nStart}
              end={nEnd}
              onApply={(f, t) => updateRange("n", f, t)}
            />
            <hr className="my-3 border-dashed border-neutral-200" />
            <RangeFilter
              name="Inscription Height"
              start={hStart}
              end={hEnd}
              onApply={(f, t) => updateRange("h", f, t)}
            />
            <hr className="my-3 border-dashed border-neutral-200" />
            <RangeFilter
              name="Coinbase Height"
              start={cStart}
              end={cEnd}
              onApply={(f, t) => updateRange("c", f, t)}
            />

            {/* todo: inscription number filter */}
            {/* todo: period filter */}

            <hr className="my-3 border-dashed border-neutral-200" />
            <div className="my-6"></div>
            <button
              className="block w-full px-4 py-2 border text-neutral-600 rounded-[4px] uppercase"
              onClick={clear}
            >
              {/* todo: clear button color state, hover, etc. */}
              Clear Filters {filterCount > 0 && `(${filterCount})`}
            </button>
          </div>
          <div className="mx-6 flex flex-col flex-grow space-y-5">
            <div className="w-full text-xs uppercase">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="uppercase py-1 opacity-0">Show todo</div>
                  <Sort sortKey={sortKey} updateSort={updateSort} />
                </div>
                <hr className="border-dashed border-neutral-300" />
              </div>
            </div>
            {/* IMAGES */}
            <GalleryFull apiOptions={apiOptions} renderEmpty={renderEmpty}>
              {/* Pagination */}
              <div className="my-12 flex justify-center">
                {/* todo: use real links? */}
                {/* todo: hide on load, or add skeleton */}
                <div className="grid grid-cols-2 gap-3">
                  {page > 0 && (
                    <button
                      className="text-white bg-black px-3 py-1.5 rounded-[4px]"
                      onClick={() => updatePage(-1)}
                    >
                      &larr; Previous
                    </button>
                  )}
                  <button
                    className="text-white bg-black px-3 py-1.5 rounded-[4px]"
                    onClick={() => updatePage(+1)}
                  >
                    Next &rarr;
                  </button>
                </div>
              </div>
            </GalleryFull>
            {/* preload next page */}
            <div className="hidden">
              <GalleryFull
                apiOptions={{ ...apiOptions, page: apiOptions.page + 1 }}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Page;
