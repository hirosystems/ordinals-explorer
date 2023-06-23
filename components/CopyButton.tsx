"use client";

import { CopyIcon } from "@radix-ui/react-icons";
import { motion } from "framer-motion";
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
    // todo: add tooltip
    <span className="inline-flex items-center">
      {props.children}
      <motion.button
        className="ml-1 self-center rounded-[50%] bg-transparent p-2 text-neutral-500 transition-[color,background-color,opacity] hover:bg-neutral-0 group-hover:opacity-100 md:hover:opacity-100 md:hover:bg-neutral-0 xl:opacity-0"
        whileTap={{
          scale: 0.8,
        }}
        onClick={onClick}
        title="Copy to clipboard"
      >
        <CopyIcon />
      </motion.button>
    </span>
  );
};

export default CopyButton;
