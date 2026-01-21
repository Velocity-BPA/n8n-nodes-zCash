/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

import { createRpcClient, ZcashRpcClient } from './transport/rpcClient';
import { LICENSING_NOTICE } from './constants/constants';

// Wallet operations
import * as walletOps from './actions/wallet/wallet.operations';
// Transaction operations
import * as transactionOps from './actions/transaction/transaction.operations';
// Block operations
import * as blockOps from './actions/block/block.operations';
// Shielded operations
import * as shieldedOps from './actions/shielded/shielded.operations';
// Keys operations
import * as keysOps from './actions/keys/keys.operations';
// Mining operations
import * as miningOps from './actions/mining/mining.operations';
// Network operations
import * as networkOps from './actions/network/network.operations';
// Utility operations
import * as utilityOps from './actions/utility/utility.operations';

// Log licensing notice once on module load
let licensingLogged = false;
function logLicensingNotice(): void {
  if (!licensingLogged) {
    console.warn(LICENSING_NOTICE);
    licensingLogged = true;
  }
}

async function executeWalletOperation(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  operation: string,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  switch (operation) {
    case 'getBalance':
      return walletOps.getBalance(context, client, itemIndex);
    case 'getNewAddress':
      return walletOps.getNewAddress(context, client, itemIndex);
    case 'listAddresses':
      return walletOps.listAddresses(context, client, itemIndex);
    case 'listTransactions':
      return walletOps.listTransactions(context, client, itemIndex);
    case 'sendToAddress':
      return walletOps.sendToAddress(context, client, itemIndex);
    case 'validateAddress':
      return walletOps.validateAddress(context, client, itemIndex);
    case 'getWalletInfo':
      return walletOps.getWalletInfo(context, client, itemIndex);
    case 'backupWallet':
      return walletOps.backupWallet(context, client, itemIndex);
    default:
      throw new Error(`Unknown wallet operation: ${operation}`);
  }
}

async function executeTransactionOperation(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  operation: string,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  switch (operation) {
    case 'getTransaction':
      return transactionOps.getTransaction(context, client, itemIndex);
    case 'getRawTransaction':
      return transactionOps.getRawTransaction(context, client, itemIndex);
    case 'sendRawTransaction':
      return transactionOps.sendRawTransaction(context, client, itemIndex);
    case 'decodeRawTransaction':
      return transactionOps.decodeRawTransaction(context, client, itemIndex);
    case 'createRawTransaction':
      return transactionOps.createRawTransaction(context, client, itemIndex);
    case 'signRawTransaction':
      return transactionOps.signRawTransaction(context, client, itemIndex);
    case 'listUnspent':
      return transactionOps.listUnspent(context, client, itemIndex);
    default:
      throw new Error(`Unknown transaction operation: ${operation}`);
  }
}

async function executeBlockOperation(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  operation: string,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  switch (operation) {
    case 'getBlock':
      return blockOps.getBlock(context, client, itemIndex);
    case 'getBlockCount':
      return blockOps.getBlockCount(context, client, itemIndex);
    case 'getBlockHash':
      return blockOps.getBlockHash(context, client, itemIndex);
    case 'getBestBlockHash':
      return blockOps.getBestBlockHash(context, client, itemIndex);
    case 'getBlockHeader':
      return blockOps.getBlockHeader(context, client, itemIndex);
    case 'getBlockchainInfo':
      return blockOps.getBlockchainInfo(context, client, itemIndex);
    case 'getDifficulty':
      return blockOps.getDifficulty(context, client, itemIndex);
    default:
      throw new Error(`Unknown block operation: ${operation}`);
  }
}

