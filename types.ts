
export type Perspective = 'guardian' | 'child' | 'professional';
export type View = 'overview' | 'shanarri' | 'sip' | 'dataprofile' | 'timeline' | 'documents' | 'quality' | 'ai-analysis' | 'journal' | 'comparison' | 'trends';
export type Theme = 'light' | 'dark';

export interface ShanarriIndicator {
  id: string;
  name: string;
  nameEn: string;
  color: string;
  status: number; // 1-5
  target: number; // 1-5

  // Semantic Bridge Data
  icf: string;    // International Classification of Functioning
  ksi: string;    // Kommunernas Socialtjänsts Informationssystem
  bbic: string;   // Barns Behov i Centrum (Social Care)
  ibic: string;   // Individens Behov i Centrum (Disability/Elderly)
  kva: string;    // Klassifikation av vårdåtgärder (Healthcare)
  icd?: string;   // International Classification of Diseases (Optional)
  snomed: string; // Snomed CT (Clinical Terminology)

  source: string;
  notes: string;
}

export interface UserContext {
  name: string;
  role: string;
  roleBadge: string;
  avatar: string;
}

export interface ChildProfile {
  name: string;
  ssn: string; // Fictional
  age: number;
  school: string;
  grade: string;
  sipActive: boolean;
}

// NEW: Multi-student support
export interface Student {
  id: string;
  profile: ChildProfile;
  dimensions: Record<string, ShanarriIndicator[]>;
  timeline: TimelineEvent[];
  history: HistoricalDataPoint[];
  riskLevel: 'low' | 'medium' | 'high';
}

// NEW: Historical tracking
export interface HistoricalDataPoint {
  date: string;
  scores: number[]; // 9 SHANARRI dimensions
  notes?: string;
}

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  type: 'school' | 'health' | 'social' | 'meeting';
  color: string;
}

export interface QualityPhase {
  id: string;
  title: string;
  period: string;
  activities: string[];
  status: 'completed' | 'active' | 'upcoming';
  description: string;
}

export interface TrendData {
  year: string;
  score: number;
  schoolAvg: number;
}

export interface AiSuggestion {
  standard: 'ICF' | 'BBIC' | 'KVÅ' | 'KSI';
  code: string;
  confidence: number;
  reasoning: string;
}

export interface JournalEntry {
  unit: string;
  contact: string;
  lastUpdated: string;
  Delaktighet: string;
  Funktion: string;
  Insats: string;
  Kontext: string;
}

export interface JournalData {
  [domain: string]: JournalEntry;
}

export interface NewsItem {
  id: string;
  title: string;
  snippet: string;
  date: string;
  source: string;
}

export interface DocumentItem {
  title: string;
  date: string;
  type: string;
  author: string;
  status: string;
  link?: string;
}

export interface DocumentSection {
  category: string;
  items: DocumentItem[];
}

// NEW: Comparison types
export interface ComparisonMetric {
  dimension: string;
  students: {
    id: string;
    value: number;
  }[];
}

// NEW: PDF Export options
export interface PDFExportOptions {
  includeWheel: boolean;
  includeTimeline: boolean;
  includeCharts: boolean;
  includeTrends: boolean;
  format: 'A4' | 'Letter';
}

// NEW: Theme context
export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}
