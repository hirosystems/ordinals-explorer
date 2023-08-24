"use client";

import BlockDetails from "../../../../components/BlockDetails";

const BlockById = ({ params }: { params: { bid: string } }) => {
  return (
    <main className="mx-auto w-full max-w-5xl flex-grow p-8">
      <BlockDetails bid={params.bid} />
    </main>
  );
};

export default BlockById;
