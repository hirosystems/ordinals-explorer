const Brc20Table = () => {
  return (
    <div>
      <table className="w-full border-collapse rounded-t-[4px] border border-neutral-50">
        <thead className="w-full table-fixed">
          <tr>
            <th className="rounded-tl-[4px] bg-neutral-0 px-4 py-2 text-left text-sm font-normal uppercase">
              Date
            </th>
            <th className="bg-neutral-0 px-4 py-2 text-left text-sm font-normal uppercase">
              Transferred To
            </th>
            <th className="rounded-tr-[4px] bg-neutral-0 px-4 py-2 text-left text-sm font-normal uppercase">
              TxId
            </th>
            {/* todo: add loading dot component */}
            {/* {isLoading && (
                  <span className="absolute right-2 top-2">
                    <Loading />
                  </span>
                )} */}
          </tr>
        </thead>
        <tbody>
          {/* {data.results.map((transfer: InscriptionTransferResponse, i) => (
                <TransferRow
                  transfer={transfer}
                  isGenisis={isLastPage && i === data.results.length - 1}
                  previousAddress={data.results[i + 1]?.address}
                  key={transfer?.output ?? i}
                />
              ))} */}
        </tbody>
      </table>
    </div>
  );
};

export default Brc20Table;
