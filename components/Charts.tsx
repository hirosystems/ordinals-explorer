"use client";

import * as d3 from "d3";
import { useEffect, useRef } from "react";

import localFont from "next/font/local";
import { addLineChart } from "./LineChart";

// todo: aeonik font?
const inter = localFont({ src: "../assets/Inter.ttf", display: "swap" });

// todo: remove ts-ignores
const Charts = ({
  data,
  dataCumulative,
}: {
  data: [number, number][];
  dataCumulative: [number, number][];
}) => {
  const graphRef = useRef(null);
  const graphCumulativeRef = useRef(null);

  let didInit = false;
  useEffect(() => {
    if (didInit || !graphRef.current || !graphCumulativeRef.current) return;
    didInit = true;
    // @ts-ignore
    addLineChart(graphRef.current, data, {
      color: "#C2EBC4",
      curve: d3.curveBasis,
      strokeWidth: 2,
      yType: d3.scaleSqrt,
      fontFamily: inter.style.fontFamily,
    });
    // @ts-ignore
    addLineChart(graphCumulativeRef.current, dataCumulative, {
      color: "#B3D9FF",
      curve: d3.curveBasis,
      strokeWidth: 2,
      yType: d3.scaleSqrt,
      fontFamily: inter.style.fontFamily,
    });
  }, []);

  return (
    <div className="text-center">
      <h3 className="mt-8 text-lg">Number of Inscriptions by Block Height</h3>
      <p className="text-neutral-400">
        The number of new inscribed sats per block by block height
      </p>
      <div className="my-2 relative aspect-video" ref={graphRef}></div>
      <h3 className="mt-12 text-lg">Total Number Inscriptions over Time</h3>
      <p className="text-neutral-400">
        The cumulative number of inscribed sats by block height
      </p>
      <div
        className="my-8 relative aspect-video"
        ref={graphCumulativeRef}
      ></div>
    </div>
  );
};

export default Charts;
