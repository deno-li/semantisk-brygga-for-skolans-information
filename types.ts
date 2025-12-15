
export type Perspective = 'guardian' | 'child' | 'professional';
export type View = 'overview' | 'shanarri' | 'sip' | 'dataprofile' | 'timeline' | 'quality' | 'ai-analysis' | 'journal' | 'lifecourse' | 'myworld' | 'resilience' | 'qualitywheel' | 'survey';

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
  bbicCategory?: 'child-development' | 'parenting' | 'family-environment'; // BBIC Triangle Category
  bbicArea?: string; // Specific BBIC sub-area
  ibic: string;   // Individens Behov i Centrum (Disability/Elderly)
  kva: string;    // Klassifikation av vårdåtgärder (Healthcare)
  icd?: string;   // International Classification of Diseases (Optional)
  snomed?: string; // Snomed CT (Clinical Terminology)

  source: string;
  notes?: string;
}

export interface BBICTriangleArea {
  id: string;
  category: 'child-development' | 'parenting' | 'family-environment';
  title: string;
  subAreas: BBICSubArea[];
  color: string;
}

export interface BBICSubArea {
  id: string;
  title: string;
  description: string;
  linkedShanarri: string[]; // SHANARRI dimension IDs
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
  sipGoal?: {
    child: string;
    professional: string;
  };
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
  standard: 'ICF' | 'BBIC' | 'KVÅ';
  code: string;
  confidence: number;
  reasoning: string;
  // Optional for backward compatibility if needed, but primarily defined here
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

// ==========================================
// LIVSLOPPSPERSPEKTIV - Nya typer
// ==========================================

export type LifePhase =
  | 'early-childhood'      // 0-5 år: BVC/MVC
  | 'preschool'            // 1-6 år: Förskola (kan börja vid 1 år vid behov)
  | 'elementary-school'    // 7-15 år: Grundskola
  | 'high-school'          // 16-19 år: Gymnasiet
  | 'young-adult'          // 20-25 år: Högskola/Arbetsliv
  | 'adult';               // 26+ år: IBIC/Vuxenliv

export type SupportLevel =
  | 'universal'            // Nivå 1: Grön - Alla barn
  | 'early-attention'      // Nivå 2: Gul - Tidig uppmärksamhet
  | 'enhanced-support'     // Nivå 3: Orange - Förstärkt stöd
  | 'intensive-support';   // Nivå 4: Röd - Intensivt stöd

export type ActorSector =
  | 'bvc'                  // Barn- och vårdcentral
  | 'mvc'                  // Mödravårdscentral
  | 'preschool'            // Förskola
  | 'elementary-school'    // Grundskola
  | 'high-school'          // Gymnasiet
  | 'student-health'       // Elevhälsa
  | 'social-services'      // Socialtjänst
  | 'healthcare'           // Primärvård
  | 'bup'                  // Barn- och ungdomspsykiatri
  | 'youth-center'         // Ungdomsmottagning
  | 'employment'           // Arbetsförmedling
  | 'university';          // Högskola/Universitet

export type RiskFactorCategory =
  | 'individual'           // Individnivå
  | 'family'               // Familjenivå
  | 'environment';         // Miljönivå

export type RiskFactorSeverity =
  | 'low'                  // Låg risk
  | 'medium'               // Medel risk
  | 'high'                 // Hög risk
  | 'critical';            // Kritisk risk

export interface RiskFactor {
  id: string;
  category: RiskFactorCategory;
  severity: RiskFactorSeverity;
  name: string;
  description?: string;
  identifiedDate: string;
  identifiedBy: ActorSector;
  relatedDimensions: string[];  // SHANARRI dimension IDs
  icfCodes?: string[];          // Relaterade ICF-koder
  mitigationActions?: string[]; // Åtgärder som vidtagits
  status: 'active' | 'monitoring' | 'resolved';
}

export interface ProtectiveFactor {
  id: string;
  category: RiskFactorCategory;
  strength: 'weak' | 'moderate' | 'strong';
  name: string;
  description?: string;
  identifiedDate: string;
  identifiedBy: ActorSector;
  relatedDimensions: string[];  // SHANARRI dimension IDs
  icfCodes?: string[];
}

export interface LifePhaseMilestone {
  id: string;
  phase: LifePhase;
  ageRange: string;           // e.g., "0-5 år"
  name: string;
  description: string;
  expectedAge?: number;        // Förväntad ålder för milstolpen
  achievedDate?: string;       // Datum då milstolpen uppnåddes
  status: 'not-started' | 'in-progress' | 'achieved' | 'delayed';
  relatedDimensions: string[]; // SHANARRI dimensions
}

export interface Transition {
  id: string;
  fromPhase: LifePhase;
  toPhase: LifePhase;
  fromSector: ActorSector;
  toSector: ActorSector;
  plannedDate: string;
  completedDate?: string;
  status: 'planned' | 'in-progress' | 'completed';
  transitionMeeting?: {
    date: string;
    participants: string[];
    notes?: string;
  };
  informationShared: boolean;
  followUpDate?: string;
}

export interface SupportTrigger {
  id: string;
  triggeredDate: string;
  fromLevel: SupportLevel;
  toLevel: SupportLevel;
  reason: string;
  triggerCriteria: string[];   // Vad som triggade nivåändringen
  riskFactors: string[];        // Risk factor IDs
  dimensions: string[];         // SHANARRI dimension IDs med låga värden
  actionPlan?: string;
  responsibleSector: ActorSector;
  status: 'pending' | 'active' | 'completed';
}

export interface ActorProfile {
  sector: ActorSector;
  name: string;
  organization: string;
  contact: string;
  role: string;
  accessLevel: 'basic' | 'standard' | 'extended' | 'full';
  canViewDimensions: string[]; // Vilka dimensioner de kan se
  canEditDimensions: string[]; // Vilka dimensioner de kan redigera
  activePhases: LifePhase[];   // Vilka livsfaser de är aktiva i
}

export interface LongitudinalDataPoint {
  date: string;
  phase: LifePhase;
  age: number;
  dimensions: {
    [dimensionId: string]: {
      value: number;
      source: ActorSector;
      notes?: string;
    };
  };
  riskFactors: string[];       // Risk factor IDs active at this time
  protectiveFactors: string[]; // Protective factor IDs
  supportLevel: SupportLevel;
  sector: ActorSector;         // Primär sektor vid denna tidpunkt
}

export interface QualityIndicator {
  id: string;
  type: 'process' | 'result' | 'long-term';
  name: string;
  description: string;
  target: number;              // Målvärde
  current: number;             // Nuvarande värde
  unit: string;                // t.ex., "%", "dagar", "antal"
  trend: 'improving' | 'stable' | 'declining';
  lastUpdated: string;
  relatedPhases: LifePhase[];
  gavleModelPillar?: 'mapping' | 'collaboration' | 'followup' | 'development';
}

// ==========================================
// MY WORLD TRIANGLE (GIRFEC/BBIC Integration)
// ==========================================

export type MyWorldDimension =
  | 'how-i-develop'        // Hur jag växer och utvecklas (BBIC: Barnets utveckling)
  | 'what-i-need'          // Vad jag behöver från andra (BBIC: Föräldraförmåga)
  | 'my-wider-world';      // Min omvärld (BBIC: Familj och miljö)

export interface MyWorldTriangleAssessment {
  dimension: MyWorldDimension;
  aspects: MyWorldAspect[];
  overallRating: number;      // 1-5 skala
  lastAssessed: string;
  assessedBy: ActorSector;
  notes?: string;
}

export interface MyWorldAspect {
  id: string;
  name: string;
  description: string;
  rating: number;             // 1-5 skala
  shanarriLinks: string[];    // Kopplingar till SHANARRI-dimensioner
  bbicCode?: string;          // BBIC-kodning
  icfCodes?: string[];
  concerns: string[];         // Identifierade bekymmer
  strengths: string[];        // Identifierade styrkor
}

// ==========================================
// RESILIENCE MATRIX (GIRFEC)
// ==========================================

export interface ResilienceMatrix {
  adversity: AdversityFactor[];
  vulnerability: VulnerabilityFactor[];
  protectiveEnvironment: ProtectiveEnvironmentFactor[];
  resilienceScore: number;        // Beräknad resiliens 1-10
  lastUpdated: string;
}

export interface AdversityFactor {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  duration: 'acute' | 'chronic';  // Akut eller kronisk
  impact: string[];               // Vilka livsområden påverkas
  identifiedDate: string;
  status: 'active' | 'resolved' | 'monitoring';
}

export interface VulnerabilityFactor {
  id: string;
  name: string;
  description: string;
  type: 'individual' | 'family' | 'environmental';
  level: 'low' | 'medium' | 'high';
  relatedAdversities: string[];   // IDs till AdversityFactors
  mitigationStrategies: string[];
}

export interface ProtectiveEnvironmentFactor {
  id: string;
  name: string;
  description: string;
  type: 'individual' | 'family' | 'community';
  strength: 'weak' | 'moderate' | 'strong';
  sustainabilityRisk: 'low' | 'medium' | 'high';  // Risk att skyddsfaktorn försvinner
  relatedDimensions: string[];    // SHANARRI dimensions
}

// ==========================================
// ÅRSHJUL - SYSTEMATISKT KVALITETSARBETE
// ==========================================

export type QualityWorkPhase =
  | 'mapping'              // Jan-Mar: Kartläggning
  | 'analysis'             // Apr-Jun: Analys och planering
  | 'implementation'       // Jul-Sep: Implementering
  | 'follow-up'            // Okt-Dec: Uppföljning och utvärdering
  | 'development';         // Kontinuerlig: Utveckling

export type LegalFramework =
  | 'SoL'                  // Socialtjänstlagen
  | 'HSL'                  // Hälso- och sjukvårdslagen
  | 'SkolL'                // Skollagen
  | 'PatL'                 // Patientlagen
  | 'OSL'                  // Offentlighets- och sekretesslagen
  | 'Barnkonventionen';    // FN:s barnkonvention

export interface AnnualQualityWheel {
  year: number;
  phases: QualityWheelPhase[];
  gavleModelPillars: GavleModelPillar[];
  legalRequirements: LegalRequirement[];
  overallProgress: number;      // 0-100%
  responsibleSectors: ActorSector[];
}

export interface QualityWheelPhase {
  id: string;
  phase: QualityWorkPhase;
  period: string;              // T.ex. "Januari - Mars 2024"
  startDate: string;
  endDate: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'delayed';
  activities: QualityActivity[];
  milestones: QualityMilestone[];
  progress: number;            // 0-100%
  responsibleSector: ActorSector;
  participants: ActorSector[];
}

export interface QualityActivity {
  id: string;
  name: string;
  description: string;
  dueDate: string;
  completedDate?: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  responsiblePerson?: string;
  gavlePillar: 'mapping' | 'collaboration' | 'followup' | 'development';
  legalFramework?: LegalFramework[];
  deliverables: string[];
}

export interface QualityMilestone {
  id: string;
  name: string;
  date: string;
  achieved: boolean;
  achievedDate?: string;
  criteria: string[];
  indicators: string[];        // KPI IDs
}

export interface GavleModelPillar {
  pillar: 'mapping' | 'collaboration' | 'followup' | 'development';
  name: string;
  description: string;
  activities: string[];        // QualityActivity IDs
  indicators: string[];        // QualityIndicator IDs
  progress: number;            // 0-100%
  status: 'on-track' | 'at-risk' | 'delayed';
}

export interface LegalRequirement {
  id: string;
  framework: LegalFramework;
  requirement: string;
  description: string;
  dueDate?: string;            // Om det finns deadline
  frequency: 'annual' | 'quarterly' | 'monthly' | 'ongoing';
  relatedActivities: string[]; // QualityActivity IDs
  complianceStatus: 'compliant' | 'partial' | 'non-compliant' | 'not-assessed';
  lastAssessment?: string;
  responsibleSector: ActorSector;
}

export interface EnhancedChildProfile extends ChildProfile {
  currentPhase: LifePhase;
  supportLevel: SupportLevel;
  primarySector: ActorSector;
  secondarySectors: ActorSector[];
  riskFactors: RiskFactor[];
  protectiveFactors: ProtectiveFactor[];
  transitions: Transition[];
  longitudinalData: LongitudinalDataPoint[];
  activeTriggers: SupportTrigger[];
  myWorldAssessments: MyWorldTriangleAssessment[];
  resilienceMatrix?: ResilienceMatrix;
}