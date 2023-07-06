import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { cn } from "../lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./Collapsible";

const RangeFilter = ({
  name,
  onApply,
  start,
  end,
  defaultOpen = false,
  className,
}: {
  name: string;
  onApply: (start: string | null, end: string | null) => void;
  start: string | null;
  end: string | null;
  defaultOpen?: boolean;
  className?: string;
}) => {
  const [currentStart, setCurrentStart] = useState(start);
  const [currentEnd, setCurrentEnd] = useState(end);

  const isAppliable = start !== currentStart || end !== currentEnd;

  return (
    <div className={className}>
      <Collapsible defaultOpen={defaultOpen}>
        <CollapsibleTrigger className="flex w-full justify-between">
          <div className="uppercase text-neutral-300">{name}</div>
          {/* todo: better/thinner ChevronDown icon alternative */}
          <ChevronDown size={16} className="text-neutral-300" />
          {/* todo: rotate on expand */}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mb-6 mt-4">
            <div className="flex items-center justify-between space-x-2">
              {/* todo: hidden labels for accessibility with name prefix */}
              <input
                type="number"
                min="0"
                placeholder="0"
                defaultValue={start ?? ""}
                className="w-[90px] rounded-[4px] border px-1.5 py-1"
                onChange={(e) => setCurrentStart(e.target.value)}
              />
              <p className="uppercase">to</p>
              <input
                type="number"
                min="0"
                placeholder="..."
                defaultValue={end ?? ""}
                className="w-[90px] rounded-[4px] border px-1.5 py-1"
                onChange={(e) => setCurrentEnd(e.target.value)}
              />
            </div>
            <button
              className={cn(
                "mt-4 block w-full rounded-[4px] border px-4 py-2 uppercase text-neutral-600",
                isAppliable && "text-orange"
              )}
              onClick={() => onApply(currentStart, currentEnd)}
            >
              {/* todo: apply button color state, hover, etc. */}
              Apply
            </button>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default RangeFilter;
