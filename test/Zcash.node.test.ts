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

    it('should define 5 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(5);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(5);
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
        baseUrl: 'http://localhost:8232',
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

  test('should execute getBalance operation successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'getBalance';
        case 'account': return '';
        case 'minconf': return 1;
        case 'includeWatchonly': return false;
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      result: 10.5,
      error: null,
      id: 'n8n',
    });

    const result = await executeWalletOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([
      {
        json: 10.5,
        pairedItem: { item: 0 },
      },
    ]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'http://localhost:8232',
      headers: { 'Content-Type': 'application/json' },
      json: true,
      auth: { user: 'test-user', pass: 'test-password' },
      body: {
        jsonrpc: '1.0',
        id: 'n8n',
        method: 'getbalance',
        params: ['', 1, false],
      },
    });
  });

  test('should execute getNewAddress operation successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'getNewAddress';
        case 'account': return 'main';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      result: 't1NewAddress123',
      error: null,
      id: 'n8n',
    });

    const result = await executeWalletOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([
      {
        json: 't1NewAddress123',
        pairedItem: { item: 0 },
      },
    ]);
  });

  test('should execute listAddresses operation successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'listAddresses';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      result: ['t1Address1', 't1Address2'],
      error: null,
      id: 'n8n',
    });

    const result = await executeWalletOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([
      {
        json: ['t1Address1', 't1Address2'],
        pairedItem: { item: 0 },
      },
    ]);
  });

  test('should handle API errors', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'getBalance';
        case 'account': return '';
        case 'minconf': return 1;
        case 'includeWatchonly': return false;
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      result: null,
      error: { code: -1, message: 'Wallet not found' },
      id: 'n8n',
    });

    await expect(
      executeWalletOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow();
  });

  test('should continue on fail when configured', async () => {
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      switch (paramName) {
        case 'operation': return 'getBalance';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Connection failed'));

    const result = await executeWalletOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([
      {
        json: { error: 'Connection failed' },
        pairedItem: { item: 0 },
      },
    ]);
  });
});

