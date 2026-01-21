/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { ZcashRpcClient } from '../../transport/rpcClient';
import { formatResponse } from '../../utils/helpers';

export async function getTransaction(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const txid = context.getNodeParameter('txid', itemIndex) as string;
  const includeWatchOnly = context.getNodeParameter('includeWatchOnly', itemIndex, false) as boolean;
  
  const result = await client.call(context, 'gettransaction', [txid, includeWatchOnly]);
  return formatResponse(result);
}

export async function getRawTransaction(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const txid = context.getNodeParameter('txid', itemIndex) as string;
  const verbose = context.getNodeParameter('verbose', itemIndex, true) as boolean;
  
  const result = await client.call(context, 'getrawtransaction', [txid, verbose ? 1 : 0]);
  return formatResponse(result);
}

export async function sendRawTransaction(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const hexString = context.getNodeParameter('hexString', itemIndex) as string;
  const allowHighFees = context.getNodeParameter('allowHighFees', itemIndex, false) as boolean;
  
  const result = await client.call(context, 'sendrawtransaction', [hexString, allowHighFees]);
  return formatResponse({ txid: result });
}

export async function decodeRawTransaction(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const hexString = context.getNodeParameter('hexString', itemIndex) as string;
  
  const result = await client.call(context, 'decoderawtransaction', [hexString]);
  return formatResponse(result);
}

export async function createRawTransaction(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const inputs = context.getNodeParameter('inputs', itemIndex) as string;
  const outputs = context.getNodeParameter('outputs', itemIndex) as string;
  const locktime = context.getNodeParameter('locktime', itemIndex, 0) as number;
  
  const parsedInputs = JSON.parse(inputs);
  const parsedOutputs = JSON.parse(outputs);
  
  const result = await client.call(context, 'createrawtransaction', [
    parsedInputs,
    parsedOutputs,
    locktime,
  ]);
  
  return formatResponse({ hex: result });
}

export async function signRawTransaction(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const hexString = context.getNodeParameter('hexString', itemIndex) as string;
  
  const result = await client.call(context, 'signrawtransaction', [hexString]);
  return formatResponse(result);
}

export async function listUnspent(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const minConfirmations = context.getNodeParameter('minConfirmations', itemIndex, 1) as number;
  const maxConfirmations = context.getNodeParameter('maxConfirmations', itemIndex, 9999999) as number;
  const addresses = context.getNodeParameter('addresses', itemIndex, '') as string;
  
  const params: any[] = [minConfirmations, maxConfirmations];
  
  if (addresses) {
    params.push(addresses.split(',').map((a) => a.trim()));
  }
  
  const result = await client.call(context, 'listunspent', params);
  return formatResponse(result);
}
