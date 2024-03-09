import { AxiosRequestConfig } from 'axios';
import { nanoid } from 'nanoid';
import {
  AccountHFMarginTransactionsRequest,
  AccountHFTransactionsRequest,
  AccountTransactionsRequest,
  CreateSubAccountAPIRequest,
  CreateSubAccountRequest,
  DeleteSubAccountAPIRequest,
  GetBalancesRequest,
  GetIsolatedMarginAccountBalanceDetailRequest,
  GetMarginAccountBalanceDetailRequest,
  UpdateSubAccountAPIRequest,
} from 'types/request/spot.types.js';
import {
  AccountHFMarginTransactionsResponse,
  AccountHFTransactionsResponse,
  AccountResponse,
  AccountSummaryResponse,
  AccountTransactionsResponse,
  BalancesResponse,
  CreateSubAccountAPIResponse,
  CreateSubAccountResponse,
  GetMarginAccountBalanceDetailResponse,
  GetMarginAccountBalancesResponse,
  GetSubAccountBalanceResponse,
  GetSubAccountBalancesV2Response,
  GetSubAccountsV2Response,
  IsolatedMarginAccountDetailResponse,
  SubAccountAPIInfo,
  SubAccountInfo,
  UpdateSubAccountAPIResponse,
} from 'types/response/spot.types.js';

import { BaseRestClient } from './lib/BaseRestClient.js';
import {
  REST_CLIENT_TYPE_ENUM,
  RestClientOptions,
  RestClientType,
} from './lib/requestUtils.js';
import { APISuccessResponse } from './types/response/shared.types.js';

/**
 *
 */
export class SpotClient extends BaseRestClient {
  constructor(
    restClientOptions: RestClientOptions = {},
    requestOptions: AxiosRequestConfig = {},
  ) {
    super(restClientOptions, requestOptions);
    return this;
  }

  getClientType(): RestClientType {
    return REST_CLIENT_TYPE_ENUM.main;
  }

  /**
   *
   * Misc Utility Methods
   *
   */

  generateNewOrderID(): string {
    return nanoid(32);
  }

  getServerTime(): Promise<any> {
    return this.get('api/v1/timestamp');
  }

  getServiceStatus(): Promise<any> {
    return this.get('api/v1/status');
  }

  /**
   *
   ***********
   * Account
   ***********
   *
   */

  /**
   *
   * Basic Info
   *
   */

  getAccountSummary(): Promise<APISuccessResponse<AccountSummaryResponse>> {
    return this.getPrivate('api/v2/user-info');
  }

  /**
   * Get a list of acounts and their balance states (spot/margin/trade_hf)
   *
   * Get Account List - Spot/Margin/trade_hf
   */
  getBalances(
    params?: GetBalancesRequest,
  ): Promise<Promise<APISuccessResponse<BalancesResponse[]>>> {
    return this.getPrivate('api/v1/accounts', params);
  }

  getAccount(params: {
    accountId: any;
  }): Promise<APISuccessResponse<AccountResponse>> {
    return this.getPrivate(`api/v1/accounts/${params.accountId}`);
  }

  /**
   * Get Account Ledgers - Spot/Margin
   */
  getAccountTransactions(
    params: AccountTransactionsRequest,
  ): Promise<APISuccessResponse<AccountTransactionsResponse>> {
    return this.getPrivate('api/v1/accounts/ledgers', params);
  }

  /**
   * Get Account Ledgers - trade_hf
   */
  getAccountHFTransactions(
    params: AccountHFTransactionsRequest,
  ): Promise<APISuccessResponse<AccountHFTransactionsResponse[]>> {
    return this.getPrivate('api/v1/hf/accounts/ledgers', params);
  }

  /**
   * Get Account Ledgers - margin_hf
   */
  getAccountHFMarginTransactions(
    params: AccountHFMarginTransactionsRequest,
  ): Promise<APISuccessResponse<AccountHFMarginTransactionsResponse[]>> {
    return this.getPrivate('api/v3/hf/margin/account/ledgers', params);
  }

  /**
   *
   * Sub-Account
   *
   */

  getSubAccountsV1(): Promise<APISuccessResponse<SubAccountInfo[]>> {
    return this.getPrivate('api/v1/sub/user');
  }

  getSubAccountsV2(params: {
    currentPage?: number;
    pageSize?: number;
  }): Promise<APISuccessResponse<GetSubAccountsV2Response>> {
    return this.getPrivate('api/v2/sub/user', params);
  }

  createSubAccount(
    params: CreateSubAccountRequest,
  ): Promise<APISuccessResponse<CreateSubAccountResponse>> {
    return this.postPrivate('api/v2/sub/user/created', params);
  }

  getSubAccountBalance(params: {
    subUserId: string;
    includeBaseAmount: boolean;
  }): Promise<APISuccessResponse<GetSubAccountBalanceResponse>> {
    return this.getPrivate(`api/v1/sub-accounts/${params.subUserId}`, params);
  }

  getSubAccountBalancesV1(): Promise<
    APISuccessResponse<GetSubAccountBalanceResponse>
  > {
    return this.getPrivate('api/v1/sub-accounts');
  }

  getSubAccountBalancesV2(params: {
    currentPage?: number;
    pageSize?: number;
  }): Promise<APISuccessResponse<GetSubAccountBalancesV2Response>> {
    return this.getPrivate('api/v2/sub-accounts', params);
  }

  /**
   *
   * Sub-Account API
   *
   *
   */

  getSubAccountAPIs(params: {
    apiKey?: string;
    subName: string;
  }): Promise<APISuccessResponse<SubAccountAPIInfo[]>> {
    return this.getPrivate('api/v1/sub/api-key', params);
  }

  createSubAccountAPI(
    params: CreateSubAccountAPIRequest,
  ): Promise<APISuccessResponse<CreateSubAccountAPIResponse>> {
    return this.postPrivate('api/v1/sub/api-key', params);
  }

  updateSubAccountAPI(
    params: UpdateSubAccountAPIRequest,
  ): Promise<APISuccessResponse<UpdateSubAccountAPIResponse>> {
    return this.postPrivate('api/v1/sub/api-key/update', params);
  }

  deleteSubAccountAPI(params: DeleteSubAccountAPIRequest): Promise<
    APISuccessResponse<{
      subName: string; // Sub-account name
      apiKey: string; // API-Key
    }>
  > {
    return this.deletePrivate('api/v1/sub/api-key', params);
  }

  /**
   *
   ***********
   * Funding
   ***********
   *
   */

  getMarginAccountBalances(): Promise<
    APISuccessResponse<GetMarginAccountBalancesResponse>
  > {
    return this.getPrivate('api/v1/margin/account');
  }

  getMarginAccountBalanceDetail(
    params?: GetMarginAccountBalanceDetailRequest,
  ): Promise<APISuccessResponse<GetMarginAccountBalanceDetailResponse>> {
    return this.getPrivate('api/v3/margin/accounts', params);
  }

  getIsolatedMarginAccountBalanceDetail(
    params?: GetIsolatedMarginAccountBalanceDetailRequest,
  ): Promise<APISuccessResponse<IsolatedMarginAccountDetailResponse[]>> {
    return this.getPrivate('api/v3/isolated/accounts', params);
  }

  /**
   *
   * Deposit
   *
   */

  createDepositAddress(params: { currency: string; chain?: string }): Promise<
    APISuccessResponse<{
      address: string; // Deposit address
      memo: string; // Address remark. If there’s no remark, it is empty.
      chain: string; // The chain name of currency
    }>
  > {
    return this.postPrivate('api/v1/deposit-addresses', params);
  }

  getDepositAddressesV2(params: { currency: string }): Promise<
    APISuccessResponse<
      {
        address: string; // Deposit address
        memo: string; // Address remark. If there’s no remark, it is empty.
        chain: string; // The chain name of currency.
        contractAddress: string; // The token contract address.
      }[]
    >
  > {
    return this.getPrivate('api/v2/deposit-addresses', params);
  }

  getDepositAddress(params: { currency: string; chain?: string }): Promise<
    APISuccessResponse<{
      address: string; // Deposit address
      memo: string; // Address remark. If there’s no remark, it is empty.
      chain: string; // The chain name of currency
    }>
  > {
    return this.getPrivate('api/v1/deposit-addresses', params);
  }

  getDepositList(params?: {
    currency?: string;
    startAt?: number;
    endAt?: number;
    status?: 'PROCESSING' | 'SUCCESS' | 'FAILURE';
  }): Promise<
    APISuccessResponse<{
      currentPage: number;
      pageSize: number;
      totalNum: number;
      totalPage: number;
      items: {
        address: string; // Deposit address
        memo: string; // Address remark. If there’s no remark, it is empty.
        amount: string; // Deposit amount
        fee: string; // Fees charged for deposit
        currency: string; // Currency
        chain: string; // The chain of currency
        isInner: boolean; // Internal deposit or not
        walletTxId: string; // Wallet Txid
        status: 'PROCESSING' | 'SUCCESS' | 'FAILURE'; // Status
        remark: string; // remark
        createdAt: number; // Creation time of the database record
        updatedAt: number; // Update time of the database record
      }[];
    }>
  > {
    return this.getPrivate('api/v1/deposits', params);
  }

  getV1HistoricalDepositsList(params?: {
    currency?: string;
    startAt?: number;
    endAt?: number;
    status?: 'PROCESSING' | 'SUCCESS' | 'FAILURE';
  }): Promise<
    APISuccessResponse<{
      currentPage: number;
      pageSize: number;
      totalNum: number;
      totalPage: number;
      items: {
        currency: string; // Currency
        createAt: number; // Creation time of the database record
        amount: string; // Deposit amount
        walletTxId: string; // Wallet Txid
        isInner: boolean; // Internal deposit or not
        status: 'PROCESSING' | 'SUCCESS' | 'FAILURE'; // Status
      }[];
    }>
  > {
    return this.getPrivate('api/v1/hist-deposits', params);
  }

  /**
   *
   * Withdrawals
   *
   */

  getWithdrawalsList(params?: {
    currency?: string;
    status?: 'PROCESSING' | 'WALLET_PROCESSING' | 'SUCCESS' | 'FAILURE';
    startAt?: number;
    endAt?: number;
  }): Promise<
    APISuccessResponse<{
      currentPage: number;
      pageSize: number;
      totalNum: number;
      totalPage: number;
      items: {
        id: string; // Unique identity
        address: string; // Withdrawal address
        memo: string; // Address remark. If there’s no remark, it is empty.
        currency: string; // Currency
        chain: string; // The chain of currency
        amount: string; // Withdrawal amount
        fee: string; // Withdrawal fee
        walletTxId: string; // Wallet Txid
        isInner: boolean; // Internal withdrawal or not
        status: 'PROCESSING' | 'WALLET_PROCESSING' | 'SUCCESS' | 'FAILURE'; // status
        remark: string; // remark
        createdAt: number; // Creation time
        updatedAt: number; // Update time
      }[];
    }>
  > {
    return this.getPrivate('api/v1/withdrawals', params);
  }

  getV1HistoricalWithdrawalsList(params?: {
    currency?: string;
    startAt?: number;
    endAt?: number;
    status?: 'PROCESSING' | 'SUCCESS' | 'FAILURE';
  }): Promise<
    APISuccessResponse<{
      currentPage: number;
      pageSize: number;
      totalNum: number;
      totalPage: number;
      items: {
        currency: string; // Currency
        createAt: number; // Creation time of the database record
        amount: string; // Withdrawal amount
        address: string; // Withdrawal address
        walletTxId: string; // Wallet Txid
        isInner: boolean; // Internal deposit or not
        status: 'PROCESSING' | 'SUCCESS' | 'FAILURE'; // Status
      }[];
    }>
  > {
    return this.getPrivate('api/v1/hist-withdrawals', params);
  }

