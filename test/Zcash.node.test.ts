/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { Zcash } from '../nodes/Zcash/Zcash.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('Zcash Node', () => {
  let node: Zcash;

  beforeAll(() => {
    node = new Zcash();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Zcash');
      expect(node.description.name).toBe('zcash');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Wallet Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        username: 'test-user',
        password: 'test-password',
        baseUrl: 'http://127.0.0.1:8232'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn()
      }
    };
  });

  it('should get wallet info successfully', async () => {
    const mockResponse = JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      result: {
        walletname: 'wallet.dat',
        walletversion: 169900,
        balance: 10.5,
        unconfirmed_balance: 0.0
      }
    });

    mockExecuteFunctions.getNodeParameter.mockReturnValue('getWalletInfo');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeWalletOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.result.balance).toBe(10.5);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'http://127.0.0.1:8232',
      headers: { 'Content-Type': 'application/json' },
      auth: { username: 'test-user', password: 'test-password' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getwalletinfo',
        params: []
      }),
      json: false
    });
  });

  it('should get balance with account and minconf', async () => {
    const mockResponse = JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      result: 5.25
    });

    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getBalance')
      .mockReturnValueOnce('default')
      .mockReturnValueOnce(3);
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeWalletOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.result).toBe(5.25);
  });

  it('should generate new address', async () => {
    const mockResponse = JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      result: 't1XYZ123abc456def789'
    });

    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getNewAddress')
      .mockReturnValueOnce('main');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeWalletOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.result).toBe('t1XYZ123abc456def789');
  });

  it('should validate address', async () => {
    const mockResponse = JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      result: {
        isvalid: true,
        address: 't1XYZ123abc456def789',
        scriptPubKey: '76a914...',
        ismine: true
      }
    });

    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('validateAddress')
      .mockReturnValueOnce('t1XYZ123abc456def789');
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeWalletOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.result.isvalid).toBe(true);
  });

  it('should import private key with label and rescan', async () => {
    const mockResponse = JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      result: null
    });

    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('importPrivKey')
      .mockReturnValueOnce('L1abc123def456...')
      .mockReturnValueOnce('imported-key')
      .mockReturnValueOnce(false);
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeWalletOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'importprivkey',
          params: ['L1abc123def456...', 'imported-key', false]
        })
      })
    );
  });

  it('should handle API errors gracefully', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getWalletInfo');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Connection refused'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);

    const result = await executeWalletOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('Connection refused');
  });

  it('should throw error when continueOnFail is false', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getWalletInfo');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('RPC Error'));
    mockExecuteFunctions.continueOnFail.mockReturnValue(false);

    await expect(
      executeWalletOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('RPC Error');
  });

  it('should throw error for unknown operation', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValue('unknownOperation');

    await expect(
      executeWalletOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('Unknown operation: unknownOperation');
  });
});

describe('Transaction Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				username: 'test-user',
				password: 'test-password',
				baseUrl: 'http://127.0.0.1:8232',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('sendToAddress operation', () => {
		it('should send ZEC to an address successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('sendToAddress')
				.mockReturnValueOnce('t1234567890abcdef')
				.mockReturnValueOnce(1.5)
				.mockReturnValueOnce('test comment')
				.mockReturnValueOnce('test recipient');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(
				JSON.stringify({
					jsonrpc: '2.0',
					result: 'txid123456789',
					id: 1,
				}),
			);

			const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json.result).toBe('txid123456789');
		});

		it('should handle errors gracefully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('sendToAddress')
				.mockReturnValueOnce('invalid-address')
				.mockReturnValueOnce(-1);

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid address'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json.error).toBe('Invalid address');
		});
	});

	describe('getRawTransaction operation', () => {
		it('should get raw transaction successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getRawTransaction')
				.mockReturnValueOnce('txid123456789')
				.mockReturnValueOnce(true);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(
				JSON.stringify({
					jsonrpc: '2.0',
					result: { txid: 'txid123456789', hex: '0x123456' },
					id: 1,
				}),
			);

			const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json.result.txid).toBe('txid123456789');
		});
	});

	describe('listTransactions operation', () => {
		it('should list transactions successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('listTransactions')
				.mockReturnValueOnce('*')
				.mockReturnValueOnce(10)
				.mockReturnValueOnce(0)
				.mockReturnValueOnce(false);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(
				JSON.stringify({
					jsonrpc: '2.0',
					result: [{ txid: 'tx1', amount: 1.0 }, { txid: 'tx2', amount: 2.0 }],
					id: 1,
				}),
			);

			const result = await executeTransactionOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json.result).toHaveLength(2);
		});
	});
});

