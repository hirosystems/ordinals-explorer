import Brc20Details from "../../../../../components/Brc20Details";
import Footer from "../../../../../components/Footer";
import Header from "../../../../../components/Header";

const Page = ({ params }: { params: { ticker: string } }) => {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-grow p-8 px-4">
        <Brc20Details ticker={params.ticker} />
      </main>
      <Footer />
    </>
  );
};

export default Page;