  getWithdrawalQuotas(params: { currency: string; chain?: string }): Promise<
    APISuccessResponse<{
      limitBTCAmount: string; // 24-hour total withdrawal limit, equivalent to BTC
      quotaCurrency: string; // withdrawal limit currency
      chain: string; // The chain name of currency
      remainAmount: string; // Remaining amount available to withdraw the current day
      innerWithdrawMinFee: string; // Fees for internal withdrawal
      usedBTCAmount: string; // The estimated BTC amount (based on the daily fiat limit) that can be withdrawn within the current day
      limitQuotaCurrencyAmount: string; // The intraday available withdrawal amount(withdrawal limit currency)
      withdrawMinSize: string; // Minimum withdrawal amount
      withdrawMinFee: string; // Minimum withdrawal fee
      precision: number; // Floating point precision.
      reason: string | null; // Reason for withdrawal limit (if any)
      usedQuotaCurrencyAmount: string; // The intraday cumulative withdrawal amount(withdrawal limit currency)
      currency: string; // Currency
      availableAmount: string; // Current available withdrawal amount
      isWithdrawEnabled: boolean; // Is the withdraw function enabled or not
    }>
  > {
    return this.getPrivate('api/v1/withdrawals/quotas', params);
  }

  applyWithdraw(params: {
    currency: string;
    address: string;
    amount: number;
    memo?: string;
    isInner?: boolean;
    remark?: string;
    chain?: string;
    feeDeductType?: 'INTERNAL' | 'EXTERNAL';
  }): Promise<APISuccessResponse<{ withdrawalId: string }>> {
    return this.postPrivate('api/v1/withdrawals', params);
  }

  cancelWithdrawal(params: {
    withdrawalId: string;
  }): Promise<APISuccessResponse<{ withdrawalId: string }>> {
    return this.deletePrivate(`api/v1/withdrawals/${params.withdrawalId}`);
  }

  /**
   *
   * Transfer
   *
   */

  getTransferable(params: {
    currency: string;
    type: 'MAIN' | 'TRADE' | 'TRADE_HF' | 'MARGIN' | 'ISOLATED';
    tag?: string;
  }): Promise<
    APISuccessResponse<{
      currency: string; // Currency
      balance: string; // Total funds in an account.
      available: string; // Funds available to withdraw or trade.
      holds: string; // Funds on hold (not available for use).
      transferable: string; // Funds available to transfer.
    }>
  > {
    return this.getPrivate('api/v1/accounts/transferable', params);
  }

  flexTransfer(params: {
    clientOid: string;
    currency?: string;
    amount: string;
    fromUserId?: string;
    fromAccountType:
      | 'MAIN'
      | 'TRADE'
      | 'CONTRACT'
      | 'MARGIN'
      | 'ISOLATED'
      | 'TRADE_HF'
      | 'MARGIN_V2'
      | 'ISOLATED_V2';
    fromAccountTag?: string;
    type: 'INTERNAL' | 'PARENT_TO_SUB' | 'SUB_TO_PARENT';
    toUserId?: string;
    toAccountType:
      | 'MAIN'
      | 'TRADE'
      | 'CONTRACT'
      | 'MARGIN'
      | 'ISOLATED'
      | 'TRADE_HF'
      | 'MARGIN_V2'
      | 'ISOLATED_V2';
    toAccountTag?: string;
  }): Promise<
    APISuccessResponse<{
      orderId: string; // Transfer order ID
    }>
  > {
    return this.postPrivate('api/v3/accounts/universal-transfer', params);
  }

  transferBetweenMasterAndSubAccount(params: {
    clientOid: string;
    currency: string;
    amount: string;
    direction: 'OUT' | 'IN';
    accountType?: 'MAIN' | 'TRADE' | 'TRADE_HF' | 'MARGIN' | 'CONTRACT';
    subAccountType?: 'MAIN' | 'TRADE' | 'TRADE_HF' | 'MARGIN' | 'CONTRACT';
    subUserId: string;
  }): Promise<
    APISuccessResponse<{
      orderId: string; // Transfer order ID
    }>
  > {
    return this.postPrivate('api/v2/accounts/sub-transfer', params);
  }

  innerTransfer(params: {
    clientOid: string;
    currency: string;
    from:
      | 'main'
      | 'trade'
      | 'trade_hf'
      | 'margin'
      | 'isolated'
      | 'margin_v2'
      | 'isolated_v2'
      | 'contract';
    to:
      | 'main'
      | 'trade'
      | 'trade_hf'
      | 'margin'
      | 'isolated'
      | 'margin_v2'
      | 'isolated_v2'
      | 'contract';
    amount: string;
    fromTag?: string;
    toTag?: string;
  }): Promise<
    APISuccessResponse<{
      orderId: string; // Transfer order ID
    }>
  > {
    return this.postPrivate('api/v2/accounts/inner-transfer', params);
  }

  /**
   *
   * Trade Fee
   *
   */

  getBasicUserFee(params: { currencyType: string }): Promise<
    APISuccessResponse<{
      takerFeeRate: string; // Taker fee rate
      makerFeeRate: string; // Maker fee rate
    }>
  > {
    return this.getPrivate('api/v1/base-fee', params);
  }

  getTradingPairActualFee(params: { symbols: string }): Promise<
    APISuccessResponse<
      {
        symbol: string; // Trading pair
        takerFeeRate: string; // Taker fee rate
        makerFeeRate: string; // Maker fee rate
      }[]
    >
  > {
    return this.getPrivate('api/v1/trade-fees', params);
  }

  /**
   *
   ***********
   * Spot Trading
   ***********
   *
   */

  /**
   *
   * Market data
   *
   */

  getCurrencyList(): Promise<
    APISuccessResponse<
      {
        currency: string; // A unique currency code that will never change
        name: string; // Currency name, will change after renaming
        fullName: string; // Full name of a currency, will change after renaming
        precision: number; // Currency precision
        confirms: number | null; // Number of block confirmations
        contractAddress: string | null; // Contract address
        isMarginEnabled: boolean; // Support margin or not
        isDebitEnabled: boolean; // Support debit or not
        chains: {
          chainName: string; // Chain name of currency
          withdrawalMinSize: string; // Minimum withdrawal amount
          withdrawalMinFee: string; // Minimum fees charged for withdrawal
          isWithdrawEnabled: boolean; // Support withdrawal or not
          isDepositEnabled: boolean; // Support deposit or not
          confirms: number; // Number of block confirmations
          preConfirms: number; // The number of blocks (confirmations) for advance on-chain verification
          contractAddress: string; // Contract address
          chainId: string; // Chain of currency
        }[];
      }[]
    >
  > {
    return this.get('api/v3/currencies');
  }

  getCurrencyDetail(params: { currency: string; chain?: string }): Promise<
    APISuccessResponse<{
      currency: string; // A unique currency code that will never change
      name: string; // Currency name, will change after renaming
      fullName: string; // Full name of a currency, will change after renaming
      precision: number; // Currency precision
      confirms: number | null; // Number of block confirmations
      contractAddress: string | null; // Contract address
      isMarginEnabled: boolean; // Support margin or not
      isDebitEnabled: boolean; // Support debit or not
      chains: {
        chainName: string; // Chain name of currency
        withdrawalMinSize: string; // Minimum withdrawal amount
        withdrawalMinFee: string; // Minimum fees charged for withdrawal
        isWithdrawEnabled: boolean; // Support withdrawal or not
        isDepositEnabled: boolean; // Support deposit or not
        confirms: number; // Number of block confirmations
        preConfirms: number; // The number of blocks (confirmations) for advance on-chain verification
        contractAddress: string; // Contract address
        chainId: string; // Chain of currency
      }[];
    }>
  > {
    return this.get(`api/v3/currencies/${params.currency}`, params);
  }

  getSymbolsList(params?: { market?: string }): Promise<
    APISuccessResponse<
      {
        symbol: string; // unique code of a symbol, it would not change after renaming
        name: string; // Name of trading pairs, it would change after renaming
        baseCurrency: string; // Base currency,e.g. BTC.
        quoteCurrency: string; // Quote currency,e.g. USDT.
        feeCurrency: string; // The currency of charged fees.
        market: string; // The trading market.
        baseMinSize: string; // The minimum order quantity required to place an order.
        quoteMinSize: string; // The minimum order funds required to place a market order.
        baseMaxSize: string; // The maximum order size required to place an order.
        quoteMaxSize: string; // The maximum order funds required to place a market order.
        baseIncrement: string; // The increment of the order size. The value shall be a positive multiple of the baseIncrement.
        quoteIncrement: string; // The increment of the funds required to place a market order. The value shall be a positive multiple of the quoteIncrement.
        priceIncrement: string; // The increment of the price required to place a limit order. The value shall be a positive multiple of the priceIncrement.
        priceLimitRate: string; // Threshold for price protection
        minFunds: string; // the minimum spot and margin trading amounts
        isMarginEnabled: boolean; // Available for margin or not.
        enableTrading: boolean; // Available for transaction or not.
      }[]
    >
  > {
    return this.get('api/v2/symbols', params);
  }

  getTicker(params: { symbol: string }): Promise<
    APISuccessResponse<{
      sequence: string; // Sequence
      price: string; // Last traded price
      size: string; // Last traded size
      bestAsk: string; // Best ask price
      bestAskSize: string; // Best ask size
      bestBid: string; // Best bid price
      bestBidSize: string; // Best bid size
      time: number; // timestamp
    }>
  > {
    return this.get(`api/v1/market/orderbook/level1`, params);
  }

  getAllTickers(): Promise<
    APISuccessResponse<{
      time: number; // timestamp
      ticker: {
        symbol: string; // Symbol
        symbolName: string; // Name of trading pairs, it would change after renaming
        buy: string; // Best bid price
        sell: string; // Best ask price
        bestBidSize: string; // Best bid size
        bestAskSize: string; // Best ask size
        changeRate: string; // 24h change rate
        changePrice: string; // 24h change price
        high: string; // Highest price in 24h
        low: string; // Lowest price in 24h
        vol: string; // 24h volume, executed based on base currency
        volValue: string; // 24h traded amount
        last: string; // Last traded price
        averagePrice: string; // Average trading price in the last 24 hours
        takerFeeRate: string; // Basic Taker Fee
        makerFeeRate: string; // Basic Maker Fee
        takerCoefficient: string; // Taker Fee Coefficient
        makerCoefficient: string; // Maker Fee Coefficient
      }[];
    }>
  > {
    return this.get('api/v1/market/allTickers');
  }

  get24hrStats(params: { symbol: string }): Promise<
    APISuccessResponse<{
      time: number; // timestamp
      symbol: string; // Symbol
      buy: string; // Best bid price
      sell: string; // Best ask price
      changeRate: string; // 24h change rate
      changePrice: string; // 24h change price
      high: string; // Highest price in 24h
      low: string; // Lowest price in 24h
      vol: string; // 24h volume, executed based on base currency
      volValue: string; // 24h traded amount
      last: string; // Last traded price
      averagePrice: string; // Average trading price in the last 24 hours
      takerFeeRate: string; // Basic Taker Fee
      makerFeeRate: string; // Basic Maker Fee
      takerCoefficient: string; // Taker Fee Coefficient
      makerCoefficient: string; // Maker Fee Coefficient
    }>
  > {
    return this.get('api/v1/market/stats', params);
  }

  getMarketList(): Promise<APISuccessResponse<string[]>> {
    return this.get('api/v1/markets');
  }

  getPartOrderBookLevel20(params: { symbol: string }): Promise<
    APISuccessResponse<{
      sequence: string; // Sequence number
      time: number; // Timestamp
      bids: [string, string][]; // bids [price, size]
      asks: [string, string][]; // asks [price, size]
    }>
  > {
    return this.get(`api/v1/market/orderbook/level2_20`, params);
  }

