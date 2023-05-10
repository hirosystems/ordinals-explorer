import { decodeBtcAddress } from "@stacks/stacking";
import useSWR from "swr";

import styles from "./TransferHistory.module.css";
import { API_URL } from "../lib/constants";
import { fetcher } from "../lib/helpers";
import { InscriptionTransferResponse, ListResponse } from "../lib/types";
import Loading from "./Loading";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./Tooltip";

const TransferHistory = (params: { iid: string }) => {
  const { data, error, isLoading } = useSWR<
    | ListResponse<InscriptionTransferResponse>
    | {
        // todo: add more generic api error response type
        error: string;
        message: string;
        statusCode: number;
      }
  >(`${API_URL}/inscriptions/${params.iid}/transfers`, fetcher);

  if (!params.iid) return <div>404</div>;

  if (error) return <span>Something went wrong ʕ•̠͡•ʔ</span>;
  if (!data) return <Loading />;
  if ("error" in data)
    return (
      <span>
        Something went wrong ʕ•̠͡•ʔ
        <br />
        {data.error}: {data.message}
      </span>
    );

  return (
    <div className="p-2">
      <h2 className="text-xl px-2 py-3">Transfer History</h2>
      <div className="border p-4 rounded-lg">
        <div className="flex flex-row flex-wrap">
          {data.results.map((transfer, i) => (
            <TransferRowItem
              transfer={transfer}
              length={data.results.length}
              i={i}
              key={i}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TransferHistory;

function TransferRowItem(params: {
  transfer: InscriptionTransferResponse;
  i: number;
  length: number;
}) {
  const { data: bytes } = decodeBtcAddress(params.transfer.address);

  const [startR, startG, startB] = bytes.slice(0, 6);
  const [endR, endG, endB] = bytes.slice(6, 12);

  const startOpacity = Math.round(((bytes.at(-1) ?? 127) / 255) * 100);
  const endOpacity = Math.round(((bytes.at(-2) ?? 127) / 255) * 100);

  const degree = Math.round(((bytes.at(-3) ?? 127) / 255) * 180);

  return (
    <div className="">
      <div className="relative text-sm">
        {params.i < params.length - 1 && (
          // show line on all but last element
          <div className="absolute inset-x-0 top-[50%] border-b border-b-neutral-200 border-dotted ml-2" />
        )}
        <span className="ml-2 relative bg-white">
          #{params.transfer.block_height}
        </span>
      </div>
      <div className=" mx-2 mb-2 bg-neutral-50 rounded-[6px]  w-24 h-24 overflow-hidden">
        {params.i === 0 && (
          // show genesis star on first element
          <div className="flex justify-center items-center absolute inset w-4 h-4 bg-[rgba(242,240,237,.65)] rounded border border-white m-1 z-10">
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger className="w-full">
                  <div className="mt-[3px]">*</div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Inscription genesis</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
        <div className="flex w-full h-full items-end relative">
          <div
            // todo: try group-hover
            className={`${styles.gradient} w-full h-full absolute inset-0 transition-[filter] duration-350`}
            style={{
              background: `linear-gradient(${degree}deg, rgba(${startR}, ${startG}, ${startB}, ${startOpacity}), rgba(${endR}, ${endG}, ${endB}, ${endOpacity})), url('/noise.png')`,
              backgroundBlendMode: "multiply",
            }}
          />
          <div className="overflow-hidden overflow-ellipsis m-0.5 pl-1 rounded-[4.5px] text-white bg-neutral-600 z-10">
            {params.transfer.address}
          </div>
        </div>
      </div>
    </div>
  );
}
