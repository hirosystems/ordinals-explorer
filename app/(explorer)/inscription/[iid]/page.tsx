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
  const inscription = await getInscription(params.iid);

  const title = `Inscription #${inscription.number} | ordinals.hiro.so`;
  const description = "Explore Ordinals inscriptions.";

  return {
    title,
    description,
    twitter: {
      card: "summary_large_image",
      creator: "@hirosystems",
      title,
      description,
      images: [
        `https://ordinals-ogimage.vercel.app/api/ogimage/${params.iid}?h=600`,
      ],
    },
    openGraph: {
      title,
      description,
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
