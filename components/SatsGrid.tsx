"use client";

import * as d3 from "d3";
// @ts-ignore
import d3Tip from "d3-tip";
import { useLayoutEffect, useRef } from "react";
import { blockHeightToMinedSats, blockHeightToRewardSats } from "../lib/utils";

import "./Sats.css";

const size = 17;

function SatsGrid({
  block,
  width,
  sats,
}: {
  block: number;
  width: number;
  sats: string[];
}) {
  const satsInBlock = blockHeightToRewardSats(block);

  const w = BigInt(Math.floor(width / size));
  const h = (satsInBlock / (w || 1n)) * BigInt(size);

  const svgRef = useRef<SVGSVGElement>(null);
  const firstRef = useRef<SVGRectElement | null>(null);

  useLayoutEffect(() => {
    if (!width || !svgRef.current) return;

    const tip = d3Tip()
      .attr("class", "tip")
      .html((d: any) => d.target.getAttribute("data-sat"));

    const svg = d3
      .select(svgRef.current)
      .attr("width", "100%")
      .attr("height", "100%")
      .call(tip);

    function onClick(this: any) {
      const sat = this.getAttribute("data-sat");
      window.open(`/sat/${sat}`, "_blank");
    }

    const satsMined = blockHeightToMinedSats(block);

    // reduce with a side effect of drawing a rect for each block
    const last = sats.reduce((_, satStr) => {
      const sat = Number(BigInt(satStr) - satsMined);

      const i = sat % Number(w);
      const j = Math.floor(sat / Number(w));

      let rect = svg
        .append("rect")
        .attr("class", "sat")
        .attr("x", i * size)
        .attr("y", j * size)
        .attr("height", size - 1)
        .attr("width", size - 1)
        .attr("rx", 2)
        .attr("ry", 2)
        .attr("fill", "cyan")
        .attr("data-sat", satStr)
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide)
        .on("click", onClick);

      if (!firstRef.current) {
        firstRef.current = rect.node();
      }

      return { i, j }; // todo: this should be the last mined block, not the last block with inscriptions
    }, {}) as { i: number; j: number };

    // draw a rect from last block to the end of the svg
    if (last && last.i < Number(w) - 1) {
      svg
        .append("rect")
        .attr("x", (last.i + 1) * size)
        .attr("y", last.j * size)
        .attr("height", size - 1)
        .attr("width", (Number(w) - last.i - 1) * size)
        .attr("rx", 2)
        .attr("ry", 2)
        .attr("fill", "black")
        .attr("fill-opacity", 0.7);
    }

    // draw a rect from the line after the last block to the end of the svg
    if (last && last.j < Number(h) - 1) {
      svg
        .append("rect")
        .attr("x", 0)
        .attr("y", (last.j + 1) * size)
        .attr("height", (Number(h) - last.j - 1) * size)
        .attr("width", Number(w) * size)
        .attr("rx", 2)
        .attr("ry", 2)
        .attr("fill", "black")
        .attr("fill-opacity", 0.7);
    }
  }, [sats, width, w, h]);

  return (
    <>
      <div className="tools">
        <button onClick={() => firstRef.current?.scrollIntoView()}>
          Jump to Sat &rarr;
        </button>
      </div>
      <div
        className="pattern"
        style={{ width: Number(w) * size, height: Number(h) }}
      >
        <svg ref={svgRef} />
      </div>
    </>
  );
}

export default SatsGrid;
