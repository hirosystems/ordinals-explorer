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
  async function onClick(e) {
    e.preventDefault();
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
    <span className="inline-flex items-center">
      {props.children}
      <motion.button
        className="ml-1 self-center rounded-[50%] bg-neutral-0 p-2 text-neutral-500 transition-opacity hover:opacity-100 group-hover:opacity-100 md:opacity-0"
        whileTap={{ backgroundColor: "#e4e0dc", color: "#000" }}
        onClick={onClick}
      >
        <CopyIcon />
      </motion.button>
    </span>
  );
};

export default CopyButton;
