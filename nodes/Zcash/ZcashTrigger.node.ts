/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IPollFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

import { LICENSING_NOTICE } from './constants/constants';

// Log licensing notice once on module load
let licensingLogged = false;
function logLicensingNotice(): void {
  if (!licensingLogged) {
    console.warn(LICENSING_NOTICE);
    licensingLogged = true;
  }
}

interface ZcashCredentials {
  host: string;
  port: number;
  username: string;
  password: string;
  ssl: boolean;
  network: string;
}

export class ZcashTrigger implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Zcash Trigger',
    name: 'zcashTrigger',
    icon: 'file:zcash.svg',
    group: ['trigger'],
    version: 1,
    subtitle: '={{$parameter["event"]}}',
    description: 'Trigger workflows on Zcash blockchain events',
    defaults: {
      name: 'Zcash Trigger',
    },
    inputs: [],
    outputs: ['main'],
    credentials: [
      {
        name: 'zcashRpcApi',
        required: true,
      },
    ],
    polling: true,
    properties: [
      {
        displayName: 'Event',
        name: 'event',
        type: 'options',
        options: [
          {
            name: 'New Block',
            value: 'newBlock',
            description: 'Trigger when a new block is mined',
          },
          {
            name: 'Address Activity',
            value: 'addressActivity',
            description: 'Trigger when an address receives or sends funds',
          },
          {
            name: 'Balance Change',
            value: 'balanceChange',
            description: 'Trigger when wallet balance changes',
          },
          {
            name: 'Transaction Confirmed',
            value: 'transactionConfirmed',
            description: 'Trigger when a transaction gets confirmed',
          },
          {
            name: 'Large Transaction',
            value: 'largeTransaction',
            description: 'Trigger on transactions above a threshold',
          },
        ],
        default: 'newBlock',
      },
      {
        displayName: 'Address',
        name: 'address',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            event: ['addressActivity'],
          },
        },
        description: 'Address to monitor for activity',
      },
      {
        displayName: 'Transaction ID',
        name: 'txid',
        type: 'string',
        default: '',
        required: true,
        displayOptions: {
          show: {
            event: ['transactionConfirmed'],
          },
        },
        description: 'Transaction ID to monitor for confirmations',
      },
      {
        displayName: 'Required Confirmations',
        name: 'confirmations',
        type: 'number',
        default: 6,
        displayOptions: {
          show: {
            event: ['transactionConfirmed'],
          },
        },
        description: 'Number of confirmations to wait for',
      },
      {
        displayName: 'Threshold Amount (ZEC)',
        name: 'threshold',
        type: 'number',
        default: 10,
        typeOptions: {
          minValue: 0,
          numberPrecision: 8,
        },
        displayOptions: {
          show: {
            event: ['largeTransaction'],
          },
        },
        description: 'Minimum transaction amount to trigger',
      },
    ],
  };

  async poll(this: IPollFunctions): Promise<INodeExecutionData[][] | null> {
    logLicensingNotice();

    const event = this.getNodeParameter('event') as string;
    const credentials = (await this.getCredentials('zcashRpcApi')) as ZcashCredentials;

    const protocol = credentials.ssl ? 'https' : 'http';
    const baseUrl = `${protocol}://${credentials.host}:${credentials.port}`;
    const auth = Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64');

    const rpcCall = async (method: string, params: any[] = []): Promise<any> => {
      const response = await this.helpers.httpRequest({
        method: 'POST',
        url: baseUrl,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`,
        },
        body: {
          jsonrpc: '1.0',
          id: 'n8n-trigger',
          method,
          params,
        },
        json: true,
      });

      if (response.error) {
        throw new Error(`Zcash RPC Error: ${response.error.message}`);
      }

      return response.result;
    };

    const webhookData = this.getWorkflowStaticData('node');

    switch (event) {
      case 'newBlock': {
        const currentBlockCount = await rpcCall('getblockcount');
        const lastBlockCount = (webhookData.lastBlockCount as number) || currentBlockCount;

        if (currentBlockCount > lastBlockCount) {
          webhookData.lastBlockCount = currentBlockCount;

          const results: INodeExecutionData[] = [];
          for (let height = lastBlockCount + 1; height <= currentBlockCount; height++) {
            const blockHash = await rpcCall('getblockhash', [height]);
            const block = await rpcCall('getblock', [blockHash, 1]);
            results.push({
              json: {
                event: 'newBlock',
                height,
                hash: blockHash,
                time: block.time,
                transactions: block.tx?.length || 0,
                difficulty: block.difficulty,
                size: block.size,
              },
            });
          }

          return [results];
        }

        webhookData.lastBlockCount = currentBlockCount;
        return null;
      }

      case 'addressActivity': {
        const address = this.getNodeParameter('address') as string;
        const transactions = await rpcCall('listtransactions', ['*', 10, 0, true]);

        const lastTxId = (webhookData.lastTxId as string) || '';
        const newTransactions = [];
        let foundLast = !lastTxId;

        for (const tx of transactions.reverse()) {
          if (foundLast) {
            if (tx.address === address) {
              newTransactions.push({
                json: {
                  event: 'addressActivity',
                  address,
                  txid: tx.txid,
                  category: tx.category,
                  amount: tx.amount,
                  confirmations: tx.confirmations,
                  time: tx.time,
                },
              });
            }
          } else if (tx.txid === lastTxId) {
            foundLast = true;
          }
        }

        if (transactions.length > 0) {
          webhookData.lastTxId = transactions[transactions.length - 1].txid;
        }

        return newTransactions.length > 0 ? [newTransactions] : null;
      }

      case 'balanceChange': {
        const balance = await rpcCall('z_gettotalbalance', [1, true]);
        const totalBalance = parseFloat(balance.total);
        const lastBalance = (webhookData.lastBalance as number) ?? totalBalance;

        if (totalBalance !== lastBalance) {
          const change = totalBalance - lastBalance;
          webhookData.lastBalance = totalBalance;

          return [
            [
              {
                json: {
                  event: 'balanceChange',
                  previousBalance: lastBalance,
                  currentBalance: totalBalance,
                  change,
                  transparent: parseFloat(balance.transparent),
                  private: parseFloat(balance.private),
                },
              },
            ],
          ];
        }

        webhookData.lastBalance = totalBalance;
        return null;
      }

      case 'transactionConfirmed': {
        const txid = this.getNodeParameter('txid') as string;
        const requiredConfirmations = this.getNodeParameter('confirmations') as number;

        try {
          const tx = await rpcCall('gettransaction', [txid]);

          const wasConfirmed = (webhookData.wasConfirmed as boolean) || false;
          const confirmations = tx.confirmations || 0;

          if (!wasConfirmed && confirmations >= requiredConfirmations) {
            webhookData.wasConfirmed = true;

            return [
              [
                {
                  json: {
                    event: 'transactionConfirmed',
                    txid,
                    confirmations,
                    requiredConfirmations,
                    amount: tx.amount,
                    fee: tx.fee,
                    time: tx.time,
                    blockHash: tx.blockhash,
                  },
                },
              ],
            ];
          }
        } catch {
          // Transaction not found or pending
        }

        return null;
      }

      case 'largeTransaction': {
        const threshold = this.getNodeParameter('threshold') as number;
        const transactions = await rpcCall('listtransactions', ['*', 20, 0, true]);

        const lastProcessedTxId = (webhookData.lastProcessedTxId as string) || '';
        const largeTransactions: INodeExecutionData[] = [];
        let foundLast = !lastProcessedTxId;

        for (const tx of transactions.reverse()) {
          if (foundLast) {
            if (Math.abs(tx.amount) >= threshold) {
              largeTransactions.push({
                json: {
                  event: 'largeTransaction',
                  txid: tx.txid,
                  amount: tx.amount,
                  threshold,
                  category: tx.category,
                  address: tx.address,
                  confirmations: tx.confirmations,
                  time: tx.time,
                },
              });
            }
          } else if (tx.txid === lastProcessedTxId) {
            foundLast = true;
          }
        }

        if (transactions.length > 0) {
          webhookData.lastProcessedTxId = transactions[transactions.length - 1].txid;
        }

        return largeTransactions.length > 0 ? [largeTransactions] : null;
      }

      default:
        throw new Error(`Unknown event: ${event}`);
    }
  }
}