  getPartOrderBookLevel100(params: { symbol: string }): Promise<
    APISuccessResponse<{
      sequence: string; // Sequence number
      time: number; // Timestamp
      bids: [string, string][]; // bids [price, size]
      asks: [string, string][]; // asks [price, size]
    }>
  > {
    return this.get(`api/v1/market/orderbook/level2_100`, params);
  }

  getFullOrderBook(params: { symbol: string }): Promise<
    APISuccessResponse<{
      sequence: string; // Sequence number
      time: number; // Timestamp
      bids: [string, string][]; // bids [price, size]
      asks: [string, string][]; // asks [price, size]
    }>
  > {
    return this.get('api/v3/market/orderbook/level2', params);
  }

  getTradeHistories(params: { symbol: string }): Promise<
    APISuccessResponse<
      {
        sequence: string; // Sequence number
        time: number; // Transaction time
        price: string; // Filled price
        size: string; // Filled amount
        side: string; // Filled side. The filled side is set to the taker by default.
      }[]
    >
  > {
    return this.get('api/v1/market/histories', params);
  }

  getKlines(params: {
    symbol: string;
    startAt?: number;
    endAt?: number;
    type:
      | '1min'
      | '3min'
      | '5min'
      | '15min'
      | '30min'
      | '1hour'
      | '2hour'
      | '4hour'
      | '6hour'
      | '8hour'
      | '12hour'
      | '1day'
      | '1week';
  }): Promise<
    APISuccessResponse<
      [
        string, // Start time of the candle cycle
        string, // Opening price
        string, // Closing price
        string, // Highest price
        string, // Lowest price
        string, // Transaction volume (One-sided transaction volume)
        string, // Transaction amount (One-sided transaction amount)
      ][]
    >
  > {
    return this.get('api/v1/market/candles', params);
  }

  getFiatPrice(params?: { base?: string; currencies?: string }): Promise<any> {
    return this.get('api/v1/prices', params);
  }

  /**
   *
   * Spot HF trade
   *
   */

  placeHFOrder(params: {
    clientOid?: string;
    symbol: string;
    type: 'limit' | 'market';
    side: 'buy' | 'sell';
    stp?: 'CN' | 'CO' | 'CB' | 'DC';
    tags?: string;
    remark?: string;
  }): Promise<
    APISuccessResponse<{
      orderId: string; // Transfer order ID
    }>
  > {
    return this.postPrivate('api/v1/hf/orders', params);
  }

  placeHFOrderTest(): Promise<any> {
    return this.postPrivate('api/v1/hf/orders/test');
  }

  placeHFOrderSync(params: {
    clientOid?: string;
    symbol: string;
    type: 'limit' | 'market';
    side: 'buy' | 'sell';
    stp?: 'CN' | 'CO' | 'CB' | 'DC';
    tags?: string;
    remark?: string;
  }): Promise<
    APISuccessResponse<{
      orderId: string; // An order Id is returned once an order is successfully placed.
      orderTime: string; // order time
      originSize: string; // original order size
      dealSize: string; // deal size
      remainSize: string; // remain size
      canceledSize: string; // Cumulative number of cancellations
      status: string; // Order Status. open: the order is active; done: the order has been completed
      matchTime: string; // matching time
    }>
  > {
    return this.postPrivate('api/v1/hf/orders/sync', params);
  }

  placeMultipleHFOrders(params: {
    clientOid?: string;
    symbol: string;
    type: 'limit' | 'market';
    timeInForce?: 'GTC' | 'GTT' | 'IOC' | 'FOK';
    stp?: 'CN' | 'CO' | 'CB' | 'DC';
    side: 'buy' | 'sell';
    price: string;
    size: string;
    cancelAfter?: number;
    postOnly?: boolean;
    hidden?: boolean;
    iceberg?: boolean;
    visibleSize?: string;
    tags?: string;
    remark?: string;
  }): Promise<
    {
      orderId: string;
      success?: boolean;
      failMsg?: string; // Reason of failure, optional based on success status
    }[]
  > {
    return this.postPrivate('api/v1/hf/orders/multi', params);
  }

  placeMultipleHFOrdersSync(params: {
    clientOid?: string;
    symbol: string;
    type: 'limit' | 'market';
    timeInForce?: 'GTC' | 'GTT' | 'IOC' | 'FOK';
    stp?: 'CN' | 'CO' | 'CB' | 'DC';
    side: 'buy' | 'sell';
    price: string;
    size: string;
    cancelAfter?: number;
    postOnly?: boolean;
    hidden?: boolean;
    iceberg?: boolean;
    visibleSize?: string;
    tags?: string;
    remark?: string;
  }): Promise<
    {
      orderId: string; // An order Id is returned once an order is successfully placed.
      orderTime: number; // order time
      originSize: string; // original order size
      dealSize: string; // deal size
      remainSize: string; // remain size
      canceledSize: string; // Cumulative number of cancellations
      status: string; // Order Status. open: the order is active; done: the order has been completed
      matchTime: number; // matching time
      success: boolean; // Whether the order was placed successfully.
    }[]
  > {
    return this.postPrivate('api/v1/hf/orders/multi/sync', params);
  }

  modifyHFOrder(params: {
    symbol: string;
    clientOid?: string;
    orderId?: string;
    newPrice?: string;
    newSize?: string;
  }): Promise<
    APISuccessResponse<{
      newOrderId: string; // New order ID
    }>
  > {
    return this.postPrivate('api/v1/hf/orders/alter', params);
  }

  cancelHFOrder(params: { orderId: string; symbol: string }): Promise<
    APISuccessResponse<{
      orderId: string; // New order ID
    }>
  > {
    return this.deletePrivate(`api/v1/hf/orders/${params.orderId}`, params);
  }

  syncCancelHFOrder(params: { orderId: string; symbol: string }): Promise<
    APISuccessResponse<{
      orderId: string; // order Id
      originSize: string; // original order size
      dealSize: string; // deal size
      remainSize: string; // remain size
      canceledSize: string; // Cumulative number of cancellations
      status: string; // Order Status. open: the order is active; done: the order has been completed
    }>
  > {
    return this.deletePrivate(
      `api/v1/hf/orders/sync/${params.orderId}`,
      params,
    );
  }

  cancelHFOrderByClientOId(params: {
    clientOid: string;
    symbol: string;
  }): Promise<
    APISuccessResponse<{
      clientOid: string; // New order ID
    }>
  > {
    return this.deletePrivate(
      `api/v1/hf/orders/client-order/${params.clientOid}`,
      params,
    );
  }

  syncCancelHFOrderByClientOId(params: {
    clientOid: string;
    symbol: string;
  }): Promise<
    APISuccessResponse<{
      orderId: string; // order Id
      originSize: string; // original order size
      dealSize: string; // deal size
      remainSize: string; // remain size
      canceledSize: string; // Cumulative number of cancellations
      status: string; // Order Status. open: the order is active; done: the order has been completed
    }>
  > {
    return this.deletePrivate(
      `api/v1/hf/orders/sync/client-order/${params.clientOid}`,
      params,
    );
  }

  cancelSpecifiedNumberHFOrders(params: {
    orderId: string;
    symbol: string;
    cancelSize: string;
  }): Promise<any> {
    return this.deletePrivate(
      `api/v1/hf/orders/cancel/${params.orderId}`,
      params,
    );
  }

  cancelAllHFOrdersBySymbol(params: { symbol: string }): Promise<
    APISuccessResponse<{
      orderId: string; // order Id
      cancelSize: string; // Size of the order to be canceled
    }>
  > {
    return this.deletePrivate(`api/v1/hf/orders`, params);
  }

  cancelAllHFOrders(): Promise<
    APISuccessResponse<{
      succeedSymbols?: string[]; // Cancel order successful symbol
      failedSymbols?: {
        symbol: string; // Cancel order failed symbol
        error: string; // Error message
      }[];
    }>
  > {
    return this.deletePrivate(`api/v1/hf/orders/cancelAll`);
  }

  getActiveHFOrders(params: { symbol: string }): Promise<
    APISuccessResponse<
      {
        id: string; // Order id, a unique identifier pertaining to the order
        symbol: string; // Trading pair
        opType: string; // Operation type: DEAL
        type: string; // Order type
        side: string; // Buy or sell
        price: string; // Order price
        size: string; // Order size
        dealSize: string; // Number of filled transactions
        cancelledSize: string; // Number of canceled transactions
        remainSize: string; // Number of remain transactions
        funds: string; // Order amount
        dealFunds: string; // Number of filled funds
        cancelledFunds: string; // Number of canceled funds
        remainFunds: string; // Number of remain funds
        fee: string; // Service fee
        feeCurrency: string; // Currency used to calculate fees
        stp: string; // Self trade protection
        timeInForce: string; // Time in force
        postOnly: boolean; // Is it post only?
        hidden: boolean; // Is it a hidden order?
        iceberg: boolean; // Is it an iceberg order?
        visibleSize: string; // Visible size of iceberg order in order book.
        cancelAfter: number; // A GTT timeInForce that expires in n seconds
        channel: string; // Source of orders
        clientOid: string; // Identifier created by the client
        remark: string; // Order description
        tags: string; // Order identifier
        active: boolean; // Order status: true-The status of the order is active; false-The status of the order is done
        inOrderBook: boolean; // Whether to enter the orderbook: true: enter the orderbook; false: not enter the orderbook
        cancelExist: boolean; // Are there any cancellation records pertaining to the order?
        createdAt: number; // Order creation time
        lastUpdatedAt: number; // Last update time of order
        tradeType: string; // Trade type: TRADE (Spot Trading)
      }[]
    >
  > {
    return this.getPrivate(`api/v1/hf/orders/active`, params);
  }

  getActiveHFSymbols(): Promise<
    APISuccessResponse<{
      symbols: string[];
    }>
  > {
    return this.getPrivate(`api/v1/hf/orders/active/symbols`);
  }

  getHFCompletedOrders(params: {
    symbol: string;
    side?: 'buy' | 'sell';
    type?: 'limit' | 'market';
    startAt?: number;
    endAt?: number;
    lastId?: number;
    limit?: number;
  }): Promise<
    APISuccessResponse<{
      lastId: number;
      items: {
        id: string; // Order id, a unique identifier of the order
        symbol: string; // Trading pair
        opType: string; // Operation type: DEAL
        type: string; // Order type
        side: string; // Buy or sell
        price: string; // Order price
        size: string; // Order size
        dealSize: string; // Number of filled transactions
        cancelledSize: string; // Number of canceled transactions
        remainSize: string; // Number of remain transactions
        funds: string; // Order amount
        dealFunds: string; // Number of filled funds
        cancelledFunds: string; // Number of canceled funds
        remainFunds: string; // Number of remain funds
        fee: string; // Service fee
        feeCurrency: string; // Currency used to calculate fees
        stp: string; // Self trade protection
        timeInForce: string; // Time in force
        postOnly: boolean; // Is it post only?
        hidden: boolean; // Is it a hidden order?
        iceberg: boolean; // Is it an iceberg order?
        visibleSize: string; // Visible size of iceberg order in order book.
        cancelAfter: number; // A GTT timeInForce that expires in n seconds
        channel: string; // Source of orders
        clientOid: string; // Identifier created by the client
        remark: string; // Order description
        tags: string; // Order identifier
        active: boolean; // Order status: true-The status of the order is active; false-The status of the order is done
        inOrderBook: boolean; // Whether to enter the orderbook: true: enter the orderbook; false: not enter the orderbook
        cancelExist: boolean; // Are there any cancellation records pertaining to the order?
        createdAt: number; // Order creation time
        lastUpdatedAt: number; // Last update time of order
        tradeType: string; // Trade type: TRADE (Spot Trading)
      }[];
    }>
  > {
    return this.getPrivate(`api/v1/hf/orders/done`, params);
  }

