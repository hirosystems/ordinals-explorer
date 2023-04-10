"use client";

import BlockDetails from "../../../../components/BlockDetails";
import Footer from "../../../../components/Footer";
import Header from "../../../../components/Header";

const BlockById = ({ params }: { params: { bid: string } }) => {
  return (
    <>
      <Header />
      <main className="p-8 flex-grow w-full max-w-5xl mx-auto">
        <BlockDetails bid={params.bid} />
      </main>
      <Footer />
    </>
  );
};

export default BlockById;
