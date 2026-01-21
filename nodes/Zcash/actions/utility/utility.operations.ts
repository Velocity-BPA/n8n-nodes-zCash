/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { ZcashRpcClient } from '../../transport/rpcClient';
import { formatResponse } from '../../utils/helpers';

export async function estimateFee(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const numBlocks = context.getNodeParameter('numBlocks', itemIndex, 6) as number;
  
  const result = await client.call(context, 'estimatefee', [numBlocks]);
  return formatResponse({ estimatedFee: result, blocks: numBlocks, unit: 'ZEC/kB' });
}

export async function signMessage(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const address = context.getNodeParameter('address', itemIndex) as string;
  const message = context.getNodeParameter('message', itemIndex) as string;
  
  const result = await client.call(context, 'signmessage', [address, message]);
  return formatResponse({ signature: result, address, message });
}

export async function verifyMessage(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const address = context.getNodeParameter('address', itemIndex) as string;
  const signature = context.getNodeParameter('signature', itemIndex) as string;
  const message = context.getNodeParameter('message', itemIndex) as string;
  
  const result = await client.call(context, 'verifymessage', [address, signature, message]);
  return formatResponse({ valid: result, address });
}

export async function getInfo(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  _itemIndex: number,
): Promise<INodeExecutionData[]> {
  const result = await client.call(context, 'getinfo', []);
  return formatResponse(result);
}

export async function help(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const command = context.getNodeParameter('command', itemIndex, '') as string;
  
  const params = command ? [command] : [];
  const result = await client.call(context, 'help', params);
  return formatResponse({ help: result });
}

export async function stop(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  _itemIndex: number,
): Promise<INodeExecutionData[]> {
  const result = await client.call(context, 'stop', []);
  return formatResponse({ message: result || 'Zcash server stopping' });
}
