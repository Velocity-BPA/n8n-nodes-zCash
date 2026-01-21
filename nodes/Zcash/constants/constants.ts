/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

export const RESOURCES = {
  WALLET: 'wallet',
  TRANSACTION: 'transaction',
  BLOCK: 'block',
  SHIELDED: 'shielded',
  KEYS: 'keys',
  MINING: 'mining',
  NETWORK: 'network',
  UTILITY: 'utility',
} as const;

export const OPERATIONS = {
  // Wallet
  GET_BALANCE: 'getBalance',
  GET_NEW_ADDRESS: 'getNewAddress',
  LIST_ADDRESSES: 'listAddresses',
  LIST_TRANSACTIONS: 'listTransactions',
  SEND_TO_ADDRESS: 'sendToAddress',
  VALIDATE_ADDRESS: 'validateAddress',
  GET_WALLET_INFO: 'getWalletInfo',
  BACKUP_WALLET: 'backupWallet',

  // Transaction
  GET_TRANSACTION: 'getTransaction',
  GET_RAW_TRANSACTION: 'getRawTransaction',
  SEND_RAW_TRANSACTION: 'sendRawTransaction',
  DECODE_RAW_TRANSACTION: 'decodeRawTransaction',
  CREATE_RAW_TRANSACTION: 'createRawTransaction',
  SIGN_RAW_TRANSACTION: 'signRawTransaction',
  LIST_UNSPENT: 'listUnspent',

  // Block
  GET_BLOCK: 'getBlock',
  GET_BLOCK_COUNT: 'getBlockCount',
  GET_BLOCK_HASH: 'getBlockHash',
  GET_BEST_BLOCK_HASH: 'getBestBlockHash',
  GET_BLOCK_HEADER: 'getBlockHeader',
  GET_BLOCKCHAIN_INFO: 'getBlockchainInfo',
  GET_DIFFICULTY: 'getDifficulty',

  // Shielded
  Z_GET_BALANCE: 'zGetBalance',
  Z_GET_NEW_ADDRESS: 'zGetNewAddress',
  Z_LIST_ADDRESSES: 'zListAddresses',
  Z_SEND_MANY: 'zSendMany',
  Z_GET_OPERATION_STATUS: 'zGetOperationStatus',
  Z_GET_OPERATION_RESULT: 'zGetOperationResult',
  Z_LIST_OPERATIONS: 'zListOperations',
  Z_VIEW_TRANSACTION: 'zViewTransaction',
  Z_GET_TOTAL_BALANCE: 'zGetTotalBalance',

  // Keys
  EXPORT_VIEWING_KEY: 'exportViewingKey',
  IMPORT_VIEWING_KEY: 'importViewingKey',
  EXPORT_SPENDING_KEY: 'exportSpendingKey',
  IMPORT_SPENDING_KEY: 'importSpendingKey',
  Z_EXPORT_KEY: 'zExportKey',
  Z_IMPORT_KEY: 'zImportKey',

  // Mining
  GET_MINING_INFO: 'getMiningInfo',
  GET_NETWORK_HASHRATE: 'getNetworkHashrate',
  GET_BLOCK_TEMPLATE: 'getBlockTemplate',
  SUBMIT_BLOCK: 'submitBlock',
  GET_NETWORK_SOL_PS: 'getNetworkSolPs',

  // Network
  GET_NETWORK_INFO: 'getNetworkInfo',
  GET_PEER_INFO: 'getPeerInfo',
  GET_CONNECTION_COUNT: 'getConnectionCount',
  ADD_NODE: 'addNode',
  GET_ADDED_NODE_INFO: 'getAddedNodeInfo',
  DISCONNECT_NODE: 'disconnectNode',

  // Utility
  ESTIMATE_FEE: 'estimateFee',
  SIGN_MESSAGE: 'signMessage',
  VERIFY_MESSAGE: 'verifyMessage',
  GET_INFO: 'getInfo',
  HELP: 'help',
  STOP: 'stop',
} as const;

export const ADDRESS_TYPES = {
  TRANSPARENT: 'transparent',
  SAPLING: 'sapling',
  UNIFIED: 'unified',
} as const;

export const NETWORKS = {
  MAINNET: 'mainnet',
  TESTNET: 'testnet',
  REGTEST: 'regtest',
} as const;

export const LICENSING_NOTICE = `[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.`;
