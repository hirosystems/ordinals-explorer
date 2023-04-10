"use client";

import Footer from "../../../../components/Footer";
import Header from "../../../../components/Header";
import SatDetails from "../../../../components/SatDetails";

const SatPage = ({ params }: { params: { sid: string } }) => {
  return (
    <>
      <Header />
      <main className="p-8 flex-grow w-full max-w-5xl mx-auto">
        <SatDetails sid={params.sid} />
      </main>
      <Footer />
    </>
  );
};

export default SatPage;