describe('ShieldedOperations Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        username: 'test-user',
        password: 'test-password',
        baseUrl: 'http://localhost:8232',
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

  describe('zGetNewAddress', () => {
    it('should generate new shielded address successfully', async () => {
      const mockResponse = JSON.stringify({
        result: 'ztestsapling1ctuamfer5xjuynnorc2z4cf5c6vp8g2nq8vw3jwqzzpmk3wf5zhvpg4jqpq7pk3s9xfpng8qv4x',
        error: null,
        id: 'n8n-123'
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'zGetNewAddress';
        if (paramName === 'type') return 'sapling';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeShieldedOperationsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toContain('ztestsapling');
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('z_getnewaddress'),
        })
      );
    });
  });

  describe('zListAddresses', () => {
    it('should list shielded addresses successfully', async () => {
      const mockResponse = JSON.stringify({
        result: [
          'ztestsapling1ctuamfer5xjuynnorc2z4cf5c6vp8g2nq8vw3jwqzzpmk3wf5zhvpg4jqpq7pk3s9xfpng8qv4x',
          'ztestsapling2dtuamfer5xjuynnorc2z4cf5c6vp8g2nq8vw3jwqzzpmk3wf5zhvpg4jqpq7pk3s9xfpng8qv5y'
        ],
        error: null,
        id: 'n8n-123'
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'zListAddresses';
        if (paramName === 'includeWatchonly') return false;
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeShieldedOperationsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(Array.isArray(result[0].json)).toBe(true);
      expect(result[0].json).toHaveLength(2);
    });
  });

  describe('zGetBalance', () => {
    it('should get shielded address balance successfully', async () => {
      const mockResponse = JSON.stringify({
        result: 5.25,
        error: null,
        id: 'n8n-123'
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'zGetBalance';
        if (paramName === 'address') return 'ztestsapling1ctuamfer5xjuynnorc2z4cf5c6vp8g2nq8vw3jwqzzpmk3wf5zhvpg4jqpq7pk3s9xfpng8qv4x';
        if (paramName === 'minconf') return 1;
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeShieldedOperationsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toBe(5.25);
    });
  });

  describe('zSendMany', () => {
    it('should send shielded transaction successfully', async () => {
      const mockResponse = JSON.stringify({
        result: 'opid-12345-abcdef',
        error: null,
        id: 'n8n-123'
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'zSendMany';
        if (paramName === 'fromaddress') return 'ztestsapling1source';
        if (paramName === 'amounts') return '[{"address": "ztestsapling1dest", "amount": 1.0}]';
        if (paramName === 'minconf') return 1;
        if (paramName === 'fee') return 0.0001;
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeShieldedOperationsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json).toBe('opid-12345-abcdef');
    });

    it('should handle invalid amounts JSON', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'zSendMany';
        if (paramName === 'fromaddress') return 'ztestsapling1source';
        if (paramName === 'amounts') return 'invalid-json';
        return undefined;
      });

      const items = [{ json: {} }];
      
      await expect(
        executeShieldedOperationsOperations.call(mockExecuteFunctions, items)
      ).rejects.toThrow('Invalid JSON format for amounts parameter');
    });
  });

  describe('zGetOperationStatus', () => {
    it('should get operation status successfully', async () => {
      const mockResponse = JSON.stringify({
        result: [
          {
            id: 'opid-12345',
            status: 'success',
            creation_time: 1234567890,
            result: { txid: 'abc123' }
          }
        ],
        error: null,
        id: 'n8n-123'
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'zGetOperationStatus';
        if (paramName === 'opids') return '["opid-12345"]';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      const result = await executeShieldedOperationsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(Array.isArray(result[0].json)).toBe(true);
      expect(result[0].json[0].status).toBe('success');
    });
  });

  describe('Error handling', () => {
    it('should handle RPC errors', async () => {
      const mockResponse = JSON.stringify({
        result: null,
        error: {
          code: -1,
          message: 'RPC error occurred'
        },
        id: 'n8n-123'
      });

      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'zGetNewAddress';
        if (paramName === 'type') return 'sapling';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const items = [{ json: {} }];
      
      await expect(
        executeShieldedOperationsOperations.call(mockExecuteFunctions, items)
      ).rejects.toThrow('RPC error occurred');
    });

    it('should handle invalid JSON response', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'zGetNewAddress';
        if (paramName === 'type') return 'sapling';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue('invalid-json');

      const items = [{ json: {} }];
      
      await expect(
        executeShieldedOperationsOperations.call(mockExecuteFunctions, items)
      ).rejects.toThrow('Invalid JSON response from Zcash node');
    });

    it('should continue on fail when enabled', async () => {
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
        if (paramName === 'operation') return 'zGetNewAddress';
        if (paramName === 'type') return 'sapling';
        return undefined;
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network error'));

      const items = [{ json: {} }];
      const result = await executeShieldedOperationsOperations.call(mockExecuteFunctions, items);

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('Network error');
    });
  });
});

describe('Transactions Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        username: 'test-user',
        password: 'test-password',
        baseUrl: 'http://localhost:8232',
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

  test('sendToAddress operation should send ZEC to address', async () => {
    const mockTxId = 'abc123def456';
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'sendToAddress';
        case 'address': return 't1abc123def456';
        case 'amount': return 1.5;
        case 'comment': return 'Test payment';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      result: mockTxId,
      error: null,
    });

    const result = await executeTransactionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockTxId, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
        body: expect.objectContaining({
          method: 'sendtoaddress',
          params: ['t1abc123def456', 1.5, 'Test payment'],
        }),
      })
    );
  });

  test('getTransaction operation should return transaction details', async () => {
    const mockTransaction = {
      txid: 'abc123def456',
      amount: 1.5,
      confirmations: 6,
      blockhash: 'block123',
    };

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getTransaction';
        case 'txid': return 'abc123def456';
        case 'includeWatchonly': return false;
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      result: mockTransaction,
      error: null,
    });

    const result = await executeTransactionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockTransaction, pairedItem: { item: 0 } }]);
  });

  test('listTransactions operation should return transaction list', async () => {
    const mockTransactions = [
      { txid: 'tx1', amount: 1.0, category: 'receive' },
      { txid: 'tx2', amount: -0.5, category: 'send' },
    ];

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'listTransactions';
        case 'account': return '';
        case 'count': return 10;
        case 'skip': return 0;
        case 'includeWatchonly': return false;
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      result: mockTransactions,
      error: null,
    });

    const result = await executeTransactionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockTransactions, pairedItem: { item: 0 } }]);
  });

  test('getRawTransaction operation should return raw transaction data', async () => {
    const mockRawTx = '0100000001abc123def456...';

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getRawTransaction';
        case 'txid': return 'abc123def456';
        case 'verbose': return false;
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      result: mockRawTx,
      error: null,
    });

    const result = await executeTransactionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockRawTx, pairedItem: { item: 0 } }]);
  });

  test('sendRawTransaction operation should broadcast transaction', async () => {
    const mockTxId = 'broadcast123def456';

    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'sendRawTransaction';
        case 'hexstring': return '0100000001abc123def456...';
        case 'allowhighfees': return false;
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      result: mockTxId,
      error: null,
    });

    const result = await executeTransactionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{ json: mockTxId, pairedItem: { item: 0 } }]);
  });

  test('should handle RPC errors properly', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getTransaction';
        case 'txid': return 'invalid-txid';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      result: null,
      error: { code: -5, message: 'Invalid or non-wallet transaction id' },
    });

    await expect(
      executeTransactionsOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow('Zcash RPC Error: Invalid or non-wallet transaction id');
  });

  test('should continue on fail when configured', async () => {
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
      switch (param) {
        case 'operation': return 'getTransaction';
        case 'txid': return 'invalid-txid';
        default: return undefined;
      }
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      result: null,
      error: { code: -5, message: 'Invalid transaction id' },
    });

    const result = await executeTransactionsOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([
      { json: { error: 'Zcash RPC Error: Invalid transaction id' }, pairedItem: { item: 0 } },
    ]);
  });
});

