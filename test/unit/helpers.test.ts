/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import {
  satoshisToZec,
  zecToSatoshis,
  formatResponse,
  isValidZcashAddress,
  formatMemo,
  decodeMemo,
} from '../../nodes/Zcash/utils/helpers';

describe('Zcash Helpers', () => {
  describe('satoshisToZec', () => {
    it('should convert satoshis to ZEC correctly', () => {
      expect(satoshisToZec(100000000)).toBe(1);
      expect(satoshisToZec(50000000)).toBe(0.5);
      expect(satoshisToZec(1)).toBe(0.00000001);
    });
  });

  describe('zecToSatoshis', () => {
    it('should convert ZEC to satoshis correctly', () => {
      expect(zecToSatoshis(1)).toBe(100000000);
      expect(zecToSatoshis(0.5)).toBe(50000000);
      expect(zecToSatoshis(0.00000001)).toBe(1);
    });
  });

  describe('formatResponse', () => {
    it('should format array data', () => {
      const data = [{ a: 1 }, { b: 2 }];
      const result = formatResponse(data);
      expect(result).toHaveLength(2);
      expect(result[0].json).toEqual({ a: 1 });
      expect(result[1].json).toEqual({ b: 2 });
    });

    it('should format object data', () => {
      const data = { test: 'value' };
      const result = formatResponse(data);
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({ test: 'value' });
    });

    it('should format primitive data', () => {
      const result = formatResponse('test');
      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual({ result: 'test' });
    });
  });

  describe('isValidZcashAddress', () => {
    it('should validate transparent addresses', () => {
      expect(isValidZcashAddress('t1VShHAhsQc5RVndQLyM3G97U3ChMvtFaUj')).toBe(true);
      expect(isValidZcashAddress('t3invalid')).toBe(false);
    });

    it('should validate sapling addresses', () => {
      const saplingAddress = 'zs' + 'a'.repeat(76);
      expect(isValidZcashAddress(saplingAddress)).toBe(true);
    });

    it('should reject invalid addresses', () => {
      expect(isValidZcashAddress('invalid')).toBe(false);
      expect(isValidZcashAddress('')).toBe(false);
    });
  });

  describe('formatMemo and decodeMemo', () => {
    it('should encode and decode memos', () => {
      const original = 'Hello, Zcash!';
      const encoded = formatMemo(original);
      const decoded = decodeMemo(encoded);
      expect(decoded).toBe(original);
    });

    it('should handle empty memos', () => {
      const encoded = formatMemo('');
      const decoded = decodeMemo(encoded);
      expect(decoded).toBe('');
    });
  });
});

describe('Zcash Constants', () => {
  it('should have LICENSING_NOTICE defined', () => {
    const { LICENSING_NOTICE } = require('../../nodes/Zcash/constants/constants');
    expect(LICENSING_NOTICE).toContain('Business Source License 1.1');
    expect(LICENSING_NOTICE).toContain('Velocity BPA');
  });
});
