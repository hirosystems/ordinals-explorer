"use client";

import Brc20Homepage from "../../../../components/Brc20Homepage";

const Page = () => {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-stretch justify-between space-y-6 p-6">
      {/* todo: remove client component */}
      {typeof window !== "undefined" && <Brc20Homepage />}
    </main>
  );
};

export default Page;
