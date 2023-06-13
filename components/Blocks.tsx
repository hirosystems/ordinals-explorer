"use client";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import * as d3 from "d3";
// @ts-ignore
import d3Tip from "d3-tip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/Dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { scrollIntoView } from "../lib/utils";
import SatsListWrapper from "./SatsListWrapper";

const size = 17;
const amount = 210_000;

function Blocks({ blocks }: { blocks: [string, number][] }) {
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const selectedRef = useRef<SVGRectElement | null>(null);

  const unselectSat = useCallback(() => {
    setSelectedBlock(null);
    if (selectedRef.current) {
      selectedRef.current.classList.remove("selected");
      selectedRef.current = null;
    }
  }, []);

  const selectSat = useCallback(
    function (this: SVGRectElement) {
      if (selectedRef.current) unselectSat();

      const offset = Math.floor(window.innerHeight / 4);
      scrollIntoView(this, -offset);

      const block = this.getAttribute("data-block")
        ?.split("<br/>")[0]
        .replace("#", "");
      setSelectedBlock(block ?? null);

      this.classList.add("selected");
      selectedRef.current = this;
    },
    [unselectSat]
  );

  return (
    <>
      {/* <div className="tools pointer-events-none">
        <button
          className="pointer-events-auto"
          onClick={() => scrollIntoView(firstRef.current, -64)}
        >
          Jump to Block &rarr;
        </button>
      </div> */}
      <div className="m-5">
        <h3 className="text-lg font-bold">Legend</h3>
        <div className="flex items-center justify-start">
          <div className="blocks-pattern !mx-0 h-[17px] w-[17px]"></div>
          <div className="ml-2">Blocks without inscribed sats</div>
        </div>
        <div className="flex items-center justify-start">
          <div className="h-[16px] w-[16px] rounded-[3px] bg-gradient-to-r from-[pink] to-[red]"></div>
          <div className="ml-[9px]">Blocks with inscribed sats</div>
          {/* todo: tooltip with gradient number of inscriptions */}
        </div>
      </div>

      <BlocksSVG {...{ blocks, selectSat }} />

      <div className="h-[50vh]"></div>
      <Dialog
        open={!!selectedBlock}
        onOpenChange={(open) => {
          if (open === false) unselectSat();
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Block #{selectedBlock}</DialogTitle>
            <DialogDescription>
              The following inscriptions are on sats coinbased in block #
              {selectedBlock}
            </DialogDescription>
          </DialogHeader>
          <div className="my-4 h-full max-h-full overflow-auto">
            <SatsListWrapper bid={selectedBlock!} />
          </div>
          <DialogPrimitive.Close
            onClick={unselectSat}
            className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900 dark:data-[state=open]:bg-slate-800"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogContent>
      </Dialog>
    </>
  );
}

const BlocksSVG = React.memo(
  function BlocksSVG({
    blocks,
    selectSat,
  }: {
    blocks: [string, number][];
    selectSat: (this: SVGRectElement) => void;
  }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const firstRef = useRef<SVGRectElement | null>(null);
    const timeout = useRef<number | null>(null);
    const [width, setWidth] = useState(0);
    const w = Math.floor(width / size);
    const h = Math.ceil(amount / (w || 1)) * size;

    const tip = d3Tip()
      .attr("class", "tip")
      .html((d: any) => d.target.getAttribute("data-block"));

    if (svgRef.current) {
      d3.select(svgRef.current)
        .call(tip)
        .on("mouseover", (ev) => {
          if (ev.target.classList.contains("block")) {
            tip.show.call(ev.target, ev);
          }
        })
        .on("mouseout", (ev) => {
          if (ev.target.classList.contains("block")) {
            tip.hide.call(ev.target, ev);
          }
        })
        .on("click", (ev) => {
          if (ev.target.classList.contains("block")) {
            selectSat.call(ev.target);
          }
        });
    }

    const onResize = useCallback(() => {
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = window.setTimeout(() => {
        if (!containerRef.current) return;
        const newWidth = containerRef.current.getBoundingClientRect().width;
        setWidth(newWidth);
      }, 200);
    }, []);

    useEffect(() => {
      if (!containerRef.current) return;
      window.addEventListener("resize", onResize, false);
      return () => {
        if (timeout.current) clearTimeout(timeout.current);
        window.removeEventListener("resize", onResize, false);
      };
    }, [onResize]);

    useLayoutEffect(() => {
      if (!containerRef.current) return;
      setWidth(containerRef.current.offsetWidth);
    }, []);

    useLayoutEffect(() => {
      if (!width || !svgRef.current) return;

      const svg = d3.select(svgRef.current);
      svg.selectChildren().remove();
      svg.attr("width", "100%").attr("height", "100%");

      const maxBlockHeat = Math.max(...blocks.map(([_, v]) => v));
      const blockHeat = d3
        .scaleSequential()
        .domain([0, maxBlockHeat])
        // @ts-ignore
        .range(["pink", "red"]);

      let last: { i: number; j: number } = { i: 0, j: 0 };
      for (const [kStr, v] of blocks) {
        const k = parseInt(kStr) % 210_000;

        const i = k % w;
        const j = Math.floor(k / w);

        let rect = svg
          .append("rect")
          .attr("class", "block")
          .attr("height", size - 1)
          .attr("width", size - 1)
          .attr("fill", "green")
          .attr("rx", 2)
          .attr("ry", 2)
          .attr("x", i * size)
          .attr("y", j * size)
          .attr("fill", blockHeat(v))
          .attr(
            "data-block",
            `#${kStr}<br/>${v} inscribed sat${v > 1 ? "s" : ""}`
          );

        if (!firstRef.current) {
          firstRef.current = rect.node();
        }

        last = { i, j }; // todo: this should be the last mined block, not the last block with inscriptions
      }

      // todo: add dark mode for react drawing below
      // draw a rect from last block to the end of the svg
      if (last && last.i < w - 1) {
        svg
          .append("rect")
          .attr("x", (last.i + 1) * size)
          .attr("y", last.j * size)
          .attr("height", size - 1)
          .attr("width", (w - last.i - 1) * size)
          .attr("rx", 2)
          .attr("ry", 2)
          .attr("fill", "white")
          .attr("fill-opacity", 0.7);
      }

      // draw a rect from the line after the last block to the end of the svg
      if (last && last.j < h - 1) {
        svg
          .append("rect")
          .attr("x", 0)
          .attr("y", (last.j + 1) * size)
          .attr("height", (h - last.j - 1) * size)
          .attr("width", w * size)
          .attr("rx", 2)
          .attr("ry", 2)
          .attr("fill", "white")
          .attr("fill-opacity", 0.7);
      }
    }, [blocks, width, w, h, selectSat, tip]);

    return (
      <div ref={containerRef}>
        <div className="blocks-pattern" style={{ width: w * size, height: h }}>
          <svg ref={svgRef} />
        </div>
      </div>
    );
  },
  (prev, next) => prev.blocks.length == next.blocks.length
);

export default Blocks;
