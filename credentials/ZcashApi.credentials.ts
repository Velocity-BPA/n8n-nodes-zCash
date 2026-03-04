import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class ZcashApi implements ICredentialType {
	name = 'zcashApi';
	displayName = 'Zcash API';
	documentationUrl = 'https://zcash.readthedocs.io/en/latest/rtd_pages/rpc.html';
	properties: INodeProperties[] = [
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'http://localhost:8232',
			description: 'The base URL for the Zcash RPC endpoint',
			required: true,
		},
		{
			displayName: 'RPC Username',
			name: 'username',
			type: 'string',
			default: '',
			description: 'RPC username configured in zcash.conf (rpcuser)',
			required: true,
		},
		{
			displayName: 'RPC Password',
			name: 'password',
			type: 'password',
			default: '',
			description: 'RPC password configured in zcash.conf (rpcpassword)',
			required: true,
		},
	];
}