describe('ShieldedPool Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        username: 'test-user',
        password: 'test-password',
        baseUrl: 'http://127.0.0.1:8232'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
      },
    };
  });

  it('should generate new shielded address successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('generateAddress')
      .mockReturnValueOnce('sapling');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      result: 'zs1test1234567890abcdef',
    });

    const result = await executeShieldedPoolOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toBe('zs1test1234567890abcdef');
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        body: expect.objectContaining({
          method: 'z_getnewaddress',
          params: ['sapling'],
        }),
      })
    );
  });

  it('should get address for account successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getAddressForAccount')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(1);

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      result: 'zs1account1234567890abcdef',
    });

    const result = await executeShieldedPoolOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toBe('zs1account1234567890abcdef');
  });

  it('should list addresses successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('listAddresses')
      .mockReturnValueOnce(false);

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      result: ['zs1addr1', 'zs1addr2'],
    });

    const result = await executeShieldedPoolOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toEqual(['zs1addr1', 'zs1addr2']);
  });

  it('should get balance successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getBalance')
      .mockReturnValueOnce('zs1test1234567890')
      .mockReturnValueOnce(1);

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      result: 10.5,
    });

    const result = await executeShieldedPoolOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toBe(10.5);
  });

  it('should send many successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('sendMany')
      .mockReturnValueOnce('zs1from123')
      .mockReturnValueOnce([{ address: 'zs1to123', amount: 1.0 }])
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(0.0001);

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      result: 'opid-12345',
    });

    const result = await executeShieldedPoolOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json).toBe('opid-12345');
  });

  it('should handle RPC errors', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('generateAddress');
    
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      error: { code: -1, message: 'RPC Error' },
    });

    await expect(
      executeShieldedPoolOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('Zcash RPC Error: RPC Error');
  });

  it('should handle unknown operations', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('invalidOperation');

    await expect(
      executeShieldedPoolOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('Unknown operation: invalidOperation');
  });

  it('should continue on fail when enabled', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('generateAddress');
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network error'));

    const result = await executeShieldedPoolOperations.call(
      mockExecuteFunctions,
      [{ json: {} }]
    );

    expect(result).toHaveLength(1);
    expect(result[0].json.error).toBe('Network error');
  });
});

describe('Blockchain Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				username: 'test-user',
				password: 'test-pass',
				baseUrl: 'http://127.0.0.1:8232'
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn()
			},
		};
	});

	it('should get blockchain info successfully', async () => {
		const mockResponse = JSON.stringify({
			jsonrpc: '2.0',
			id: 'test',
			result: {
				chain: 'main',
				blocks: 1500000,
				bestblockhash: 'abc123'
			}
		});

		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getblockchaininfo');
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeBlockchainOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.chain).toBe('main');
		expect(result[0].json.blocks).toBe(1500000);
	});

	it('should handle RPC errors', async () => {
		const mockResponse = JSON.stringify({
			jsonrpc: '2.0',
			id: 'test',
			error: {
				code: -1,
				message: 'Connection refused'
			}
		});

		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getblockchaininfo');
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		await expect(
			executeBlockchainOperations.call(mockExecuteFunctions, [{ json: {} }])
		).rejects.toThrow('RPC Error: Connection refused');
	});

	it('should get block by hash successfully', async () => {
		const mockResponse = JSON.stringify({
			jsonrpc: '2.0',
			id: 'test',
			result: {
				hash: 'abc123',
				height: 1000,
				tx: ['tx1', 'tx2']
			}
		});

		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('getblock')
			.mockReturnValueOnce('abc123')
			.mockReturnValueOnce(1);
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeBlockchainOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.hash).toBe('abc123');
		expect(result[0].json.height).toBe(1000);
	});

	it('should get transaction output successfully', async () => {
		const mockResponse = JSON.stringify({
			jsonrpc: '2.0',
			id: 'test',
			result: {
				bestblock: 'def456',
				confirmations: 100,
				value: 1.5,
				scriptPubKey: {
					asm: 'OP_DUP OP_HASH160 abc123 OP_EQUALVERIFY OP_CHECKSIG',
					hex: '76a914abc12388ac',
					reqSigs: 1,
					type: 'pubkeyhash'
				}
			}
		});

		mockExecuteFunctions.getNodeParameter
			.mockReturnValueOnce('gettxout')
			.mockReturnValueOnce('tx123')
			.mockReturnValueOnce(0)
			.mockReturnValueOnce(true);
		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

		const result = await executeBlockchainOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.confirmations).toBe(100);
		expect(result[0].json.value).toBe(1.5);
	});

	it('should handle unknown operation error', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');

		await expect(
			executeBlockchainOperations.call(mockExecuteFunctions, [{ json: {} }])
		).rejects.toThrow('Unknown operation: unknownOperation');
	});

	it('should continue on fail when enabled', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getblockchaininfo');
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network error'));
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);

		const result = await executeBlockchainOperations.call(
			mockExecuteFunctions,
			[{ json: {} }]
		);

		expect(result).toHaveLength(1);
		expect(result[0].json.error).toBe('Network error');
	});
});