async function executeShieldedOperation(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  operation: string,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  switch (operation) {
    case 'zGetBalance':
      return shieldedOps.zGetBalance(context, client, itemIndex);
    case 'zGetNewAddress':
      return shieldedOps.zGetNewAddress(context, client, itemIndex);
    case 'zListAddresses':
      return shieldedOps.zListAddresses(context, client, itemIndex);
    case 'zSendMany':
      return shieldedOps.zSendMany(context, client, itemIndex);
    case 'zGetOperationStatus':
      return shieldedOps.zGetOperationStatus(context, client, itemIndex);
    case 'zGetOperationResult':
      return shieldedOps.zGetOperationResult(context, client, itemIndex);
    case 'zListOperations':
      return shieldedOps.zListOperations(context, client, itemIndex);
    case 'zViewTransaction':
      return shieldedOps.zViewTransaction(context, client, itemIndex);
    case 'zGetTotalBalance':
      return shieldedOps.zGetTotalBalance(context, client, itemIndex);
    default:
      throw new Error(`Unknown shielded operation: ${operation}`);
  }
}

async function executeKeysOperation(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  operation: string,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  switch (operation) {
    case 'exportViewingKey':
      return keysOps.exportViewingKey(context, client, itemIndex);
    case 'importViewingKey':
      return keysOps.importViewingKey(context, client, itemIndex);
    case 'exportSpendingKey':
      return keysOps.exportSpendingKey(context, client, itemIndex);
    case 'importSpendingKey':
      return keysOps.importSpendingKey(context, client, itemIndex);
    case 'zExportKey':
      return keysOps.zExportKey(context, client, itemIndex);
    case 'zImportKey':
      return keysOps.zImportKey(context, client, itemIndex);
    default:
      throw new Error(`Unknown keys operation: ${operation}`);
  }
}

async function executeMiningOperation(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  operation: string,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  switch (operation) {
    case 'getMiningInfo':
      return miningOps.getMiningInfo(context, client, itemIndex);
    case 'getNetworkHashrate':
      return miningOps.getNetworkHashrate(context, client, itemIndex);
    case 'getBlockTemplate':
      return miningOps.getBlockTemplate(context, client, itemIndex);
    case 'submitBlock':
      return miningOps.submitBlock(context, client, itemIndex);
    case 'getNetworkSolPs':
      return miningOps.getNetworkSolPs(context, client, itemIndex);
    default:
      throw new Error(`Unknown mining operation: ${operation}`);
  }
}

async function executeNetworkOperation(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  operation: string,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  switch (operation) {
    case 'getNetworkInfo':
      return networkOps.getNetworkInfo(context, client, itemIndex);
    case 'getPeerInfo':
      return networkOps.getPeerInfo(context, client, itemIndex);
    case 'getConnectionCount':
      return networkOps.getConnectionCount(context, client, itemIndex);
    case 'addNode':
      return networkOps.addNode(context, client, itemIndex);
    case 'getAddedNodeInfo':
      return networkOps.getAddedNodeInfo(context, client, itemIndex);
    case 'disconnectNode':
      return networkOps.disconnectNode(context, client, itemIndex);
    default:
      throw new Error(`Unknown network operation: ${operation}`);
  }
}

async function executeUtilityOperation(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  operation: string,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  switch (operation) {
    case 'estimateFee':
      return utilityOps.estimateFee(context, client, itemIndex);
    case 'signMessage':
      return utilityOps.signMessage(context, client, itemIndex);
    case 'verifyMessage':
      return utilityOps.verifyMessage(context, client, itemIndex);
    case 'getInfo':
      return utilityOps.getInfo(context, client, itemIndex);
    case 'help':
      return utilityOps.help(context, client, itemIndex);
    case 'stop':
      return utilityOps.stop(context, client, itemIndex);
    default:
      throw new Error(`Unknown utility operation: ${operation}`);
  }
}