  getHFOrderDetailsByOrderId(params: {
    orderId: string;
    symbol: string;
  }): Promise<
    APISuccessResponse<{
      id: string; // Order id, a unique identifier of the order
      symbol: string; // Trading pair
      opType: string; // Operation type: DEAL
      type: string; // Order type
      side: string; // Buy or sell
      price: string; // Order price
      size: string; // Order size
      dealSize: string; // Number of filled transactions
      cancelledSize: string; // Number of canceled transactions
      remainSize: string; // Number of remain transactions
      funds: string; // Order amount
      dealFunds: string; // Number of filled funds
      cancelledFunds: string; // Number of canceled funds
      remainFunds: string; // Number of remain funds
      fee: string; // Service fee
      feeCurrency: string; // Currency used to calculate fees
      stp: string; // Self trade protection
      timeInForce: string; // Time in force
      postOnly: boolean; // Is it post only?
      hidden: boolean; // Is it a hidden order?
      iceberg: boolean; // Is it an iceberg order?
      visibleSize: string; // Visible size of iceberg order in order book.
      cancelAfter: number; // A GTT timeInForce that expires in n seconds
      channel: string; // Source of orders
      clientOid: string; // Identifier created by the client
      remark: string; // Order description
      tags: string; // Order identifier
      active: boolean; // Order status: true-The status of the order is active; false-The status of the order is done
      inOrderBook: boolean; // Whether to enter the orderbook: true: enter the orderbook; false: not enter the orderbook
      cancelExist: boolean; // Are there any cancellation records pertaining to the order?
      createdAt: number; // Order creation time
      lastUpdatedAt: number; // Last update time of order
      tradeType: string; // Trade type: TRADE (Spot Trading)
    }>
  > {
    return this.getPrivate(`api/v1/hf/orders/${params.orderId}`, params);
  }

  getHFOrderDetailsByClientOid(params: {
    clientOid: string;
    symbol: string;
  }): Promise<
    APISuccessResponse<{
      id: string; // Order id, a unique identifier of the order
      symbol: string; // Trading pair
      opType: string; // Operation type: DEAL
      type: string; // Order type
      side: string; // Buy or sell
      price: string; // Order price
      size: string; // Order size
      dealSize: string; // Number of filled transactions
      cancelledSize: string; // Number of canceled transactions
      remainSize: string; // Number of remain transactions
      funds: string; // Order amount
      dealFunds: string; // Number of filled funds
      cancelledFunds: string; // Number of canceled funds
      remainFunds: string; // Number of remain funds
      fee: string; // Service fee
      feeCurrency: string; // Currency used to calculate fees
      stp: string; // Self trade protection
      timeInForce: string; // Time in force
      postOnly: boolean; // Is it post only?
      hidden: boolean; // Is it a hidden order?
      iceberg: boolean; // Is it an iceberg order?
      visibleSize: string; // Visible size of iceberg order in order book.
      cancelAfter: number; // A GTT timeInForce that expires in n seconds
      channel: string; // Source of orders
      clientOid: string; // Identifier created by the client
      remark: string; // Order description
      tags: string; // Order identifier
      active: boolean; // Order status: true-The status of the order is active; false-The status of the order is done
      inOrderBook: boolean; // Whether to enter the orderbook: true: enter the orderbook; false: not enter the orderbook
      cancelExist: boolean; // Are there any cancellation records pertaining to the order?
      createdAt: number; // Order creation time
      lastUpdatedAt: number; // Last update time of order
      tradeType: string; // Trade type: TRADE (Spot Trading)
    }>
  > {
    return this.getPrivate(
      `api/v1/hf/orders/client-order/${params.clientOid}`,
      params,
    );
  }

  autoCancelHFOrderSetting(params: {
    timeout: number;
    symbols?: string;
  }): Promise<
    APISuccessResponse<{
      currentTime: number; // System current time (in seconds)
      triggerTime: number; // Trigger cancellation time (in seconds)
    }>
  > {
    return this.postPrivate('api/v1/hf/orders/dead-cancel-all', params);
  }

  autoCancelHFOrderSettingQuery(): Promise<
    APISuccessResponse<{
      timeout: number; // Auto cancel order trigger setting time, the unit is second. range: timeout=-1 (meaning unset) or 5 <= timeout <= 86400
      symbols: string; // List of trading pairs. Separated by commas, empty means all trading pairs
      currentTime: number; // System current time (in seconds)
      triggerTime: number; // Trigger cancellation time (in seconds)
    }>
  > {
    return this.getPrivate('api/v1/hf/orders/dead-cancel-all/query');
  }

  getHFFilledList(params: {
    orderId?: string;
    symbol: string;
    side?: 'buy' | 'sell';
    type?: 'limit' | 'market';
    startAt?: number;
    endAt?: number;
    lastId?: number;
    limit?: number;
  }): Promise<
    APISuccessResponse<{
      items: {
        id: number; // Id of transaction detail
        symbol: string; // Trading pair
        tradeId: number; // Trade Id
        orderId: string; // Order Id
        counterOrderId: string; // Counterparty order Id
        side: string; // Buy or sell
        liquidity: string; // Liquidity type: taker or maker
        forceTaker: boolean; // Whether or not to forcefully process as taker
        price: string; // Order price
        size: string; // Order size
        funds: string; // Turnover
        fee: string; // Service fee
        feeRate: string; // Fee rate
        feeCurrency: string; // Currency used to calculate fees
        stop: string; // Take Profit and Stop Loss type, currently HFT does not support the Take Profit and Stop Loss type, so it is empty
        tradeType: string; // Trade type: TRADE(Spot Trading)
        type: string; // Order type: limit or market
        createdAt: number; // Transaction(Creation) time
      }[];
      lastId: number;
    }>
  > {
    return this.getPrivate('api/v1/hf/fills', params);
  }

  /**
   *
   * Orders
   *
   */

  // SPOT and MARGIN
  placeOrder(params: {
    clientOid: string;
    side: 'buy' | 'sell';
    symbol: string;
    type?: 'limit' | 'market';
    remark?: string;
    stp?: 'CN' | 'CO' | 'CB' | 'DC';
    tradeType?: 'TRADE' | 'MARGIN_TRADE';
    price?: string;
    size?: string;
    timeInForce?: 'GTC' | 'GTT' | 'IOC' | 'FOK';
    cancelAfter?: number;
    postOnly?: boolean;
    hidden?: boolean;
    iceberg?: boolean;
    visibleSize?: string;
    funds?: string;
  }): Promise<
    APISuccessResponse<{
      orderId: string; // An order Id is returned once an order is successfully placed.
    }>
  > {
    return this.postPrivate('api/v1/orders', params);
  }

  // SPOT and MARGIN
  placeOrderTest(): Promise<any> {
    return this.postPrivate('api/v1/orders/test');
  }

  //SPOT
  placeMultipleOrders(params: {
    clientOid: string;
    side: 'buy' | 'sell';
    symbol: string;
    type?: 'limit';
    remark?: string;
    stop?: 'loss' | 'entry';
    stopPrice?: string;
    stp?: 'CN' | 'CO' | 'CB' | 'DC';
    tradeType?: 'TRADE';
    price: string;
    size: string;
    timeInForce?: 'GTC' | 'GTT' | 'IOC' | 'FOK';
    cancelAfter?: number;
    postOnly?: boolean;
    hidden?: boolean;
    iceberg?: boolean;
    visibleSize?: string;
  }): Promise<
    APISuccessResponse<
      {
        symbol: string; // symbol For Example，ETH-BTC
        type?: string; // only limit (default is limit)
        side: string; // buy or sell
        price: string; // price per base currency
        size: string; // amount of base currency to buy or sell
        funds?: any; // Order amount (optional, can be null)
        stp?: string; // self trade prevention, is divided into CN, CO, CB, and DC strategies
        stop?: string; // Either loss or entry. Requires stopPrice to be defined
        stopPrice?: any; // Need to be defined if stop is specified.
        timeInForce?: string; // GTC, GTT, IOC, or FOK (default is GTC).
        cancelAfter?: number; // Cancels in n seconds, with GTT as the time in force strategy
        postOnly?: boolean; // Post only identifier, invalid when the time in force strategy is IOC or FOK
        hidden?: boolean; // Hidden or not (not shown in order book)
        iceberg?: boolean; // Whether or not only visible portions of orders are shown in iceberg orders
        visibleSize?: any; // Maximum visible quantity in iceberg orders (optional, can be null)
        channel: string; // Channel through which the order was placed
        id: string; // Unique identifier for the order
        status: string; // Order creation results (success, fail)
        failMsg?: any; // Reason of failure (optional, can be null)
        clientOid: string; // Client Order Id, unique identifier created by the user, the use of UUID is recommended
      }[]
    >
  > {
    return this.postPrivate('api/v1/orders/multi', params);
  }

  // Used for Spot and Margin Trading: Cancels a single order by orderId.
  cancelOrderById(params: { orderId: string }): Promise<
    APISuccessResponse<{
      cancelledOrderIds: string[]; // Unique ID of the cancelled order
    }>
  > {
    return this.deletePrivate(`api/v1/orders/${params.orderId}`);
  }

  // Used for Spot and Margin Trading: Cancels a single order by clientOid.
  cancelOrderByClientOid(params: { clientOid: string }): Promise<
    APISuccessResponse<{
      cancelledOrderId: string; // Unique ID of the cancelled order
      clientOid: string; // Unique order id created by users to identify their orders
    }>
  > {
    return this.deletePrivate(`api/v1/order/client-order/${params.clientOid}`);
  }

  // Used for Spot and Margin Trading: Cancels all open orders.
  cancelAllOrders(params?: {
    symbol?: string;
    tradeType?: 'TRADE' | 'MARGIN_TRADE' | 'MARGIN_ISOLATED_TRADE';
  }): Promise<
    APISuccessResponse<{
      cancelledOrderIds: string[]; // Unique ID of the cancelled order
    }>
  > {
    return this.deletePrivate('api/v1/orders', params);
  }

  // Retrieves the current list of orders. Supports filtering by status and trade type.
  getOrderList(params?: {
    status?: 'active' | 'done';
    symbol?: string;
    side?: 'buy' | 'sell';
    type?: 'limit' | 'market' | 'limit_stop' | 'market_stop';
    tradeType?: 'TRADE' | 'MARGIN_TRADE' | 'MARGIN_ISOLATED_TRADE';
    startAt?: number;
    endAt?: number;
  }): Promise<
    APISuccessResponse<{
      currentPage: number;
      pageSize: number;
      totalNum: number;
      totalPage: number;
      items: {
        id: string; // Order ID, the ID of an order.
        symbol: string; // symbol
        opType: string; // Operation type: DEAL
        type: string; // order type
        side: string; // transaction direction, include buy and sell
        price: string; // order price
        size: string; // order quantity
        funds: string; // order funds
        dealFunds: string; // executed size of funds
        dealSize: string; // executed quantity
        fee: string; // fee
        feeCurrency: string; // charge fee currency
        stp: string; // self trade prevention, include CN, CO, DC, CB
        stop: string; // stop type, include entry and loss
        stopTriggered: boolean; // stop order is triggered or not
        stopPrice: string; // stop price
        timeInForce: string; // time InForce, include GTC, GTT, IOC, FOK
        postOnly: boolean; // postOnly
        hidden: boolean; // hidden order
        iceberg: boolean; // iceberg order
        visibleSize: string; // displayed quantity for iceberg order
        cancelAfter: number; // cancel orders time, requires timeInForce to be GTT
        channel: string; // order source
        clientOid: string; // user-entered order unique mark
        remark: string; // remark
        tags: string; // tag order source
        isActive: boolean; // order status, true and false. If true, the order is active, if false, the order is filled or cancelled
        cancelExist: boolean; // order cancellation transaction record
        createdAt: number; // create time
        tradeType: string; // The type of trading
      }[];
    }>
  > {
    return this.getPrivate('api/v1/orders', params);
  }

