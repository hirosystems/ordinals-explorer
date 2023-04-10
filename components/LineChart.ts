// @ts-nocheck
// todo: remove this no-check!

import * as d3 from "d3";

// Based on https://observablehq.com/@d3/line-with-tooltip
// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/line-with-tooltip
export function addLineChart(
  element,
  data,
  {
    x = ([x]) => x, // given d in data, returns the (temporal) x-value
    y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
    title, // given d in data, returns the title text
    defined, // for gaps in data
    curve = d3.curveLinear, // method of interpolation between points
    marginTop = 20, // top margin, in pixels
    marginRight = 30, // right margin, in pixels
    marginBottom = 30, // bottom margin, in pixels
    marginLeft = 50, // left margin, in pixels
    width = 640, // outer width, in pixels
    height = 360, // outer height, in pixels
    xType = d3.scaleLinear, // type of x-scale
    xDomain, // [xmin, xmax]
    xRange = [marginLeft, width - marginRight], // [left, right]
    yType = d3.scaleLinear, // type of y-scale
    yDomain, // [ymin, ymax]
    yRange = [height - marginBottom, marginTop], // [bottom, top]
    color = "currentColor", // stroke color of line
    strokeWidth = 1.5, // stroke width of line, in pixels
    strokeLinejoin = "round", // stroke line join of line
    strokeLinecap = "round", // stroke line cap of line
    yFormat, // a format specifier string for the y-axis
    yLabel, // a label for the y-axis
    fontFamily,
  } = {}
) {
  const container = d3.select(element);

  // Compute values.
  const X = d3.map(data, x);
  const Y = d3.map(data, y);
  const O = d3.map(data, (d) => d);
  const I = d3.map(data, (_, i) => i);

  // Compute which data points are considered defined.
  if (defined === undefined) defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i]);
  const D = d3.map(data, defined);

  // Compute default domains.
  if (xDomain === undefined) xDomain = d3.extent(X);
  if (yDomain === undefined) yDomain = [0, d3.max(Y)];

  // Construct scales and axes.
  const xScale = xType(xDomain, xRange);
  const yScale = yType(yDomain, yRange);
  const xAxis = d3
    .axisBottom(xScale)
    .ticks(width / 80)
    .tickSizeOuter(0);
  const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);

  // Compute titles.
  if (title === undefined) {
    const formatDate = xScale.tickFormat();
    const formatValue = yScale.tickFormat();
    title = (i) => `${formatDate(X[i])}\n${formatValue(Y[i])}`;
  } else {
    const O = d3.map(data, (d) => d);
    const T = title;
    title = (i) => T(O[i], i, data);
  }

  // Construct a line generator.
  const line = d3
    .line()
    .defined((i) => D[i])
    .curve(curve)
    .x((i) => xScale(X[i]))
    .y((i) => yScale(Y[i]));

  const svg = container
    .append("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("preserveAspectRatio", "xMinYMin meet")
    .style("-webkit-tap-highlight-color", "transparent")
    .on("pointerenter pointermove", pointermoved)
    .on("pointerleave", pointerleft)
    .on("touchstart", (event) => event.preventDefault());

  svg
    .append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(xAxis)
    .selectAll("text")
    .attr("font-family", fontFamily);

  const yA = svg
    .append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(yAxis);

  yA.selectAll("text").attr("font-family", fontFamily);

  yA.call((g) => g.select(".domain").remove())
    .call((g) =>
      g
        .selectAll(".tick line")
        .clone()
        .attr("x2", width - marginLeft - marginRight)
        .attr("stroke-opacity", 0.1)
    )
    .call((g) =>
      g
        .append("text")
        .attr("x", -marginLeft)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text(yLabel)
    );

  svg
    .append("path")
    .attr("fill", "none")
    .attr("stroke", color)
    .attr("stroke-width", strokeWidth)
    .attr("stroke-linejoin", strokeLinejoin)
    .attr("stroke-linecap", strokeLinecap)
    .attr("d", line(I));

  const tooltip = d3
    .select(element)
    .append("div")
    .style("display", "none")
    .style("position", "absolute")
    .style("pointer-events", "none")
    .classed("tip", true);

  function pointermoved(event) {
    const i = d3.bisectCenter(X, xScale.invert(d3.pointer(event)[0]));

    tooltip
      .style("display", null)
      .style("left", `${xScale(X[i])}px`)
      .style("top", `${yScale(Y[i]) - 24}px`)
      .html(() => `Block&nbsp;${X[i]}, Inscriptions&nbsp;${Y[i]}`);
  }

  function pointerleft() {
    tooltip.style("display", "none");
    svg.node().value = null;
    svg.dispatch("input", { bubbles: true });
  }

  return Object.assign(svg.node(), { value: null });
}
