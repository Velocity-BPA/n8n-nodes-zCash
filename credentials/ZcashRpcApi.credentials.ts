/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class ZcashRpcApi implements ICredentialType {
  name = 'zcashRpcApi';
  displayName = 'Zcash RPC API';
  documentationUrl = 'https://zcash.readthedocs.io/en/latest/rtd_pages/zcash_rpc.html';
  properties: INodeProperties[] = [
    {
      displayName: 'Host',
      name: 'host',
      type: 'string',
      default: 'localhost',
      placeholder: 'localhost',
      description: 'The hostname or IP address of your zcashd node',
    },
    {
      displayName: 'Port',
      name: 'port',
      type: 'number',
      default: 8232,
      description: 'RPC port (mainnet: 8232, testnet: 18232, regtest: 18443)',
    },
    {
      displayName: 'Username',
      name: 'username',
      type: 'string',
      default: '',
      description: 'RPC username from zcash.conf',
    },
    {
      displayName: 'Password',
      name: 'password',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      description: 'RPC password from zcash.conf',
    },
    {
      displayName: 'Use SSL',
      name: 'ssl',
      type: 'boolean',
      default: false,
      description: 'Whether to use HTTPS for the RPC connection',
    },
    {
      displayName: 'Network',
      name: 'network',
      type: 'options',
      options: [
        { name: 'Mainnet', value: 'mainnet' },
        { name: 'Testnet', value: 'testnet' },
        { name: 'Regtest', value: 'regtest' },
      ],
      default: 'mainnet',
      description: 'The Zcash network to connect to',
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      auth: {
        username: '={{$credentials.username}}',
        password: '={{$credentials.password}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.ssl ? "https" : "http"}}://{{$credentials.host}}:{{$credentials.port}}',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '1.0',
        id: 'n8n-test',
        method: 'getblockchaininfo',
        params: [],
      }),
    },
  };
}
