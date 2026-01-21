/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, ICredentialDataDecryptedObject } from 'n8n-workflow';

export interface RpcResponse<T = any> {
  result: T;
  error: RpcError | null;
  id: string;
}

export interface RpcError {
  code: number;
  message: string;
}

export interface ZcashCredentials extends ICredentialDataDecryptedObject {
  host: string;
  port: number;
  username: string;
  password: string;
  ssl: boolean;
  network: string;
}

export class ZcashRpcClient {
  private baseUrl: string;
  private auth: string;
  private requestId = 0;

  constructor(credentials: ZcashCredentials) {
    const protocol = credentials.ssl ? 'https' : 'http';
    this.baseUrl = `${protocol}://${credentials.host}:${credentials.port}`;
    this.auth = Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64');
  }

  async call<T = any>(
    context: IExecuteFunctions,
    method: string,
    params: any[] = [],
  ): Promise<T> {
    const requestId = `n8n-${++this.requestId}`;

    const response = await context.helpers.httpRequest({
      method: 'POST',
      url: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${this.auth}`,
      },
      body: {
        jsonrpc: '1.0',
        id: requestId,
        method,
        params,
      },
      json: true,
    });

    if (response.error) {
      throw new Error(`Zcash RPC Error [${response.error.code}]: ${response.error.message}`);
    }

    return response.result as T;
  }
}

export async function createRpcClient(context: IExecuteFunctions): Promise<ZcashRpcClient> {
  const credentials = (await context.getCredentials('zcashRpcApi')) as ZcashCredentials;
  return new ZcashRpcClient(credentials);
}
