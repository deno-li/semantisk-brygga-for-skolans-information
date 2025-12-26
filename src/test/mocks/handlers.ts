import { http, HttpResponse } from 'msw';

const API_BASE_URL = 'http://localhost:8000';

export const handlers = [
  // ICF Analysis endpoint
  http.post(`${API_BASE_URL}/api/v1/icf/analyze-observation`, async () => {
    return HttpResponse.json({
      success: true,
      icf_suggestions: [
        {
          code: 'd140',
          domain: 'Lära sig läsa',
          confidence: 0.92,
          performance_qualifier: {
            value: 2,
            description: 'Måttliga svårigheter',
            reasoning: 'Barnet kan läsa med ljudbok och bildstöd',
          },
          capacity_qualifier: {
            value: 3,
            description: 'Stora svårigheter',
            reasoning: 'Utan anpassningar har barnet stora läsutmaningar',
          },
          gap: -1,
          gap_interpretation: 'facilitators-work',
          gap_explanation: 'Anpassningar fungerar bra',
        },
      ],
      environmental_factors: [],
      risk_protection_balance: {
        risk_score: 2,
        protection_score: 5,
        balance: 3,
        interpretation: 'protection-dominates',
      },
      welfare_wheel_mapping: [],
      recommended_level: 'N2',
      summary: 'Test analysis summary',
    });
  }),

  // Health check
  http.get(`${API_BASE_URL}/health`, () => {
    return HttpResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        semantic_mapper: 'available',
        ai_analyzer: 'available',
      },
    });
  }),
];
