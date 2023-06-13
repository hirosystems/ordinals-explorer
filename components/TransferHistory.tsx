import { decodeBtcAddress } from "@stacks/stacking";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";
import ReactTimeAgo from "react-time-ago";
import useSWR from "swr";

import { API_URL } from "../lib/constants";
import {
  InscriptionResponse,
  InscriptionTransferResponse,
  ListResponse,
} from "../lib/types";
import { fetcher } from "../lib/utils";
import Loading from "./Loading";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./Tooltip";
import styles from "./TransferHistory.module.css";

TimeAgo.addDefaultLocale(en);

const TransferHistory = (params: { inscription: InscriptionResponse }) => {
  const { data, error, isLoading } = useSWR<
    | ListResponse<InscriptionTransferResponse>
    | {
        // todo: add more generic api error response type
        error: string;
        message: string;
        statusCode: number;
      }
  >(`${API_URL}/inscriptions/${params.inscription.id}/transfers`, fetcher);

  if (!params.inscription || !data) return <Loading />;
  if (error) return <span>Something went wrong ʕ•̠͡•ʔ</span>;
  if ("error" in data)
    return (
      <span>
        Something went wrong ʕ•̠͡•ʔ
        <br />
        {data.error}: {data.message}
      </span>
    );

  return (
    <div className="flex flex-col items-center p-2 text-center">
      <h2 className="my-4 text-center text-xl">Transfer History</h2>
      <div className="flex w-full max-w-2xl flex-col items-center space-y-4 rounded-lg border p-8">
        {data.results.map((transfer, i) => (
          <TransferRowItem
            key={transfer.tx_id}
            transfer={transfer}
            length={data.results.length}
            i={i}
          />
        ))}
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

  const isGenesis = params.i === params.length - 1;

  return (
    <div className="flex flex-col items-end">
      <div className="text-sm">
        <ReactTimeAgo date={params.transfer.timestamp} locale="en-US" />
      </div>
      <div className="flex">
        <div className="flex w-16 items-center text-sm">
          #{params.transfer.block_height}
        </div>
        <div className="group relative overflow-hidden rounded-[6px]">
          <div
            className={`${styles.gradient} duration-350 absolute inset-0 z-0 h-full w-full transition-[filter] group-hover:filter-none`}
            style={{
              background: `linear-gradient(${degree}deg, rgba(${startR}, ${startG}, ${startB}, ${startOpacity}), rgba(${endR}, ${endG}, ${endB}, ${endOpacity})), url('/noise.png')`,
              backgroundBlendMode: "multiply",
            }}
          />
          <div className="relative z-10 flex min-w-0 max-w-sm flex-row px-1.5 py-0.5">
            <span className="overflow-hidden overflow-ellipsis whitespace-nowrap text-white">
              {params.transfer.address}
            </span>
            {isGenesis && (
              // show genesis star on first element
              // todo: if genesis is last element, we can use relative/absolute positioning to make this easier (non-js)
              <div className="flex items-center">
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="relative z-20 mr-[1px] h-4 w-4 rounded border border-white bg-[rgba(242,240,237,.4)]">
                        <div className="absolute mt-[-3px] h-full w-full text-white">
                          *
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent variant="light">
                      Inscription genesis
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