  // Needs General permission, Retrieves a list of the most recent 1000 orders within the last 24 hours, sorted in descending order by time.
  getRecentOrdersList(): Promise<
    APISuccessResponse<
      {
        id: string; // Order ID, unique identifier of an order.
        symbol: string; // symbol
        opType: string; // Operation type: DEAL
        type: string; // order type, e.g. limit, market, stop_limit
        side: string; // transaction direction, include buy and sell
        price: number; // order price
        size: number; // order quantity
        funds: number; // order funds
        dealFunds: number; // deal funds
        dealSize: number; // deal quantity
        fee: number; // fee
        feeCurrency: string; // charge fee currency
        stp: string; // self trade prevention, include CN, CO, DC, CB
        stop: string; // stop type, include entry and loss
        stopTriggered: boolean; // stop order is triggered
        stopPrice: number; // stop price
        timeInForce: string; // time InForce, include GTC, GTT, IOC, FOK
        postOnly: boolean; // postOnly
        hidden: boolean; // hidden order
        iceberg: boolean; // iceberg order
        visibleSize: number; // display quantity for iceberg order
        cancelAfter: number; // cancel orders time, requires timeInForce to be GTT
        channel: string; // order source
        clientOid: string; // user-entered order unique mark
        remark: string; // remark
        tags: string; // tag order source
        isActive: boolean; // order status, true and false. If true, the order is active, if false, the order is filled or cancelled
        cancelExist: boolean; // order cancellation transaction record
        createdAt: string; // create time
        tradeType: string; // The type of trading: TRADE（Spot Trading）, MARGIN_TRADE (Margin Trading).
      }[]
    >
  > {
    return this.getPrivate('api/v1/limit/orders');
  }

  // Needs General Permission, Retrieves the details of a single order by its orderId. Useful for tracking the status and details of specific trades.
  getOrderDetailsByOrderId(params: { orderId: string }): Promise<
    APISuccessResponse<
      {
        id: string; // Order ID, unique identifier of an order.
        symbol: string; // symbol
        opType: string; // Operation type: DEAL
        type: string; // order type, e.g. limit, market, stop_limit
        side: string; // transaction direction, include buy and sell
        price: number; // order price
        size: number; // order quantity
        funds: number; // order funds
        dealFunds: number; // deal funds
        dealSize: number; // deal quantity
        fee: number; // fee
        feeCurrency: string; // charge fee currency
        stp: string; // self trade prevention, include CN, CO, DC, CB
        stop: string; // stop type, include entry and loss
        stopTriggered: boolean; // stop order is triggered
        stopPrice: number; // stop price
        timeInForce: string; // time InForce, include GTC, GTT, IOC, FOK
        postOnly: boolean; // postOnly
        hidden: boolean; // hidden order
        iceberg: boolean; // iceberg order
        visibleSize: number; // display quantity for iceberg order
        cancelAfter: number; // cancel orders time, requires timeInForce to be GTT
        channel: string; // order source
        clientOid: string; // user-entered order unique mark
        remark: string; // remark
        tags: string; // tag order source
        isActive: boolean; // order status, true and false. If true, the order is active, if false, the order is filled or cancelled
        cancelExist: boolean; // order cancellation transaction record
        createdAt: string; // create time
        tradeType: string; // The type of trading: TRADE（Spot Trading）, MARGIN_TRADE (Margin Trading).
      }[]
    >
  > {
    return this.getPrivate(`api/v1/orders/${params.orderId}`);
  }

  // Needs general permission, Retrieves the details of a single order by its clientOid. This is useful for checking the status of orders placed with a unique client-provided identifier.
  getOrderDetailsByClientOid(params: { clientOid: string }): Promise<
    APISuccessResponse<
      {
        id: string; // Order ID, unique identifier of an order.
        symbol: string; // symbol
        opType: string; // Operation type: DEAL
        type: string; // order type, e.g. limit, market, stop_limit
        side: string; // transaction direction, include buy and sell
        price: number; // order price
        size: number; // order quantity
        funds: number; // order funds
        dealFunds: number; // deal funds
        dealSize: number; // deal quantity
        fee: number; // fee
        feeCurrency: string; // charge fee currency
        stp: string; // self trade prevention, include CN, CO, DC, CB
        stop: string; // stop type, include entry and loss
        stopTriggered: boolean; // stop order is triggered
        stopPrice: number; // stop price
        timeInForce: string; // time InForce, include GTC, GTT, IOC, FOK
        postOnly: boolean; // postOnly
        hidden: boolean; // hidden order
        iceberg: boolean; // iceberg order
        visibleSize: number; // display quantity for iceberg order
        cancelAfter: number; // cancel orders time, requires timeInForce to be GTT
        channel: string; // order source
        clientOid: string; // user-entered order unique mark
        remark: string; // remark
        tags: string; // tag order source
        isActive: boolean; // order status, true and false. If true, the order is active, if false, the order is filled or cancelled
        cancelExist: boolean; // order cancellation transaction record
        createdAt: string; // create time
        tradeType: string; // The type of trading: TRADE（Spot Trading）, MARGIN_TRADE (Margin Trading).
      }[]
    >
  > {
    return this.getPrivate(`api/v1/order/client-order/${params.clientOid}`);
  }

  /**
   *
   * Fills
   *
   */

  // General permission, Retrieves a list of the most recent fills for your orders, providing details such as the executed price, size, and the fees incurred. Useful for tracking trade executions and their impact on your portfolio.
  getFilledList(params?: {
    orderId?: string;
    symbol?: string;
    side?: 'buy' | 'sell';
    type?: 'limit' | 'market' | 'limit_stop' | 'market_stop';
    startAt?: number;
    endAt?: number;
    tradeType: 'TRADE' | 'MARGIN_TRADE' | 'MARGIN_ISOLATED_TRADE';
  }): Promise<
    APISuccessResponse<{
      currentPage: number;
      pageSize: number;
      totalNum: number;
      totalPage: number;
      items: {
        symbol: string; // symbol.
        tradeId: string; // trade id, it is generated by Matching engine.
        orderId: string; // Order ID, unique identifier of an order.
        counterOrderId: string; // counter order id.
        side: 'buy' | 'sell'; // transaction direction, include buy and sell.
        price: string; // order price
        size: string; // order quantity
        funds: string; // order funds
        type: 'limit' | 'market' | 'limit_stop' | 'market_stop'; // order type, e.g. limit, market, stop_limit.
        fee: string; // fee
        feeCurrency: string; // charge fee currency
        stop: string; // stop type, include entry and loss
        liquidity: 'taker' | 'maker'; // include taker and maker
        forceTaker: boolean; // forced to become taker, include true and false
        createdAt: number; // create time
        tradeType: 'TRADE' | 'MARGIN_TRADE' | 'MARGIN_ISOLATED_TRADE'; // The type of trading: TRADE（Spot Trading）, MARGIN_TRADE (Margin Trading).
      }[];
    }>
  > {
    return this.getPrivate('api/v1/fills', params);
  }

  // General permission, Retrieves a list of the most recent 1000 fills within the last 24 hours, sorted in descending order by time.
  getRecentFillsList(): Promise<
    APISuccessResponse<
      {
        symbol: string; // symbol
        tradeId: string; // trade id, it is generated by Matching engine.
        orderId: string; // Order ID, unique identifier of an order.
        counterOrderId: string; // counter order id.
        side: 'buy' | 'sell'; // transaction direction, include buy and sell.
        price: string; // order price
        size: string; // order quantity
        funds: string; // order funds
        type: 'limit' | 'market' | 'stop_limit' | 'market_stop'; // order type, e.g. limit, market, stop_limit.
        fee: string; // fee
        feeCurrency: string; // charge fee currency
        stop: string; // stop type, include entry and loss
        liquidity: 'taker' | 'maker'; // include taker and maker
        forceTaker: boolean; // forced to become taker, include true and false
        createdAt: number; // create time
        tradeType: 'TRADE' | 'MARGIN_TRADE' | 'MARGIN_ISOLATED_TRADE'; // The type of trading: TRADE（Spot Trading）, MARGIN_TRADE (Margin Trading).
      }[]
    >
  > {
    return this.getPrivate('api/v1/limit/fills');
  }

  /**
   *
   * Stop order
   *
   */

  // Spot and margin trading, places a stop order on the platform.
  placeStopOrder(params: {
    clientOid: string;
    side: 'buy' | 'sell';
    symbol: string;
    type?: 'limit' | 'market';
    remark?: string;
    stop?: 'loss' | 'entry';
    stopPrice?: string;
    stp?: 'CN' | 'CO' | 'CB' | 'DC';
    tradeType?: 'TRADE' | 'MARGIN_TRADE' | 'MARGIN_ISOLATED_TRADE';
    price?: string;
    size?: string;
    timeInForce?: 'GTC' | 'GTT' | 'IOC' | 'FOK';
    cancelAfter?: number;
    postOnly?: boolean;
    hidden?: boolean;
    iceberg?: boolean;
    visibleSize?: string;
    funds?: string;
  }): Promise<APISuccessResponse<{ orderId: string }>> {
    return this.postPrivate('api/v1/stop-order', params);
  }

  // Cancels a single stop order by orderId. Applicable for both spot and margin trading.
  // This endpoint requires the "Spot Trading" or "Margin Trading" permission on your API key.
  cancelStopOrderById(params: { orderId: string }): Promise<
    APISuccessResponse<{
      cancelledOrderIds: string[]; // Unique ID of the cancelled order
    }>
  > {
    return this.deletePrivate(`api/v1/stop-order/${params.orderId}`);
  }

  // Cancels a stop order by clientOid. Requires "Spot Trading" or "Margin Trading" permission.
  cancelStopOrderByClientOid(params: {
    clientOid: string;
    symbol?: string;
  }): Promise<
    APISuccessResponse<{
      cancelledOrderId: string; // Unique ID of the cancelled order
      clientOid: string; // Unique order id created by users to identify their orders
    }>
  > {
    return this.deletePrivate(
      `api/v1/stop-order/cancelOrderByClientOid`,
      params,
    );
  }

  // Cancels a batch of stop orders. Requires "Spot Trading" or "Margin Trading" permission.
  cancelStopOrders(params?: {
    symbol?: string;
    tradeType?: 'TRADE' | 'MARGIN_TRADE' | 'MARGIN_ISOLATED_TRADE';
    orderIds?: string;
  }): Promise<
    APISuccessResponse<{
      cancelledOrderIds: string[]; // Unique IDs of the cancelled orders
    }>
  > {
    return this.deletePrivate(`api/v1/stop-order/cancel`, params);
  }

