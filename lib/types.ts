export type SatResponse = {
  coinbase_height: number;
  cycle: number;
  decimal: string;
  degree: string;
  inscription_id?: string;
  epoch: number;
  name: string;
  offset: number;
  percentile: string;
  period: number;
  rarity: string;
};

export type InscriptionResponse = {
  id: string;
  number: number;
  address: string;
  genesis_address: string;
  genesis_block_height: number;
  genesis_block_hash: string;
  genesis_tx_id: string;
  genesis_fee: string;
  genesis_timestamp: number;
  tx_id: string;
  location: string;
  output: string;
  offset: string;
  sat_ordinal: string;
  sat_rarity: string;
  sat_coinbase_height: number;
  mime_type: string;
  content_type: string;
  content_length: number;
  timestamp: number;
};

export type ListResponse<T> = {
  limit: number;
  offset: number;
  total: number;
  results: T[];
};
export type InscriptionTransferResponse = {
  block_height: number;
  block_hash: string;
  address: string;
  tx_id: string;
  location: string;
  output: string;
  value: string;
  offset: string;
  timestamp: number;
};
