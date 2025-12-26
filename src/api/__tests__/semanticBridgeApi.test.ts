import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import SemanticBridgeAPI from '../semanticBridgeApi';
import { server } from '@/test/mocks/server';

describe('SemanticBridgeAPI', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  describe('analyzeICFObservation', () => {
    it('returns ICF suggestions for observation text', async () => {
      const api = new SemanticBridgeAPI();
      const result = await api.analyzeICFObservation({
        observation_text: 'Barnet har svårt att läsa',
        child_age: 10,
        context: 'school',
        current_level: 'N2',
      });

      expect(result.success).toBe(true);
      expect(result.icf_suggestions).toHaveLength(1);
      expect(result.icf_suggestions[0].code).toBe('d140');
    });

    it('includes gap analysis in response', async () => {
      const api = new SemanticBridgeAPI();
      const result = await api.analyzeICFObservation({
        observation_text: 'Test observation',
        child_age: 10,
        context: 'school',
        current_level: 'N2',
      });

      expect(result.icf_suggestions[0]).toHaveProperty('gap');
      expect(result.icf_suggestions[0]).toHaveProperty('gap_interpretation');
      expect(result.icf_suggestions[0].gap).toBe(-1);
      expect(result.icf_suggestions[0].gap_interpretation).toBe('facilitators-work');
    });

    it('includes performance and capacity qualifiers', async () => {
      const api = new SemanticBridgeAPI();
      const result = await api.analyzeICFObservation({
        observation_text: 'Test observation',
        child_age: 10,
        context: 'school',
        current_level: 'N2',
      });

      const suggestion = result.icf_suggestions[0];
      expect(suggestion.performance_qualifier).toHaveProperty('value');
      expect(suggestion.performance_qualifier).toHaveProperty('description');
      expect(suggestion.performance_qualifier).toHaveProperty('reasoning');
      expect(suggestion.capacity_qualifier).toHaveProperty('value');
      expect(suggestion.capacity_qualifier).toHaveProperty('description');
      expect(suggestion.capacity_qualifier).toHaveProperty('reasoning');
    });

    it('includes risk/protection balance', async () => {
      const api = new SemanticBridgeAPI();
      const result = await api.analyzeICFObservation({
        observation_text: 'Test observation',
        child_age: 10,
        context: 'school',
        current_level: 'N2',
      });

      expect(result.risk_protection_balance).toBeDefined();
      expect(result.risk_protection_balance.risk_score).toBe(2);
      expect(result.risk_protection_balance.protection_score).toBe(5);
      expect(result.risk_protection_balance.balance).toBe(3);
      expect(result.risk_protection_balance.interpretation).toBe('protection-dominates');
    });

    it('returns recommended level', async () => {
      const api = new SemanticBridgeAPI();
      const result = await api.analyzeICFObservation({
        observation_text: 'Test observation',
        child_age: 10,
        context: 'school',
        current_level: 'N2',
      });

      expect(result.recommended_level).toBe('N2');
    });

    it('includes summary', async () => {
      const api = new SemanticBridgeAPI();
      const result = await api.analyzeICFObservation({
        observation_text: 'Test observation',
        child_age: 10,
        context: 'school',
        current_level: 'N2',
      });

      expect(result.summary).toBeDefined();
      expect(typeof result.summary).toBe('string');
      expect(result.summary.length).toBeGreaterThan(0);
    });
  });

  describe('healthCheck', () => {
    it('returns successful health status', async () => {
      const api = new SemanticBridgeAPI();
      const result = await api.healthCheck();
      
      expect(result.status).toBe('ok');
      expect(result.services).toHaveProperty('semantic_mapper');
      expect(result.services).toHaveProperty('ai_analyzer');
      expect(result.services.semantic_mapper).toBe('available');
      expect(result.services.ai_analyzer).toBe('available');
    });

    it('includes timestamp', async () => {
      const api = new SemanticBridgeAPI();
      const result = await api.healthCheck();
      
      expect(result.timestamp).toBeDefined();
      expect(new Date(result.timestamp).toISOString()).toBe(result.timestamp);
    });
  });
});
