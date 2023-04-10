import { ChevronDown, HelpCircle } from "lucide-react";
import { cn } from "../lib/helpers";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./Collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./Tooltip";

const Filter = ({
  name,
  options,
  onClick,
  selected,
  defaultOpen = false,
  className,
}: {
  name: string;
  options: string[] | string[][];
  onClick: (v: string) => void;
  selected: Set<string>;
  defaultOpen?: boolean;
  className?: string;
}) => {
  return (
    <div className={className}>
      <Collapsible defaultOpen={defaultOpen}>
        <CollapsibleTrigger className="w-full flex justify-between">
          <div className="uppercase text-neutral-300">{name}</div>
          <ChevronDown size={16} className="text-neutral-300" />
          {/* todo: rotate on expand */}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-4 mb-6 space-y-3">
            {options.map((v, i) => {
              const [value, label] = typeof v === "string" ? [v, null] : v;
              return (
                <div className="flex justify-between" key={i}>
                  <button
                    className="block uppercase"
                    onClick={() => onClick(value)}
                  >
                    [
                    {selected.has(value) ? (
                      <span>⏺</span>
                    ) : (
                      <span className="opacity-0">⏺</span>
                    )}
                    ] {value}
                  </button>
                  {label && (
                    <TooltipProvider delayDuration={150}>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle size={14} className="text-neutral-300" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{label}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              );
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default Filter;
