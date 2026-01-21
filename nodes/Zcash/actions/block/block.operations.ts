/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { ZcashRpcClient } from '../../transport/rpcClient';
import { formatResponse } from '../../utils/helpers';

export async function getBlock(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const blockHash = context.getNodeParameter('blockHash', itemIndex) as string;
  const verbosity = context.getNodeParameter('verbosity', itemIndex, 1) as number;
  
  const result = await client.call(context, 'getblock', [blockHash, verbosity]);
  return formatResponse(result);
}

export async function getBlockCount(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  _itemIndex: number,
): Promise<INodeExecutionData[]> {
  const result = await client.call(context, 'getblockcount', []);
  return formatResponse({ blockCount: result });
}

export async function getBlockHash(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const height = context.getNodeParameter('height', itemIndex) as number;
  
  const result = await client.call(context, 'getblockhash', [height]);
  return formatResponse({ blockHash: result, height });
}

export async function getBestBlockHash(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  _itemIndex: number,
): Promise<INodeExecutionData[]> {
  const result = await client.call(context, 'getbestblockhash', []);
  return formatResponse({ bestBlockHash: result });
}

export async function getBlockHeader(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const blockHash = context.getNodeParameter('blockHash', itemIndex) as string;
  const verbose = context.getNodeParameter('verbose', itemIndex, true) as boolean;
  
  const result = await client.call(context, 'getblockheader', [blockHash, verbose]);
  return formatResponse(result);
}

export async function getBlockchainInfo(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  _itemIndex: number,
): Promise<INodeExecutionData[]> {
  const result = await client.call(context, 'getblockchaininfo', []);
  return formatResponse(result);
}

export async function getDifficulty(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  _itemIndex: number,
): Promise<INodeExecutionData[]> {
  const result = await client.call(context, 'getdifficulty', []);
  return formatResponse({ difficulty: result });
}