describe('Blockchain Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        username: 'test-user',
        password: 'test-password',
        baseUrl: 'http://localhost:8232',
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

  test('should execute getBlockchainInfo operation successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      if (paramName === 'operation') return 'getBlockchainInfo';
      return undefined;
    });

    const mockResponse = JSON.stringify({
      result: {
        chain: 'main',
        blocks: 2000000,
        headers: 2000000,
        bestblockhash: 'abc123',
        difficulty: 123456789.0,
        verificationprogress: 1.0,
      },
      error: null,
      id: 'n8n-zcash',
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeBlockchainOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toHaveProperty('chain', 'main');
    expect(result[0].json).toHaveProperty('blocks', 2000000);
  });

  test('should execute getBlock operation successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      if (paramName === 'operation') return 'getBlock';
      if (paramName === 'blockhash') return 'abc123def456';
      if (paramName === 'verbosity') return 1;
      return undefined;
    });

    const mockResponse = JSON.stringify({
      result: {
        hash: 'abc123def456',
        height: 2000000,
        time: 1640000000,
        nTx: 5,
        tx: ['tx1', 'tx2', 'tx3', 'tx4', 'tx5'],
      },
      error: null,
      id: 'n8n-zcash',
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeBlockchainOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toHaveProperty('hash', 'abc123def456');
    expect(result[0].json).toHaveProperty('height', 2000000);
  });

  test('should execute getBlockHash operation successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      if (paramName === 'operation') return 'getBlockHash';
      if (paramName === 'height') return 2000000;
      return undefined;
    });

    const mockResponse = JSON.stringify({
      result: 'abc123def456',
      error: null,
      id: 'n8n-zcash',
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeBlockchainOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toBe('abc123def456');
  });

  test('should execute getBlockCount operation successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      if (paramName === 'operation') return 'getBlockCount';
      return undefined;
    });

    const mockResponse = JSON.stringify({
      result: 2000000,
      error: null,
      id: 'n8n-zcash',
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeBlockchainOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toBe(2000000);
  });

  test('should execute getBestBlockHash operation successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      if (paramName === 'operation') return 'getBestBlockHash';
      return undefined;
    });

    const mockResponse = JSON.stringify({
      result: 'best-block-hash-123',
      error: null,
      id: 'n8n-zcash',
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeBlockchainOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toBe('best-block-hash-123');
  });

  test('should execute getChainTips operation successfully', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      if (paramName === 'operation') return 'getChainTips';
      return undefined;
    });

    const mockResponse = JSON.stringify({
      result: [
        {
          height: 2000000,
          hash: 'tip-hash-1',
          branchlen: 0,
          status: 'active',
        },
        {
          height: 1999999,
          hash: 'tip-hash-2',
          branchlen: 1,
          status: 'fork',
        },
      ],
      error: null,
      id: 'n8n-zcash',
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

    const result = await executeBlockchainOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(Array.isArray(result[0].json)).toBe(true);
    expect(result[0].json).toHaveLength(2);
    expect(result[0].json[0]).toHaveProperty('status', 'active');
  });

  test('should handle API errors', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      if (paramName === 'operation') return 'getBlockchainInfo';
      return undefined;
    });

    const mockErrorResponse = JSON.stringify({
      result: null,
      error: {
        code: -1,
        message: 'Connection refused',
      },
      id: 'n8n-zcash',
    });

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockErrorResponse);

    await expect(
      executeBlockchainOperations.call(mockExecuteFunctions, [{ json: {} }])
    ).rejects.toThrow();
  });

  test('should handle network errors when continueOnFail is true', async () => {
    mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
      if (paramName === 'operation') return 'getBlockchainInfo';
      return undefined;
    });

    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network error'));

    const result = await executeBlockchainOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toHaveLength(1);
    expect(result[0].json).toHaveProperty('error', 'Network error');
  });
});

