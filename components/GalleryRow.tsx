"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import useSWR from "swr";
import { API_URL } from "../lib/constants";
import { InscriptionResponse, ListResponse } from "../lib/types";
import { fetcher } from "../lib/utils";
import InscriptionCard from "./inscriptions/InscriptionCard";

const GalleryRow = ({ query }: { query?: string[][] }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({
    container: rowRef,
  } as any); // todo: update framer motion, remove any

  const opacityLeft = useTransform(scrollXProgress, [0, 0.05, 1], [0, 1, 1]);
  const opacityRight = useTransform(scrollXProgress, [0, 0.95, 1], [1, 1, 0]);

  const params = new URLSearchParams(query);
  const { data, error, isLoading } = useSWR<ListResponse<InscriptionResponse>>(
    `${API_URL}/inscriptions?${params?.toString() ?? ""}`,
    fetcher
  );

  if (error) return <span>Something went wrong ʕ•̠͡•ʔ</span>;

  const previews = data ? data.results : Array(12).fill(null); // skeleton values

  return (
    <div className="relative">
      <div className="flex flex-row gap-4 overflow-scroll" ref={rowRef}>
        {previews.slice(0, 12).map((i, index) => (
          <div className="mb-3 shrink-0 grow-0 basis-1/5" key={index}>
            <InscriptionCard inscription={i} className="w-full" />
          </div>
        ))}
      </div>
      <motion.div
        style={{ opacity: opacityLeft }}
        className="absolute bottom-0 left-0 top-0 w-20 bg-gradient-to-l from-transparent to-white"
      />
      <motion.div
        style={{ opacity: opacityRight }}
        className="absolute bottom-0 right-0 top-0 w-20 bg-gradient-to-r from-transparent to-white"
      />
    </div>
  );
};

export default GalleryRow;
