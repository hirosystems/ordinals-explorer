import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { cn } from "../lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./Collapsible";

const TextFilter = ({
  name,
  onApply,
  text = "",
  placeholder,
  defaultOpen = false,
  className,
}: {
  name: string;
  onApply: (text: string) => void;
  text?: string;
  placeholder?: string;
  defaultOpen?: boolean;
  className?: string;
}) => {
  const [currentText, setCurrentText] = useState(text);
  const isAppliable = text !== currentText;

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
          <form
            className="mb-6 mt-4"
            onSubmit={(e) => {
              e.preventDefault();
              onApply(currentText);
            }}
          >
            <div className="flex items-center justify-between space-x-2">
              <input
                type="text"
                placeholder={placeholder}
                defaultValue={currentText ?? text}
                className="w-full rounded-[4px] border px-1.5 py-1"
                onChange={(e) => setCurrentText(e.target.value)}
                onSubmit={() => onApply(currentText)}
              />
            </div>
            <button
              type="submit"
              className={cn(
                "mt-4 block w-full rounded-[4px] border px-4 py-2 uppercase text-neutral-600",
                isAppliable && "text-orange"
              )}
            >
              {/* todo: apply button color state, hover, etc. */}
              Apply
            </button>
          </form>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default TextFilter;
