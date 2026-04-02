import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class ZcashApi implements ICredentialType {
	name = 'zcashApi';
	displayName = 'Zcash API';
	documentationUrl = 'zcash';
	properties: INodeProperties[] = [
		{
			displayName: 'RPC Username',
			name: 'username',
			type: 'string',
			default: '',
			required: true,
		},
		{
			displayName: 'RPC Password',
			name: 'password',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
		},
		{
			displayName: 'RPC URL',
			name: 'url',
			type: 'string',
			default: 'http://127.0.0.1:8232',
			placeholder: 'http://127.0.0.1:8232',
			description: 'The RPC URL of your Zcash node',
			required: true,
		},
	];
}