export class Zcash implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Zcash',
    name: 'zcash',
    icon: 'file:zcash.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with Zcash blockchain via RPC',
    defaults: {
      name: 'Zcash',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'zcashRpcApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'Wallet', value: 'wallet' },
          { name: 'Transaction', value: 'transaction' },
          { name: 'Block', value: 'block' },
          { name: 'Shielded', value: 'shielded' },
          { name: 'Keys', value: 'keys' },
          { name: 'Mining', value: 'mining' },
          { name: 'Network', value: 'network' },
          { name: 'Utility', value: 'utility' },
        ],
        default: 'wallet',
      },

      // ==================== WALLET OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['wallet'] } },
        options: [
          { name: 'Get Balance', value: 'getBalance', description: 'Get wallet balance', action: 'Get wallet balance' },
          { name: 'Get New Address', value: 'getNewAddress', description: 'Generate a new address', action: 'Generate new address' },
          { name: 'List Addresses', value: 'listAddresses', description: 'List all addresses', action: 'List addresses' },
          { name: 'List Transactions', value: 'listTransactions', description: 'List transactions', action: 'List transactions' },
          { name: 'Send To Address', value: 'sendToAddress', description: 'Send ZEC to an address', action: 'Send ZEC' },
          { name: 'Validate Address', value: 'validateAddress', description: 'Validate an address', action: 'Validate address' },
          { name: 'Get Wallet Info', value: 'getWalletInfo', description: 'Get wallet information', action: 'Get wallet info' },
          { name: 'Backup Wallet', value: 'backupWallet', description: 'Backup wallet to file', action: 'Backup wallet' },
        ],
        default: 'getBalance',
      },

      // ==================== TRANSACTION OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['transaction'] } },
        options: [
          { name: 'Get Transaction', value: 'getTransaction', description: 'Get transaction details', action: 'Get transaction' },
          { name: 'Get Raw Transaction', value: 'getRawTransaction', description: 'Get raw transaction data', action: 'Get raw transaction' },
          { name: 'Send Raw Transaction', value: 'sendRawTransaction', description: 'Broadcast raw transaction', action: 'Send raw transaction' },
          { name: 'Decode Raw Transaction', value: 'decodeRawTransaction', description: 'Decode raw transaction', action: 'Decode raw transaction' },
          { name: 'Create Raw Transaction', value: 'createRawTransaction', description: 'Create raw transaction', action: 'Create raw transaction' },
          { name: 'Sign Raw Transaction', value: 'signRawTransaction', description: 'Sign raw transaction', action: 'Sign raw transaction' },
          { name: 'List Unspent', value: 'listUnspent', description: 'List unspent outputs', action: 'List unspent' },
        ],
        default: 'getTransaction',
      },

      // ==================== BLOCK OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['block'] } },
        options: [
          { name: 'Get Block', value: 'getBlock', description: 'Get block by hash', action: 'Get block' },
          { name: 'Get Block Count', value: 'getBlockCount', description: 'Get current block height', action: 'Get block count' },
          { name: 'Get Block Hash', value: 'getBlockHash', description: 'Get block hash by height', action: 'Get block hash' },
          { name: 'Get Best Block Hash', value: 'getBestBlockHash', description: 'Get latest block hash', action: 'Get best block hash' },
          { name: 'Get Block Header', value: 'getBlockHeader', description: 'Get block header', action: 'Get block header' },
          { name: 'Get Blockchain Info', value: 'getBlockchainInfo', description: 'Get blockchain info', action: 'Get blockchain info' },
          { name: 'Get Difficulty', value: 'getDifficulty', description: 'Get mining difficulty', action: 'Get difficulty' },
        ],
        default: 'getBlockCount',
      },

      // ==================== SHIELDED OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['shielded'] } },
        options: [
          { name: 'Z Get Balance', value: 'zGetBalance', description: 'Get shielded balance', action: 'Get shielded balance' },
          { name: 'Z Get New Address', value: 'zGetNewAddress', description: 'Generate shielded address', action: 'Get new shielded address' },
          { name: 'Z List Addresses', value: 'zListAddresses', description: 'List shielded addresses', action: 'List shielded addresses' },
          { name: 'Z Send Many', value: 'zSendMany', description: 'Send shielded transaction', action: 'Send shielded transaction' },
          { name: 'Z Get Operation Status', value: 'zGetOperationStatus', description: 'Check operation status', action: 'Get operation status' },
          { name: 'Z Get Operation Result', value: 'zGetOperationResult', description: 'Get operation result', action: 'Get operation result' },
          { name: 'Z List Operations', value: 'zListOperations', description: 'List operations', action: 'List operations' },
          { name: 'Z View Transaction', value: 'zViewTransaction', description: 'View transaction details', action: 'View transaction' },
          { name: 'Z Get Total Balance', value: 'zGetTotalBalance', description: 'Get total balance', action: 'Get total balance' },
        ],
        default: 'zGetBalance',
      },

      // ==================== KEYS OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['keys'] } },
        options: [
          { name: 'Export Viewing Key', value: 'exportViewingKey', description: 'Export viewing key', action: 'Export viewing key' },
          { name: 'Import Viewing Key', value: 'importViewingKey', description: 'Import viewing key', action: 'Import viewing key' },
          { name: 'Export Spending Key', value: 'exportSpendingKey', description: 'Export spending key', action: 'Export spending key' },
          { name: 'Import Spending Key', value: 'importSpendingKey', description: 'Import spending key', action: 'Import spending key' },
          { name: 'Z Export Key', value: 'zExportKey', description: 'Export z-address key', action: 'Export z-address key' },
          { name: 'Z Import Key', value: 'zImportKey', description: 'Import z-address key', action: 'Import z-address key' },
        ],
        default: 'exportViewingKey',
      },

      // ==================== MINING OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['mining'] } },
        options: [
          { name: 'Get Mining Info', value: 'getMiningInfo', description: 'Get mining information', action: 'Get mining info' },
          { name: 'Get Network Hashrate', value: 'getNetworkHashrate', description: 'Get network hashrate', action: 'Get network hashrate' },
          { name: 'Get Block Template', value: 'getBlockTemplate', description: 'Get block template', action: 'Get block template' },
          { name: 'Submit Block', value: 'submitBlock', description: 'Submit mined block', action: 'Submit block' },
          { name: 'Get Network Sol/s', value: 'getNetworkSolPs', description: 'Get network solutions/second', action: 'Get network sol/s' },
        ],
        default: 'getMiningInfo',
      },

      // ==================== NETWORK OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['network'] } },
        options: [
          { name: 'Get Network Info', value: 'getNetworkInfo', description: 'Get network information', action: 'Get network info' },
          { name: 'Get Peer Info', value: 'getPeerInfo', description: 'Get connected peers', action: 'Get peer info' },
          { name: 'Get Connection Count', value: 'getConnectionCount', description: 'Get connection count', action: 'Get connection count' },
          { name: 'Add Node', value: 'addNode', description: 'Add a peer node', action: 'Add node' },
          { name: 'Get Added Node Info', value: 'getAddedNodeInfo', description: 'Get added node info', action: 'Get added node info' },
          { name: 'Disconnect Node', value: 'disconnectNode', description: 'Disconnect a peer', action: 'Disconnect node' },
        ],
        default: 'getNetworkInfo',
      },

      // ==================== UTILITY OPERATIONS ====================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['utility'] } },
        options: [
          { name: 'Estimate Fee', value: 'estimateFee', description: 'Estimate transaction fee', action: 'Estimate fee' },
          { name: 'Sign Message', value: 'signMessage', description: 'Sign a message', action: 'Sign message' },
          { name: 'Verify Message', value: 'verifyMessage', description: 'Verify signed message', action: 'Verify message' },
          { name: 'Get Info', value: 'getInfo', description: 'Get node info', action: 'Get info' },
          { name: 'Help', value: 'help', description: 'Get RPC help', action: 'Get help' },
          { name: 'Stop', value: 'stop', description: 'Stop zcashd', action: 'Stop node' },
        ],
        default: 'getInfo',
      },

      // ==================== PARAMETERS ====================

      // Address parameter (used by multiple operations)
      {
        displayName: 'Address',
        name: 'address',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            operation: [
              'sendToAddress', 'validateAddress', 'zGetBalance',
              'exportViewingKey', 'exportSpendingKey', 'zExportKey',
              'signMessage', 'verifyMessage',
            ],
          },
        },
        description: 'Zcash address',
      },

      // Amount parameter
      {
        displayName: 'Amount',
        name: 'amount',
        type: 'number',
        default: 0,
        required: true,
        typeOptions: { minValue: 0, numberPrecision: 8 },
        displayOptions: {
          show: { operation: ['sendToAddress', 'zSendMany'] },
        },
        description: 'Amount in ZEC',
      },

      // Transaction ID parameter
      {
        displayName: 'Transaction ID',
        name: 'txid',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { operation: ['getTransaction', 'getRawTransaction', 'zViewTransaction'] },
        },
        description: 'Transaction hash',
      },

      // Block hash parameter
      {
        displayName: 'Block Hash',
        name: 'blockHash',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { operation: ['getBlock', 'getBlockHeader'] },
        },
        description: 'Block hash',
      },

      // Block height parameter
      {
        displayName: 'Block Height',
        name: 'height',
        type: 'number',
        default: 0,
        required: true,
        displayOptions: {
          show: { operation: ['getBlockHash'] },
        },
        description: 'Block height',
      },

      // Hex string parameter (for raw transactions)
      {
        displayName: 'Hex String',
        name: 'hexString',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { operation: ['sendRawTransaction', 'decodeRawTransaction', 'signRawTransaction'] },
        },
        description: 'Raw transaction hex',
      },

      // Shielded address type
      {
        displayName: 'Address Type',
        name: 'addressType',
        type: 'options',
        options: [
          { name: 'Sapling', value: 'sapling' },
          { name: 'Unified', value: 'p2pkh' },
        ],
        default: 'sapling',
        displayOptions: {
          show: { operation: ['zGetNewAddress', 'getNewAddress'] },
        },
        description: 'Type of address to generate',
      },

      // From address for z_sendmany
      {
        displayName: 'From Address',
        name: 'fromAddress',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { operation: ['zSendMany'] },
        },
        description: 'Source address',
      },

      // To address for z_sendmany
      {
        displayName: 'To Address',
        name: 'toAddress',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { operation: ['zSendMany'] },
        },
        description: 'Destination address',
      },

      // Memo for shielded transactions
      {
        displayName: 'Memo',
        name: 'memo',
        type: 'string',
        default: '',
        displayOptions: {
          show: { operation: ['zSendMany'] },
        },
        description: 'Optional memo (max 512 bytes)',
      },

      // Operation ID parameter
      {
        displayName: 'Operation ID',
        name: 'operationId',
        type: 'string',
        default: '',
        displayOptions: {
          show: { operation: ['zGetOperationStatus', 'zGetOperationResult'] },
        },
        description: 'Operation ID to check',
      },

      // Viewing/Spending key parameters
      {
        displayName: 'Viewing Key',
        name: 'viewingKey',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { operation: ['importViewingKey'] },
        },
        description: 'Viewing key to import',
      },

      {
        displayName: 'Spending Key',
        name: 'spendingKey',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { operation: ['importSpendingKey'] },
        },
        description: 'Spending key to import',
      },

      {
        displayName: 'Key',
        name: 'key',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { operation: ['zImportKey'] },
        },
        description: 'Key to import',
      },

      // Rescan option
      {
        displayName: 'Rescan',
        name: 'rescan',
        type: 'options',
        options: [
          { name: 'When Key Is New', value: 'whenkeyisnew' },
          { name: 'Yes', value: 'yes' },
          { name: 'No', value: 'no' },
        ],
        default: 'whenkeyisnew',
        displayOptions: {
          show: { operation: ['importViewingKey', 'importSpendingKey', 'zImportKey'] },
        },
        description: 'Whether to rescan the blockchain',
      },

      // Start height for key import
      {
        displayName: 'Start Height',
        name: 'startHeight',
        type: 'number',
        default: 0,
        displayOptions: {
          show: { operation: ['importViewingKey', 'importSpendingKey', 'zImportKey'] },
        },
        description: 'Block height to start rescanning from',
      },

      // Min confirmations
      {
        displayName: 'Minimum Confirmations',
        name: 'minConfirmations',
        type: 'number',
        default: 1,
        displayOptions: {
          show: {
            operation: [
              'getBalance', 'zGetBalance', 'zSendMany', 'zGetTotalBalance', 'listUnspent',
            ],
          },
        },
        description: 'Minimum confirmations required',
      },

      // Max confirmations for listUnspent
      {
        displayName: 'Maximum Confirmations',
        name: 'maxConfirmations',
        type: 'number',
        default: 9999999,
        displayOptions: {
          show: { operation: ['listUnspent'] },
        },
        description: 'Maximum confirmations',
      },

      // Include watch only
      {
        displayName: 'Include Watch Only',
        name: 'includeWatchOnly',
        type: 'boolean',
        default: false,
        displayOptions: {
          show: {
            operation: [
              'getBalance', 'listTransactions', 'getTransaction',
              'zListAddresses', 'zGetTotalBalance',
            ],
          },
        },
        description: 'Whether to include watch-only addresses',
      },

      // Count for listTransactions
      {
        displayName: 'Count',
        name: 'count',
        type: 'number',
        default: 10,
        displayOptions: {
          show: { operation: ['listTransactions'] },
        },
        description: 'Number of transactions to return',
      },

      // Skip for listTransactions
      {
        displayName: 'Skip',
        name: 'skip',
        type: 'number',
        default: 0,
        displayOptions: {
          show: { operation: ['listTransactions'] },
        },
        description: 'Number of transactions to skip',
      },

      // Fee parameter
      {
        displayName: 'Fee',
        name: 'fee',
        type: 'number',
        default: 0.0001,
        typeOptions: { minValue: 0, numberPrecision: 8 },
        displayOptions: {
          show: { operation: ['zSendMany'] },
        },
        description: 'Transaction fee in ZEC',
      },

      // Verbose parameter
      {
        displayName: 'Verbose',
        name: 'verbose',
        type: 'boolean',
        default: true,
        displayOptions: {
          show: { operation: ['getRawTransaction', 'getBlockHeader'] },
        },
        description: 'Whether to return detailed information',
      },

      // Verbosity for getBlock
      {
        displayName: 'Verbosity',
        name: 'verbosity',
        type: 'options',
        options: [
          { name: 'Hex Only', value: 0 },
          { name: 'JSON Object', value: 1 },
          { name: 'JSON With Transactions', value: 2 },
        ],
        default: 1,
        displayOptions: {
          show: { operation: ['getBlock'] },
        },
        description: 'Level of detail to return',
      },

      // Comment parameters for sendToAddress
      {
        displayName: 'Comment',
        name: 'comment',
        type: 'string',
        default: '',
        displayOptions: {
          show: { operation: ['sendToAddress'] },
        },
        description: 'Comment for the transaction',
      },

      {
        displayName: 'Comment To',
        name: 'commentTo',
        type: 'string',
        default: '',
        displayOptions: {
          show: { operation: ['sendToAddress'] },
        },
        description: 'Comment about the recipient',
      },

      // Backup destination
      {
        displayName: 'Destination',
        name: 'destination',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { operation: ['backupWallet'] },
        },
        description: 'Path to save wallet backup',
      },

      // Raw transaction inputs/outputs
      {
        displayName: 'Inputs (JSON)',
        name: 'inputs',
        type: 'string',
        default: '[]',
        required: true,
        displayOptions: {
          show: { operation: ['createRawTransaction'] },
        },
        description: 'JSON array of inputs',
      },

      {
        displayName: 'Outputs (JSON)',
        name: 'outputs',
        type: 'string',
        default: '{}',
        required: true,
        displayOptions: {
          show: { operation: ['createRawTransaction'] },
        },
        description: 'JSON object of outputs',
      },

      {
        displayName: 'Locktime',
        name: 'locktime',
        type: 'number',
        default: 0,
        displayOptions: {
          show: { operation: ['createRawTransaction'] },
        },
        description: 'Transaction locktime',
      },

      // Addresses for listUnspent
      {
        displayName: 'Addresses',
        name: 'addresses',
        type: 'string',
        default: '',
        displayOptions: {
          show: { operation: ['listUnspent'] },
        },
        description: 'Comma-separated addresses to filter',
      },

      // Allow high fees
      {
        displayName: 'Allow High Fees',
        name: 'allowHighFees',
        type: 'boolean',
        default: false,
        displayOptions: {
          show: { operation: ['sendRawTransaction'] },
        },
        description: 'Whether to allow high fees',
      },

      // Mining parameters
      {
        displayName: 'Blocks',
        name: 'blocks',
        type: 'number',
        default: 120,
        displayOptions: {
          show: { operation: ['getNetworkHashrate', 'getNetworkSolPs'] },
        },
        description: 'Number of blocks to average',
      },

      {
        displayName: 'Height',
        name: 'height',
        type: 'number',
        default: -1,
        displayOptions: {
          show: { operation: ['getNetworkHashrate', 'getNetworkSolPs'] },
        },
        description: 'Block height (-1 for latest)',
      },

      {
        displayName: 'Hex Data',
        name: 'hexData',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { operation: ['submitBlock'] },
        },
        description: 'Block data in hex',
      },

      // Network parameters
      {
        displayName: 'Node',
        name: 'node',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { operation: ['addNode', 'disconnectNode'] },
        },
        description: 'Node address (ip:port)',
      },

      {
        displayName: 'Command',
        name: 'command',
        type: 'options',
        options: [
          { name: 'Add', value: 'add' },
          { name: 'Remove', value: 'remove' },
          { name: 'One Try', value: 'onetry' },
        ],
        default: 'add',
        displayOptions: {
          show: { operation: ['addNode'] },
        },
        description: 'Action to perform',
      },

      {
        displayName: 'DNS',
        name: 'dns',
        type: 'boolean',
        default: true,
        displayOptions: {
          show: { operation: ['getAddedNodeInfo'] },
        },
        description: 'Whether to include DNS info',
      },

      // Utility parameters
      {
        displayName: 'Number of Blocks',
        name: 'numBlocks',
        type: 'number',
        default: 6,
        displayOptions: {
          show: { operation: ['estimateFee'] },
        },
        description: 'Number of blocks for fee estimate',
      },

      {
        displayName: 'Message',
        name: 'message',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { operation: ['signMessage', 'verifyMessage'] },
        },
        description: 'Message to sign or verify',
      },

      {
        displayName: 'Signature',
        name: 'signature',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: { operation: ['verifyMessage'] },
        },
        description: 'Signature to verify',
      },

      {
        displayName: 'Help Command',
        name: 'helpCommand',
        type: 'string',
        default: '',
        displayOptions: {
          show: { operation: ['help'] },
        },
        description: 'RPC command to get help for',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    logLicensingNotice();

    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;
    const client = await createRpcClient(this);

    for (let i = 0; i < items.length; i++) {
      try {
        let result: INodeExecutionData[];

        // Route to appropriate operation
        switch (resource) {
          case 'wallet':
            result = await executeWalletOperation(this, client, operation, i);
            break;
          case 'transaction':
            result = await executeTransactionOperation(this, client, operation, i);
            break;
          case 'block':
            result = await executeBlockOperation(this, client, operation, i);
            break;
          case 'shielded':
            result = await executeShieldedOperation(this, client, operation, i);
            break;
          case 'keys':
            result = await executeKeysOperation(this, client, operation, i);
            break;
          case 'mining':
            result = await executeMiningOperation(this, client, operation, i);
            break;
          case 'network':
            result = await executeNetworkOperation(this, client, operation, i);
            break;
          case 'utility':
            result = await executeUtilityOperation(this, client, operation, i);
            break;
          default:
            throw new Error(`Unknown resource: ${resource}`);
        }

        returnData.push(...result);
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({ json: { error: (error as Error).message } });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
