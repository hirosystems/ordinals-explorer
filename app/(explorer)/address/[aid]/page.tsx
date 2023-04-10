"use client";

import AddressDetails from "../../../../components/AddressDetails";
import Footer from "../../../../components/Footer";
import Header from "../../../../components/Header";

const LocationById = ({ params }: { params: { aid: string } }) => {
  return (
    <>
      <Header />
      <main className="p-8 flex-grow w-full max-w-5xl mx-auto">
        <AddressDetails aid={params.aid} />
      </main>
      <Footer />
    </>
  );
};

export default LocationById;
