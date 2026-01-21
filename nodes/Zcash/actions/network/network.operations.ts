/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { ZcashRpcClient } from '../../transport/rpcClient';
import { formatResponse } from '../../utils/helpers';

export async function getNetworkInfo(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  _itemIndex: number,
): Promise<INodeExecutionData[]> {
  const result = await client.call(context, 'getnetworkinfo', []);
  return formatResponse(result);
}

export async function getPeerInfo(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  _itemIndex: number,
): Promise<INodeExecutionData[]> {
  const result = await client.call(context, 'getpeerinfo', []);
  return formatResponse(result);
}

export async function getConnectionCount(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  _itemIndex: number,
): Promise<INodeExecutionData[]> {
  const result = await client.call(context, 'getconnectioncount', []);
  return formatResponse({ connectionCount: result });
}

export async function addNode(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const node = context.getNodeParameter('node', itemIndex) as string;
  const command = context.getNodeParameter('command', itemIndex) as string;
  
  await client.call(context, 'addnode', [node, command]);
  return formatResponse({ success: true, node, command });
}

export async function getAddedNodeInfo(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const dns = context.getNodeParameter('dns', itemIndex, true) as boolean;
  const node = context.getNodeParameter('node', itemIndex, '') as string;
  
  const params: any[] = [dns];
  if (node) {
    params.push(node);
  }
  
  const result = await client.call(context, 'getaddednodeinfo', params);
  return formatResponse(result);
}

export async function disconnectNode(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const node = context.getNodeParameter('node', itemIndex) as string;
  
  await client.call(context, 'disconnectnode', [node]);
  return formatResponse({ success: true, disconnected: node });
}
