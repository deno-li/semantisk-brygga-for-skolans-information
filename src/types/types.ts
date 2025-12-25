
export type Perspective = 'guardian' | 'child' | 'professional';
export type View =
  | 'overview'
  | 'shanarri'
  | 'sip'
  | 'dataprofile'
  | 'timeline'
  | 'quality'
  | 'ai-analysis'
  | 'journal'
  | 'lifecourse'
  | 'myworld'
  | 'resilience'
  | 'qualitywheel'
  | 'survey'
  | 'optimal-wheel'      // Barnets Resa - Optimalt välbefinnandehjul
  | 'journey-level'      // Barnets Resa - Nivåhantering
  | 'matrix-overview'    // Barnets Resa - Matrisöversikt
  | 'icf-demo'           // WHO ICF - Performance/Capacity & Environmental Factors
  | 'icf-n1'             // WHO ICF - N1 Universell screening
  | 'icf-n2';            // WHO ICF - N2 Fördjupad analys

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

// ==========================================
// BARNETS RESA MATRIS - Nivåmodell
// ==========================================

export type JourneyLevel =
  | 'universell'           // Nivå 1: Alla barn - Hälsofrämjande + tidig upptäckt
  | 'stodprofil'          // Nivå 2: Barn med stödbehov - Riktat stöd och uppföljning
  | 'samordning';         // Nivå 3: Samordnade insatser - Samlad plan över huvudmannagränser

export type WelfareWheelSpoke =
  | 'trygg'               // TRYGG - Jag känner mig trygg
  | 'halsa'               // HÄLSA/MÅ BRA - Jag mår bra
  | 'utvecklas'           // UTVECKLAS - Jag hänger med
  | 'larande'             // LÄRANDE - Jag får hjälp när jag behöver
  | 'hemmet'              // HEMMET - Det känns bra hemma
  | 'relationer'          // RELATIONER - Jag har någon att vara med
  | 'aktiv'               // AKTIV - Jag gör något jag gillar varje vecka
  | 'delaktig';           // DELAKTIG - Jag får vara med och påverka

export interface WelfareWheelSpokeData {
  spoke: WelfareWheelSpoke;
  name: string;
  childIndicator: string;      // Barnets indikator
  guardianIndicator: string;   // Vårdnadshavares indikator
  professionalIndicator: string; // Professionell indikator
  icfDomains: string[];        // ICF-domäner (grov nivå)
  ksiTargets: string[];        // KSI Target/Action/Means
  snomedCT?: string;           // SNOMED CT (endast vid vård-källa)
  ss12000Source: string[];     // Skolans bärlager (SS 12000)
  status: 1 | 2 | 3 | 4 | 5;  // 1=Röd, 2=Orange, 3=Gul, 4=Ljusgrön, 5=Grön
  history: WheelHistoryPoint[]; // Historisk trend
  notes?: string;
}

export interface WheelHistoryPoint {
  date: string;
  value: 1 | 2 | 3 | 4 | 5;
  source: ActorSector;
  measurement: 'survey' | 'observation' | 'assessment' | 'meeting';
}

export interface JourneyLevelConfig {
  level: JourneyLevel;
  name: string;
  targetGroup: string;         // Målgrupp
  purpose: string;             // Syfte
  familyView: string[];        // Vad syns i 1177 (familjevyn)
  professionalView: string[];  // Vad syns för profession (rollvy)
  dataMinimization: string;    // Dataminimeringsregler
  followUpFrequency: string;   // Uppföljningsfrekvens
  escalationTriggers: string[]; // Trigger till nästa nivå
}

export interface EscalationTrigger {
  id: string;
  triggeredDate: string;
  fromLevel: JourneyLevel;
  toLevel: JourneyLevel;
  situation: string;           // T.ex. "Röd i 1 eker två gånger"
  affectedSpokes: WelfareWheelSpoke[]; // Vilka ekrar som triggar
  action: string;              // Vad ska göras
  responsible: ActorSector;
  status: 'pending' | 'active' | 'completed' | 'declined';
  notes?: string;
}

