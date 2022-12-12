export const executeMethodParams = {
    add_plan: ["name", "price"],
    add_referral: ["referrer"],
    pay_referral: ["plan_name"],
    buy_tokens: ["amount_to_buy"],
    increase_allowance: ["spender", "amount"],
  };
  
  export const queryMethodParams = {
    get_referral_info: ["address"],
    get_all_referral_datas: [],
    plan_detail: ["name"],
    get_all_plans: [],
    get_level_detail: ["address", "level_count"],
    get_payment_status: ["address"],
    allowance: ["owner", "spender"],
    balance: ["address"],
  };
  
  export const executeMethodTypes = ["add_plan", "add_referral", "pay_referral", "buy_tokens", "increase_allowance"];
  export const queryMethodTypes = ["get_referral_info", "get_all_referral_datas", "plan_detail", "get_all_plans", "get_level_detail", "get_payment_status", "allowance", "balance"];
  
  export const ERROR = {
    EXECUTE_METHOD_TYPE_NOT_FOUND: "Please provide the valid method type: `add_plan`, `add_referral`, `pay_referral`, `buy_tokens`, `increase_allowance`",
    QUERY_METHOD_TYPE_NOT_FOUND: "Please provide the valid method type: `get_referral_info`, `get_all_referral_datas`, `plan_detail`, `get_all_plans`, `get_level_detail`, `get_payment_status`, `allowance`, `balance`",
    CONTRACT_ADDRESS_NOT_FOUND: "Contract address is required for initiating transaction",
    SENDER_NOT_FOUND: "Sender address is required for signing the transaction",
    INSUFFICIENT_PARAMS: "Insufficient params, please provide required params to initiate",
    CONFIG: {
      NOT_FOUND: "Required param `config` not found",
      CHAIN_ID_NOT_FOUND: "Config property must have `chain_id` for signing client",
      RPCENDPOINT_NOT_FOUND: "Config property must have `rpcEndPoint`",
      GASPRICE_NOT_FOUND: "Config property must have `gasPrice` for signing client",
      MICRODENOM_NOT_FOUND: "Config property must have `microDenom` for signing client",
    },
    KEPLR: {
      NOT_FOUND: "Please install keplr extension",
    },
    SEND_TOKENS: {
      RECIPIENT_NOT_FOUND: "Recipient is required for sending tokens",
      AMOUNT_NOT_FOUND: "Amount is required for sending tokens",
    },
    DEPLOY: {
      WASMCODE_NOT_FOUND: "WasmCode is required for uploading the contract",
      INSTANTIATE_MSG_NOT_FOUND: "InstantiateMsg is required for deploying the contract",
      LABEL_NOT_FOUND: "Label is required on all contracts",
    }
  }
  
  export const ERROR_MESSAGES = {
    SHOULD: "method should have",
    FIELD: "field in",
    HAS_NO_VALUE: "has no value",
    NO_PARAMETERS: "No parameters needed for",
    HAS_NO_FIELD: "has no field called",
    MISSING: "Missing",
    EXECUTING: "property while executing the contract",
    QUERYING: "property while querying the contract"
  }
  
  export const REQ_TYPES = {
    EXECUTE: "execute",
    QUERY: "query"
  }
  
  export const GET_ALL_REFERRAL = "get_all_referral_datas"
  export const GET_ALL_PLANS = "get_all_plans"