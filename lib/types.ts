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

export type PeriodResponse = [string, number][];

export type BlockResponse = string[];

// todo: split into multiple responses
export type HomepageResponse = {
  periods: { [key: string]: number };
  graph: [number, number][];
  graphCumulative: [number, number][];
};

export type Brc20TokenResponse = {
  id: string;
  number: number;
  block_height: number;
  tx_id: string;
  address: string;
  ticker: string;
  max_supply: string;
  mint_limit: string;
  decimals: number;
  minted_supply: string;
  deploy_timestamp: number;
};

export type Brc20TokenDetailsResponse = {
  token: Brc20TokenResponse;
  supply: {
    max_supply: string;
    minted_supply: string;
    holders: number;
  };
};

export type Brc20HolderResponse = {
  address: string;
  overall_balance: string;
};
