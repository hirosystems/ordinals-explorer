"use client";

import Footer from "../../../../components/Footer";
import Header from "../../../../components/Header";
import SatDetails from "../../../../components/SatDetails";

const SatPage = ({ params }: { params: { sid: string } }) => {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-grow p-8 px-4">
        <SatDetails sid={params.sid} />
      </main>
      <Footer />
    </>
  );
};

export default SatPage;
