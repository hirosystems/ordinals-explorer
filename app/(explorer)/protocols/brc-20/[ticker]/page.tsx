import Brc20Details from "../../../../../components/Brc20Details";

const Page = ({ params }: { params: { ticker: string } }) => {
  return (
    <main className="mx-auto w-full max-w-3xl flex-grow p-8 px-4">
      <Brc20Details ticker={params.ticker} />
    </main>
  );
};

export default Page;
