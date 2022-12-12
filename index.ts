import {
    CosmWasmClient,
    JsonObject,
    SigningCosmWasmClient,
  } from "@cosmjs/cosmwasm-stargate";
  import { DeliverTxResponse, GasPrice, StdFee } from "@cosmjs/stargate";
  import {
    Config,
    ExecuteMsg,
    QueryMsg,
    ExecuteResult,
    DeployParams,
    SendTokenParams,
    InstantiateResult,
    ExecuteParams,
    QueryParams
  } from "./interface";
  import { executeMethodParams, queryMethodParams, executeMethodTypes, queryMethodTypes, ERROR, ERROR_MESSAGES, GET_ALL_PLANS, GET_ALL_REFERRAL, REQ_TYPES } from "./constants";
  export class MlmSdk {
    private queryingClient!: CosmWasmClient;
    private signingClient!: SigningCosmWasmClient;
  
    public config: Config;
    public stdFee: StdFee | "auto" | number;
  
    constructor(config: Config, stdFee: StdFee | "auto" | number) {
      this.config = config;
      this.stdFee = stdFee;
    }
  
    throwError = (message: string) => {
      throw new Error(message);
    };
  
    getQueryClient = async (): Promise<CosmWasmClient> => {
      !this.config && this.throwError(ERROR.CONFIG.NOT_FOUND);
      const { rpcEndpoint } = this.config;
      !rpcEndpoint && this.throwError(ERROR.CONFIG.RPCENDPOINT_NOT_FOUND);
      this.queryingClient = await CosmWasmClient.connect(rpcEndpoint);
      return this.queryingClient;
    };
  
    getSigningClient = async (): Promise<SigningCosmWasmClient> => {
      !this.config && this.throwError(ERROR.CONFIG.NOT_FOUND);
      const { chainId, rpcEndpoint, gasPrice, microDenom } = this.config;
  
      !chainId && this.throwError(ERROR.CONFIG.CHAIN_ID_NOT_FOUND);
      !rpcEndpoint && this.throwError(ERROR.CONFIG.RPCENDPOINT_NOT_FOUND);
      !gasPrice && this.throwError(ERROR.CONFIG.GASPRICE_NOT_FOUND);
      !microDenom && this.throwError(ERROR.CONFIG.MICRODENOM_NOT_FOUND);

  
      (!window["getOfflineSigner"] || !window["keplr"]) && this.throwError(ERROR.KEPLR.NOT_FOUND);
  
      await window["keplr"].enable(chainId);
      const signer = window["getOfflineSigner"](chainId);
      this.signingClient = await SigningCosmWasmClient.connectWithSigner(
        rpcEndpoint,
        signer,
        {
          gasPrice: GasPrice.fromString(`${gasPrice}${microDenom}`),
        }
      );
      return this.signingClient;
    };
  
    validate = (
      params: ExecuteMsg | QueryMsg,
      methodType: string,
      requestType: string
    ) => {
      const userParams = Object.keys(
        params[methodType] ? params[methodType] : {}
      );
  
      if (
        methodType === GET_ALL_REFERRAL ||
        methodType === GET_ALL_PLANS
      ) {
        if (userParams.length > 0) {
          this.throwError(`${ERROR_MESSAGES.NO_PARAMETERS} ${methodType}`);
        }
      }
  
      const validateParams =
        requestType === REQ_TYPES.EXECUTE ? executeMethodParams : queryMethodParams;
  
      validateParams[methodType].forEach((param: string) => {
        if (!userParams.includes(param)) {
          this.throwError(`${methodType} ${ERROR_MESSAGES.SHOULD} ${param}`);
        }
      });
  
      userParams.forEach((i) => {
        if (validateParams[methodType].includes(i)) {
          if (!params[methodType][i]) {
            this.throwError(`${i} ${ERROR_MESSAGES.FIELD} ${methodType} ${ERROR_MESSAGES.HAS_NO_VALUE}`);
          }
        } else {
          this.throwError(`${methodType} ${ERROR_MESSAGES.HAS_NO_FIELD} ${i}`);
        }
      });
    };
  
    deploy = async (deployParams: DeployParams): Promise<InstantiateResult> => {
      try {
        !deployParams && this.throwError(ERROR.INSUFFICIENT_PARAMS);
        const {
          sender,
          wasmCode,
          instantiateMsg,
          label,
          memo,
          instantiateOptions,
        } = deployParams;
  
        !sender && this.throwError(ERROR.SENDER_NOT_FOUND);
        !wasmCode && this.throwError(ERROR.DEPLOY.WASMCODE_NOT_FOUND);
        !instantiateMsg && this.throwError(ERROR.DEPLOY.INSTANTIATE_MSG_NOT_FOUND);
        !label && this.throwError(ERROR.DEPLOY.LABEL_NOT_FOUND);
  
        const client = await this.getSigningClient();
        const { codeId } = await client.upload(
          sender,
          wasmCode,
          this.stdFee,
          memo
        );
        return client.instantiate(
          sender,
          codeId,
          instantiateMsg,
          label,
          this.stdFee,
          instantiateOptions
        );
      } catch (e) {
        throw e;
      }
    };
  
    executeMethod = async (executeParams: ExecuteParams): Promise<ExecuteResult> => {
      try {
        !executeParams && this.throwError(ERROR.INSUFFICIENT_PARAMS);
        const {methodType, sender, contractAddress, params, memo} = executeParams;
  
        (!methodType || !executeMethodTypes.includes(methodType)) && this.throwError(ERROR.EXECUTE_METHOD_TYPE_NOT_FOUND);
        !sender && this.throwError(ERROR.SENDER_NOT_FOUND);
        !contractAddress && this.throwError(ERROR.CONTRACT_ADDRESS_NOT_FOUND);
        !params && this.throwError(ERROR.INSUFFICIENT_PARAMS);
      
        if (!params[methodType]) {
          this.throwError(`${ERROR_MESSAGES.MISSING} ${methodType} ${ERROR_MESSAGES.EXECUTING}`);
        }
  
        this.validate(params, methodType, REQ_TYPES.EXECUTE);
  
        const client = await this.getSigningClient();
        return client.execute(
          sender,
          contractAddress,
          { ...params },
          this.stdFee,
          memo
        );
      } catch (e) {
        throw e;
      }
    };
  
    queryMethod = async (queryParams: QueryParams): Promise<JsonObject> => {
      try {
        !queryParams && this.throwError(ERROR.INSUFFICIENT_PARAMS);
        const {methodType, contractAddress, params} = queryParams;
  
        (!methodType || !queryMethodTypes.includes(methodType)) && this.throwError(ERROR.QUERY_METHOD_TYPE_NOT_FOUND);
        !contractAddress && this.throwError(ERROR.CONTRACT_ADDRESS_NOT_FOUND);
        !params && this.throwError(ERROR.INSUFFICIENT_PARAMS);  
  
        if (!params[methodType]) {
          throw new Error(`${ERROR_MESSAGES.MISSING} ${methodType} ${ERROR_MESSAGES.QUERYING}`);
        }
  
        this.validate(params, methodType, REQ_TYPES.QUERY);
  
        const client = await this.getQueryClient();
  
        return client.queryContractSmart(contractAddress, { ...params });
      } catch (e) {
        throw e;
      }
    };
  
    sendTokens = async (
      sendTokenParams: SendTokenParams
    ): Promise<DeliverTxResponse> => {
      try {
        !sendTokenParams && this.throwError(ERROR.INSUFFICIENT_PARAMS);
        const { sender, recipient, amount, memo } = sendTokenParams;
  
        !sender && this.throwError(ERROR.SENDER_NOT_FOUND);
        !recipient && this.throwError(ERROR.SEND_TOKENS.RECIPIENT_NOT_FOUND);
        !amount && this.throwError(ERROR.SEND_TOKENS.AMOUNT_NOT_FOUND);
  
        const client = await this.getSigningClient();
        return client.sendTokens(sender, recipient, [amount], this.stdFee, memo);
      } catch (e) {
        throw e;
      }
    };
  }
  