  // Retrieves your current untriggered stop order list, paginated and sorted to show the latest first.
  getStopOrdersList(params?: {
    symbol?: string;
    side?: 'buy' | 'sell';
    type?: 'limit' | 'market' | 'limit_stop' | 'market_stop';
    tradeType?: 'TRADE' | 'MARGIN_TRADE' | 'MARGIN_ISOLATED_TRADE';
    startAt?: number;
    endAt?: number;
    currentPage?: number;
    orderIds?: string;
    pageSize?: number;
    stop?: 'stop' | 'oco';
  }): Promise<
    APISuccessResponse<{
      currentPage: number;
      pageSize: number;
      totalNum: number;
      totalPage: number;
      items: {
        id: string; // Order ID, the ID of an order.
        symbol: string; // Symbol
        userId: string; // User ID
        status: 'NEW' | 'TRIGGERED'; // Order status
        type: 'limit' | 'market'; // Order type
        side: 'buy' | 'sell'; // Transaction direction
        price: string; // Order price
        size: string; // Order quantity
        funds: string | null; // Order funds
        stp: string | null; // Self trade prevention
        timeInForce: 'GTC' | 'GTT' | 'IOC' | 'FOK'; // Time InForce
        cancelAfter: number; // Cancel orders after n seconds, requires timeInForce to be GTT
        postOnly: boolean; // PostOnly
        hidden: boolean; // Hidden order
        iceberg: boolean; // Iceberg order
        visibleSize: string | null; // Displayed quantity for iceberg order
        channel: string; // Order source
        clientOid: string; // User-entered order unique mark
        remark: string | null; // Remarks
        tags: string | null; // Tag order source
        orderTime: number; // Time of place a stop order, accurate to nanoseconds
        domainId: string; // DomainId, e.g: kucoin
        tradeSource: 'USER' | 'MARGIN_SYSTEM'; // Trade source
        tradeType: 'TRADE' | 'MARGIN_TRADE' | 'MARGIN_ISOLATED_TRADE'; // The type of trading
        feeCurrency: string; // The currency of the fee
        takerFeeRate: string; // Fee Rate of taker
        makerFeeRate: string; // Fee Rate of maker
        createdAt: number; // Order creation time
        stop: 'loss' | 'entry'; // Stop order type
        stopTriggerTime: number | null; // The trigger time of the stop order
        stopPrice: string; // Stop price
      }[];
    }>
  > {
    return this.getPrivate('api/v1/stop-order', params);
  }

  // Retrieves the details of a single stop order by its orderId.
  getStopOrderDetailsByOrderId(params: { orderId: string }): Promise<
    APISuccessResponse<{
      id: string; // Order ID, the ID of an order.
      symbol: string; // Symbol
      userId: string; // User ID
      status: 'NEW' | 'TRIGGERED'; // Order status
      type: 'limit' | 'market'; // Order type
      side: 'buy' | 'sell'; // Transaction direction
      price: string; // Order price
      size: string; // Order quantity
      funds: string | null; // Order funds
      stp: string | null; // Self trade prevention
      timeInForce: 'GTC' | 'GTT' | 'IOC' | 'FOK'; // Time InForce
      cancelAfter: number; // Cancel orders after n seconds, requires timeInForce to be GTT
      postOnly: boolean; // PostOnly
      hidden: boolean; // Hidden order
      iceberg: boolean; // Iceberg order
      visibleSize: string | null; // Displayed quantity for iceberg order
      channel: string; // Order source
      clientOid: string; // User-entered order unique mark
      remark: string | null; // Remarks
      tags: string | null; // Tag order source
      orderTime: number; // Time of place a stop order, accurate to nanoseconds
      domainId: string; // DomainId, e.g: kucoin
      tradeSource: 'USER' | 'MARGIN_SYSTEM'; // Trade source
      tradeType: 'TRADE' | 'MARGIN_TRADE' | 'MARGIN_ISOLATED_TRADE'; // The type of trading
      feeCurrency: string; // The currency of the fee
      takerFeeRate: string; // Fee Rate of taker
      makerFeeRate: string; // Fee Rate of maker
      createdAt: number; // Order creation time
      stop: 'loss' | 'entry'; // Stop order type
      stopTriggerTime: number | null; // The trigger time of the stop order
      stopPrice: string; // Stop price
    }>
  > {
    return this.getPrivate(`api/v1/stop-order/${params.orderId}`);
  }

  // Retrieves the details of a single stop order by its clientOid.
  getStopOrderDetailsByClientOid(params: {
    clientOid: string;
    symbol?: string;
  }): Promise<
    APISuccessResponse<
      {
        id: string; // Order ID, the ID of an order.
        symbol: string; // Symbol
        userId: string; // User ID
        status: 'NEW' | 'TRIGGERED'; // Order status
        type: 'limit' | 'market'; // Order type
        side: 'buy' | 'sell'; // Transaction direction
        price: string; // Order price
        size: string; // Order quantity
        funds: string | null; // Order funds
        stp: string | null; // Self trade prevention
        timeInForce: 'GTC' | 'GTT' | 'IOC' | 'FOK'; // Time InForce
        cancelAfter: number; // Cancel orders after n seconds, requires timeInForce to be GTT
        postOnly: boolean; // PostOnly
        hidden: boolean; // Hidden order
        iceberg: boolean; // Iceberg order
        visibleSize: string | null; // Displayed quantity for iceberg order
        channel: string; // Order source
        clientOid: string; // User-entered order unique mark
        remark: string | null; // Remarks
        tags: string | null; // Tag order source
        orderTime: number; // Time of place a stop order, accurate to nanoseconds
        domainId: string; // DomainId, e.g: kucoin
        tradeSource: 'USER' | 'MARGIN_SYSTEM'; // Trade source
        tradeType: 'TRADE' | 'MARGIN_TRADE' | 'MARGIN_ISOLATED_TRADE'; // The type of trading
        feeCurrency: string; // The currency of the fee
        takerFeeRate: string; // Fee Rate of taker
        makerFeeRate: string; // Fee Rate of maker
        createdAt: number; // Order creation time
        stop: 'loss' | 'entry'; // Stop order type
        stopTriggerTime: number | null; // The trigger time of the stop order
        stopPrice: string; // Stop price
      }[]
    >
  > {
    return this.getPrivate('api/v1/stop-order/queryOrderByClientOid', params);
  }
  /**
   *
   * OCO order
   *
   */

  // Places an OCO (One Cancels the Other) order on the platform.
  placeOCOOrder(params: {
    symbol: string;
    side: 'buy' | 'sell';
    price: string;
    size: string;
    stopPrice: string;
    limitPrice: string;
    tradeType?: 'TRADE'; // Currently only supports TRADE
    clientOid: string;
    remark?: string;
  }): Promise<
    APISuccessResponse<{
      orderId: string; // An order Id is returned once an order is successfully placed.
    }>
  > {
    return this.postPrivate('api/v3/oco/order', params);
  }

  // Cancels a single OCO order by orderId.
  cancelOCOOrderById(params: { orderId: string }): Promise<
    APISuccessResponse<{
      cancelledOrderIds: string[]; // List of few order IDs related to the canceled OCO order
    }>
  > {
    return this.deletePrivate(`api/v3/oco/order/${params.orderId}`);
  }

  // Cancels a single OCO order by clientOid.
  cancelOCOOrderByClientOid(params: { clientOid: string }): Promise<
    APISuccessResponse<{
      cancelledOrderIds: string[]; // List of two order IDs related to the canceled OCO order
    }>
  > {
    return this.deletePrivate(`api/v3/oco/client-order/${params.clientOid}`);
  }

  // Batch cancels OCO orders through orderIds.
  cancelMultipleOCOOrders(params?: {
    orderIds?: string;
    symbol?: string;
  }): Promise<
    APISuccessResponse<{
      cancelledOrderIds: string[]; // List of two order IDs related to the canceled OCO order
    }>
  > {
    return this.deletePrivate('api/v3/oco/orders', params);
  }

  // Retrieves the details of a single OCO order by its orderId.
  getOCOOrderDetailsByOrderId(params: { orderId: string }): Promise<
    APISuccessResponse<{
      orderId: string; // order id, Unique order id created by users to identify their orders
      symbol: string; // symbol, such as, ETH-BTC
      clientOid: string; // client order id
      orderTime: number; // Order placement time, milliseconds
      status: 'NEW' | 'DONE' | 'TRIGGERED' | 'CANCELLED'; // Order status
    }>
  > {
    return this.getPrivate(`api/v3/oco/order/${params.orderId}`);
  }

  // Retrieves the details of a single OCO order by its orderId, including detailed information about the individual orders.
  getOCOOrderDetails(params: { orderId: string }): Promise<
    APISuccessResponse<{
      orderId: string; // order id, Unique order id created by users to identify their orders
      symbol: string; // symbol, such as, ETH-BTC
      clientOid: string; // client order id
      orderTime: number; // Order placement time, milliseconds
      status: 'NEW' | 'DONE' | 'TRIGGERED' | 'CANCELLED'; // Order status
      orders: {
        id: string; // Sub-order ID
        symbol: string; // Symbol of the sub-order
        side: 'buy' | 'sell'; // Side of the sub-order
        price: string; // Price of the sub-order
        stopPrice: string; // Stop price of the sub-order
        size: string; // Size of the sub-order
        status: 'NEW' | 'DONE' | 'TRIGGERED' | 'CANCELLED'; // Status of the sub-order
      }[];
    }>
  > {
    return this.getPrivate(`api/v3/oco/order/details/${params.orderId}`);
  }

  // Retrieves the details of a single OCO order by its clientOid.
  getOCOOrderDetailsByClientOid(params: { clientOid: string }): Promise<
    APISuccessResponse<{
      orderId: string; // order id, Unique order id created by users to identify their orders
      symbol: string; // symbol, such as, ETH-BTC
      clientOid: string; // client order id
      orderTime: number; // Order placement time, milliseconds
      status: 'NEW' | 'DONE' | 'TRIGGERED' | 'CANCELLED'; // Order status
    }>
  > {
    return this.getPrivate(`api/v3/oco/client-order/${params.clientOid}`);
  }

  // Retrieves your current OCO order list, paginated and sorted to show the latest first.
  getOCOOrdersList(params: {
    pageSize: string;
    currentPage: string;
    symbol?: string;
    startAt?: number;
    endAt?: number;
    orderIds?: string;
  }): Promise<
    APISuccessResponse<{
      currentPage: number;
      pageSize: number;
      totalNum: number;
      totalPage: number;
      items: {
        orderId: string; // order id, Unique order id created by users to identify their orders
        symbol: string; // symbol, such as, ETH-BTC
        clientOid: string; // client order id
        orderTime: number; // Order placement time, milliseconds
        status: 'NEW' | 'DONE' | 'TRIGGERED' | 'CANCELLED'; // Order status
      }[];
    }>
  > {
    return this.getPrivate('api/v3/oco/orders', params);
  }

  /**
   *
   ***********
   * Margin Trading
   ***********
   *
   */

  /**
   *
   * Margin HF trade
   *
   */

  placeHFMarginOrder(params: {
    clientOid: string;
    side: 'buy' | 'sell';
    symbol: string;
    type?: 'limit' | 'market';
    stp?: 'CN' | 'CO' | 'CB' | 'DC';
    isIsolated?: boolean;
    autoBorrow?: boolean;
    autoRepay?: boolean;
    price?: string;
    size?: string;
    timeInForce?: 'GTC' | 'GTT' | 'IOC' | 'FOK';
    cancelAfter?: number;
    postOnly?: boolean;
    hidden?: boolean;
    iceberg?: boolean;
    visibleSize?: string;
    funds?: string;
  }): Promise<
    APISuccessResponse<{
      orderNo: string; // An order Id is returned once an order is successfully placed.
    }>
  > {
    return this.postPrivate('api/v3/hf/margin/order', params);
  }

  placeHFMarginOrderTest(): Promise<any> {
    return this.postPrivate('api/v3/hf/margin/order/test');
  }

  cancelHFMarginOrder(params: { orderId: string; symbol: string }): Promise<
    APISuccessResponse<{
      orderId: string; // Order id of the cancelled order
    }>
  > {
    return this.deletePrivate(
      `api/v3/hf/margin/orders/${params.orderId}`,
      params,
    );
  }

