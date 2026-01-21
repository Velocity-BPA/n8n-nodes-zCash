/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { ZcashRpcClient } from '../../transport/rpcClient';
import { formatResponse } from '../../utils/helpers';

export async function getBalance(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const minConfirmations = context.getNodeParameter('minConfirmations', itemIndex, 1) as number;
  const includeWatchOnly = context.getNodeParameter('includeWatchOnly', itemIndex, false) as boolean;
  
  const result = await client.call(context, 'getbalance', ['*', minConfirmations, includeWatchOnly]);
  return formatResponse({ balance: result, unit: 'ZEC' });
}

export async function getNewAddress(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const addressType = context.getNodeParameter('addressType', itemIndex, '') as string;
  
  const params = addressType ? [addressType] : [];
  const result = await client.call(context, 'getnewaddress', params);
  return formatResponse({ address: result, type: addressType || 'default' });
}

export async function listAddresses(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  _itemIndex: number,
): Promise<INodeExecutionData[]> {
  const result = await client.call(context, 'listaddressgroupings', []);
  
  const addresses: any[] = [];
  for (const group of result) {
    for (const addr of group) {
      addresses.push({
        address: addr[0],
        balance: addr[1],
        label: addr[2] || '',
      });
    }
  }
  
  return formatResponse(addresses);
}

export async function listTransactions(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const count = context.getNodeParameter('count', itemIndex, 10) as number;
  const skip = context.getNodeParameter('skip', itemIndex, 0) as number;
  const includeWatchOnly = context.getNodeParameter('includeWatchOnly', itemIndex, false) as boolean;
  
  const result = await client.call(context, 'listtransactions', ['*', count, skip, includeWatchOnly]);
  return formatResponse(result);
}

export async function sendToAddress(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const address = context.getNodeParameter('address', itemIndex) as string;
  const amount = context.getNodeParameter('amount', itemIndex) as number;
  const comment = context.getNodeParameter('comment', itemIndex, '') as string;
  const commentTo = context.getNodeParameter('commentTo', itemIndex, '') as string;
  
  const result = await client.call(context, 'sendtoaddress', [
    address,
    amount,
    comment,
    commentTo,
  ]);
  
  return formatResponse({ txid: result });
}

export async function validateAddress(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const address = context.getNodeParameter('address', itemIndex) as string;
  
  const result = await client.call(context, 'validateaddress', [address]);
  return formatResponse(result);
}

export async function getWalletInfo(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  _itemIndex: number,
): Promise<INodeExecutionData[]> {
  const result = await client.call(context, 'getwalletinfo', []);
  return formatResponse(result);
}

export async function backupWallet(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const destination = context.getNodeParameter('destination', itemIndex) as string;
  
  await client.call(context, 'backupwallet', [destination]);
  return formatResponse({ success: true, destination });
}
