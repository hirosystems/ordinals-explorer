"use client";

import { motion } from "framer-motion";
import { Children } from "react";

const Marquee = ({ children }: { children: React.ReactNode }) => {
  const arrayChildren = Children.toArray(children);
  return (
    <div className="relative flex h-full w-[200%] overflow-hidden">
      {/* render first child to get height */}
      <div className="opacity-0">{arrayChildren[0]}</div>
      <motion.div
        className="absolute flex h-full w-[200%] justify-around"
        animate={{
          left: ["0%", "-100%"],
          transition: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 200,
            ease: "linear",
          },
        }}
      >
        {arrayChildren.map((child, index) => (
          <div key={index}>{child}</div>
        ))}
        {arrayChildren.map((child, index) => (
          <div key={index}>{child}</div>
        ))}
      </motion.div>
      <div className="absolute bottom-0 left-0 top-0 w-20 bg-gradient-to-r from-white to-transparent" />
      <div className="absolute bottom-0 right-0 top-0 w-20 bg-gradient-to-l from-white to-transparent" />
    </div>
  );
};

export default Marquee;
