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

  if (!params.iid) return {};

  const inscription = await getInscription(params.iid);

  if (!inscription.content_type) return {};

  if (!inscription.content_type.toLowerCase().startsWith("image")) return {};

  if (inscription.content_type.toLowerCase().includes("image/webp")) return {};

  return {
    openGraph: {
      // todo: add inscription number, override title, etc.
      images: [
        {
          url: `/api/og/inscriptions?id=${params.iid}`,
          width: 1200,
          height: 600,
        },
      ],
    },
  };
}

const InscriptionById = ({ params }: { params: { iid: string } }) => {
  return (
    <>
      <Header />
      <main className="p-8 flex-grow w-full max-w-7xl mx-auto">
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
