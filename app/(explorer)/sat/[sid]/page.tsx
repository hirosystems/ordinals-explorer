"use client";

import SatDetails from "../../../../components/SatDetails";

const SatPage = ({ params }: { params: { sid: string } }) => {
  return (
    <main className="mx-auto w-full max-w-3xl flex-grow p-8 px-4">
      <SatDetails sid={params.sid} />
    </main>
  );
};

export default SatPage;
