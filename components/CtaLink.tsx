import Link from "next/link";
import { ReactNode } from "react";

import { cn } from "../lib/helpers";

const CtaLink = (props: {
  children: ReactNode;
  href: string;
  className?: string;
}) => {
  return (
    <Link
      href={props.href}
      className={cn(
        "cta-link px-[24px] py-[15px] text-white bg-neutral-500 border-2 border-black rounded-[4px]",
        props.className
      )}
    >
      {props.children}
    </Link>
  );
};

export default CtaLink;
