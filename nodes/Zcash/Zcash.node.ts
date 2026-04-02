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
            name: 'Transaction',
            value: 'transaction',
          },
          {
            name: 'ShieldedPool',
            value: 'shieldedPool',
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
          },
          {
            name: 'Network',
            value: 'network',
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
  displayOptions: { show: { resource: ['wallet'] } },
  options: [
    { name: 'Get Wallet Info', value: 'getWalletInfo', description: 'Get wallet information and status', action: 'Get wallet info' },
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
    { name: 'Validate Address', value: 'validateAddress', description: 'Validate an address', action: 'Validate address' },
    { name: 'Dump Private Key', value: 'dumpPrivKey', description: 'Export private key for address', action: 'Export private key' },
    { name: 'Import Private Key', value: 'importPrivKey', description: 'Import private key', action: 'Import private key' }
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
			resource: ['transaction'],
		},
	},
	options: [
		{
			name: 'Send to Address',
			value: 'sendToAddress',
			description: 'Send ZEC to a transparent address',
			action: 'Send to address',
		},
		{
			name: 'Send Many',
			value: 'sendMany',
			description: 'Send ZEC to multiple addresses in one transaction',
			action: 'Send many',
		},
		{
			name: 'Get Raw Transaction',
			value: 'getRawTransaction',
			description: 'Get raw transaction data by transaction ID',
			action: 'Get raw transaction',
		},
		{
			name: 'Send Raw Transaction',
			value: 'sendRawTransaction',
			description: 'Broadcast a raw transaction to the network',
			action: 'Send raw transaction',
		},
		{
			name: 'Get Transaction',
			value: 'getTransaction',
			description: 'Get detailed transaction information',
			action: 'Get transaction',
		},
		{
			name: 'List Transactions',
			value: 'listTransactions',
			description: 'List recent transactions',
			action: 'List transactions',
		},
		{
			name: 'List Since Block',
			value: 'listSinceBlock',
			description: 'List transactions since a specific block',
			action: 'List since block',
		},
	],
	default: 'sendToAddress',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['shieldedPool'] } },
  options: [
    { name: 'Generate New Shielded Address', value: 'generateAddress', description: 'Generate a new shielded address', action: 'Generate new shielded address' },
    { name: 'Get Address for Account', value: 'getAddressForAccount', description: 'Get shielded address for a specific account', action: 'Get address for account' },
    { name: 'List Addresses', value: 'listAddresses', description: 'List all shielded addresses', action: 'List shielded addresses' },
    { name: 'Get Balance', value: 'getBalance', description: 'Get balance for a shielded address', action: 'Get shielded address balance' },
    { name: 'Get Total Balance', value: 'getTotalBalance', description: 'Get total balance across all shielded pools', action: 'Get total balance across pools' },
    { name: 'Send Many', value: 'sendMany', description: 'Send shielded transaction to multiple recipients', action: 'Send shielded transaction' },
    { name: 'Shield Coinbase', value: 'shieldCoinbase', description: 'Shield coinbase funds to shielded address', action: 'Shield coinbase funds' },
    { name: 'List Received by Address', value: 'listReceivedByAddress', description: 'List amounts received by shielded address', action: 'List received amounts' }
  ],
  default: 'generateAddress',
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
			value: 'getblockchaininfo',
			description: 'Get blockchain state information',
			action: 'Get blockchain info',
		},
		{
			name: 'Get Best Block Hash',
			value: 'getbestblockhash',
			description: 'Get hash of the best block',
			action: 'Get best block hash',
		},
		{
			name: 'Get Block',
			value: 'getblock',
			description: 'Get block information by hash',
			action: 'Get block',
		},
		{
			name: 'Get Block Count',
			value: 'getblockcount',
			description: 'Get the number of blocks in the chain',
			action: 'Get block count',
		},
		{
			name: 'Get Block Hash',
			value: 'getblockhash',
			description: 'Get block hash at specific height',
			action: 'Get block hash',
		},
		{
			name: 'Get Block Header',
			value: 'getblockheader',
			description: 'Get block header information',
			action: 'Get block header',
		},
		{
			name: 'Get Transaction Output',
			value: 'gettxout',
			description: 'Get unspent transaction output',
			action: 'Get transaction output',
		},
		{
			name: 'Get UTXO Set Info',
			value: 'gettxoutsetinfo',
			description: 'Get UTXO set statistics',
			action: 'Get UTXO set info',
		},
    {
      name: 'Get Chain Tips',
      value: 'getChainTips',
      description: 'Get information about chain tips',
      action: 'Get chain tips',
    },
	],
	default: 'getblockchaininfo',
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
			name: 'Get Mining Info',
			value: 'getMiningInfo',
			description: 'Get mining-related information',
			action: 'Get mining information',
		},
		{
			name: 'Get Network Hash Rate',
			value: 'getNetworkHashps',
			description: 'Get network hash rate per second',
			action: 'Get network hash rate',
		},
		{
			name: 'Prioritise Transaction',
			value: 'prioritiseTransaction',
			description: 'Prioritize transaction for mining',
			action: 'Prioritise transaction for mining',
		},
		{
			name: 'Submit Block',
			value: 'submitBlock',
			description: 'Submit new block to network',
			action: 'Submit block to network',
		},
		{
			name: 'Get Block Template',
			value: 'getBlockTemplate',
			description: 'Get block template for mining',
			action: 'Get block template',
		},
		{
			name: 'Get Network Solution Rate',
			value: 'getNetworkSolps',
			description: 'Get network solution rate per second',
			action: 'Get network solution rate',
		},
    {
      name: 'Get Difficulty',
      value: 'getDifficulty',
      description: 'Get current mining difficulty',
      action: 'Get difficulty',
    },
	],
	default: 'getMiningInfo',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['network'],
		},
	},
	options: [
		{
			name: 'Get Network Info',
			value: 'getNetworkInfo',
			description: 'Get network information',
			action: 'Get network info',
		},
		{
			name: 'Get Peer Info',
			value: 'getPeerInfo',
			description: 'Get peer connection information',
			action: 'Get peer info',
		},
		{
			name: 'Get Connection Count',
			value: 'getConnectionCount',
			description: 'Get number of connections',
			action: 'Get connection count',
		},
		{
			name: 'Add Node',
			value: 'addNode',
			description: 'Add/remove/connect to node',
			action: 'Add node',
		},
		{
			name: 'Disconnect Node',
			value: 'disconnectNode',
			description: 'Disconnect from node',
			action: 'Disconnect node',
		},
		{
			name: 'List Banned',
			value: 'listBanned',
			description: 'List banned nodes',
			action: 'List banned nodes',
		},
		{
			name: 'Ping',
			value: 'ping',
			description: 'Send ping to all nodes',
			action: 'Send ping to all nodes',
		},
	],
	default: 'getNetworkInfo',
},
      // Parameter definitions
{
  displayName: 'Account',
  name: 'account',
  type: 'string',
  default: '',
  description: 'The account name',
  displayOptions: {
    show: {
      resource: ['wallet'],
      operation: ['getBalance', 'getNewAddress', 'getAddressesByAccount']
    }
  }
},
{
  displayName: 'Minimum Confirmations',
  name: 'minconf',
  type: 'number',
  default: 1,
  description: 'Only include transactions confirmed at least this many times',
  displayOptions: {
    show: {
      resource: ['wallet'],
      operation: ['getBalance']
    }
  }
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
  displayName: 'Address',
  name: 'address',
  type: 'string',
  required: true,
  default: '',
  description: 'The Zcash address to validate or dump private key for',
  displayOptions: {
    show: {
      resource: ['wallet'],
      operation: ['validateAddress', 'dumpPrivKey']
    }
  }
},
{
  displayName: 'Private Key',
  name: 'privkey',
  type: 'string',
  required: true,
  default: '',
  description: 'The private key to import',
  displayOptions: {
    show: {
      resource: ['wallet'],
      operation: ['importPrivKey']
    }
  }
},
{
  displayName: 'Label',
  name: 'label',
  type: 'string',
  default: '',
  description: 'An optional label for the imported key',
  displayOptions: {
    show: {
      resource: ['wallet'],
      operation: ['importPrivKey']
    }
  }
},
{
  displayName: 'Rescan',
  name: 'rescan',
  type: 'boolean',
  default: true,
  description: 'Rescan the wallet for transactions after importing',
  displayOptions: {
    show: {
      resource: ['wallet'],
      operation: ['importPrivKey']
    }
  }
},
{
	displayName: 'Address',
	name: 'address',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['sendToAddress'],
		},
	},
	default: '',
	description: 'The transparent Zcash address to send to',
},
{
	displayName: 'Amount',
	name: 'amount',
	type: 'number',
	required: true,
	displayOptions: {
		show: {
			resource: ['transaction'],
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
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['sendToAddress'],
		},
	},
	default: '',
	description: 'Comment for the transaction (stored locally)',
},
{
	displayName: 'Comment To',
	name: 'comment_to',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['sendToAddress'],
		},
	},
	default: '',
	description: 'Comment about the recipient (stored locally)',
},
{
	displayName: 'From Account',
	name: 'fromaccount',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['sendMany'],
		},
	},
	default: '',
	description: 'Account to send from (deprecated but required)',
},
{
	displayName: 'Amounts',
	name: 'amounts',
	type: 'json',
	required: true,
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['sendMany'],
		},
	},
	default: '{}',
	description: 'JSON object mapping addresses to amounts',
},
{
	displayName: 'Min Confirmations',
	name: 'minconf',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['sendMany'],
		},
	},
	default: 1,
	description: 'Minimum number of confirmations required',
},
{
	displayName: 'Transaction ID',
	name: 'txid',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['getRawTransaction', 'getTransaction'],
		},
	},
	default: '',
	description: 'The transaction ID to retrieve',
},
{
	displayName: 'Verbose',
	name: 'verbose',
	type: 'boolean',
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['getRawTransaction'],
		},
	},
	default: true,
	description: 'Whether to return verbose transaction data',
},
{
	displayName: 'Hex String',
	name: 'hexstring',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['transaction'],
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
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['sendRawTransaction'],
		},
	},
	default: false,
	description: 'Allow high fees for the transaction',
},
{
	displayName: 'Include Watch Only',
	name: 'includeWatchonly',
	type: 'boolean',
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['getTransaction', 'listTransactions', 'listSinceBlock'],
		},
	},
	default: false,
	description: 'Include watch-only addresses',
},
{
	displayName: 'Account',
	name: 'account',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['listTransactions'],
		},
	},
	default: '*',
	description: 'Account to list transactions for',
},
{
	displayName: 'Count',
	name: 'count',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['listTransactions'],
		},
	},
	default: 10,
	description: 'Number of transactions to return',
},
{
	displayName: 'Skip',
	name: 'skip',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['listTransactions'],
		},
	},
	default: 0,
	description: 'Number of transactions to skip',
},
{
	displayName: 'Block Hash',
	name: 'blockhash',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['listSinceBlock'],
		},
	},
	default: '',
	description: 'Block hash to list transactions since',
},
{
	displayName: 'Target Confirmations',
	name: 'target_confirmations',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['listSinceBlock'],
		},
	},
	default: 1,
	description: 'Target number of confirmations',
},
{
  displayName: 'Address Type',
  name: 'type',
  type: 'options',
  displayOptions: { show: { resource: ['shieldedPool'], operation: ['generateAddress'] } },
  options: [
    { name: 'Sapling', value: 'sapling' },
    { name: 'Orchard', value: 'orchard' },
    { name: 'Unified', value: 'unified' }
  ],
  default: 'sapling',
  description: 'Type of shielded address to generate',
},
{
  displayName: 'Account',
  name: 'account',
  type: 'number',
  displayOptions: { show: { resource: ['shieldedPool'], operation: ['getAddressForAccount'] } },
  default: 0,
  description: 'Account number to get address for',
},
{
  displayName: 'Diversifier Index',
  name: 'diversifierIndex',
  type: 'number',
  displayOptions: { show: { resource: ['shieldedPool'], operation: ['getAddressForAccount'] } },
  default: 0,
  description: 'Diversifier index for address generation',
},
{
  displayName: 'Include Watch Only',
  name: 'includeWatchonly',
  type: 'boolean',
  displayOptions: { show: { resource: ['shieldedPool'], operation: ['listAddresses', 'getTotalBalance'] } },
  default: false,
  description: 'Include watch-only addresses in results',
},
{
  displayName: 'Address',
  name: 'address',
  type: 'string',
  displayOptions: { show: { resource: ['shieldedPool'], operation: ['getBalance', 'listReceivedByAddress'] } },
  default: '',
  description: 'Shielded address to query',
  required: true,
},
{
  displayName: 'Minimum Confirmations',
  name: 'minconf',
  type: 'number',
  displayOptions: { show: { resource: ['shieldedPool'], operation: ['getBalance', 'getTotalBalance', 'sendMany', 'listReceivedByAddress'] } },
  default: 1,
  description: 'Minimum number of confirmations required',
},
{
  displayName: 'From Address',
  name: 'fromaddress',
  type: 'string',
  displayOptions: { show: { resource: ['shieldedPool'], operation: ['sendMany', 'shieldCoinbase'] } },
  default: '',
  description: 'Source address for the transaction',
  required: true,
},
{
  displayName: 'To Address',
  name: 'toaddress',
  type: 'string',
  displayOptions: { show: { resource: ['shieldedPool'], operation: ['shieldCoinbase'] } },
  default: '',
  description: 'Destination shielded address',
  required: true,
},
{
  displayName: 'Amounts',
  name: 'amounts',
  type: 'json',
  displayOptions: { show: { resource: ['shieldedPool'], operation: ['sendMany'] } },
  default: '[]',
  description: 'Array of recipient objects with address and amount fields',
  required: true,
},
{
  displayName: 'Fee',
  name: 'fee',
  type: 'number',
  displayOptions: { show: { resource: ['shieldedPool'], operation: ['sendMany', 'shieldCoinbase'] } },
  default: 0.0001,
  description: 'Transaction fee in ZEC',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { show: { resource: ['shieldedPool'], operation: ['shieldCoinbase'] } },
  default: 50,
  description: 'Maximum number of UTXOs to shield',
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
	name: 'hash',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['blockchain'],
			operation: ['getblock'],
		},
	},
	default: '',
	description: 'The hash of the block to retrieve',
},
{
	displayName: 'Verbosity',
	name: 'verbosity',
	type: 'options',
	displayOptions: {
		show: {
			resource: ['blockchain'],
			operation: ['getblock'],
		},
	},
	options: [
		{
			name: 'Raw Block Data',
			value: 0,
			description: 'Return raw block data',
		},
		{
			name: 'Block Object',
			value: 1,
			description: 'Return block object with transaction IDs',
		},
		{
			name: 'Block Object with Transactions',
			value: 2,
			description: 'Return block object with full transaction objects',
		},
	],
	default: 1,
	description: 'Level of detail to return',
},
{
	displayName: 'Height',
	name: 'height',
	type: 'number',
	required: true,
	displayOptions: {
		show: {
			resource: ['blockchain'],
			operation: ['getblockhash'],
		},
	},
	default: 0,
	description: 'The block height to get the hash for',
},
{
	displayName: 'Block Hash',
	name: 'hash',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['blockchain'],
			operation: ['getblockheader'],
		},
	},
	default: '',
	description: 'The hash of the block header to retrieve',
},
{
	displayName: 'Verbose',
	name: 'verbose',
	type: 'boolean',
	displayOptions: {
		show: {
			resource: ['blockchain'],
			operation: ['getblockheader'],
		},
	},
	default: true,
	description: 'Whether to return verbose block header information',
},
{
	displayName: 'Transaction ID',
	name: 'txid',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['blockchain'],
			operation: ['gettxout'],
		},
	},
	default: '',
	description: 'The transaction ID',
},
{
	displayName: 'Output Index',
	name: 'n',
	type: 'number',
	required: true,
	displayOptions: {
		show: {
			resource: ['blockchain'],
			operation: ['gettxout'],
		},
	},
	default: 0,
	description: 'The output index number (vout)',
},
{
	displayName: 'Include Mempool',
	name: 'includeMempool',
	type: 'boolean',
	displayOptions: {
		show: {
			resource: ['blockchain'],
			operation: ['gettxout'],
		},
	},
	default: true,
	description: 'Whether to include the mempool in the search',
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
	displayName: 'Number of Blocks',
	name: 'nblocks',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['mining'],
			operation: ['getNetworkHashps', 'getNetworkSolps'],
		},
	},
	default: 120,
	description: 'Number of blocks to average over. Use 120 for last 120 blocks, or -1 for blocks since last difficulty change.',
},
{
	displayName: 'Height',
	name: 'height',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['mining'],
			operation: ['getNetworkHashps', 'getNetworkSolps'],
		},
	},
	default: -1,
	description: 'Block height to estimate network hash rate. Use -1 for current tip.',
},
{
	displayName: 'Transaction ID',
	name: 'txid',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['mining'],
			operation: ['prioritiseTransaction'],
		},
	},
	default: '',
	description: 'The transaction ID to prioritize',
},
{
	displayName: 'Priority Delta',
	name: 'priorityDelta',
	type: 'number',
	required: true,
	displayOptions: {
		show: {
			resource: ['mining'],
			operation: ['prioritiseTransaction'],
		},
	},
	default: 0,
	description: 'The priority to add or subtract (if negative)',
},
{
	displayName: 'Fee Delta',
	name: 'feeDelta',
	type: 'number',
	required: true,
	displayOptions: {
		show: {
			resource: ['mining'],
			operation: ['prioritiseTransaction'],
		},
	},
	default: 0,
	description: 'The fee value in zatoshis to add or subtract (if negative)',
},
{
	displayName: 'Hex Data',
	name: 'hexdata',
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
	description: 'Optional object of parameters',
},
{
	displayName: 'Template Request',
	name: 'templateRequest',
	type: 'json',
	displayOptions: {
		show: {
			resource: ['mining'],
			operation: ['getBlockTemplate'],
		},
	},
	default: '{}',
	description: 'Template request object with optional mode and capabilities',
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
	displayName: 'Node',
	name: 'node',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['network'],
			operation: ['addNode'],
		},
	},
	default: '',
	description: 'The node address (IP:port)',
},
{
	displayName: 'Command',
	name: 'command',
	type: 'options',
	required: true,
	displayOptions: {
		show: {
			resource: ['network'],
			operation: ['addNode'],
		},
	},
	options: [
		{
			name: 'Add',
			value: 'add',
		},
		{
			name: 'Remove',
			value: 'remove',
		},
		{
			name: 'One Try',
			value: 'onetry',
		},
	],
	default: 'add',
	description: 'Command to execute on the node',
},
{
	displayName: 'Address',
	name: 'address',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['network'],
			operation: ['disconnectNode'],
		},
	},
	default: '',
	description: 'The IP address/port of the node',
},
{
	displayName: 'Node ID',
	name: 'nodeid',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['network'],
			operation: ['disconnectNode'],
		},
	},
	default: 0,
	description: 'The node ID (either address or nodeid must be provided)',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'wallet':
        return [await executeWalletOperations.call(this, items)];
      case 'transaction':
        return [await executeTransactionOperations.call(this, items)];
      case 'shieldedPool':
        return [await executeShieldedPoolOperations.call(this, items)];
      case 'shieldedOperations':
        return [await executeShieldedOperationsOperations.call(this, items)];
      case 'transactions':
        return [await executeTransactionsOperations.call(this, items)];
      case 'blockchain':
        return [await executeBlockchainOperations.call(this, items)];
      case 'mining':
        return [await executeMiningOperations.call(this, items)];
      case 'network':
        return [await executeNetworkOperations.call(this, items)];
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
        case 'getWalletInfo': {
          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Content-Type': 'application/json'
            },
            auth: {
              username: credentials.username,
              password: credentials.password
            },
            body: JSON.stringify({
              jsonrpc: '2.0',
              id: 1,
              method: 'getwalletinfo',
              params: []
            }),
            json: false
          };
          const response = await this.helpers.httpRequest(options) as any;
          result = JSON.parse(response);
          break;
        }

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

        case 'validateAddress': {
          const address = this.getNodeParameter('address', i) as string;
          
          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Content-Type': 'application/json'
            },
            auth: {
              username: credentials.username,
              password: credentials.password
            },
            body: JSON.stringify({
              jsonrpc: '2.0',
              id: 1,
              method: 'validateaddress',
              params: [address]
            }),
            json: false
          };
          const response = await this.helpers.httpRequest(options) as any;
          result = JSON.parse(response);
          break;
        }

        case 'dumpPrivKey': {
          const address = this.getNodeParameter('address', i) as string;
          
          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Content-Type': 'application/json'
            },
            auth: {
              username: credentials.username,
              password: credentials.password
            },
            body: JSON.stringify({
              jsonrpc: '2.0',
              id: 1,
              method: 'dumpprivkey',
              params: [address]
            }),
            json: false
          };
          const response = await this.helpers.httpRequest(options) as any;
          result = JSON.parse(response);
          break;
        }

        case 'importPrivKey': {
          const privkey = this.getNodeParameter('privkey', i) as string;
          const label = this.getNodeParameter('label', i) as string;
          const rescan = this.getNodeParameter('rescan', i) as boolean;
          
          let rpcParams = [privkey];
          if (label) rpcParams.push(label);
          if (label || rescan !== true) rpcParams.push(rescan);
          
          const options: any = {
            method: 'POST',
            url: credentials.baseUrl,
            headers: {
              'Content-Type': 'application/json'
            },
            auth: {
              username: credentials.username,
              password: credentials.password
            },
            body: JSON.stringify({
              jsonrpc: '2.0',
              id: 1,
              method: 'importprivkey',
              params: rpcParams
            }),
            json: false
          };
          const response = await this.helpers.httpRequest(options) as any;
          result = JSON.parse(response);
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

async function executeTransactionOperations(
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
					const comment = this.getNodeParameter('comment', i) as string;
					const comment_to = this.getNodeParameter('comment_to', i) as string;

					const params = [address, amount];
					if (comment) params.push(comment);
					if (comment_to) params.push(comment_to);

					const requestBody = {
						jsonrpc: '2.0',
						method: 'sendtoaddress',
						params,
						id: 1,
					};

					const options: any = {
						method: 'POST',
						url: credentials.baseUrl,
						headers: {
							'Content-Type': 'application/json',
						},
						auth: {
							username: credentials.username,
							password: credentials.password,
						},
						body: JSON.stringify(requestBody),
						json: false,
					};

					const response = await this.helpers.httpRequest(options) as any;
					result = JSON.parse(response);
					break;
				}

				case 'sendMany': {
					const fromaccount = this.getNodeParameter('fromaccount', i) as string;
					const amounts = JSON.parse(this.getNodeParameter('amounts', i) as string);
					const minconf = this.getNodeParameter('minconf', i) as number;
					const comment = this.getNodeParameter('comment', i) as string;

					const params = [fromaccount, amounts, minconf];
					if (comment) params.push(comment);

					const requestBody = {
						jsonrpc: '2.0',
						method: 'sendmany',
						params,
						id: 1,
					};

					const options: any = {
						method: 'POST',
						url: credentials.baseUrl,
						headers: {
							'Content-Type': 'application/json',
						},
						auth: {
							username: credentials.username,
							password: credentials.password,
						},
						body: JSON.stringify(requestBody),
						json: false,
					};

					const response = await this.helpers.httpRequest(options) as any;
					result = JSON.parse(response);
					break;
				}

				case 'getRawTransaction': {
					const txid = this.getNodeParameter('txid', i) as string;
					const verbose = this.getNodeParameter('verbose', i) as boolean;

					const requestBody = {
						jsonrpc: '2.0',
						method: 'getrawtransaction',
						params: [txid, verbose],
						id: 1,
					};

					const options: any = {
						method: 'POST',
						url: credentials.baseUrl,
						headers: {
							'Content-Type': 'application/json',
						},
						auth: {
							username: credentials.username,
							password: credentials.password,
						},
						body: JSON.stringify(requestBody),
						json: false,
					};

					const response = await this.helpers.httpRequest(options) as any;
					result = JSON.parse(response);
					break;
				}

				case 'sendRawTransaction': {
					const hexstring = this.getNodeParameter('hexstring', i) as string;
					const allowhighfees = this.getNodeParameter('allowhighfees', i) as boolean;

					const requestBody = {
						jsonrpc: '2.0',
						method: 'sendrawtransaction',
						params: [hexstring, allowhighfees],
						id: 1,
					};

					const options: any = {
						method: 'POST',
						url: credentials.baseUrl,
						headers: {
							'Content-Type': 'application/json',