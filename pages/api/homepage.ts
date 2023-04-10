import { sum } from "lodash";
import type { NextApiRequest, NextApiResponse } from "next";

import dataPeriods from "../../data/data-cycles-blocks.json";
import dataGraphCumulative from "../../data/data-graph-cumulative.json";
import dataGraph from "../../data/data-graph.json";

export type HomepageResponse = {
  periods: { [key: string]: number };
  graph: [number, number][];
  graphCumulative: [number, number][];
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<HomepageResponse>
) {
  // count inscribed blocks per period
  const inscriptionsPerPeriod = Object.entries(dataPeriods).map(
    ([key, value]) => {
      return [key, sum(Object.entries(value).map(([_, v]) => v))];
    }
  );

  res.status(200).json({
    periods: Object.fromEntries(inscriptionsPerPeriod),
    graph: dataGraph as [number, number][],
    graphCumulative: dataGraphCumulative as [number, number][],
  });
}