describe('Mining Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        username: 'test-user',
        password: 'test-password',
        baseUrl: 'http://localhost:8232',
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

  describe('getNetworkSolps', () => {
    it('should get network solution rate successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getNetworkSolps';
          case 'blocks': return 120;
          case 'height': return -1;
          default: return undefined;
        }
      });

      const mockResponse = JSON.stringify({
        result: 5000000,
        error: null,
        id: 12345,
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeMiningOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.result).toBe(5000000);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: 'http://localhost:8232',
        })
      );
    });

    it('should handle errors when getting network solution rate', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getNetworkSolps';
          case 'blocks': return 120;
          case 'height': return -1;
          default: return undefined;
        }
      });

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Connection failed'));

      await expect(
        executeMiningOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow();
    });
  });

  describe('getMiningInfo', () => {
    it('should get mining info successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getMiningInfo';
          default: return undefined;
        }
      });

      const mockResponse = JSON.stringify({
        result: {
          blocks: 1000000,
          currentblocktx: 0,
          difficulty: 12345.67,
          networkhashps: 5000000,
          pooledtx: 10,
          chain: 'main',
        },
        error: null,
        id: 12345,
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeMiningOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.result.blocks).toBe(1000000);
      expect(result[0].json.result.difficulty).toBe(12345.67);
    });
  });

  describe('getBlockTemplate', () => {
    it('should get block template successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getBlockTemplate';
          case 'jsonRequestObject': return '{"mode": "template"}';
          default: return undefined;
        }
      });

      const mockResponse = JSON.stringify({
        result: {
          version: 4,
          previousblockhash: 'abc123',
          transactions: [],
          coinbaseaux: {},
          coinbasevalue: 625000000,
          target: 'def456',
        },
        error: null,
        id: 12345,
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeMiningOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.result.version).toBe(4);
      expect(result[0].json.result.coinbasevalue).toBe(625000000);
    });

    it('should handle invalid JSON request object', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getBlockTemplate';
          case 'jsonRequestObject': return 'invalid json';
          default: return undefined;
        }
      });

      await expect(
        executeMiningOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Invalid JSON in request object');
    });
  });

  describe('submitBlock', () => {
    it('should submit block successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'submitBlock';
          case 'hexData': return '0100000000000000000000000000000000000000000000000000000000000000000000003ba3edfd7a7b12b27ac72c3e67768f617fc81bc3888a51323a9fb8aa4b1e5e4a29ab5f49ffff001d1dac2b7c';
          case 'jsonParametersObject': return '{}';
          default: return undefined;
        }
      });

      const mockResponse = JSON.stringify({
        result: null,
        error: null,
        id: 12345,
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeMiningOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.result).toBeNull();
      expect(result[0].json.error).toBeNull();
    });
  });

  describe('getDifficulty', () => {
    it('should get difficulty successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getDifficulty';
          default: return undefined;
        }
      });

      const mockResponse = JSON.stringify({
        result: 12345.67,
        error: null,
        id: 12345,
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeMiningOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.result).toBe(12345.67);
    });
  });

  describe('getNetworkHashps', () => {
    it('should get network hash rate successfully', async () => {
      mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
        switch (param) {
          case 'operation': return 'getNetworkHashps';
          case 'blocks': return 120;
          case 'height': return -1;
          default: return undefined;
        }
      });

      const mockResponse = JSON.stringify({
        result: 50000000000,
        error: null,
        id: 12345,
      });

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeMiningOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toHaveLength(1);
      expect(result[0].json.result).toBe(50000000000);
    });
  });
});
});
