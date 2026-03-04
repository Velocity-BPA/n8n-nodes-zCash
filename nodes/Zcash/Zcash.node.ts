/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-zcash/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class Zcash implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Zcash',
    name: 'zcash',
    icon: 'file:zcash.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Zcash API',
    defaults: {
      name: 'Zcash',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'zcashApi',
        required: true,
      },
    ],
    properties: [
      // Resource selector
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Wallet',
            value: 'wallet',
          },
          {
            name: 'ShieldedOperations',
            value: 'shieldedOperations',
          },
          {
            name: 'Transactions',
            value: 'transactions',
          },
          {
            name: 'Blockchain',
            value: 'blockchain',
          },
          {
            name: 'Mining',
            value: 'mining',
          }
        ],
        default: 'wallet',
      },
      // Operation dropdowns per resource
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['wallet'],
    },
  },
  options: [
    {
      name: 'Get Balance',
      value: 'getBalance',
      description: 'Get total wallet balance',
      action: 'Get wallet balance',
    },
    {
      name: 'Get New Address',
      value: 'getNewAddress',
      description: 'Generate new transparent address',
      action: 'Generate new address',
    },
    {
      name: 'Get Addresses by Account',
      value: 'getAddressesByAccount',
      description: 'List addresses by account',
      action: 'List addresses by account',
    },
    {
      name: 'List Addresses',
      value: 'listAddresses',
      description: 'List all wallet addresses',
      action: 'List all addresses',
    },
    {
      name: 'Backup Wallet',
      value: 'backupWallet',
      description: 'Backup wallet to file',
      action: 'Backup wallet',
    },
    {
      name: 'Encrypt Wallet',
      value: 'encryptWallet',
      description: 'Encrypt wallet with passphrase',
      action: 'Encrypt wallet',
    },
    {
      name: 'Wallet Passphrase',
      value: 'walletPassphrase',
      description: 'Unlock wallet for operations',
      action: 'Unlock wallet',
    },
  ],
  default: 'getBalance',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['shieldedOperations'],
    },
  },
  options: [
    {
      name: 'Generate New Shielded Address',
      value: 'zGetNewAddress',
      description: 'Generate a new shielded address',
      action: 'Generate new shielded address',
    },
    {
      name: 'List Shielded Addresses',
      value: 'zListAddresses',
      description: 'List all shielded addresses',
      action: 'List shielded addresses',
    },
    {
      name: 'Get Shielded Balance',
      value: 'zGetBalance',
      description: 'Get balance of a shielded address',
      action: 'Get shielded balance',
    },
    {
      name: 'Send Shielded Transaction',
      value: 'zSendMany',
      description: 'Send a shielded transaction to multiple recipients',
      action: 'Send shielded transaction',
    },
    {
      name: 'Get Operation Status',
      value: 'zGetOperationStatus',
      description: 'Get status of async operations',
      action: 'Get operation status',
    },
    {
      name: 'Get Operation Result',
      value: 'zGetOperationResult',
      description: 'Get result of completed operations',
      action: 'Get operation result',
    },
    {
      name: 'List Operation IDs',
      value: 'zListOperationIds',
      description: 'List all operation IDs',
      action: 'List operation IDs',
    },
  ],
  default: 'zGetNewAddress',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['transactions'],
    },
  },
  options: [
    {
      name: 'Send to Address',
      value: 'sendToAddress',
      description: 'Send ZEC to a transparent address',
      action: 'Send to transparent address',
    },
    {
      name: 'Get Transaction',
      value: 'getTransaction',
      description: 'Get detailed information about a transaction',
      action: 'Get transaction details',
    },
    {
      name: 'List Transactions',
      value: 'listTransactions',
      description: 'List recent transactions',
      action: 'List recent transactions',
    },
    {
      name: 'Get Raw Transaction',
      value: 'getRawTransaction',
      description: 'Get raw transaction data in hex format',
      action: 'Get raw transaction data',
    },
    {
      name: 'Send Raw Transaction',
      value: 'sendRawTransaction',
      description: 'Broadcast a raw transaction to the network',
      action: 'Broadcast raw transaction',
    },
    {
      name: 'Get Transaction Receipt',
      value: 'getTransactionReceipt',
      description: 'Get transaction receipt information',
      action: 'Get transaction receipt',
    },
  ],
  default: 'sendToAddress',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['blockchain'],
    },
  },
  options: [
    {
      name: 'Get Blockchain Info',
      value: 'getBlockchainInfo',
      description: 'Get blockchain status information',
      action: 'Get blockchain info',
    },
    {
      name: 'Get Block',
      value: 'getBlock',
      description: 'Get block information',
      action: 'Get block',
    },
    {
      name: 'Get Block Hash',
      value: 'getBlockHash',
      description: 'Get block hash by height',
      action: 'Get block hash',
    },
    {
      name: 'Get Block Count',
      value: 'getBlockCount',
      description: 'Get current block height',
      action: 'Get block count',
    },
    {
      name: 'Get Best Block Hash',
      value: 'getBestBlockHash',
      description: 'Get hash of best block',
      action: 'Get best block hash',
    },
    {
      name: 'Get Chain Tips',
      value: 'getChainTips',
      description: 'Get information about chain tips',
      action: 'Get chain tips',
    },
  ],
  default: 'getBlockchainInfo',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['mining'],
    },
  },
  options: [
    {
      name: 'Get Network Solution Rate',
      value: 'getNetworkSolps',
      description: 'Get the network solution rate',
      action: 'Get network solution rate',
    },
    {
      name: 'Get Mining Info',
      value: 'getMiningInfo',
      description: 'Get mining-related information',
      action: 'Get mining info',
    },
    {
      name: 'Get Block Template',
      value: 'getBlockTemplate',
      description: 'Get block template for mining',
      action: 'Get block template',
    },
    {
      name: 'Submit Block',
      value: 'submitBlock',
      description: 'Submit a mined block',
      action: 'Submit block',
    },
    {
      name: 'Get Difficulty',
      value: 'getDifficulty',
      description: 'Get current mining difficulty',
      action: 'Get difficulty',
    },
    {
      name: 'Get Network Hash Rate',
      value: 'getNetworkHashps',
      description: 'Get network hash rate',
      action: 'Get network hash rate',
    },
  ],
  default: 'getNetworkSolps',
},
      // Parameter definitions
{
  displayName: 'Account',
  name: 'account',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['wallet'],
      operation: ['getBalance'],
    },
  },
  default: '',
  description: 'Account name for balance query (optional)',
},
{
  displayName: 'Minimum Confirmations',
  name: 'minconf',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['wallet'],
      operation: ['getBalance'],
    },
  },
  default: 1,
  description: 'Minimum number of confirmations',
},
{
  displayName: 'Include Watch Only',
  name: 'includeWatchonly',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['wallet'],
      operation: ['getBalance'],
    },
  },
  default: false,
  description: 'Whether to include watch-only addresses',
},
{
  displayName: 'Account',
  name: 'account',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['wallet'],
      operation: ['getNewAddress'],
    },
  },
  default: '',
  description: 'Account name for new address (optional)',
},
{
  displayName: 'Account',
  name: 'account',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['wallet'],
      operation: ['getAddressesByAccount'],
    },
  },
  default: '',
  description: 'Account name to list addresses for',
},
{
  displayName: 'Destination',
  name: 'destination',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['wallet'],
      operation: ['backupWallet'],
    },
  },
  default: '',
  description: 'Path and filename for wallet backup',
},
{
  displayName: 'Passphrase',
  name: 'passphrase',
  type: 'string',
  required: true,
  typeOptions: {
    password: true,
  },
  displayOptions: {
    show: {
      resource: ['wallet'],
      operation: ['encryptWallet'],
    },
  },
  default: '',
  description: 'Passphrase to encrypt the wallet',
},
{
  displayName: 'Passphrase',
  name: 'passphrase',
  type: 'string',
  required: true,
  typeOptions: {
    password: true,
  },
  displayOptions: {
    show: {
      resource: ['wallet'],
      operation: ['walletPassphrase'],
    },
  },
  default: '',
  description: 'Wallet passphrase to unlock',
},
{
  displayName: 'Timeout',
  name: 'timeout',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['wallet'],
      operation: ['walletPassphrase'],
    },
  },
  default: 60,
  description: 'Timeout in seconds for wallet unlock',
},
{
  displayName: 'Address Type',
  name: 'type',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['shieldedOperations'],
      operation: ['zGetNewAddress'],
    },
  },
  options: [
    {
      name: 'Sapling',
      value: 'sapling',
    },
    {
      name: 'Sprout',
      value: 'sprout',
    },
  ],
  default: 'sapling',
  description: 'Type of shielded address to generate',
},
{
  displayName: 'Include Watch Only',
  name: 'includeWatchonly',
  type: 'boolean',
  displayOptions: {
    show: {
      resource: ['shieldedOperations'],
      operation: ['zListAddresses'],
    },
  },
  default: false,
  description: 'Whether to include watch-only addresses',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['shieldedOperations'],
      operation: ['zGetBalance'],
    },
  },
  default: '',
  description: 'The shielded address to get balance for',
},
{
  displayName: 'Minimum Confirmations',
  name: 'minconf',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['shieldedOperations'],
      operation: ['zGetBalance', 'zSendMany'],
    },
  },
  default: 1,
  description: 'Minimum number of confirmations required',
},
{
  displayName: 'From Address',
  name: 'fromaddress',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['shieldedOperations'],
      operation: ['zSendMany'],
    },
  },
  default: '',
  description: 'Source address for the transaction',
},
{
  displayName: 'Amounts',
  name: 'amounts',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['shieldedOperations'],
      operation: ['zSendMany'],
    },
  },
  default: '[]',
  description: 'Array of recipient objects with address and amount fields',
},
{
  displayName: 'Transaction Fee',
  name: 'fee',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['shieldedOperations'],
      operation: ['zSendMany'],
    },
  },
  default: 0.0001,
  description: 'Transaction fee in ZEC',
},
{
  displayName: 'Operation IDs',
  name: 'opids',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['shieldedOperations'],
      operation: ['zGetOperationStatus', 'zGetOperationResult'],
    },
  },
  default: '[]',
  description: 'Array of operation IDs to check',
},
{
  displayName: 'Status Filter',
  name: 'status',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['shieldedOperations'],
      operation: ['zListOperationIds'],
    },
  },
  options: [
    {
      name: 'All',
      value: '',
    },
    {
      name: 'Queued',
      value: 'queued',
    },
    {
      name: 'Executing',
      value: 'executing',
    },
    {
      name: 'Success',
      value: 'success',
    },
    {
      name: 'Failed',
      value: 'failed',
    },
    {
      name: 'Cancelled',
      value: 'cancelled',
    },
  ],
  default: '',
  description: 'Filter operations by status',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['sendToAddress'],
    },
  },
  default: '',
  description: 'The transparent address to send ZEC to',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['sendToAddress'],
    },
  },
  default: 0,
  description: 'The amount of ZEC to send',
},
{
  displayName: 'Comment',
  name: 'comment',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['sendToAddress'],
    },
  },
  default: '',
  description: 'A comment to store what the transaction is for',
},
{
  displayName: 'Comment To',
  name: 'commentto',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['sendToAddress'],
    },
  },
  default: '',
  description: 'A comment to store the name of the person or organization to which you are sending the transaction',
},
{
  displayName: 'Subtract Fee From Amount',
  name: 'subtractfeefromamount',
  type: 'boolean',
  required: false,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['sendToAddress'],
    },
  },
  default: false,
  description: 'Whether the fee will be deducted from the amount being sent',
},
{
  displayName: 'Transaction ID',
  name: 'txid',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['getTransaction', 'getRawTransaction', 'getTransactionReceipt'],
    },
  },
  default: '',
  description: 'The transaction ID to query',
},
{
  displayName: 'Include Watch Only',
  name: 'includeWatchonly',
  type: 'boolean',
  required: false,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['getTransaction', 'listTransactions'],
    },
  },
  default: false,
  description: 'Whether to include watch-only addresses in the results',
},
{
  displayName: 'Account',
  name: 'account',
  type: 'string',
  required: false,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['listTransactions'],
    },
  },
  default: '',
  description: 'The account name to list transactions for (deprecated, use "" for default)',
},
{
  displayName: 'Count',
  name: 'count',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['listTransactions'],
    },
  },
  default: 10,
  description: 'The number of transactions to return (default: 10)',
},
{
  displayName: 'Skip',
  name: 'skip',
  type: 'number',
  required: false,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['listTransactions'],
    },
  },
  default: 0,
  description: 'The number of transactions to skip',
},
{
  displayName: 'Verbose',
  name: 'verbose',
  type: 'boolean',
  required: false,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['getRawTransaction'],
    },
  },
  default: false,
  description: 'Whether to return a JSON object instead of hex string',
},
{
  displayName: 'Hex String',
  name: 'hexstring',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['sendRawTransaction'],
    },
  },
  default: '',
  description: 'The raw transaction hex string to broadcast',
},
{
  displayName: 'Allow High Fees',
  name: 'allowhighfees',
  type: 'boolean',
  required: false,
  displayOptions: {
    show: {
      resource: ['transactions'],
      operation: ['sendRawTransaction'],
    },
  },
  default: false,
  description: 'Whether to allow high fees for the transaction',
},
{
  displayName: 'Block Hash',
  name: 'blockhash',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['blockchain'],
      operation: ['getBlock'],
    },
  },
  default: '',
  description: 'The block hash to retrieve information for',
},
{
  displayName: 'Verbosity',
  name: 'verbosity',
  type: 'options',
  displayOptions: {
    show: {
      resource: ['blockchain'],
      operation: ['getBlock'],
    },
  },
  options: [
    {
      name: '0 - Hex String',
      value: 0,
    },
    {
      name: '1 - JSON Object',
      value: 1,
    },
    {
      name: '2 - JSON Object with Transaction Data',
      value: 2,
    },
  ],
  default: 1,
  description: 'Level of detail to return for the block',
},
{
  displayName: 'Height',
  name: 'height',
  type: 'number',
  required: true,
  displayOptions: {
    show: {
      resource: ['blockchain'],
      operation: ['getBlockHash'],
    },
  },
  default: 0,
  description: 'The block height to get the hash for',
},
{
  displayName: 'Blocks',
  name: 'blocks',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['mining'],
      operation: ['getNetworkSolps', 'getNetworkHashps'],
    },
  },
  default: 120,
  description: 'Number of blocks to average over (-1 for all blocks)',
},
{
  displayName: 'Height',
  name: 'height',
  type: 'number',
  displayOptions: {
    show: {
      resource: ['mining'],
      operation: ['getNetworkSolps', 'getNetworkHashps'],
    },
  },
  default: -1,
  description: 'Block height to calculate average from (-1 for current tip)',
},
{
  displayName: 'JSON Request Object',
  name: 'jsonRequestObject',
  type: 'json',
  required: true,
  displayOptions: {
    show: {
      resource: ['mining'],
      operation: ['getBlockTemplate'],
    },
  },
  default: '{}',
  description: 'Block template request object',
},
{
  displayName: 'Hex Data',
  name: 'hexData',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['mining'],
      operation: ['submitBlock'],
    },
  },
  default: '',
  description: 'The hex-encoded block data to submit',
},
{
  displayName: 'JSON Parameters Object',
  name: 'jsonParametersObject',
  type: 'json',
  displayOptions: {
    show: {
      resource: ['mining'],
      operation: ['submitBlock'],
    },
  },
  default: '{}',
  description: 'Optional parameters object for block submission',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'wallet':
        return [await executeWalletOperations.call(this, items)];
      case 'shieldedOperations':
        return [await executeShieldedOperationsOperations.call(this, items)];
      case 'transactions':
        return [await executeTransactionsOperations.call(this, items)];
      case 'blockchain':
        return [await executeBlockchainOperations.call(this, items)];
      case 'mining':
        return [await executeMiningOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeWalletOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('zcashApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      const baseOptions: any = {
        method: 'POST',
        url: credentials.baseUrl || 'http://localhost:8232',
        headers: {
          'Content-Type': 'application/json',
        },
        json: true,
        auth: {
          user: credentials.username,
          pass: credentials.password,
        },
      };

      switch (operation) {
        case 'getBalance': {
          const account = this.getNodeParameter('account', i, '') as string;
          const minconf = this.getNodeParameter('minconf', i, 1) as number;
          const includeWatchonly = this.getNodeParameter('includeWatchonly', i, false) as boolean;

          const params: any[] = [];
          if (account) params.push(account);
          else params.push('');
          params.push(minconf);
          params.push(includeWatchonly);

          const options = {
            ...baseOptions,
            body: {
              jsonrpc: '1.0',
              id: 'n8n',
              method: 'getbalance',
              params,
            },
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getNewAddress': {
          const account = this.getNodeParameter('account', i, '') as string;

          const params: any[] = [];
          if (account) params.push(account);

          const options = {
            ...baseOptions,
            body: {
              jsonrpc: '1.0',
              id: 'n8n',
              method: 'getnewaddress',
              params,
            },
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getAddressesByAccount': {
          const account = this.getNodeParameter('account', i) as string;

          const options = {
            ...baseOptions,
            body: {
              jsonrpc: '1.0',
              id: 'n8n',
              method: 'getaddressesbyaccount',
              params: [account],
            },
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'listAddresses': {
          const options = {
            ...baseOptions,
            body: {
              jsonrpc: '1.0',
              id: 'n8n',
              method: 'listaddresses',
              params: [],
            },
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'backupWallet': {
          const destination = this.getNodeParameter('destination', i) as string;

          const options = {
            ...baseOptions,
            body: {
              jsonrpc: '1.0',
              id: 'n8n',
              method: 'backupwallet',
              params: [destination],
            },
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'encryptWallet': {
          const passphrase = this.getNodeParameter('passphrase', i) as string;

          const options = {
            ...baseOptions,
            body: {
              jsonrpc: '1.0',
              id: 'n8n',
              method: 'encryptwallet',
              params: [passphrase],
            },
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'walletPassphrase': {
          const passphrase = this.getNodeParameter('passphrase', i) as string;
          const timeout = this.getNodeParameter('timeout', i) as number;

          const options = {
            ...baseOptions,
            body: {
              jsonrpc: '1.0',
              id: 'n8n',
              method: 'walletpassphrase',
              params: [passphrase, timeout],
            },
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      if (result.error) {
        throw new NodeApiError(this.getNode(), result.error);
      }

      returnData.push({ json: result.result, pairedItem: { item: i } });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw new NodeApiError(this.getNode(), error);
      }
    }
  }

  return returnData;
}

async function executeShieldedOperationsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('zcashApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      let rpcParams: any[] = [];
      let method = '';

      switch (operation) {
        case 'zGetNewAddress': {
          const type = this.getNodeParameter('type', i) as string;
          method = 'z_getnewaddress';
          rpcParams = [type];
          break;
        }
        case 'zListAddresses': {
          const includeWatchonly = this.getNodeParameter('includeWatchonly', i) as boolean;
          method = 'z_listaddresses';
          rpcParams = [includeWatchonly];
          break;
        }
        case 'zGetBalance': {
          const address = this.getNodeParameter('address', i) as string;
          const minconf = this.getNodeParameter('minconf', i) as number;
          method = 'z_getbalance';
          rpcParams = [address, minconf];
          break;
        }
        case 'zSendMany': {
          const fromaddress = this.getNodeParameter('fromaddress', i) as string;
          const amounts = this.getNodeParameter('amounts', i) as string;
          const minconf = this.getNodeParameter('minconf', i) as number;
          const fee = this.getNodeParameter('fee', i) as number;
          
          let parsedAmounts: any;
          try {
            parsedAmounts = JSON.parse(amounts);
          } catch (error: any) {
            throw new NodeOperationError(this.getNode(), 'Invalid JSON format for amounts parameter');
          }
          
          method = 'z_sendmany';
          rpcParams = [fromaddress, parsedAmounts, minconf, fee];
          break;
        }
        case 'zGetOperationStatus': {
          const opids = this.getNodeParameter('opids', i) as string;
          
          let parsedOpids: any;
          try {
            parsedOpids = JSON.parse(opids);
          } catch (error: any) {
            throw new NodeOperationError(this.getNode(), 'Invalid JSON format for opids parameter');
          }
          
          method = 'z_getoperationstatus';
          rpcParams = [parsedOpids];
          break;
        }
        case 'zGetOperationResult': {
          const opids = this.getNodeParameter('opids', i) as string;
          
          let parsedOpids: any;
          try {
            parsedOpids = JSON.parse(opids);
          } catch (error: any) {
            throw new NodeOperationError(this.getNode(), 'Invalid JSON format for opids parameter');
          }
          
          method = 'z_getoperationresult';
          rpcParams = [parsedOpids];
          break;
        }
        case 'zListOperationIds': {
          const status = this.getNodeParameter('status', i) as string;
          method = 'z_listoperationids';
          rpcParams = status ? [status] : [];
          break;
        }
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      const requestBody = {
        jsonrpc: '1.0',
        id: `n8n-${Date.now()}`,
        method,
        params: rpcParams,
      };

      const options: any = {
        method: 'POST',
        url: credentials.baseUrl || 'http://localhost:8232',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64')}`,
        },
        body: JSON.stringify(requestBody),
        json: false,
      };

      const response = await this.helpers.httpRequest(options) as any;
      
      let parsedResponse: any;
      try {
        parsedResponse = JSON.parse(response);
      } catch (error: any) {
        throw new NodeApiError(this.getNode(), { message: 'Invalid JSON response from Zcash node' });
      }

      if (parsedResponse.error) {
        throw new NodeApiError(this.getNode(), {
          message: parsedResponse.error.message || 'Unknown RPC error',
          code: parsedResponse.error.code,
        });
      }

      result = parsedResponse.result;
      returnData.push({ json: result, pairedItem: { item: i } });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ 
          json: { error: error.message }, 
          pairedItem: { item: i } 
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeTransactionsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('zcashApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'sendToAddress': {
          const address = this.getNodeParameter('address', i) as string;
          const amount = this.getNodeParameter('amount', i) as number;
          const comment = this.getNodeParameter('comment', i, '') as string;
          const commentto = this.getNodeParameter('commentto', i, '') as string;
          const subtractfeefromamount = this.getNodeParameter('subtractfeefromamount', i, false) as boolean;

          const params: any[] = [address, amount];
          if (comment) params.push(comment);
          if (commentto || params.length > 2) params.push(commentto);
          if (subtractfeefromamount || params.length > 3) params.push(subtractfeefromamount);

          const body: any = {
            jsonrpc: '1.0',
            id: 'n8n',
            method: 'sendtoaddress',
            params,
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'http://localhost:8232',
            auth: {
              username: credentials.username,
              password: credentials.password,
            },
            headers: {
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          const response = await this.helpers.httpRequest(options) as any;
          if (response.error) {
            throw new NodeOperationError(this.getNode(), `Zcash RPC Error: ${response.error.message}`);
          }
          result = response.result;
          break;
        }

        case 'getTransaction': {
          const txid = this.getNodeParameter('txid', i) as string;
          const includeWatchonly = this.getNodeParameter('includeWatchonly', i, false) as boolean;

          const body: any = {
            jsonrpc: '1.0',
            id: 'n8n',
            method: 'gettransaction',
            params: [txid, includeWatchonly],
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'http://localhost:8232',
            auth: {
              username: credentials.username,
              password: credentials.password,
            },
            headers: {
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          const response = await this.helpers.httpRequest(options) as any;
          if (response.error) {
            throw new NodeOperationError(this.getNode(), `Zcash RPC Error: ${response.error.message}`);
          }
          result = response.result;
          break;
        }

        case 'listTransactions': {
          const account = this.getNodeParameter('account', i, '') as string;
          const count = this.getNodeParameter('count', i, 10) as number;
          const skip = this.getNodeParameter('skip', i, 0) as number;
          const includeWatchonly = this.getNodeParameter('includeWatchonly', i, false) as boolean;

          const body: any = {
            jsonrpc: '1.0',
            id: 'n8n',
            method: 'listtransactions',
            params: [account, count, skip, includeWatchonly],
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'http://localhost:8232',
            auth: {
              username: credentials.username,
              password: credentials.password,
            },
            headers: {
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          const response = await this.helpers.httpRequest(options) as any;
          if (response.error) {
            throw new NodeOperationError(this.getNode(), `Zcash RPC Error: ${response.error.message}`);
          }
          result = response.result;
          break;
        }

        case 'getRawTransaction': {
          const txid = this.getNodeParameter('txid', i) as string;
          const verbose = this.getNodeParameter('verbose', i, false) as boolean;

          const body: any = {
            jsonrpc: '1.0',
            id: 'n8n',
            method: 'getrawtransaction',
            params: [txid, verbose ? 1 : 0],
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'http://localhost:8232',
            auth: {
              username: credentials.username,
              password: credentials.password,
            },
            headers: {
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          const response = await this.helpers.httpRequest(options) as any;
          if (response.error) {
            throw new NodeOperationError(this.getNode(), `Zcash RPC Error: ${response.error.message}`);
          }
          result = response.result;
          break;
        }

        case 'sendRawTransaction': {
          const hexstring = this.getNodeParameter('hexstring', i) as string;
          const allowhighfees = this.getNodeParameter('allowhighfees', i, false) as boolean;

          const body: any = {
            jsonrpc: '1.0',
            id: 'n8n',
            method: 'sendrawtransaction',
            params: [hexstring, allowhighfees],
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'http://localhost:8232',
            auth: {
              username: credentials.username,
              password: credentials.password,
            },
            headers: {
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          const response = await this.helpers.httpRequest(options) as any;
          if (response.error) {
            throw new NodeOperationError(this.getNode(), `Zcash RPC Error: ${response.error.message}`);
          }
          result = response.result;
          break;
        }

        case 'getTransactionReceipt': {
          const txid = this.getNodeParameter('txid', i) as string;

          const body: any = {
            jsonrpc: '1.0',
            id: 'n8n',
            method: 'gettransactionreceipt',
            params: [txid],
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'http://localhost:8232',
            auth: {
              username: credentials.username,
              password: credentials.password,
            },
            headers: {
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          const response = await this.helpers.httpRequest(options) as any;
          if (response.error) {
            throw new NodeOperationError(this.getNode(), `Zcash RPC Error: ${response.error.message}`);
          }
          result = response.result;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeBlockchainOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('zcashApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'getBlockchainInfo': {
          const requestBody: any = {
            jsonrpc: '1.0',
            id: 'n8n-zcash',
            method: 'getblockchaininfo',
            params: [],
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'http://localhost:8232',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Basic ' + Buffer.from(credentials.username + ':' + credentials.password).toString('base64'),
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          const response = await this.helpers.httpRequest(options) as any;
          const parsedResponse = typeof response === 'string' ? JSON.parse(response) : response;
          
          if (parsedResponse.error) {
            throw new NodeApiError(this.getNode(), parsedResponse.error);
          }
          
          result = parsedResponse.result;
          break;
        }

        case 'getBlock': {
          const blockhash = this.getNodeParameter('blockhash', i) as string;
          const verbosity = this.getNodeParameter('verbosity', i) as number;

          const requestBody: any = {
            jsonrpc: '1.0',
            id: 'n8n-zcash',
            method: 'getblock',
            params: [blockhash, verbosity],
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'http://localhost:8232',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Basic ' + Buffer.from(credentials.username + ':' + credentials.password).toString('base64'),
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          const response = await this.helpers.httpRequest(options) as any;
          const parsedResponse = typeof response === 'string' ? JSON.parse(response) : response;
          
          if (parsedResponse.error) {
            throw new NodeApiError(this.getNode(), parsedResponse.error);
          }
          
          result = parsedResponse.result;
          break;
        }

        case 'getBlockHash': {
          const height = this.getNodeParameter('height', i) as number;

          const requestBody: any = {
            jsonrpc: '1.0',
            id: 'n8n-zcash',
            method: 'getblockhash',
            params: [height],
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'http://localhost:8232',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Basic ' + Buffer.from(credentials.username + ':' + credentials.password).toString('base64'),
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          const response = await this.helpers.httpRequest(options) as any;
          const parsedResponse = typeof response === 'string' ? JSON.parse(response) : response;
          
          if (parsedResponse.error) {
            throw new NodeApiError(this.getNode(), parsedResponse.error);
          }
          
          result = parsedResponse.result;
          break;
        }

        case 'getBlockCount': {
          const requestBody: any = {
            jsonrpc: '1.0',
            id: 'n8n-zcash',
            method: 'getblockcount',
            params: [],
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'http://localhost:8232',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Basic ' + Buffer.from(credentials.username + ':' + credentials.password).toString('base64'),
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          const response = await this.helpers.httpRequest(options) as any;
          const parsedResponse = typeof response === 'string' ? JSON.parse(response) : response;
          
          if (parsedResponse.error) {
            throw new NodeApiError(this.getNode(), parsedResponse.error);
          }
          
          result = parsedResponse.result;
          break;
        }

        case 'getBestBlockHash': {
          const requestBody: any = {
            jsonrpc: '1.0',
            id: 'n8n-zcash',
            method: 'getbestblockhash',
            params: [],
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'http://localhost:8232',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Basic ' + Buffer.from(credentials.username + ':' + credentials.password).toString('base64'),
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          const response = await this.helpers.httpRequest(options) as any;
          const parsedResponse = typeof response === 'string' ? JSON.parse(response) : response;
          
          if (parsedResponse.error) {
            throw new NodeApiError(this.getNode(), parsedResponse.error);
          }
          
          result = parsedResponse.result;
          break;
        }

        case 'getChainTips': {
          const requestBody: any = {
            jsonrpc: '1.0',
            id: 'n8n-zcash',
            method: 'getchaintips',
            params: [],
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'http://localhost:8232',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Basic ' + Buffer.from(credentials.username + ':' + credentials.password).toString('base64'),
            },
            body: JSON.stringify(requestBody),
            json: false,
          };

          const response = await this.helpers.httpRequest(options) as any;
          const parsedResponse = typeof response === 'string' ? JSON.parse(response) : response;
          
          if (parsedResponse.error) {
            throw new NodeApiError(this.getNode(), parsedResponse.error);
          }
          
          result = parsedResponse.result;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeMiningOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('zcashApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      
      switch (operation) {
        case 'getNetworkSolps': {
          const blocks = this.getNodeParameter('blocks', i) as number;
          const height = this.getNodeParameter('height', i) as number;
          
          const params: any[] = [];
          if (blocks !== undefined) params.push(blocks);
          if (height !== undefined && height !== -1) params.push(height);
          
          const requestBody: any = {
            method: 'getnetworksolps',
            params,
            id: Date.now(),
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'http://localhost:8232',
            auth: {
              username: credentials.username,
              password: credentials.password,
            },
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };
          
          const response = await this.helpers.httpRequest(options) as any;
          result = JSON.parse(response);
          break;
        }

        case 'getMiningInfo': {
          const requestBody: any = {
            method: 'getmininginfo',
            params: [],
            id: Date.now(),
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'http://localhost:8232',
            auth: {
              username: credentials.username,
              password: credentials.password,
            },
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };
          
          const response = await this.helpers.httpRequest(options) as any;
          result = JSON.parse(response);
          break;
        }

        case 'getBlockTemplate': {
          const jsonRequestObject = this.getNodeParameter('jsonRequestObject', i) as string;
          let requestObject: any;
          
          try {
            requestObject = JSON.parse(jsonRequestObject);
          } catch (error: any) {
            throw new NodeOperationError(this.getNode(), 'Invalid JSON in request object: ' + error.message);
          }

          const requestBody: any = {
            method: 'getblocktemplate',
            params: [requestObject],
            id: Date.now(),
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'http://localhost:8232',
            auth: {
              username: credentials.username,
              password: credentials.password,
            },
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };
          
          const response = await this.helpers.httpRequest(options) as any;
          result = JSON.parse(response);
          break;
        }

        case 'submitBlock': {
          const hexData = this.getNodeParameter('hexData', i) as string;
          const jsonParametersObject = this.getNodeParameter('jsonParametersObject', i) as string;
          
          const params: any[] = [hexData];
          
          if (jsonParametersObject && jsonParametersObject.trim() !== '{}') {
            try {
              const parametersObject = JSON.parse(jsonParametersObject);
              params.push(parametersObject);
            } catch (error: any) {
              throw new NodeOperationError(this.getNode(), 'Invalid JSON in parameters object: ' + error.message);
            }
          }

          const requestBody: any = {
            method: 'submitblock',
            params,
            id: Date.now(),
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'http://localhost:8232',
            auth: {
              username: credentials.username,
              password: credentials.password,
            },
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };
          
          const response = await this.helpers.httpRequest(options) as any;
          result = JSON.parse(response);
          break;
        }

        case 'getDifficulty': {
          const requestBody: any = {
            method: 'getdifficulty',
            params: [],
            id: Date.now(),
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'http://localhost:8232',
            auth: {
              username: credentials.username,
              password: credentials.password,
            },
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };
          
          const response = await this.helpers.httpRequest(options) as any;
          result = JSON.parse(response);
          break;
        }

        case 'getNetworkHashps': {
          const blocks = this.getNodeParameter('blocks', i) as number;
          const height = this.getNodeParameter('height', i) as number;
          
          const params: any[] = [];
          if (blocks !== undefined) params.push(blocks);
          if (height !== undefined && height !== -1) params.push(height);
          
          const requestBody: any = {
            method: 'getnetworkhashps',
            params,
            id: Date.now(),
          };

          const options: any = {
            method: 'POST',
            url: credentials.baseUrl || 'http://localhost:8232',
            auth: {
              username: credentials.username,
              password: credentials.password,
            },
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
            json: false,
          };
          
          const response = await this.helpers.httpRequest(options) as any;
          result = JSON.parse(response);
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: {
          item: i,
        },
      });

    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
        continue;
      }
      throw new NodeApiError(this.getNode(), error);
    }
  }

  return returnData;
}
