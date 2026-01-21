/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { ZcashRpcClient } from '../../transport/rpcClient';
import { formatResponse, formatMemo, parseOperationId } from '../../utils/helpers';

export async function zGetBalance(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const address = context.getNodeParameter('address', itemIndex) as string;
  const minConfirmations = context.getNodeParameter('minConfirmations', itemIndex, 1) as number;
  
  const result = await client.call(context, 'z_getbalance', [address, minConfirmations]);
  return formatResponse({ address, balance: result, unit: 'ZEC' });
}

export async function zGetNewAddress(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const addressType = context.getNodeParameter('addressType', itemIndex, 'sapling') as string;
  
  const result = await client.call(context, 'z_getnewaddress', [addressType]);
  return formatResponse({ address: result, type: addressType });
}

export async function zListAddresses(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const includeWatchOnly = context.getNodeParameter('includeWatchOnly', itemIndex, false) as boolean;
  
  const result = await client.call(context, 'z_listaddresses', [includeWatchOnly]);
  return formatResponse(result.map((address: string) => ({ address })));
}

export async function zSendMany(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const fromAddress = context.getNodeParameter('fromAddress', itemIndex) as string;
  const toAddress = context.getNodeParameter('toAddress', itemIndex) as string;
  const amount = context.getNodeParameter('amount', itemIndex) as number;
  const memo = context.getNodeParameter('memo', itemIndex, '') as string;
  const minConfirmations = context.getNodeParameter('minConfirmations', itemIndex, 1) as number;
  const fee = context.getNodeParameter('fee', itemIndex, 0.0001) as number;
  
  const amounts: any[] = [{
    address: toAddress,
    amount: amount,
  }];
  
  if (memo) {
    amounts[0].memo = formatMemo(memo);
  }
  
  const result = await client.call(context, 'z_sendmany', [
    fromAddress,
    amounts,
    minConfirmations,
    fee,
  ]);
  
  return formatResponse({ operationId: parseOperationId(result) });
}

export async function zGetOperationStatus(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const operationId = context.getNodeParameter('operationId', itemIndex, '') as string;
  
  const params = operationId ? [[operationId]] : [];
  const result = await client.call(context, 'z_getoperationstatus', params);
  return formatResponse(result);
}

export async function zGetOperationResult(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const operationId = context.getNodeParameter('operationId', itemIndex, '') as string;
  
  const params = operationId ? [[operationId]] : [];
  const result = await client.call(context, 'z_getoperationresult', params);
  return formatResponse(result);
}

export async function zListOperations(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  _itemIndex: number,
): Promise<INodeExecutionData[]> {
  const result = await client.call(context, 'z_listoperationids', []);
  return formatResponse(result.map((opId: string) => ({ operationId: opId })));
}

export async function zViewTransaction(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const txid = context.getNodeParameter('txid', itemIndex) as string;
  
  const result = await client.call(context, 'z_viewtransaction', [txid]);
  return formatResponse(result);
}

export async function zGetTotalBalance(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const minConfirmations = context.getNodeParameter('minConfirmations', itemIndex, 1) as number;
  const includeWatchOnly = context.getNodeParameter('includeWatchOnly', itemIndex, false) as boolean;
  
  const result = await client.call(context, 'z_gettotalbalance', [minConfirmations, includeWatchOnly]);
  return formatResponse(result);
}
