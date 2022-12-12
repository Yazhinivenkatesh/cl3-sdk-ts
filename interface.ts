import { Coin, logs } from "@cosmjs/stargate";

export interface Config {
  chainId: string;
  rpcEndpoint: string;
  gasPrice: string;
  microDenom: string;
}

export interface DeployParams {
  sender: string;
  wasmCode: Uint8Array;
  instantiateMsg: Record<string, unknown>;
  label: string;
  memo?: string;
  instantiateOptions?: InstantiateOptions;
}

export interface SendTokenParams {
  sender: string,
  recipient: string,
  amount: Coin,
  memo?: string
}

export interface ExecuteMsg {
    add_plan?: {
      name: string;
      price: number;
    };
    add_referral?: {
      referrer: string;
    };
    pay_referral?: {
      plan_name: string;
    };
    buy_tokens?: {
      amount_to_buy: string;
    };
    increase_allowance?: {
      spender: string;
      amount: number;
    };
}

export interface QueryMsg {
    get_referral_info?: {
      address: string;
    };
    get_all_referral_datas?: {};
    plan_detail?: {
      name: string;
    };
    get_all_plans?: {};
    get_level_detail?: {
      address: string;
      level_count: number;
    };
    get_payment_status?: {
      address: string;
    };
    allowance?: {
      owner: string;
      spender: string;
    };
    balance?: {
      address: string;
    };
}

export interface ExecuteParams {
  methodType: string,
  sender: string,
  contractAddress: string,
  params: ExecuteMsg,
  memo?: string | undefined
}

export interface QueryParams {
  methodType: string,
  contractAddress: string,
  params: QueryMsg
}

export interface ExecuteResult {
    readonly logs: readonly logs.Log[];
    readonly height: number;
    readonly transactionHash: string;
    readonly gasWanted: number;
    readonly gasUsed: number;
}

export interface InstantiateResult {
  readonly contractAddress: string;
  readonly logs: readonly logs.Log[];
  readonly height: number;
  readonly transactionHash: string;
  readonly gasWanted: number;
  readonly gasUsed: number;
}

export interface InstantiateOptions {
    readonly memo?: string;
    readonly funds?: readonly Coin[];
    readonly admin?: string;
}
