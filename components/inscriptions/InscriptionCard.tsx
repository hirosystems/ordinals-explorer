import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "../../lib/utils";

import { InscriptionResponse } from "../../lib/types";
import InscriptionRender from "./InscriptionRender";

const InscriptionCard = ({
  inscription,
  light = false,
}: {
  inscription?: InscriptionResponse;
  light?: boolean;
}) => {
  if (!inscription?.id)
    return (
      // make the grid take up the maximal space, even when a grid item is empty
      // todo: double-check skeleton styles are the same as the real ones
      <div className="space-y-2 rounded-md border sm:p-2 md:space-y-3 md:p-3 lg:space-y-5 lg:p-5">
        <div className="aspect-square rounded-[4px]" />
        <div
          className={cn(
            "hidden rounded-[4px] px-1 text-sm opacity-0 sm:inline-block md:px-2 md:py-1",
            light && "border"
          )}
        >
          {/* placeholder */}
          #123
        </div>
      </div>
    );

  return (
    <Link
      href={`/inscription/${inscription.id}`}
      className="space-y-2 rounded-md border sm:p-2 md:space-y-3 md:p-3 lg:space-y-5 lg:p-5"
    >
      <div className="aspect-square w-full overflow-hidden rounded-[4px]">
        <InscriptionRender
          inscription={inscription}
          className="pointer-events-none sm:pointer-events-auto"
        />
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "hidden rounded-[4px] bg-black px-1 text-sm text-white sm:inline-block md:px-2 md:py-1",
          light && "border bg-white text-neutral-300"
        )}
      >
        #{inscription.number}
      </motion.div>
    </Link>
  );
};

export default InscriptionCard;
