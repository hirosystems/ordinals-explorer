"use client";

import Link from "next/link";
import "./Sats.css";

function SatsList({
  block,
  width,
  sats,
}: {
  block: number;
  width: number;
  sats: string[];
}) {
  return (
    <ul className="p-6 list-disc">
      {sats.map((sat) => (
        <li key={sat}>
          <Link
            href={`/sat/${sat}`}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            Sat #{sat}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default SatsList;
