import { Metadata } from "next";
import Brc20Homepage from "../../../../components/Brc20Homepage";

export const metadata: Metadata = {
  title: "BRC-20 Explorer",
  description:
    "Discover the world of BRC-20 tokens on top of Ordinal Inscriptions with the Hiro Ordinals Explorer. Dive deep into this unique universe of digital assets inscribed on satoshis, the smallest unit of Bitcoin.",
};

const Page = () => {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-stretch justify-between space-y-6 p-6">
      <Brc20Homepage />
    </main>
  );
};

export default Page;
