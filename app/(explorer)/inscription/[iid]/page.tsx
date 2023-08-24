import InscriptionDetails from "../../../../components/inscriptions/InscriptionDetails";
import { API_URL } from "../../../../lib/constants";
import { InscriptionResponse } from "../../../../lib/types";

export async function generateMetadata({
  params,
}: {
  params: { iid: string };
}) {
  const inscription = await getInscription(params.iid);
  const titleAbsolute = `Inscription #${inscription.number} | Hiro Ordinals Explorer`;

  return {
    title: { absolute: titleAbsolute },
    twitter: {
      card: "summary_large_image",
      creator: "@hirosystems",
      title: titleAbsolute,
      images: [
        `https://ordinals-ogimage.vercel.app/api/ogimage/${params.iid}?h=600`,
      ],
    },
    openGraph: {
      title: titleAbsolute,
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
    <main className="mx-auto w-full max-w-7xl flex-grow p-8">
      <InscriptionDetails iid={params.iid} />
    </main>
  );
};

export default InscriptionById;

async function getInscription(iid: string): Promise<InscriptionResponse> {
  const response = await fetch(`${API_URL}/inscriptions/${iid.toLowerCase()}`);
  return await response.json();
}
