"use client";

import Brc20Homepage from "../../../../components/Brc20Homepage";
import Footer from "../../../../components/Footer";
import Header from "../../../../components/Header";

const Page = () => {
  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-stretch justify-between space-y-6 p-6">
        <Brc20Homepage />
      </main>
      <Footer />
    </>
  );
};

export default Page;
