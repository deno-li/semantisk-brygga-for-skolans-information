import { describe, it, expect } from 'vitest';
import { HEALTH_CORE_SET_N1, HEALTH_CORE_SET_N2 } from '../icf-core-sets';

describe('ICF Core Sets', () => {
  describe('HEALTH_CORE_SET_N1', () => {
    it('has correct structure', () => {
      expect(HEALTH_CORE_SET_N1).toHaveProperty('spoke');
      expect(HEALTH_CORE_SET_N1).toHaveProperty('level');
      expect(HEALTH_CORE_SET_N1).toHaveProperty('items');
    });

    it('is for universell level', () => {
      expect(HEALTH_CORE_SET_N1.level).toBe('N1');
    });

    it('is for health spoke', () => {
      expect(HEALTH_CORE_SET_N1.spoke).toBe('halsa');
    });

    it('contains ICF codes', () => {
      expect(HEALTH_CORE_SET_N1.items.length).toBeGreaterThan(0);
      expect(HEALTH_CORE_SET_N1.items[0]).toHaveProperty('code');
      expect(HEALTH_CORE_SET_N1.items[0]).toHaveProperty('domain');
      expect(HEALTH_CORE_SET_N1.items[0]).toHaveProperty('indicatorQuestions');
      expect(HEALTH_CORE_SET_N1.items[0]).toHaveProperty('requiredLevel');
    });

    it('has indicator questions for each item', () => {
      HEALTH_CORE_SET_N1.items.forEach(item => {
        expect(item.indicatorQuestions).toBeDefined();
        expect(Array.isArray(item.indicatorQuestions)).toBe(true);
        expect(item.indicatorQuestions.length).toBeGreaterThan(0);
      });
    });

    it('all items have N1 as required level', () => {
      HEALTH_CORE_SET_N1.items.forEach(item => {
        expect(item.requiredLevel).toBe('N1');
      });
    });

    it('has valid ICF code format', () => {
      HEALTH_CORE_SET_N1.items.forEach(item => {
        // ICF codes start with b, d, e, or s followed by digits
        expect(item.code).toMatch(/^[bdes]\d+/);
      });
    });
  });

  describe('HEALTH_CORE_SET_N2', () => {
    it('has correct structure', () => {
      expect(HEALTH_CORE_SET_N2).toHaveProperty('spoke');
      expect(HEALTH_CORE_SET_N2).toHaveProperty('level');
      expect(HEALTH_CORE_SET_N2).toHaveProperty('items');
    });

    it('is for stödprofil level', () => {
      expect(HEALTH_CORE_SET_N2.level).toBe('N2');
    });

    it('is for health spoke', () => {
      expect(HEALTH_CORE_SET_N2.spoke).toBe('halsa');
    });

    it('contains more items than N1', () => {
      expect(HEALTH_CORE_SET_N2.items.length).toBeGreaterThan(HEALTH_CORE_SET_N1.items.length);
    });
  });

  describe('N1 vs N2 core sets', () => {
    it('N2 contains all N1 items', () => {
      const n1Codes = HEALTH_CORE_SET_N1.items.map(i => i.code);
      const n2Codes = HEALTH_CORE_SET_N2.items.map(i => i.code);
      
      n1Codes.forEach(code => {
        expect(n2Codes).toContain(code);
      });
    });

    it('N2 has additional items beyond N1', () => {
      expect(HEALTH_CORE_SET_N2.items.length).toBeGreaterThanOrEqual(HEALTH_CORE_SET_N1.items.length);
    });

    it('N1 items in N2 have consistent data', () => {
      const n1Map = new Map(HEALTH_CORE_SET_N1.items.map(item => [item.code, item]));
      
      HEALTH_CORE_SET_N2.items.forEach(n2Item => {
        const n1Item = n1Map.get(n2Item.code);
        if (n1Item) {
          // Same code should have same domain
          expect(n2Item.domain).toBe(n1Item.domain);
          // Should have at least the same indicator questions
          expect(n2Item.indicatorQuestions.length).toBeGreaterThanOrEqual(n1Item.indicatorQuestions.length);
        }
      });
    });
  });

  describe('ICF code validation', () => {
    it('all codes are body functions (b) or activities (d)', () => {
      const allItems = [...HEALTH_CORE_SET_N1.items, ...HEALTH_CORE_SET_N2.items];
      allItems.forEach(item => {
        const firstChar = item.code.charAt(0);
        expect(['b', 'd', 'e', 's']).toContain(firstChar);
      });
    });

    it('codes are unique within each set', () => {
      const n1Codes = HEALTH_CORE_SET_N1.items.map(i => i.code);
      const uniqueN1Codes = new Set(n1Codes);
      expect(uniqueN1Codes.size).toBe(n1Codes.length);

      const n2Codes = HEALTH_CORE_SET_N2.items.map(i => i.code);
      const uniqueN2Codes = new Set(n2Codes);
      expect(uniqueN2Codes.size).toBe(n2Codes.length);
    });
  });
});
