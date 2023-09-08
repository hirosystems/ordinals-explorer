"use client";

import AddressDetails from "../../../../components/AddressDetails";

const LocationById = ({ params }: { params: { aid: string } }) => {
  return (
    <main className="mx-auto w-full max-w-5xl flex-grow p-8">
      <AddressDetails aid={params.aid} />
    </main>
  );
};

export default LocationById;
