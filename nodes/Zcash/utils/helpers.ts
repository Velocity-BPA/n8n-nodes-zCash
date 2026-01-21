/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { INodeExecutionData } from 'n8n-workflow';

/**
 * Convert satoshis to ZEC
 */
export function satoshisToZec(satoshis: number): number {
  return satoshis / 100000000;
}

/**
 * Convert ZEC to satoshis
 */
export function zecToSatoshis(zec: number): number {
  return Math.round(zec * 100000000);
}

/**
 * Format the response as n8n execution data
 */
export function formatResponse(data: any): INodeExecutionData[] {
  if (Array.isArray(data)) {
    return data.map((item) => ({ json: item }));
  }
  return [{ json: typeof data === 'object' ? data : { result: data } }];
}

/**
 * Validate a Zcash address format
 */
export function isValidZcashAddress(address: string): boolean {
  // Transparent addresses start with 't1' (mainnet) or 'tm' (testnet)
  if (/^t[13][a-km-zA-HJ-NP-Z1-9]{33}$/.test(address)) {
    return true;
  }
  // Sapling addresses start with 'zs' (mainnet) or 'ztestsapling' (testnet)
  if (/^zs[a-km-zA-HJ-NP-Z1-9]{76}$/.test(address)) {
    return true;
  }
  // Unified addresses start with 'u1'
  if (/^u1[a-km-zA-HJ-NP-Z1-9]+$/.test(address)) {
    return true;
  }
  return false;
}

/**
 * Format memo for shielded transactions
 */
export function formatMemo(memo: string): string {
  // Convert memo to hex
  return Buffer.from(memo, 'utf8').toString('hex');
}

/**
 * Decode hex memo back to string
 */
export function decodeMemo(hexMemo: string): string {
  const buffer = Buffer.from(hexMemo, 'hex');
  // Remove trailing null bytes
  let endIndex = buffer.length;
  while (endIndex > 0 && buffer[endIndex - 1] === 0) {
    endIndex--;
  }
  return buffer.subarray(0, endIndex).toString('utf8');
}

/**
 * Parse operation ID from z_sendmany result
 */
export function parseOperationId(result: any): string {
  if (typeof result === 'string') {
    return result;
  }
  return result?.operationid || result?.opid || '';
}

/**
 * Sleep utility for polling operations
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
