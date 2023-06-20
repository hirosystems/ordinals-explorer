"use client";
import useSWR from "swr";

import InscriptionRender from "../../../../components/inscriptions/InscriptionRender";
import { API_URL } from "../../../../lib/constants";
import { InscriptionResponse } from "../../../../lib/types";
import { fetcher } from "../../../../lib/utils";
import { useSearchParams } from "next/navigation";

const OgImagePage = ({ params }: { params: { iid: string } }) => {
  const { data, error, isLoading } = useSWR<
    | InscriptionResponse
    | {
        // todo: add more generic api error response type
        error: string;
        message: string;
        statusCode: number;
      }
  >(`${API_URL}/inscriptions/${params.iid}`, fetcher);

  const searchParams = useSearchParams();
  const width = searchParams.get("w") ?? 1200;
  const height = searchParams.get("h") ?? 630;

  if (!data || error || isLoading || "error" in data) {
    // todo: add loading state
    return <div>loading...</div>;
  }

  return (
    <div
      className="flex flex-col justify-around space-y-[16px] overflow-hidden p-[72px]"
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <div className="mt-[20px] flex">
        <div className="flex aspect-square h-[390px] rounded-md border-2 p-[30px]">
          <InscriptionRender
            inscription={data}
            className="h-full w-full overflow-hidden rounded-[4px]"
          />
        </div>
        <div className="ml-[54px] flex flex-col space-y-[40px]">
          <h2 className="mt-[28px] text-4xl uppercase text-neutral-300">
            Inscription
          </h2>
          <span className="text-7xl text-black">#{data.number}</span>
          {/* todo: add table to be more correct */}
          <div className="flex space-x-[64px] text-3xl uppercase">
            <div className="flex flex-col space-y-[32px] ">
              <span>Type</span>
              <span>Id</span>
            </div>
            <div className="flex flex-col space-y-[32px] font-['Aeonik_Mono'] ">
              <span>{data.mime_type}</span>
              <span className="tracking-wide">
                {data.id.slice(0, 8)}&hellip;{data.id.slice(-8)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <p className="self-end font-['Aeonik_Fono'] text-3xl text-neutral-300">
          ordinals.hiro.so
        </p>
        <img src="/hiro-dark.svg" className="w-[62px]" />
      </div>
    </div>
  );
};

export default OgImagePage;