  cancelHFMarginOrderByClientOid(params: {
    clientOid: string;
    symbol: string;
  }): Promise<
    APISuccessResponse<{
      clientOid: string; // Order id of the cancelled order
    }>
  > {
    return this.deletePrivate(
      `api/v3/hf/margin/orders/client-order/${params.clientOid}`,
      params,
    );
  }

  cancelAllHFMarginOrders(params: {
    symbol: string;
    tradeType: 'MARGIN_TRADE' | 'MARGIN_ISOLATED_TRADE';
  }): Promise<any> {
    return this.deletePrivate(`api/v3/hf/margin/orders`, params);
  }

  getActiveHFMarginOrders(params: {
    symbol: string;
    tradeType: 'MARGIN_TRADE' | 'MARGIN_ISOLATED_TRADE';
  }): Promise<
    APISuccessResponse<
      {
        id: string; // Order id, a unique identifier pertaining to the order
        symbol: string; // Trading pair
        opType: 'DEAL'; // Operation type: DEAL
        type: 'limit' | 'market'; // Order type
        side: 'buy' | 'sell'; // Buy or sell
        price: string; // Order price
        size: string; // Order size
        funds: string; // Order amount
        dealFunds: string; // Number of filled funds
        dealSize: string; // Number of filled transactions
        fee: string; // Service fee
        feeCurrency: string; // Currency used to calculate fees
        stp: string; // Self trade prevention
        timeInForce: 'GTC' | 'GTT' | 'IOC' | 'FOK'; // Time in force
        postOnly: boolean; // Is it post only?
        hidden: boolean; // Is it a hidden order?
        iceberg: boolean; // Is it an iceberg order?
        visibleSize: string; // Visible size of iceberg order in order book.
        cancelAfter: number; // A GTT timeInForce that expires in n seconds
        channel: string; // Source of orders
        clientOid: string; // Identifier created by the client
        remark: string; // Order description
        tags: string; // Order identifier
        active: boolean; // Order status: true-The status of the order is active; false-The status of the order is done
        inOrderBook: boolean; // Whether to enter the orderbook: true: enter the orderbook; false: not enter the orderbook
        cancelExist: boolean; // Are there any cancellation records pertaining to the order?
        createdAt: number; // Order creation time
        lastUpdatedAt: number; // Last update time of order
        tradeType: 'MARGIN_TRADE' | 'MARGIN_ISOLATED_TRADE'; // Transaction type
      }[]
    >
  > {
    return this.getPrivate(`api/v3/hf/margin/orders/active`, params);
  }

  getHFMarginFilledList(params: {
    symbol: string;
    tradeType: 'MARGIN_TRADE' | 'MARGIN_ISOLATED_TRADE';
    side?: 'buy' | 'sell';
    type?: 'limit' | 'market';
    startAt?: number;
    endAt?: number;
    lastId?: number;
    limit?: number;
  }): Promise<
    APISuccessResponse<{
      lastId: number;
      items: {
        id: string; // Order id, a unique identifier pertaining to the order
        symbol: string; // Trading pair
        opType: 'DEAL'; // Operation type: DEAL
        type: 'limit' | 'market'; // Order type
        side: 'buy' | 'sell'; // Buy or sell
        price: string; // Order price
        size: string; // Order size
        funds: string; // Order amount
        dealFunds: string; // Number of filled funds
        dealSize: string; // Number of filled transactions
        fee: string; // Service fee
        feeCurrency: string; // Currency used to calculate fees
        stp: string; // Self trade prevention
        timeInForce: 'GTC' | 'GTT' | 'IOC' | 'FOK'; // Time in force
        postOnly: boolean; // Is it post only?
        hidden: boolean; // Is it a hidden order?
        iceberg: boolean; // Is it an iceberg order?
        visibleSize: string; // Visible size of iceberg order in order book.
        cancelAfter: number; // A GTT timeInForce that expires in n seconds
        channel: string; // Source of orders
        clientOid: string; // Identifier created by the client
        remark: string; // Order description
        tags: string; // Order identifier
        cancelExist: boolean; // Are there any cancellation records pertaining to the order?
        createdAt: number; // Order creation time
        lastUpdatedAt: number; // Last update time of order
        tradeType: 'MARGIN_TRADE' | 'MARGIN_ISOLATED_TRADE'; // Transaction type
        inOrderBook: boolean; // Whether to enter the orderbook: true: enter the orderbook; false: not enter the orderbook
        active: boolean; // Order status: true-The status of the order is active; false-The status of the order is done
      }[];
    }>
  > {
    return this.getPrivate('api/v3/hf/margin/orders/done', params);
  }

  getHFMarginOrderDetailsByOrderId(params: {
    orderId: string;
    symbol: string;
  }): Promise<
    APISuccessResponse<{
      id: string; // Order id, a unique identifier pertaining to the order
      symbol: string; // Trading pair
      opType: 'DEAL'; // Operation type: DEAL
      type: 'limit' | 'market'; // Order type
      side: 'buy' | 'sell'; // Buy or sell
      price: string; // Order price
      size: string; // Order size
      funds: string; // Order amount
      dealFunds: string; // Number of filled funds
      dealSize: string; // Number of filled transactions
      fee: string; // Service fee
      feeCurrency: string; // Currency used to calculate fees
      stp: string; // Self trade prevention
      timeInForce: 'GTC' | 'GTT' | 'IOC' | 'FOK'; // Time in force
      postOnly: boolean; // Is it post only?
      hidden: boolean; // Is it a hidden order?
      iceberg: boolean; // Is it an iceberg order?
      visibleSize: string; // Visible size of iceberg order in order book.
      cancelAfter: number; // A GTT timeInForce that expires in n seconds
      channel: string; // Source of orders
      clientOid: string; // Identifier created by the client
      remark: string; // Order description
      tags: string; // Order identifier
      active: boolean; // Order status: true-The status of the order is active; false-The status of the order is done
      inOrderBook: boolean; // Whether to enter the orderbook: true: enter the orderbook; false: not enter the orderbook
      cancelExist: boolean; // Are there any cancellation records pertaining to the order?
      createdAt: number; // Order creation time
      lastUpdatedAt: number; // Last update time of order
      tradeType: 'MARGIN_TRADE' | 'MARGIN_ISOLATED_TRADE'; // Transaction type
    }>
  > {
    return this.getPrivate(`api/v3/hf/margin/orders/${params.orderId}`, params);
  }

  getHFMarginOrderDetailsByClientOid(params: {
    clientOid: string;
    symbol: string;
  }): Promise<
    APISuccessResponse<{
      id: string; // Order id, a unique identifier pertaining to the order
      symbol: string; // Trading pair
      opType: 'DEAL'; // Operation type: DEAL
      type: 'limit' | 'market'; // Order type
      side: 'buy' | 'sell'; // Buy or sell
      price: string; // Order price
      size: string; // Order size
      funds: string; // Order amount
      dealFunds: string; // Number of filled funds
      dealSize: string; // Number of filled transactions
      fee: string; // Service fee
      feeCurrency: string; // Currency used to calculate fees
      stp: string; // Self trade prevention
      timeInForce: 'GTC' | 'GTT' | 'IOC' | 'FOK'; // Time in force
      postOnly: boolean; // Is it post only?
      hidden: boolean; // Is it a hidden order?
      iceberg: boolean; // Is it an iceberg order?
      visibleSize: string; // Visible size of iceberg order in order book.
      cancelAfter: number; // A GTT timeInForce that expires in n seconds
      channel: string; // Source of orders
      clientOid: string; // Identifier created by the client
      remark: string; // Order description
      tags: string; // Order identifier
      active: boolean; // Order status: true-The status of the order is active; false-The status of the order is done
      inOrderBook: boolean; // Whether to enter the orderbook: true: enter the orderbook; false: not enter the orderbook
      cancelExist: boolean; // Are there any cancellation records pertaining to the order?
      createdAt: number; // Order creation time
      lastUpdatedAt: number; // Last update time of order
      tradeType: 'MARGIN_TRADE' | 'MARGIN_ISOLATED_TRADE'; // Transaction type
    }>
  > {
    return this.getPrivate(
      `api/v3/hf/margin/orders/client-order/${params.clientOid}?symbol=${params.symbol}`,
    );
  }

  getHFMarginTransactionRecords(params: {
    orderId?: string;
    symbol: string;
    tradeType: 'MARGIN_TRADE' | 'MARGIN_ISOLATED_TRADE';
    side?: 'buy' | 'sell';
    type?: 'limit' | 'market';
    startAt?: number;
    endAt?: number;
    lastId?: number;
    limit?: number;
  }): Promise<
    APISuccessResponse<{
      items: {
        id: number; // Id of transaction detail
        symbol: string; // Trading pair
        tradeId: number; // Trade Id
        orderId: string; // Order Id
        counterOrderId: string; // Counterparty order Id
        side: 'buy' | 'sell'; // Buy or sell
        liquidity: 'taker' | 'maker'; // Liquidity type: taker or maker
        forceTaker: boolean; // Whether or not to forcefully process as taker
        price: string; // Order price
        size: string; // Order size
        funds: string; // Turnover
        fee: string; // Service fee
        feeRate: string; // Fee rate
        feeCurrency: string; // Currency used to calculate fees
        type: 'limit' | 'market'; // Order type: limit or market
        stop: string; // Take Profit and Stop Loss type, currently HFT does not support the Take Profit and Stop Loss type, so it is empty
        createdAt: number; // Transaction(Creation) time
        tradeType: 'MARGIN_TRADE' | 'MARGIN_ISOLATED_TRADE'; // Trade type: MARGIN_TRADE - cross margin trade, MARGIN_ISOLATED_TRADE - isolated margin trade
      }[];
      lastId: number;
    }>
  > {
    return this.getPrivate('api/v3/hf/margin/fills', params);
  }

  /**
   *
   * Orders
   *
   */

  placeMarginOrder(params: {
    clientOid: string;
    side: 'buy' | 'sell';
    symbol: string;
    type?: 'limit' | 'market';
    remark?: string;
    stp?: 'CN' | 'CO' | 'CB' | 'DC';
    marginModel?: 'cross' | 'isolated';
    autoBorrow?: boolean;
    autoRepay?: boolean;
    price: string;
    size?: string;
    timeInForce?: 'GTC' | 'GTT' | 'IOC' | 'FOK';
    cancelAfter?: number;
    postOnly?: boolean;
    hidden?: boolean;
    iceberg?: boolean;
    visibleSize?: string;
    funds?: string;
  }): Promise<
    APISuccessResponse<{
      orderId: string; // An order Id is returned once an order is successfully placed.
      borrowSize?: number; // Borrowed amount. The field is returned only after placing the order under the mode of Auto-Borrow.
      loanApplyId?: string; // ID of the borrowing response. The field is returned only after placing the order under the mode of Auto-Borrow.
    }>
  > {
    return this.postPrivate('api/v1/margin/order', params);
  }

  placeMarginOrderTest(): Promise<any> {
    return this.postPrivate('api/v1/margin/order/test');
  }

  /**
   *
   * Margin info
   *
   */

  getMarginLeveragedTokenInfo(params?: { currency?: string }): Promise<
    APISuccessResponse<
      {
        currency: string; // currency
        netAsset: number; // Net worth
        targetLeverage: string; // Target leverage
        actualLeverage: string; // Actual leverage
        assetsUnderManagement: string; // The amount of currency issued
        basket: string; // basket information
      }[]
    >
  > {
    return this.get('api/v3/etf/info', params);
  }

  getMarginMarkPrice(params: { symbol: string }): Promise<
    APISuccessResponse<{
      symbol: string; // symbol
      timePoint: number; // Time (millisecond)
      value: number; // Mark price
    }>
  > {
    return this.get(`api/v1/mark-price/${params.symbol}/current`);
  }

