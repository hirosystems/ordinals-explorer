import { Metadata } from "next";
import Footer from "../../../../components/Footer";
import Header from "../../../../components/Header";
import InscriptionDetails from "../../../../components/inscriptions/InscriptionDetails";

import { API_URL } from "../../../../lib/constants";
import { InscriptionResponse } from "../../../../lib/types";

export async function generateMetadata({
  params,
}: {
  params: { iid: string };
}) {
  // todo: add other metadata information
  return {
    openGraph: {
      // todo: add inscription number, override title, etc.
      images: [
        {
          url: `https://ordinals-ogimage.vercel.app/api/ogimage/${params.iid}`,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

const InscriptionById = ({ params }: { params: { iid: string } }) => {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-grow p-8">
        <InscriptionDetails iid={params.iid} />
      </main>
      <Footer />
    </>
  );
};

export default InscriptionById;

async function getInscription(iid: string): Promise<InscriptionResponse> {
  const response = await fetch(`${API_URL}/inscriptions/${iid.toLowerCase()}`);
  return await response.json();
}
