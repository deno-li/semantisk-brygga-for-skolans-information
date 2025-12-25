/**
 * ICF Types - WHO International Classification of Functioning, Disability and Health
 * Based on WHO ICF Beginner's Guide (2002)
 */

import { ActorSector, WelfareWheelSpoke } from './types';

// WHO ICF Qualifier för Activities & Participation
// 0 = Inga svårigheter (0-4%)
// 1 = Lätta svårigheter (5-24%)
// 2 = Måttliga svårigheter (25-49%)
// 3 = Stora svårigheter (50-95%)
// 4 = Totala svårigheter (96-100%)
// 9 = Ej bedömt / Ej relevant
export type ICFQualifierValue = 0 | 1 | 2 | 3 | 4 | 9;

export interface ICFQualifier {
  value: ICFQualifierValue;
  description: string;
}

// Performance vs Capacity (WHO ICF core concept)
export interface ICFAssessment {
  code: string;                    // ICF-kod, t.ex. "d140", "b134"
  domain: string;                  // Domän på svenska, t.ex. "Lära sig läsa"

  // Performance Qualifier: What the person DOES in current environment
  performance: ICFQualifier;       // Vad barnet GÖR i nuvarande miljö (med anpassningar)

  // Capacity Qualifier: What the person CAN do in standardized environment
  capacity: ICFQualifier;          // Vad barnet KAN utan anpassningar/stöd

  // Gap Analysis (Performance - Capacity)
  gap: number;                     // Negativ = anpassningar fungerar, Positiv = barriers
  gapInterpretation: 'facilitators-work' | 'barriers-exist' | 'neutral';

  // Metadata (WHO requirement)
  assessedDate: string;            // ISO 8601: YYYY-MM-DD
  assessedBy: ActorSector;         // Vem gjorde bedömningen
  timeSpan: string;                // "Senaste 2 veckor", "Senaste 4 veckor"
  context: 'home' | 'school' | 'healthcare' | 'leisure';
  source: 'observation' | 'survey' | 'assessment' | 'parent-report' | 'child-report';

  notes?: string;                  // Valfria anteckningar
}

// Environmental Factors (e-koder) - Major innovation in ICF
export type EnvironmentalFactorType = 'barrier' | 'facilitator';

// Barrier levels (WHO standard)
// .0 = Ingen barriär (0-4%)
// .1 = Lätt barriär (5-24%)
// .2 = Måttlig barriär (25-49%)
// .3 = Betydande barriär (50-95%)
// .4 = Fullständig barriär (96-100%)
export type BarrierLevel = 0 | 1 | 2 | 3 | 4;

// Facilitator levels (WHO standard)
// +0 = Ingen underlättare (0-4%)
// +1 = Lätt underlättare (5-24%)
// +2 = Måttlig underlättare (25-49%)
// +3 = Betydande underlättare (50-95%)
// +4 = Fullständig underlättare (96-100%)
export type FacilitatorLevel = 0 | 1 | 2 | 3 | 4;

export interface EnvironmentalFactor {
  code: string;                    // ICF e-kod, t.ex. "e310", "e1301", "e250"
  domain: string;                  // Domän på svenska
  type: EnvironmentalFactorType;   // Barrier eller facilitator
  level: BarrierLevel | FacilitatorLevel;  // .0-.4 eller +0-+4
  description: string;             // Fritext beskrivning
  relatedSpokes: WelfareWheelSpoke[];  // Vilka ekrar påverkas

  // Metadata
  identifiedDate: string;          // ISO 8601
  identifiedBy: ActorSector;
  context: 'home' | 'school' | 'healthcare' | 'community';
  status: 'active' | 'resolved' | 'monitoring';

  notes?: string;
}

// ICF Core Set - Begränsad delmängd av ICF för specifika behov
export interface ICFCoreSetItem {
  code: string;                    // ICF-kod (b/d/e)
  domain: string;                  // Domän på svenska
  indicatorQuestions: string[];    // 2-3 indikatorfrågor för bedömning
  requiredLevel: 'N1' | 'N2' | 'N3';  // Vilken nivå i Barnets Resa
}

export interface ICFCoreSet {
  spoke: WelfareWheelSpoke;        // Vilken eker i välbefinnandehjulet
  level: 'N1' | 'N2' | 'N3';       // Vilken nivå (universell/stödprofil/samordning)
  items: ICFCoreSetItem[];         // Urval av ICF-koder för denna eker + nivå
}

// Risk/Protection Balance (baserat på Environmental Factors)
export interface RiskProtectionBalance {
  barriers: EnvironmentalFactor[];     // Alla barriers för barnet
  facilitators: EnvironmentalFactor[]; // Alla facilitators

  riskScore: number;               // Summa av barrier levels (.1-.4)
  protectionScore: number;         // Summa av facilitator levels (+1-+4)
  balance: number;                 // protectionScore - riskScore

