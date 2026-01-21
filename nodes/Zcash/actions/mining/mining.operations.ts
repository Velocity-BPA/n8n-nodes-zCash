/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { ZcashRpcClient } from '../../transport/rpcClient';
import { formatResponse } from '../../utils/helpers';

export async function getMiningInfo(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  _itemIndex: number,
): Promise<INodeExecutionData[]> {
  const result = await client.call(context, 'getmininginfo', []);
  return formatResponse(result);
}

export async function getNetworkHashrate(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const blocks = context.getNodeParameter('blocks', itemIndex, 120) as number;
  const height = context.getNodeParameter('height', itemIndex, -1) as number;
  
  const result = await client.call(context, 'getnetworkhashps', [blocks, height]);
  return formatResponse({ hashrate: result, unit: 'H/s' });
}

export async function getBlockTemplate(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  _itemIndex: number,
): Promise<INodeExecutionData[]> {
  const result = await client.call(context, 'getblocktemplate', []);
  return formatResponse(result);
}

export async function submitBlock(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const hexData = context.getNodeParameter('hexData', itemIndex) as string;
  
  const result = await client.call(context, 'submitblock', [hexData]);
  return formatResponse({ result: result || 'accepted' });
}

export async function getNetworkSolPs(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const blocks = context.getNodeParameter('blocks', itemIndex, 120) as number;
  const height = context.getNodeParameter('height', itemIndex, -1) as number;
  
  const result = await client.call(context, 'getnetworksolps', [blocks, height]);
  return formatResponse({ solutionsPerSecond: result, unit: 'Sol/s' });
}
