import Link from "next/link";
import { ReactNode } from "react";

import { cn } from "../lib/utils";

const CtaLink = (props: {
  children: ReactNode;
  href: string;
  className?: string;
}) => {
  return (
    <Link
      href={props.href}
      className={cn(
        "cta-link rounded-[4px] border-2 border-black bg-neutral-500 px-[24px] py-[15px] text-white",
        props.className
      )}
    >
      {props.children}
    </Link>
  );
};

export default CtaLink;