  getMarginConfigInfo(): Promise<
    APISuccessResponse<{
      currencyList: string[]; // Available currencies for margin trade
      warningDebtRatio: string; // The warning debt ratio of the forced liquidation
      liqDebtRatio: string; // The debt ratio of the forced liquidation
      maxLeverage: number; // Max leverage available
    }>
  > {
    return this.get('api/v1/margin/config');
  }

  getMarginRiskLimitCurrencyConfig(params: {
    isIsolated: boolean;
    symbol?: string;
    currency?: string;
  }): Promise<
    APISuccessResponse<
      {
        timestamp: number;
        currency?: string;
        symbol?: string;
        borrowMaxAmount?: string;
        buyMaxAmount?: string;
        holdMaxAmount?: string;
        borrowCoefficient?: string;
        marginCoefficient?: string;
        precision?: number;
        borrowMinAmount?: string;
        borrowMinUnit?: string;
        borrowEnabled?: boolean;
        baseMaxBorrowAmount?: string;
        quoteMaxBorrowAmount?: string;
        baseMaxBuyAmount?: string;
        quoteMaxBuyAmount?: string;
        baseMaxHoldAmount?: string;
        quoteMaxHoldAmount?: string;
        basePrecision?: number;
        quotePrecision?: number;
        baseBorrowCoefficient?: string;
        quoteBorrowCoefficient?: string;
        baseMarginCoefficient?: string;
        quoteMarginCoefficient?: string;
        baseBorrowMinAmount?: string | null;
        quoteBorrowMinAmount?: string | null;
        baseBorrowMinUnit?: string | null;
        quoteBorrowMinUnit?: string | null;
        baseBorrowEnabled?: boolean;
        quoteBorrowEnabled?: boolean;
      }[]
    >
  > {
    return this.get('api/v3/margin/currencies', params);
  }

  /**
   *
   * Isolated Margin
   *
   */

  getIsolatedMarginSymbolsConfig(): Promise<
    APISuccessResponse<
      {
        symbol: string; // The trading pair code
        symbolName: string; // Trading pair name
        baseCurrency: string; // Base currency type
        quoteCurrency: string; // Quote coin
        maxLeverage: number; // Maximum leverage
        flDebtRatio: string; // Liquidation debt ratio
        tradeEnable: boolean; // Trade switch
        autoRenewMaxDebtRatio: string; // During automatic renewal of the max debt ratio, the loan will only be renewed if it is lower than the debt ratio, with partial liquidation triggered for repayment if the debt ratio is in excess
        baseBorrowEnable: boolean; // base coin type borrow switch
        quoteBorrowEnable: boolean; // quote coin type borrow switch
        baseTransferInEnable: boolean; // base coin type transfer switch
        quoteTransferInEnable: boolean; // quote coin type transfer switch
      }[]
    >
  > {
    return this.getPrivate('api/v1/isolated/symbols');
  }

  getIsolatedMarginAccountInfo(params?: {
    balanceCurrency?: 'USDT' | 'KCS' | 'BTC';
  }): Promise<
    APISuccessResponse<{
      totalConversionBalance: string; // The total balance of the isolated margin account (in the specified coin)
      liabilityConversionBalance: string; // Total liabilities of the isolated margin account (in the specified coin)
      assets: {
        symbol: string; // Trading pairs, with each trading pair indicating a position
        status: string; // The position status: Existing liabilities-DEBT, No liabilities-CLEAR, Bankrupcy (after position enters a negative balance)-BANKRUPTCY, Existing borrowings-IN_BORROW, Existing repayments-IN_REPAY, Under liquidation-IN_LIQUIDATION, Under auto-renewal assets-IN_AUTO_RENEW.
        debtRatio: string; // Debt ratio
        baseAsset: {
          currency: string; // Coin type Code
          totalBalance: string; // Current coin type asset amount
          holdBalance: string; // Current coin type frozen
          availableBalance: string; // The available balance (available assets - frozen assets)
          liability: string; // Liability
          interest: string; // Interest
          borrowableAmount: string; // Borrowable amount
        };
        quoteAsset: {
          currency: string; // Coin type Code
          totalBalance: string; // Current coin type asset amount
          holdBalance: string; // Current coin type frozen
          availableBalance: string; // The available balance (available assets - frozen assets)
          liability: string; // Liability
          interest: string; // Interest
          borrowableAmount: string; // Borrowable amount
        };
      }[];
    }>
  > {
    return this.getPrivate('api/v1/isolated/accounts', params);
  }

  getSingleIsolatedMarginAccountInfo(params: { symbol: string }): Promise<
    APISuccessResponse<{
      symbol: string; // Trading pair
      status: string; // The position status: Existing liabilities-DEBT, No liabilities-CLEAR, Bankrupcy (after position enters a negative balance)-BANKRUPTCY, Existing borrowings-IN_BORROW, Existing repayments-IN_REPAY, Under liquidation-IN_LIQUIDATION, Under auto-renewal-IN_AUTO_RENEW (permissions per state)
      debtRatio: string; // Debt ratio
      baseAsset: {
        currency: string; // Coin type Code
        totalBalance: string; // Current coin type asset amount
        holdBalance: string; // Current coin type frozen
        availableBalance: string; // The available balance (available assets - frozen assets)
        liability: string; // The principal of the of current coin liability (the outstanding principal)
        interest: string; // The interest of the liability of the current coin (the outstanding interest)
        borrowableAmount: string; // The borrowable amount
      };
      quoteAsset: {
        currency: string; // Coin type Code
        totalBalance: string; // Current coin type asset amount
        holdBalance: string; // Current coin type frozen
        availableBalance: string; // The available balance (available assets - frozen assets)
        liability: string; // The principal of the of current coin liability (the outstanding principal)
        interest: string; // The interest of the liability of the current coin (the outstanding interest)
        borrowableAmount: string; // The borrowable amount
      };
    }>
  > {
    return this.getPrivate(`api/v1/isolated/account/${params.symbol}`);
  }

  /**
   *
   * Margin trading(v3)
   *
   */

  marginBorrowV3(params: {
    isIsolated?: boolean;
    symbol?: string;
    currency: string;
    size: number;
    timeInForce: 'IOC' | 'FOK';
  }): Promise<
    APISuccessResponse<{
      orderNo: string; // Borrow order number
      actualSize: number; // Actual borrowed amount
    }>
  > {
    return this.postPrivate('api/v3/margin/borrow', params);
  }

  marginRepayV3(params: {
    isIsolated?: boolean;
    symbol?: string;
    currency: string;
    size: number;
  }): Promise<
    APISuccessResponse<{
      orderNo: string; // Borrow order number
      actualSize: number; // Actual borrowed amount
    }>
  > {
    return this.postPrivate('api/v3/margin/repay', params);
  }

  getMarginBorrowingHistoryV3(params: {
    currency: string;
    isIsolated?: boolean;
    symbol?: string;
    orderNo?: string;
    startTime?: number;
    endTime?: number;
    currentPage?: number;
    pageSize?: number;
  }): Promise<
    APISuccessResponse<
      {
        orderNo: string; // Borrow order ID
        symbol: string; // Isolated margin trading pair; empty for cross margin
        currency: string; // Currency
        size: number; // Initiated borrowing amount
        actualSize: number; // Actual borrowed amount
        status: string; // Status
        createdTime: number; // Time of borrowing
      }[]
    >
  > {
    return this.getPrivate('api/v3/margin/borrow', params);
  }

  getMarginRepaymentHistoryV3(params: {
    currency: string;
    isIsolated?: boolean;
    symbol?: string;
    orderNo?: string;
    startTime?: number;
    endTime?: number;
    currentPage?: number;
    pageSize?: number;
  }): Promise<
    APISuccessResponse<
      {
        orderNo: string; // Borrow order ID
        symbol: string; // Isolated margin trading pair; empty for cross margin
        currency: string; // Currency
        size: number; // Initiated borrowing amount
        actualSize: number; // Actual borrowed amount
        status: string; // Status
        createdTime: number; // Time of borrowing
      }[]
    >
  > {
    return this.getPrivate('api/v3/margin/repay', params);
  }

  /**
   *
   * Lending market(v3)
   *
   */

  getLendingMarketCurrencyInfoV3(params?: { currency?: string }): Promise<
    APISuccessResponse<{
      currentPage: number;
      pageSize: number;
      totalNum: number;
      totalPage: number;
      items: {
        currency: string; // Currency
        purchaseEnable: boolean; // Support subscription
        redeemEnable: boolean; // Support redemption
        increment: string; // Increment precision for subscription and redemption
        minPurchaseSize: string; // Minimum subscription amount
        minInterestRate: string; // Minimum annualized interest rate
        maxInterestRate: string; // Maximum annualized interest rate
        interestIncrement: string; // Increment precision for interest; default is 0.0001
        maxPurchaseSize: string; // Maximum subscription limit per user
        marketInterestRate: string; // Latest market annualized interest rate
        autoPurchaseEnable: boolean; // Auto-Subscribe enabled?: true: enable, false: disable
      }[];
    }>
  > {
    return this.get('api/v3/project/list', params);
  }

  getLendingMarketInterestRatesV3(params: { currency: string }): Promise<
    APISuccessResponse<
      {
        time: string; // Time: YYYYMMDDHH00
        marketInterestRate: string; // Market interest rate
      }[]
    >
  > {
    return this.get('api/v3/project/marketInterestRate', params);
  }

  initiateLendingSubscriptionV3(params: {
    currency: string;
    size: string;
    interestRate: string;
  }): Promise<
    APISuccessResponse<
      {
        orderNo: string;
      }[]
    >
  > {
    return this.postPrivate('api/v3/purchase', params);
  }

  initiateLendingRedemptionV3(params: {
    currency: string;
    size: string;
    purchaseOrderNo: string;
  }): Promise<
    APISuccessResponse<
      {
        orderNo: string;
      }[]
    >
  > {
    return this.postPrivate('api/v3/redeem', params);
  }

  modifyLendingSubscriptionOrdersV3(params: {
    currency: string;
    purchaseOrderNo: string;
    interestRate: string;
  }): Promise<any> {
    return this.postPrivate('api/v3/lend/purchase/update', params);
  }

  getLendingRedemptionOrdersV3(params: {
    currency: string;
    redeemOrderNo?: string;
    status: 'DONE' | 'PENDING';
    currentPage?: number;
    pageSize?: number;
  }): Promise<
    APISuccessResponse<{
      currentPage: number;
      pageSize: number;
      totalNum: number;
      totalPage: number;
      items: {
        currency: string; // Currency
        purchaseOrderNo: string; // Subscription order number
        redeemOrderNo: string; // Redemption order number
        redeemAmount: string; // Redemption amount
        receiptAmount: string; // Redeemed amount
        applyTime: number; // Time of redemption
        status: 'DONE' | 'PENDING'; // Status: DONE-completed; PENDING-settling
      }[];
    }>
  > {
    return this.getPrivate('api/v3/redeem/orders', params);
  }

  getLendingSubscriptionOrdersV3(params: {
    currency: string;
    purchaseOrderNo?: string;
    status: 'DONE' | 'PENDING';
    currentPage?: number;
    pageSize?: number;
  }): Promise<
    APISuccessResponse<{
      currentPage: number;
      pageSize: number;
      totalNum: number;
      totalPage: number;
      items: {
        currency: string; // Currency
        purchaseOrderNo: string; // Subscription order number
        purchaseAmount: string; // Total subscription amount
        lendAmount: string; // Executed amount
        redeemAmount: string; // Redeemed amount
        interestRate: string; // Target annualized interest rate
        incomeAmount: string; // Total earnings
        applyTime: number; // Time of subscription
        status: 'DONE' | 'PENDING'; // Status: DONE-completed; PENDING-settling
      }[];
    }>
  > {
    return this.getPrivate('api/v3/purchase/orders', params);
  }
}
