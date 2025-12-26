/**
 * Semantic Bridge API Client
 * Connects Ultimate Edition to the Semantic Bridge Backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface CodeMapping {
  code: string;
  description: string;
  confidence?: number;
}

export interface MappingResult {
  source_code: string;
  source_system: string;
  target_system: string;
  target_codes: string[];
  confidence: number;
  description?: string;
  mappings?: Record<string, CodeMapping>;
}

export interface AIAnalysisRequest {
  text: string;
  context?: string;
  standards?: string[];
}

export interface ICFSuggestion {
  code: string;
  description: string;
  confidence: number;
  category: string;
  reasoning: string;
}

export interface AIAnalysisResponse {
  text: string;
  icf_suggestions: ICFSuggestion[];
  ksi_codes: string[];
  bbic_domains: string[];
  analysis_summary: string;
  confidence: number;
}

export interface CodeInfo {
  code: string;
  description: string;
  category?: string;
}

export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  services: {
    semantic_mapper: string;
    ai_analyzer: string;
  };
}

class SemanticBridgeAPI {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.ensureSecureBaseUrl();
  }

  private ensureSecureBaseUrl(): void {
    const allowInsecure = import.meta.env.VITE_ALLOW_INSECURE_API === 'true';
    if (allowInsecure) {
      return;
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(this.baseUrl);
    } catch (error) {
      const detail = error instanceof Error ? `. ${error.message}` : '';
      throw new Error(`Invalid API base URL: ${this.baseUrl}${detail}`);
    }

    const isLocalhost = ['localhost', '127.0.0.1', '0.0.0.0', '::1', 'ip6-localhost'].includes(
      parsedUrl.hostname
    );
    if (parsedUrl.protocol === 'http:' && !isLocalhost) {
      throw new Error(
        `Insecure API base URL blocked: ${this.baseUrl}. Use HTTPS or set VITE_ALLOW_INSECURE_API=true for local testing.`
      );
    }
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<HealthCheckResponse> {
    const response = await fetch(`${this.baseUrl}/health`);
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Map ICF code to KSI codes
   */
  async mapICFtoKSI(icfCode: string): Promise<MappingResult> {
    const response = await fetch(
      `${this.baseUrl}/api/v1/mapping/icf-to-ksi/${encodeURIComponent(icfCode)}`
    );
    if (!response.ok) {
      throw new Error(`ICF to KSI mapping failed: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Map KSI target to ICF codes
   */
  async mapKSItoICF(ksiTarget: string): Promise<MappingResult> {
    const response = await fetch(
      `${this.baseUrl}/api/v1/mapping/ksi-to-icf/${encodeURIComponent(ksiTarget)}`
    );
    if (!response.ok) {
      throw new Error(`KSI to ICF mapping failed: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Map ICF code to BBIC domains
   */
  async mapICFtoBBIC(icfCode: string): Promise<MappingResult> {
    const response = await fetch(
      `${this.baseUrl}/api/v1/mapping/icf-to-bbic/${encodeURIComponent(icfCode)}`
    );
    if (!response.ok) {
      throw new Error(`ICF to BBIC mapping failed: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Map BBIC domain to ICF codes
   */
  async mapBBICtoICF(bbicDomain: string): Promise<MappingResult> {
    const response = await fetch(
      `${this.baseUrl}/api/v1/mapping/bbic-to-icf/${encodeURIComponent(bbicDomain)}`
    );
    if (!response.ok) {
      throw new Error(`BBIC to ICF mapping failed: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Analyze text and get semantic code suggestions
   */
  async analyzeText(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    const response = await fetch(`${this.baseUrl}/api/v1/ai/analyze-text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    if (!response.ok) {
      throw new Error(`Text analysis failed: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Validate ICF code
   */
  async validateICFCode(code: string): Promise<{ valid: boolean; description?: string }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/v1/codes/icf/${encodeURIComponent(code)}`
      );
      if (response.ok) {
        const data = await response.json();
        return { valid: true, description: data.description };
      }
      return { valid: false };
    } catch (error) {
      return { valid: false };
    }
  }

  /**
   * Validate KSI code
   */
  async validateKSICode(code: string): Promise<{ valid: boolean; description?: string }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/v1/codes/ksi/${encodeURIComponent(code)}`
      );
      if (response.ok) {
        const data = await response.json();
        return { valid: true, description: data.description };
      }
      return { valid: false };
    } catch (error) {
      return { valid: false };
    }
  }

  /**
   * Get all available ICF codes (with pagination)
   */
  async getICFCodes(
    category?: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<{ codes: CodeInfo[]; total: number }> {
    let url = `${this.baseUrl}/api/v1/codes/icf?limit=${limit}&offset=${offset}`;
    if (category) {
      url += `&category=${encodeURIComponent(category)}`;
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ICF codes: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Get all available KSI codes
   */
  async getKSICodes(): Promise<CodeInfo[]> {
    const response = await fetch(`${this.baseUrl}/api/v1/codes/ksi`);
    if (!response.ok) {
      throw new Error(`Failed to fetch KSI codes: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Search codes across all systems
   */
  async searchCodes(
    query: string,
    systems: string[] = ['icf', 'ksi', 'bbic']
  ): Promise<{ system: string; code: string; description: string }[]> {
    const response = await fetch(`${this.baseUrl}/api/v1/codes/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, systems }),
    });
    if (!response.ok) {
      throw new Error(`Code search failed: ${response.statusText}`);
    }
    return response.json();
  }
}

// Export singleton instance
export const semanticBridgeApi = new SemanticBridgeAPI();

// Export class for testing
export default SemanticBridgeAPI;
