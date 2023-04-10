"use client";

import useSWR from "swr";
import { API_URL } from "../lib/constants";
import { fetcher } from "../lib/helpers";
import { InscriptionResponse } from "../pages/api/ordinals/v1/inscriptions/[iid]";
import Loading from "./Loading";

const WithInscription = (iid: string, Content: React.ComponentType<any>) => {
  const { data, error, isLoading } = useSWR<InscriptionResponse>(
    `${API_URL}/inscriptions/${iid}`,
    fetcher
  );

  if (error) return <span>Something went wrong ʕ•̠͡•ʔ</span>;
  if (!data) return <Loading />;

  return <Content {...data} />;
};

export default WithInscription;