describe('Mining Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				username: 'test-user',
				password: 'test-pass',
				baseUrl: 'http://127.0.0.1:8232',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('getMiningInfo operation', () => {
		it('should get mining information successfully', async () => {
			const mockResponse = {
				result: {
					blocks: 12345,
					currentblocksize: 1000,
					difficulty: 123456789,
					networkhashps: 987654321,
				},
			};

			mockExecuteFunctions.getNodeParameter.mockReturnValue('getMiningInfo');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeMiningOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});

		it('should handle getMiningInfo error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('getMiningInfo');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('RPC Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeMiningOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json.error).toBe('RPC Error');
		});
	});

	describe('getNetworkHashps operation', () => {
		it('should get network hash rate successfully', async () => {
			const mockResponse = {
				result: 123456789012345,
			};

			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				if (param === 'operation') return 'getNetworkHashps';
				if (param === 'nblocks') return 120;
				if (param === 'height') return -1;
				return undefined;
			});
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeMiningOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});
	});

	describe('prioritiseTransaction operation', () => {
		it('should prioritise transaction successfully', async () => {
			const mockResponse = {
				result: true,
			};

			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				if (param === 'operation') return 'prioritiseTransaction';
				if (param === 'txid') return 'abc123def456';
				if (param === 'priorityDelta') return 1000;
				if (param === 'feeDelta') return 10000;
				return undefined;
			});
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeMiningOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});
	});

	describe('submitBlock operation', () => {
		it('should submit block successfully', async () => {
			const mockResponse = {
				result: null,
			};

			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				if (param === 'operation') return 'submitBlock';
				if (param === 'hexdata') return '0100000000000000000000000000000000000000';
				if (param === 'jsonParametersObject') return '{}';
				return undefined;
			});
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeMiningOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});
	});

	describe('getBlockTemplate operation', () => {
		it('should get block template successfully', async () => {
			const mockResponse = {
				result: {
					version: 4,
					previousblockhash: 'abc123def456',
					transactions: [],
					coinbaseaux: {},
					coinbasevalue: 1250000000,
				},
			};

			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				if (param === 'operation') return 'getBlockTemplate';
				if (param === 'templateRequest') return '{"mode": "template"}';
				return undefined;
			});
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeMiningOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});
	});

	describe('getNetworkSolps operation', () => {
		it('should get network solution rate successfully', async () => {
			const mockResponse = {
				result: 987654321,
			};

			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				if (param === 'operation') return 'getNetworkSolps';
				if (param === 'nblocks') return 120;
				if (param === 'height') return -1;
				return undefined;
			});
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeMiningOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse);
		});
	});
});

describe('Network Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				username: 'testuser',
				password: 'testpass',
				baseUrl: 'http://127.0.0.1:8232',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
			},
		};
	});

	describe('getNetworkInfo', () => {
		it('should get network information successfully', async () => {
			const mockResponse = {
				result: {
					version: 4070050,
					subversion: '/MagicBean:4.7.0/',
					protocolversion: 170013,
					connections: 8,
				},
			};

			mockExecuteFunctions.getNodeParameter.mockReturnValue('getNetworkInfo');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeNetworkOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json).toEqual(mockResponse.result);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'http://127.0.0.1:8232',
				headers: { 'Content-Type': 'application/json' },
				auth: { username: 'testuser', password: 'testpass' },
				json: true,
				body: {
					jsonrpc: '2.0',
					id: 'n8n',
					method: 'getnetworkinfo',
					params: [],
				},
			});
		});

		it('should handle getNetworkInfo error', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValue('getNetworkInfo');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeNetworkOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(result[0].json.error).toBe('Network error');
		});
	});

	describe('addNode', () => {
		it('should add node successfully', async () => {
			const mockResponse = { result: null };

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('addNode')
				.mockReturnValueOnce('192.168.1.100:8233')
				.mockReturnValueOnce('add');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeNetworkOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'http://127.0.0.1:8232',
				headers: { 'Content-Type': 'application/json' },
				auth: { username: 'testuser', password: 'testpass' },
				json: true,
				body: {
					jsonrpc: '2.0',
					id: 'n8n',
					method: 'addnode',
					params: ['192.168.1.100:8233', 'add'],
				},
			});
		});
	});

	describe('disconnectNode', () => {
		it('should disconnect node by address successfully', async () => {
			const mockResponse = { result: null };

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('disconnectNode')
				.mockReturnValueOnce('192.168.1.100:8233')
				.mockReturnValueOnce(0);
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeNetworkOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toHaveLength(1);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'http://127.0.0.1:8232',
				headers: { 'Content-Type': 'application/json' },
				auth: { username: 'testuser', password: 'testpass' },
				json: true,
				body: {
					jsonrpc: '2.0',
					id: 'n8n',
					method: 'disconnectnode',
					params: ['192.168.1.100:8233'],
				},
			});
		});
	});
});
});
