/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { ZcashRpcClient } from '../../transport/rpcClient';
import { formatResponse } from '../../utils/helpers';

export async function exportViewingKey(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const address = context.getNodeParameter('address', itemIndex) as string;
  
  const result = await client.call(context, 'z_exportviewingkey', [address]);
  return formatResponse({ address, viewingKey: result });
}

export async function importViewingKey(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const viewingKey = context.getNodeParameter('viewingKey', itemIndex) as string;
  const rescan = context.getNodeParameter('rescan', itemIndex, 'whenkeyisnew') as string;
  const startHeight = context.getNodeParameter('startHeight', itemIndex, 0) as number;
  
  const result = await client.call(context, 'z_importviewingkey', [viewingKey, rescan, startHeight]);
  return formatResponse({ success: true, result });
}

export async function exportSpendingKey(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const address = context.getNodeParameter('address', itemIndex) as string;
  
  const result = await client.call(context, 'z_exportkey', [address]);
  return formatResponse({ address, spendingKey: result });
}

export async function importSpendingKey(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const spendingKey = context.getNodeParameter('spendingKey', itemIndex) as string;
  const rescan = context.getNodeParameter('rescan', itemIndex, 'whenkeyisnew') as string;
  const startHeight = context.getNodeParameter('startHeight', itemIndex, 0) as number;
  
  const result = await client.call(context, 'z_importkey', [spendingKey, rescan, startHeight]);
  return formatResponse({ success: true, result });
}

export async function zExportKey(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const address = context.getNodeParameter('address', itemIndex) as string;
  
  const result = await client.call(context, 'z_exportkey', [address]);
  return formatResponse({ address, key: result });
}

export async function zImportKey(
  context: IExecuteFunctions,
  client: ZcashRpcClient,
  itemIndex: number,
): Promise<INodeExecutionData[]> {
  const key = context.getNodeParameter('key', itemIndex) as string;
  const rescan = context.getNodeParameter('rescan', itemIndex, 'whenkeyisnew') as string;
  const startHeight = context.getNodeParameter('startHeight', itemIndex, 0) as number;
  
  const result = await client.call(context, 'z_importkey', [key, rescan, startHeight]);
  return formatResponse({ success: true, result });
}
