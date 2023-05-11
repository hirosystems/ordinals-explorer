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
    <div className="flex flex-col justify-center p-2">
      <h2 className="text-center text-xl px-2 py-3">Transfer History</h2>
      <div className="border p-4 rounded-lg">
        <div className="space-y-3">
          {data.results.reverse().map((transfer, i) => (
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

  const isGenesis = params.i === 0;

  return (
    <div className="flex flex-row">
      <div className="flex items-center text-sm w-16">
        #{params.transfer.block_height}
      </div>
      <div className="">
        <div className="relative group rounded-[6px] max-w-md overflow-hidden">
          <div
            className={`${styles.gradient} group-hover:filter-none absolute inset-0 w-full h-full transition-[filter] duration-350 z-0`}
            style={{
              background: `linear-gradient(${degree}deg, rgba(${startR}, ${startG}, ${startB}, ${startOpacity}), rgba(${endR}, ${endG}, ${endB}, ${endOpacity})), url('/noise.png')`,
              backgroundBlendMode: "multiply",
            }}
          />
          <div className="relative flex flex-row px-1.5 py-0.5 z-10">
            <span className="text-white overflow-hidden overflow-ellipsis">
              {params.transfer.address}
            </span>
            {isGenesis && (
              // show genesis star on first element
              <div className="flex items-center">
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="relative w-4 h-4 bg-[rgba(242,240,237,.65)] rounded border border-white mr-[1px] z-20">
                        <div className="absolute w-full h-full">*</div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Inscription genesis</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