  interpretation: 'protection-dominates' | 'balanced' | 'risk-dominates';

  // Per eker
  spokeBalances: {
    spoke: WelfareWheelSpoke;
    riskScore: number;
    protectionScore: number;
    balance: number;
  }[];
}

// Utökad metadata för ICF-bedömningar
export interface ICFAssessmentMetadata {
  assessmentId: string;
  childId: string;
  childName: string;

  // Vem/Vad/När/Var
  assessedBy: ActorSector;
  assessedByName: string;          // Konkret namn på bedömare
  assessedDate: string;            // ISO 8601
  timeSpan: string;                // Vilken period bedömningen avser
  context: 'home' | 'school' | 'healthcare' | 'leisure';

  // Hur
  method: 'observation' | 'survey' | 'standardized-test' | 'interview' | 'parent-report' | 'child-report';

  // Reliabilitet
  confidence: 'high' | 'medium' | 'low';  // Bedömarens konfidensgrad

  // Longitudinell kontext
  previousAssessment?: string;     // ID till föregående assessment
  nextFollowUp?: string;           // Planerat datum för nästa

  notes?: string;
}

// Gap Trend - Uppföljning av gap över tid
export interface GapTrendPoint {
  date: string;                    // ISO 8601
  capacity: ICFQualifierValue;
  performance: ICFQualifierValue;
  gap: number;

  // Interventioner vid denna tidpunkt
  activeInterventions: string[];   // Vilka insatser var aktiva

  assessedBy: ActorSector;
}

export interface GapTrend {
  icfCode: string;
  domain: string;
  dataPoints: GapTrendPoint[];

  // Trendanalys
  trend: 'improving' | 'stable' | 'declining';
  startDate: string;
  endDate: string;

  // Interpretation
  interpretation: string;          // Fritext tolkning av trenden
}

// Helper function: Convert qualifier value to description
export function getQualifierDescription(value: ICFQualifierValue): string {
  switch (value) {
    case 0: return 'Inga svårigheter';
    case 1: return 'Lätta svårigheter';
    case 2: return 'Måttliga svårigheter';
    case 3: return 'Stora svårigheter';
    case 4: return 'Totala svårigheter';
    case 9: return 'Ej bedömt';
    default: return 'Okänd';
  }
}

// Helper function: Convert barrier level to description
export function getBarrierDescription(level: BarrierLevel): string {
  switch (level) {
    case 0: return 'Ingen barriär';
    case 1: return 'Lätt barriär';
    case 2: return 'Måttlig barriär';
    case 3: return 'Betydande barriär';
    case 4: return 'Fullständig barriär';
    default: return 'Okänd';
  }
}

// Helper function: Convert facilitator level to description
export function getFacilitatorDescription(level: FacilitatorLevel): string {
  switch (level) {
    case 0: return 'Ingen underlättare';
    case 1: return 'Lätt underlättare';
    case 2: return 'Måttlig underlättare';
    case 3: return 'Betydande underlättare';
    case 4: return 'Fullständig underlättare';
    default: return 'Okänd';
  }
}

// Helper function: Calculate gap interpretation
export function interpretGap(gap: number): 'facilitators-work' | 'barriers-exist' | 'neutral' {
  if (gap < 0) return 'facilitators-work';  // Performance bättre än Capacity
  if (gap > 0) return 'barriers-exist';     // Performance sämre än Capacity
  return 'neutral';                         // Performance = Capacity
}

// Helper function: Calculate risk/protection balance interpretation
export function interpretBalance(balance: number): 'protection-dominates' | 'balanced' | 'risk-dominates' {
  if (balance >= 2) return 'protection-dominates';  // Skyddsfaktorer dominerar
  if (balance <= -2) return 'risk-dominates';       // Riskfaktorer dominerar
  return 'balanced';                                // Jämnt
}

// Helper function: Calculate gap from performance and capacity
export function calculateGap(performance: ICFQualifierValue, capacity: ICFQualifierValue): number {
  // Gap = Performance - Capacity
  // Negativ gap = anpassningar fungerar (Performance bättre än Capacity)
  // Positiv gap = barriers finns (Performance sämre än Capacity)
  if (performance === 9 || capacity === 9) return 0;  // Kan ej beräkna om någon är "ej bedömt"
  return performance - capacity;
}

// Helper function: Get color for qualifier value (for visualization)
export function getQualifierColor(value: ICFQualifierValue): string {
  switch (value) {
    case 0: return '#22c55e';  // Green
    case 1: return '#84cc16';  // Light green
    case 2: return '#eab308';  // Yellow
    case 3: return '#f97316';  // Orange
    case 4: return '#ef4444';  // Red
    case 9: return '#9ca3af';  // Gray
    default: return '#000000';
  }
}