export interface DataSharingRule {
  informationLayer: string;     // T.ex. "Barnets röst", "Välbefinnandeindikatorer"
  master: string;               // Var är master-systemet
  example: string;
  storedIn: string;             // Var lagras data
  sharedInProfile: boolean;     // Delas i profilen?
  why: string;                  // Varför/varför inte
  sensitivity: 'L' | 'M' | 'H'; // Känslighet (Low/Medium/High)
  consentRequired: 'yes' | 'no' | 'varies'; // Samtyckeskrav
}

export interface SemanticMapping {
  id: string;
  sourceSystem: string;         // T.ex. "Skolans dokumentation"
  sourceCode: string;           // T.ex. "Frånvaro>10%"
  targetSystem: 'ICF' | 'KSI' | 'SNOMED' | 'ICD' | 'KVÅ' | 'SS12000';
  targetCode: string;
  mappingType: 'exact' | 'narrower' | 'broader' | 'related' | 'no-mapping';
  confidence: 'high' | 'medium' | 'low';
  status: 'draft' | 'reviewed' | 'approved' | 'revising';
  reviewer?: string;
  reviewDate?: string;
  notes?: string;
}

export interface JourneyProfile {
  childId: string;
  currentLevel: JourneyLevel;
  levelHistory: JourneyLevelChange[];
  welfareWheel: WelfareWheelSpokeData[];
  activeTriggers: EscalationTrigger[];
  supportPlan?: SupportPlanData;
  coordinationPlan?: CoordinationPlanData;
  dataSharingConsent: ConsentRecord[];
  lastAssessment: string;
  nextFollowUp: string;
}

export interface JourneyLevelChange {
  date: string;
  fromLevel: JourneyLevel | null; // null för första nivån
  toLevel: JourneyLevel;
  reason: string;
  triggeredBy: EscalationTrigger | null;
  decidedBy: ActorSector;
  notes?: string;
}

export interface SupportPlanData {
  id: string;
  created: string;
  updated: string;
  goals: PlanGoal[];
  interventions: PlanIntervention[];
  responsible: ActorSector;
  participants: ActorSector[];
  followUpSchedule: string;
  status: 'active' | 'completed' | 'paused';
}

export interface CoordinationPlanData extends SupportPlanData {
  sipLike: boolean;             // Om det är en SIP-liknande plan
  crossSectorGoals: CrossSectorGoal[];
  responsibilityMatrix: ResponsibilityAssignment[];
  meetingSchedule: string;
  coordinatorName: string;
  coordinatorSector: ActorSector;
}

export interface PlanGoal {
  id: string;
  text: string;                 // Mål i klarspråk
  targetDate: string;
  relatedSpokes: WelfareWheelSpoke[];
  ksiTarget?: string;
  progress: 'not-started' | 'in-progress' | 'achieved' | 'revised';
  lastReviewed: string;
}

export interface PlanIntervention {
  id: string;
  name: string;                 // Insats i klarspråk
  description: string;
  ksiCode?: string;             // KSI Action/Means
  responsible: ActorSector;
  startDate: string;
  endDate?: string;
  frequency: string;            // T.ex. "2ggr/vecka"
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  effectOnSpokes: WelfareWheelSpoke[]; // Vilka ekrar påverkas
}

export interface CrossSectorGoal extends PlanGoal {
  primarySector: ActorSector;
  supportingSectors: ActorSector[];
  sectorResponsibilities: { sector: ActorSector; responsibility: string }[];
}

export interface ResponsibilityAssignment {
  sector: ActorSector;
  contactPerson: string;
  role: string;
  responsibilities: string[];
  availableResources: string[];
}

export interface ConsentRecord {
  id: string;
  consentDate: string;
  givenBy: 'child' | 'guardian' | 'both';
  consentType: 'data-sharing' | 'coordination' | 'specific-service';
  scope: string;                // Vad samtycket gäller
  fromSector: ActorSector;
  toSector: ActorSector[];
  validUntil?: string;
  status: 'active' | 'withdrawn' | 'expired';
  withdrawalDate?: string;
}