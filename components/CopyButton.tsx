"use client";

import { CopyIcon } from "@radix-ui/react-icons";
import { toast } from "react-hot-toast";

const CopyButton = (
  props:
    | {
        children: string;
      }
    | {
        children: React.ReactElement;
        text: string;
      }
) => {
  async function onClick() {
    try {
      await navigator.clipboard.writeText(
        "text" in props ? props.text : props.children
      );
      toast.success("Copied to clipboard");
    } catch (e) {
      toast.error("Failed to copy to clipboard");
    }
  }

  return (
    <>
      <div>{props.children}</div>
      <button
        className="ml-1 flex items-center justify-center rounded-[50%] p-2 text-neutral-500 opacity-0 transition-all hover:bg-neutral-0 hover:opacity-100 group-hover:bg-neutral-0 group-hover:opacity-100"
        onClick={onClick}
      >
        <CopyIcon />
      </button>
    </>
  );
};

export default CopyButton;
