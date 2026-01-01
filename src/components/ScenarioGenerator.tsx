import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  Sparkles,
  Activity,
  Shield,
  TrendingUp,
  TrendingDown,
  Minus,
  RotateCcw,
  Play,
  Pause,
  Info,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Target,
  Users,
  Baby,
  Briefcase,
  UserCircle,
  Calendar,
  ArrowRight,
  RefreshCw,
  GitBranch,
  Lightbulb,
  Database,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Layers,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  GraduationCap,
  Heart,
  X,
  ClipboardList,
  BarChart3
} from 'lucide-react';
import { SHANARRI_DATA } from '../data/shanarriData';

// ============================================
// ICF QUALIFIER LABELS (0-4 scale from WHO ICF)
// ============================================
const ICF_QUALIFIER_LABELS: Record<number, { label: string; description: string; color: string }> = {
  0: { label: 'Inget problem', description: '0-4%', color: 'bg-emerald-500' },
  1: { label: 'Lätt problem', description: '5-24%', color: 'bg-lime-500' },
  2: { label: 'Måttligt problem', description: '25-49%', color: 'bg-amber-500' },
  3: { label: 'Gravt problem', description: '50-95%', color: 'bg-orange-500' },
  4: { label: 'Totalt problem', description: '96-100%', color: 'bg-red-500' },
};

// ============================================
// JOURNEY LEVELS CONFIGURATION
// ============================================
const JOURNEY_LEVELS = {
  N1: { name: 'N1 Universell', description: 'Hälsofrämjande insatser för alla barn', color: 'emerald' },
  N2: { name: 'N2 Stödprofil', description: 'Riktade insatser för barn med behov', color: 'amber' },
  N3: { name: 'N3 Samordning', description: 'Koordinerade insatser över huvudmannagränser', color: 'rose' },
};

// ============================================
// ESCALATION ALERT COMPONENT
// ============================================
interface EscalationAlertProps {
  currentLevel: 'N1' | 'N2' | 'N3';
  suggestedLevel: 'N1' | 'N2' | 'N3';
  reasons: string[];
  onConfirm: (newLevel: 'N1' | 'N2' | 'N3') => void;
  onDismiss: () => void;
}

const EscalationAlert: React.FC<EscalationAlertProps> = ({
  currentLevel,
  suggestedLevel,
  reasons,
  onConfirm,
  onDismiss,
}) => {
  const currentInfo = JOURNEY_LEVELS[currentLevel];
  const suggestedInfo = JOURNEY_LEVELS[suggestedLevel];

  return (
    <div className="bg-gradient-to-r from-rose-50 to-pink-50 border-2 border-rose-200 rounded-3xl p-6 mb-6 shadow-lg animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-500 flex items-center justify-center flex-shrink-0 shadow-lg">
          <AlertTriangle className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-rose-800 text-lg mb-2">Eskaleringsvarning</h3>
          <p className="text-sm text-rose-700 mb-4">
            Baserat på de justerade värdena har automatiska eskaleringskriterier utlösts.
            En uppflyttning till högre stödnivå rekommenderas.
          </p>

          {/* Level Transition */}
          <div className="flex items-center justify-center gap-4 py-4 bg-white/50 rounded-2xl mb-4">
            <div className="text-center">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-${currentInfo.color}-100 text-${currentInfo.color}-700 mb-2`}>
                Nuvarande
              </span>
              <p className="font-bold text-gray-900">{currentInfo.name}</p>
            </div>
            <ArrowRight className="w-6 h-6 text-rose-500" />
            <div className="text-center">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-rose-500 text-white mb-2">
                Rekommenderad
              </span>
              <p className="font-bold text-gray-900">{suggestedInfo.name}</p>
            </div>
          </div>

          {/* Reasons */}
          <div className="bg-white/70 rounded-xl p-4 mb-4">
            <p className="text-sm font-semibold text-rose-800 mb-2">Utlösande orsaker:</p>
            <ul className="space-y-1">
              {reasons.map((reason, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-rose-700">
                  <span className="text-rose-500 mt-0.5">•</span>
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => onConfirm(suggestedLevel)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-rose-500 text-white font-medium rounded-xl hover:bg-rose-600 transition-colors shadow-lg"
            >
              <CheckCircle2 className="w-4 h-4" />
              Bekräfta eskalering
            </button>
            <button
              onClick={onDismiss}
              className="flex items-center gap-2 px-4 py-3 bg-white text-rose-700 font-medium rounded-xl border-2 border-rose-200 hover:bg-rose-50 transition-colors"
            >
              <X className="w-4 h-4" />
              Ignorera
            </button>
          </div>

          <p className="text-xs text-rose-600 text-center mt-4">
            Vid akut oro, kontakta alltid ansvarig chef eller socialtjänst direkt.
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================
// STATISTICS SUMMARY COMPONENT
// ============================================
interface StatisticsSummaryProps {
  spokeValues: Record<string, number>;
  baselineValues: Record<string, number>;
}

const StatisticsSummary: React.FC<StatisticsSummaryProps> = ({ spokeValues, baselineValues }) => {
  const stats = useMemo(() => {
    const values = Object.values(spokeValues);
    const baseValues = Object.values(baselineValues);

    return {
      totalSpokes: values.length,
      criticalCount: values.filter(v => v <= 1).length,
      concernCount: values.filter(v => v === 2).length,
      okCount: values.filter(v => v === 3).length,
      goodCount: values.filter(v => v >= 4).length,
      average: (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1),
      improved: Object.keys(spokeValues).filter(k => spokeValues[k] > baselineValues[k]).length,
      declined: Object.keys(spokeValues).filter(k => spokeValues[k] < baselineValues[k]).length,
    };
  }, [spokeValues, baselineValues]);

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 p-5 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-lg">
          <BarChart3 className="w-5 h-5 text-white" />
        </div>
        <h4 className="font-semibold text-gray-900">Statistiksammanställning</h4>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="text-center p-3 bg-red-50 rounded-xl">
          <span className="text-2xl font-bold text-red-600">{stats.criticalCount}</span>
          <p className="text-xs text-red-600">Kritisk</p>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-xl">
          <span className="text-2xl font-bold text-orange-600">{stats.concernCount}</span>
          <p className="text-xs text-orange-600">Bekymmer</p>
        </div>
        <div className="text-center p-3 bg-amber-50 rounded-xl">
          <span className="text-2xl font-bold text-amber-600">{stats.okCount}</span>
          <p className="text-xs text-amber-600">OK</p>
        </div>
        <div className="text-center p-3 bg-emerald-50 rounded-xl">
          <span className="text-2xl font-bold text-emerald-600">{stats.goodCount}</span>
          <p className="text-xs text-emerald-600">Bra/Utmärkt</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <span className="text-emerald-700">{stats.improved} förbättrade</span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-red-500" />
          <span className="text-red-700">{stats.declined} försämrade</span>
        </div>
      </div>
    </div>
  );
};

// ============================================
// WORKFLOW PROGRESS COMPONENT
// ============================================
interface WorkflowProgressProps {
  currentPhase: 'intake' | 'assessment' | 'review' | 'complete';
  progress: number;
}

const WorkflowProgress: React.FC<WorkflowProgressProps> = ({ currentPhase, progress }) => {
  const phases = [
    { id: 'intake', label: 'Introduktion' },
    { id: 'assessment', label: 'Bedömning' },
    { id: 'review', label: 'Granskning' },
    { id: 'complete', label: 'Klar' },
  ];

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 p-4 shadow-lg mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">Framsteg</span>
        <span className="text-sm font-bold text-gray-900">{Math.round(progress)}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between">
        {phases.map((phase) => (
          <span
            key={phase.id}
            className={`text-xs font-medium transition-colors ${
              currentPhase === phase.id ? 'text-violet-600' : 'text-gray-400'
            }`}
          >
            {phase.label}
          </span>
        ))}
      </div>
    </div>
  );
};

// SHANARRI spoke configuration
const SHANARRI_SPOKES = [
  { id: 'trygg', name: 'TRYGG', nameEn: 'Safe', color: '#005595', icon: '🛡️' },
  { id: 'halsa', name: 'MÅ BRA', nameEn: 'Healthy', color: '#378056', icon: '💚' },
  { id: 'utvecklas', name: 'UTVECKLAS', nameEn: 'Achieving', color: '#C12143', icon: '📚' },
  { id: 'omvardad', name: 'OMVÅRDAD', nameEn: 'Nurtured', color: '#B00020', icon: '🤱' },
  { id: 'aktiv', name: 'AKTIV', nameEn: 'Active', color: '#E87C00', icon: '⚡' },
  { id: 'respekterad', name: 'RESPEKTERAD', nameEn: 'Respected', color: '#7B1FA2', icon: '🤝' },
  { id: 'ansvarstagande', name: 'ANSVAR', nameEn: 'Responsible', color: '#0097A7', icon: '✨' },
  { id: 'delaktig', name: 'DELAKTIG', nameEn: 'Included', color: '#FFC107', icon: '🌟' },
];

// Default baseline values (typical N1 profile)
const DEFAULT_VALUES: Record<string, number> = {
  trygg: 4,
  halsa: 4,
  utvecklas: 3,
  omvardad: 4,
  aktiv: 3,
  respekterad: 4,
  ansvarstagande: 3,
  delaktig: 4,
};

// Scenario presets
const SCENARIO_PRESETS = [
  {
    id: 'n1-universal',
    name: 'N1 Universell',
    description: 'Alla indikatorer gröna - inga insatser behövs',
    values: { trygg: 5, halsa: 5, utvecklas: 4, omvardad: 5, aktiv: 4, respekterad: 5, ansvarstagande: 4, delaktig: 5 },
    color: 'emerald'
  },
  {
    id: 'n2-support',
    name: 'N2 Stödprofil',
    description: 'Några bekymmer - riktade insatser pågår',
    values: { trygg: 4, halsa: 3, utvecklas: 2, omvardad: 4, aktiv: 3, respekterad: 3, ansvarstagande: 2, delaktig: 3 },
    color: 'amber'
  },
  {
    id: 'n3-coordinated',
    name: 'N3 Samordning',
    description: 'Komplex situation - SIP aktiverad',
    values: { trygg: 2, halsa: 2, utvecklas: 2, omvardad: 3, aktiv: 2, respekterad: 2, ansvarstagande: 1, delaktig: 2 },
    color: 'rose'
  },
  {
    id: 'learning-focus',
    name: 'Inlärningsbekymmer',
    description: 'Specifik utmaning med lärande',
    values: { trygg: 4, halsa: 4, utvecklas: 1, omvardad: 4, aktiv: 3, respekterad: 4, ansvarstagande: 2, delaktig: 3 },
    color: 'violet'
  },
  {
    id: 'social-focus',
    name: 'Social oro',
    description: 'Utmaningar med relationer och delaktighet',
    values: { trygg: 3, halsa: 4, utvecklas: 3, omvardad: 4, aktiv: 2, respekterad: 2, ansvarstagande: 3, delaktig: 1 },
    color: 'blue'
  },
];

// Life phases for forward simulation
const LIFE_PHASES = [
  { id: 'bvc', name: 'BVC/MVC', ageRange: '0-5', color: '#E91E63', icon: Baby },
  { id: 'forskola', name: 'Förskola', ageRange: '1-6', color: '#9C27B0', icon: Heart },
  { id: 'grundskola', name: 'Grundskola', ageRange: '7-15', color: '#3F51B5', icon: GraduationCap },
  { id: 'gymnasium', name: 'Gymnasium', ageRange: '16-19', color: '#009688', icon: GraduationCap },
  { id: 'vuxen', name: 'Vuxenliv', ageRange: '20+', color: '#FF5722', icon: Briefcase },
];

// PDCA phases
const PDCA_PHASES = [
  { id: 'plan', name: 'PLANERA', color: '#005595', description: 'Identifiera förbättringsområde och planera åtgärd' },
  { id: 'do', name: 'GÖRA', color: '#378056', description: 'Genomför planerad åtgärd i liten skala' },
  { id: 'check', name: 'UTVÄRDERA', color: '#E87C00', description: 'Utvärdera resultat och jämför med mål' },
  { id: 'act', name: 'AGERA', color: '#B00020', description: 'Standardisera eller justera baserat på lärdom' },
];

// Semantic classification systems
const CLASSIFICATION_SYSTEMS = [
  { id: 'icf', name: 'ICF', fullName: 'International Classification of Functioning', color: '#005595' },
  { id: 'ksi', name: 'KSI', fullName: 'Kommunernas Socialtjänsts Informationssystem', color: '#378056' },
  { id: 'bbic', name: 'BBIC', fullName: 'Barns Behov i Centrum', color: '#C12143' },
  { id: 'ibic', name: 'IBIC', fullName: 'Individens Behov i Centrum', color: '#B00020' },
  { id: 'kva', name: 'KVÅ', fullName: 'Klassifikation av vårdåtgärder', color: '#E87C00' },
  { id: 'snomed', name: 'SNOMED CT', fullName: 'Clinical Terminology', color: '#7B1FA2' },
];

// Improvisation mode tabs
type ImprovisationMode = 'scenario' | 'perspective' | 'lifecycle' | 'pdca' | 'semantic' | 'datamin' | 'trend';

const IMPROVISATION_MODES = [
  { id: 'scenario' as ImprovisationMode, name: 'Scenarioskiss', icon: Sparkles, color: 'violet' },
  { id: 'perspective' as ImprovisationMode, name: 'Roll-improvisation', icon: Users, color: 'blue' },
  { id: 'lifecycle' as ImprovisationMode, name: 'Framåtblick', icon: Calendar, color: 'pink' },
  { id: 'pdca' as ImprovisationMode, name: 'PDCA-mikroloop', icon: RefreshCw, color: 'emerald' },
  { id: 'semantic' as ImprovisationMode, name: 'Semantisk lekplats', icon: GitBranch, color: 'orange' },
  { id: 'datamin' as ImprovisationMode, name: 'Dataminimering', icon: Database, color: 'cyan' },
  { id: 'trend' as ImprovisationMode, name: 'Trendanalys', icon: TrendingUp, color: 'amber' },
];

// Perspective types
type Perspective = 'child' | 'guardian' | 'professional';

interface ScenarioGeneratorProps {
  selectedProfileId?: string;
}

const ScenarioGenerator: React.FC<ScenarioGeneratorProps> = () => {
  // Core state
  const [activeMode, setActiveMode] = useState<ImprovisationMode>('scenario');
  const [spokeValues, setSpokeValues] = useState<Record<string, number>>(DEFAULT_VALUES);
  const [baselineValues, setBaselineValues] = useState<Record<string, number>>(DEFAULT_VALUES);
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Perspective mode state
  const [perspectives, setPerspectives] = useState<Record<Perspective, Record<string, number>>>({
    child: { ...DEFAULT_VALUES },
    guardian: { ...DEFAULT_VALUES },
    professional: { ...DEFAULT_VALUES },
  });
  const [activePerspective, setActivePerspective] = useState<Perspective>('professional');
  const [showPerspectiveDiff, setShowPerspectiveDiff] = useState(true);

  // Lifecycle mode state
  const [currentPhase, setCurrentPhase] = useState(2); // grundskola
  const [projectedPhase, setProjectedPhase] = useState(3); // gymnasium
  const [phaseValues, setPhaseValues] = useState<Record<string, Record<string, number>>>({
    bvc: { trygg: 5, halsa: 5, utvecklas: 4, omvardad: 5, aktiv: 5, respekterad: 4, ansvarstagande: 3, delaktig: 4 },
    forskola: { trygg: 4, halsa: 4, utvecklas: 4, omvardad: 5, aktiv: 5, respekterad: 4, ansvarstagande: 3, delaktig: 4 },
    grundskola: { ...DEFAULT_VALUES },
    gymnasium: { trygg: 4, halsa: 3, utvecklas: 3, omvardad: 4, aktiv: 3, respekterad: 4, ansvarstagande: 4, delaktig: 3 },
    vuxen: { trygg: 4, halsa: 4, utvecklas: 4, omvardad: 3, aktiv: 3, respekterad: 5, ansvarstagande: 5, delaktig: 4 },
  });

  // PDCA mode state
  const [selectedSpoke, setSelectedSpoke] = useState<string>('utvecklas');
  const [pdcaPhase, setPdcaPhase] = useState<string>('plan');
  const [pdcaActions, setPdcaActions] = useState<Record<string, string[]>>({
    trygg: ['Genomför trygghetsrond', 'Involvera elevhälsa'],
    halsa: ['Hälsosamtal med skolsköterska', 'Frukost i skolan'],
    utvecklas: ['Lässtöd 3x/vecka', 'Anpassad studieplan'],
    omvardad: ['Hembesök', 'Föräldrastödsprogram'],
    aktiv: ['Fritidsaktivitet erbjuden', 'Rastaktiviteter'],
    respekterad: ['Regelbundna elevsamtal', 'Klassråd'],
    ansvarstagande: ['Mentorssamtal', 'Veckoplanering'],
    delaktig: ['Kompisgrupp', 'Inkluderingsinsats'],
  });

  // Semantic mode state
  const [selectedClassification, setSelectedClassification] = useState<string>('icf');
  const [showMappings, setShowMappings] = useState(true);

  // Data minimization mode state
  const [currentLevel, setCurrentLevel] = useState<'N1' | 'N2' | 'N3'>('N1');
  const [targetLevel, setTargetLevel] = useState<'N1' | 'N2' | 'N3'>('N2');
  const [visibleDataPoints, setVisibleDataPoints] = useState<Record<string, boolean>>({
    wheelIndicators: true,
    trend: false,
    icfGap: false,
    environmentalFactors: false,
    riskFactors: false,
    sipGoals: false,
    detailedNotes: false,
  });

  // Trend mode state
  const [trendDirection, setTrendDirection] = useState<'improving' | 'stable' | 'declining'>('stable');
  const [suggestedActions, setSuggestedActions] = useState<string[]>([]);

  // Escalation alert state
  const [showEscalationAlert, setShowEscalationAlert] = useState(false);
  const [escalationReasons, setEscalationReasons] = useState<string[]>([]);
  const [previousRecommendedLevel, setPreviousRecommendedLevel] = useState<'N1' | 'N2' | 'N3'>('N1');

  // Workflow phase state (for PDCA mode)
  const [workflowPhase, setWorkflowPhase] = useState<'intake' | 'assessment' | 'review' | 'complete'>('intake');
  const [workflowProgress, setWorkflowProgress] = useState(25);

  // ICF Qualifier assessments
  const [icfQualifiers, setIcfQualifiers] = useState<Record<string, number>>({
    trygg: 0,
    halsa: 0,
    utvecklas: 1,
    omvardad: 0,
    aktiv: 1,
    respekterad: 0,
    ansvarstagande: 1,
    delaktig: 0,
  });

  // Calculate derived metrics
  const metrics = useMemo(() => {
    const values = Object.values(spokeValues);
    const average = values.reduce((a, b) => a + b, 0) / values.length;

    // ICF Gap simulation (lower values = larger gaps)
    const gapScore = values.filter(v => v <= 2).length;
    const facilitatorScore = values.filter(v => v >= 4).length;

    // Risk/Protection balance
    const riskFactors = values.filter(v => v <= 2).length * 2;
    const protectionFactors = values.filter(v => v >= 4).length * 2;
    const balance = protectionFactors - riskFactors;

    // Resilience score (1-10)
    const resilience = Math.max(1, Math.min(10, Math.round(average * 2)));

    // Determine recommended level
    let recommendedLevel: 'N1' | 'N2' | 'N3' = 'N1';
    if (values.some(v => v <= 1) || values.filter(v => v <= 2).length >= 3) {
      recommendedLevel = 'N3';
    } else if (values.some(v => v <= 2) || values.filter(v => v <= 3).length >= 3) {
      recommendedLevel = 'N2';
    }

    // Calculate change from baseline
    const totalChange = Object.keys(spokeValues).reduce((acc, key) => {
      return acc + (spokeValues[key] - baselineValues[key]);
    }, 0);

    return {
      average,
      gapScore,
      facilitatorScore,
      riskFactors,
      protectionFactors,
      balance,
      resilience,
      recommendedLevel,
      totalChange,
    };
  }, [spokeValues, baselineValues]);

  // Calculate perspective differences
  const perspectiveDiffs = useMemo(() => {
    const diffs: Record<string, { max: number; min: number; diff: number }> = {};
    SHANARRI_SPOKES.forEach(spoke => {
      const vals = [
        perspectives.child[spoke.id],
        perspectives.guardian[spoke.id],
        perspectives.professional[spoke.id],
      ];
      diffs[spoke.id] = {
        max: Math.max(...vals),
        min: Math.min(...vals),
        diff: Math.max(...vals) - Math.min(...vals),
      };
    });
    return diffs;
  }, [perspectives]);

  // Detect escalation triggers
  useEffect(() => {
    const newLevel = metrics.recommendedLevel;

    // Check if we should show escalation alert
    if (newLevel !== previousRecommendedLevel) {
      const levelOrder = { 'N1': 1, 'N2': 2, 'N3': 3 };

      // Only trigger alert when escalating UP (not de-escalating)
      if (levelOrder[newLevel] > levelOrder[previousRecommendedLevel]) {
        const reasons: string[] = [];
        const values = Object.entries(spokeValues);

        // Generate reasons based on values
        const criticalSpokes = values.filter(([_, v]) => v <= 1);
        const concernSpokes = values.filter(([_, v]) => v === 2);

        if (criticalSpokes.length > 0) {
          reasons.push(`${criticalSpokes.length} dimension(er) på kritisk nivå (1)`);
        }
        if (concernSpokes.length >= 3) {
          reasons.push(`${concernSpokes.length} dimensioner visar bekymmer (≤2)`);
        }
        if (metrics.balance < -2) {
          reasons.push('Riskfaktorer överväger skyddsfaktorer markant');
        }
        if (metrics.resilience <= 3) {
          reasons.push('Mycket låg motståndskraft (Resilience ≤3)');
        }

        if (reasons.length > 0) {
          setEscalationReasons(reasons);
          setShowEscalationAlert(true);
        }
      }

      setPreviousRecommendedLevel(newLevel);
    }
  }, [metrics.recommendedLevel, metrics.balance, metrics.resilience, spokeValues, previousRecommendedLevel]);

  // Handle escalation confirmation
  const handleEscalationConfirm = useCallback((newLevel: 'N1' | 'N2' | 'N3') => {
    setCurrentLevel(newLevel);
    setShowEscalationAlert(false);
    setEscalationReasons([]);
  }, []);

  // Handle escalation dismissal
  const handleEscalationDismiss = useCallback(() => {
    setShowEscalationAlert(false);
    setEscalationReasons([]);
  }, []);

  // Handle ICF qualifier change
  const handleICFQualifierChange = useCallback((spokeId: string, value: number) => {
    setIcfQualifiers(prev => ({ ...prev, [spokeId]: value }));
  }, []);

  // Handle slider change
  const handleSpokeChange = useCallback((spokeId: string, value: number) => {
    setSpokeValues(prev => ({ ...prev, [spokeId]: value }));
    setSelectedPreset(null);
  }, []);

  // Handle perspective value change
  const handlePerspectiveChange = useCallback((perspective: Perspective, spokeId: string, value: number) => {
    setPerspectives(prev => ({
      ...prev,
      [perspective]: { ...prev[perspective], [spokeId]: value },
    }));
  }, []);

  // Handle phase value change
  const handlePhaseValueChange = useCallback((phaseId: string, spokeId: string, value: number) => {
    setPhaseValues(prev => ({
      ...prev,
      [phaseId]: { ...prev[phaseId], [spokeId]: value },
    }));
  }, []);

  // Apply preset
  const applyPreset = useCallback((preset: typeof SCENARIO_PRESETS[0]) => {
    setBaselineValues(spokeValues);
    setSelectedPreset(preset.id);

    if (isAnimating) {
      // Animate transition
      const steps = 20;
      let step = 0;

      const animate = () => {
        step++;
        const progress = step / steps;
        const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic

        setSpokeValues(prev => {
          const newValues: Record<string, number> = {};
          Object.keys(prev).forEach(key => {
            const start = prev[key];
            const end = preset.values[key];
            newValues[key] = Math.round(start + (end - start) * eased);
          });
          return newValues;
        });

        if (step < steps) {
          requestAnimationFrame(animate);
        } else {
          setSpokeValues(preset.values);
        }
      };

      requestAnimationFrame(animate);
    } else {
      setSpokeValues(preset.values);
    }
  }, [spokeValues, isAnimating]);

  // Reset to default
  const resetValues = useCallback(() => {
    setBaselineValues(spokeValues);
    setSpokeValues(DEFAULT_VALUES);
    setSelectedPreset(null);
  }, [spokeValues]);

  // Get color based on value
  const getValueColor = (value: number) => {
    if (value >= 4) return 'text-emerald-600';
    if (value >= 3) return 'text-amber-600';
    if (value >= 2) return 'text-orange-600';
    return 'text-red-600';
  };

  const getValueBg = (value: number) => {
    if (value >= 4) return 'bg-gradient-to-r from-emerald-400 to-teal-500';
    if (value >= 3) return 'bg-gradient-to-r from-amber-400 to-orange-500';
    if (value >= 2) return 'bg-gradient-to-r from-orange-400 to-red-500';
    return 'bg-gradient-to-r from-red-500 to-rose-600';
  };

  const getLevelGradient = () => {
    switch (metrics.recommendedLevel) {
      case 'N1': return 'from-emerald-400 via-teal-500 to-cyan-600';
      case 'N2': return 'from-amber-400 via-orange-500 to-rose-500';
      case 'N3': return 'from-rose-400 via-pink-500 to-purple-600';
    }
  };

  const getLevelBgGradient = () => {
    switch (metrics.recommendedLevel) {
      case 'N1': return 'from-emerald-50/80 via-teal-50/60 to-cyan-50/40';
      case 'N2': return 'from-amber-50/80 via-orange-50/60 to-rose-50/40';
      case 'N3': return 'from-rose-50/80 via-pink-50/60 to-purple-50/40';
    }
  };

  // Generate trend-based suggestions
  const generateTrendSuggestions = useCallback(() => {
    const suggestions: string[] = [];
    const lowSpokes = SHANARRI_SPOKES.filter(s => spokeValues[s.id] <= 2);
    const decliningSpokes = SHANARRI_SPOKES.filter(s => spokeValues[s.id] < baselineValues[s.id]);

    if (trendDirection === 'declining') {
      suggestions.push('Överväg att eskalera till nästa nivå');
      if (lowSpokes.length > 0) {
        suggestions.push(`Prioritera insatser för: ${lowSpokes.map(s => s.name).join(', ')}`);
      }
      suggestions.push('Kalla till tvärprofessionellt möte');
    } else if (trendDirection === 'stable') {
      suggestions.push('Fortsätt nuvarande insatser');
      suggestions.push('Planera uppföljning om 4 veckor');
      if (decliningSpokes.length > 0) {
        suggestions.push(`Bevaka trend för: ${decliningSpokes.map(s => s.name).join(', ')}`);
      }
    } else {
      suggestions.push('Dokumentera framgångsfaktorer');
      suggestions.push('Överväg att trappa ner insatsnivå');
      suggestions.push('Dela lärdomarna med teamet');
    }

    setSuggestedActions(suggestions);
  }, [spokeValues, baselineValues, trendDirection]);

  // Update data visibility based on level
  const updateDataVisibility = useCallback((level: 'N1' | 'N2' | 'N3') => {
    const visibility: Record<string, boolean> = {
      wheelIndicators: true,
      trend: level !== 'N1',
      icfGap: level !== 'N1',
      environmentalFactors: level === 'N3',
      riskFactors: level !== 'N1',
      sipGoals: level === 'N3',
      detailedNotes: level === 'N3',
    };
    setVisibleDataPoints(visibility);
  }, []);

  // Render mode content
  const renderModeContent = () => {
    switch (activeMode) {
      case 'scenario':
        return renderScenarioMode();
      case 'perspective':
        return renderPerspectiveMode();
      case 'lifecycle':
        return renderLifecycleMode();
      case 'pdca':
        return renderPDCAMode();
      case 'semantic':
        return renderSemanticMode();
      case 'datamin':
        return renderDataMinMode();
      case 'trend':
        return renderTrendMode();
      default:
        return renderScenarioMode();
    }
  };

  // Scenario Mode (original functionality)
  const renderScenarioMode = () => (
    <div className="grid grid-cols-12 gap-6">
      {/* Left: SHANARRI Sliders */}
      <div className="col-span-7 bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-8 shadow-xl shadow-gray-100/50">
        <h3 className="font-bold text-gray-900 text-lg mb-6">SHANARRI-ekrar</h3>

        <div className="space-y-5">
          {SHANARRI_SPOKES.map((spoke) => {
            const value = spokeValues[spoke.id];
            const baseValue = baselineValues[spoke.id];
            const change = value - baseValue;

            return (
              <div key={spoke.id} className="group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-lg transition-transform group-hover:scale-110"
                      style={{ background: `linear-gradient(135deg, ${spoke.color}, ${spoke.color}dd)` }}
                    >
                      {spoke.icon}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900">{spoke.name}</span>
                      <span className="text-xs text-gray-400 ml-2">({spoke.nameEn})</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {change !== 0 && (
                      <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg ${
                        change > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {change > 0 ? '+' : ''}{change}
                      </span>
                    )}
                    <span className={`text-2xl font-bold ${getValueColor(value)}`}>
                      {value}
                    </span>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 h-3 rounded-full bg-gray-100" />
                  <div
                    className={`absolute h-3 rounded-full transition-all duration-300 ${getValueBg(value)}`}
                    style={{ width: `${(value / 5) * 100}%` }}
                  />
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={value}
                    onChange={(e) => handleSpokeChange(spoke.id, parseInt(e.target.value))}
                    className="relative w-full h-3 appearance-none bg-transparent cursor-pointer z-10
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:w-6
                      [&::-webkit-slider-thumb]:h-6
                      [&::-webkit-slider-thumb]:rounded-full
                      [&::-webkit-slider-thumb]:bg-white
                      [&::-webkit-slider-thumb]:shadow-lg
                      [&::-webkit-slider-thumb]:border-2
                      [&::-webkit-slider-thumb]:border-gray-300
                      [&::-webkit-slider-thumb]:cursor-grab
                      [&::-webkit-slider-thumb]:active:cursor-grabbing
                      [&::-webkit-slider-thumb]:transition-transform
                      [&::-webkit-slider-thumb]:hover:scale-125"
                  />
                </div>

                <div className="flex justify-between mt-1 px-1">
                  <span className="text-[10px] text-red-400 font-medium">Kritisk</span>
                  <span className="text-[10px] text-amber-400 font-medium">Bekymmer</span>
                  <span className="text-[10px] text-gray-400 font-medium">OK</span>
                  <span className="text-[10px] text-emerald-400 font-medium">Bra</span>
                  <span className="text-[10px] text-teal-400 font-medium">Utmärkt</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Derived Metrics */}
      <div className="col-span-5 space-y-6">
        {renderMetricsPanel()}
      </div>
    </div>
  );

  // Perspective Mode (Roll-improvisation)
  const renderPerspectiveMode = () => (
    <div className="space-y-6">
      {/* Perspective selector */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-lg">Välj perspektiv att redigera</h3>
          <button
            onClick={() => setShowPerspectiveDiff(!showPerspectiveDiff)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              showPerspectiveDiff ? 'bg-violet-100 text-violet-700' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {showPerspectiveDiff ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            Visa avvikelser
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { id: 'child' as Perspective, name: 'Barnets röst', icon: Baby, color: 'orange' },
            { id: 'guardian' as Perspective, name: 'Vårdnadshavare', icon: UserCircle, color: 'blue' },
            { id: 'professional' as Perspective, name: 'Profession', icon: Briefcase, color: 'emerald' },
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePerspective(p.id)}
              className={`p-4 rounded-2xl border-2 transition-all ${
                activePerspective === p.id
                  ? `border-${p.color}-400 bg-${p.color}-50 shadow-lg`
                  : 'border-gray-100 bg-white/50 hover:border-gray-200'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${p.color}-400 to-${p.color}-500 flex items-center justify-center mb-3 mx-auto shadow-lg`}>
                <p.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 text-center">{p.name}</h4>
            </button>
          ))}
        </div>
      </div>

      {/* Perspective sliders */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-8 shadow-xl">
          <h3 className="font-bold text-gray-900 text-lg mb-6">
            {activePerspective === 'child' ? '🧒 Barnets upplevelse' :
             activePerspective === 'guardian' ? '👨‍👩‍👧 Vårdnadshavarens syn' :
             '👩‍⚕️ Professionell bedömning'}
          </h3>

          <div className="space-y-4">
            {SHANARRI_SPOKES.map((spoke) => {
              const value = perspectives[activePerspective][spoke.id];
              const diff = perspectiveDiffs[spoke.id];
              const hasDiff = diff.diff >= 2;

              return (
                <div key={spoke.id} className={`group p-3 rounded-xl transition-all ${hasDiff && showPerspectiveDiff ? 'bg-amber-50 ring-2 ring-amber-200' : ''}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow"
                        style={{ background: spoke.color }}
                      >
                        {spoke.icon}
                      </div>
                      <span className="font-medium text-gray-900">{spoke.name}</span>
                      {hasDiff && showPerspectiveDiff && (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                          ⚠️ Avvikelse: {diff.diff} steg
                        </span>
                      )}
                    </div>
                    <span className={`text-xl font-bold ${getValueColor(value)}`}>{value}</span>
                  </div>

                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={value}
                    onChange={(e) => handlePerspectiveChange(activePerspective, spoke.id, parseInt(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none bg-gray-200 cursor-pointer
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:w-5
                      [&::-webkit-slider-thumb]:h-5
                      [&::-webkit-slider-thumb]:rounded-full
                      [&::-webkit-slider-thumb]:bg-white
                      [&::-webkit-slider-thumb]:shadow-md
                      [&::-webkit-slider-thumb]:border-2
                      [&::-webkit-slider-thumb]:border-gray-300"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Difference summary */}
        <div className="col-span-4 space-y-4">
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 p-5 shadow-lg">
            <h4 className="font-bold text-gray-900 mb-4">Perspektivskillnader</h4>
            <div className="space-y-3">
              {SHANARRI_SPOKES.filter(s => perspectiveDiffs[s.id].diff >= 2).map((spoke) => (
                <div key={spoke.id} className="p-3 bg-amber-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{spoke.icon}</span>
                    <span className="font-medium text-gray-900">{spoke.name}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center p-1 bg-orange-100 rounded">
                      <div className="text-orange-600 font-bold">{perspectives.child[spoke.id]}</div>
                      <div className="text-gray-500">Barn</div>
                    </div>
                    <div className="text-center p-1 bg-blue-100 rounded">
                      <div className="text-blue-600 font-bold">{perspectives.guardian[spoke.id]}</div>
                      <div className="text-gray-500">V.havare</div>
                    </div>
                    <div className="text-center p-1 bg-emerald-100 rounded">
                      <div className="text-emerald-600 font-bold">{perspectives.professional[spoke.id]}</div>
                      <div className="text-gray-500">Prof.</div>
                    </div>
                  </div>
                </div>
              ))}
              {SHANARRI_SPOKES.filter(s => perspectiveDiffs[s.id].diff >= 2).length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                  <p className="text-sm">Alla perspektiv är samstämmiga</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg">
            <h4 className="font-bold mb-2">Insikt</h4>
            <p className="text-sm text-white/90">
              {SHANARRI_SPOKES.filter(s => perspectiveDiffs[s.id].diff >= 2).length > 0
                ? 'Stora skillnader i uppfattning kan tyda på behov av gemensamt samtal för att skapa samsyn.'
                : 'God samsyn mellan alla parter ger en stabil grund för eventuella insatser.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Lifecycle Mode (Framåtblick)
  const renderLifecycleMode = () => (
    <div className="space-y-6">
      {/* Phase timeline */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-6 shadow-xl">
        <h3 className="font-bold text-gray-900 text-lg mb-4">Livsloppsprojektion</h3>
        <div className="flex items-center justify-between">
          {LIFE_PHASES.map((phase, idx) => {
            const PhaseIcon = phase.icon;
            const isActive = idx === currentPhase;
            const isProjected = idx === projectedPhase;
            const isPast = idx < currentPhase;

            return (
              <React.Fragment key={phase.id}>
                <button
                  onClick={() => {
                    if (idx < currentPhase) setCurrentPhase(idx);
                    else if (idx > currentPhase) setProjectedPhase(idx);
                  }}
                  className={`flex flex-col items-center p-4 rounded-2xl transition-all ${
                    isActive ? 'bg-blue-100 ring-2 ring-blue-400 shadow-lg' :
                    isProjected ? 'bg-violet-100 ring-2 ring-violet-400 shadow-lg' :
                    isPast ? 'bg-gray-100 opacity-60' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${
                      isActive ? 'bg-blue-500' : isProjected ? 'bg-violet-500' : 'bg-gray-400'
                    }`}
                  >
                    <PhaseIcon className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-medium text-sm text-gray-900">{phase.name}</span>
                  <span className="text-xs text-gray-500">{phase.ageRange} år</span>
                  {isActive && <span className="text-xs text-blue-600 font-bold mt-1">NU</span>}
                  {isProjected && <span className="text-xs text-violet-600 font-bold mt-1">PROJEKTION</span>}
                </button>
                {idx < LIFE_PHASES.length - 1 && (
                  <ArrowRight className={`w-5 h-5 ${idx < currentPhase ? 'text-gray-300' : 'text-gray-400'}`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Phase comparison */}
      <div className="grid grid-cols-2 gap-6">
        {/* Current phase */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
              {React.createElement(LIFE_PHASES[currentPhase].icon, { className: 'w-5 h-5 text-white' })}
            </div>
            <div>
              <h4 className="font-bold text-gray-900">{LIFE_PHASES[currentPhase].name}</h4>
              <p className="text-xs text-gray-500">Nuvarande fas ({LIFE_PHASES[currentPhase].ageRange} år)</p>
            </div>
          </div>

          <div className="space-y-3">
            {SHANARRI_SPOKES.map((spoke) => {
              const value = phaseValues[LIFE_PHASES[currentPhase].id][spoke.id];
              return (
                <div key={spoke.id} className="flex items-center gap-3">
                  <span className="text-lg">{spoke.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{spoke.name}</span>
                      <span className={`font-bold ${getValueColor(value)}`}>{value}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${getValueBg(value)}`} style={{ width: `${(value / 5) * 100}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Projected phase */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-violet-500 flex items-center justify-center">
              {React.createElement(LIFE_PHASES[projectedPhase].icon, { className: 'w-5 h-5 text-white' })}
            </div>
            <div>
              <h4 className="font-bold text-gray-900">{LIFE_PHASES[projectedPhase].name}</h4>
              <p className="text-xs text-gray-500">Projicerad fas ({LIFE_PHASES[projectedPhase].ageRange} år)</p>
            </div>
          </div>

          <div className="space-y-3">
            {SHANARRI_SPOKES.map((spoke) => {
              const currentValue = phaseValues[LIFE_PHASES[currentPhase].id][spoke.id];
              const projectedValue = phaseValues[LIFE_PHASES[projectedPhase].id][spoke.id];
              const change = projectedValue - currentValue;

              return (
                <div key={spoke.id} className="flex items-center gap-3">
                  <span className="text-lg">{spoke.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span className="text-gray-600">{spoke.name}</span>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${getValueColor(projectedValue)}`}>{projectedValue}</span>
                        {change !== 0 && (
                          <span className={`text-xs px-1.5 py-0.5 rounded ${
                            change > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {change > 0 ? '+' : ''}{change}
                          </span>
                        )}
                      </div>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={projectedValue}
                      onChange={(e) => handlePhaseValueChange(LIFE_PHASES[projectedPhase].id, spoke.id, parseInt(e.target.value))}
                      className="w-full h-2 rounded-full appearance-none bg-gray-200 cursor-pointer
                        [&::-webkit-slider-thumb]:appearance-none
                        [&::-webkit-slider-thumb]:w-4
                        [&::-webkit-slider-thumb]:h-4
                        [&::-webkit-slider-thumb]:rounded-full
                        [&::-webkit-slider-thumb]:bg-violet-500
                        [&::-webkit-slider-thumb]:shadow"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl">
        <div className="flex items-start gap-4">
          <Lightbulb className="w-8 h-8 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-lg mb-2">Tidig förebyggande insikt</h4>
            <p className="text-white/90 text-sm">
              Genom att projicera framåt kan vi identifiera potentiella utmaningar vid övergångar mellan livsfaser
              och planera förebyggande insatser i god tid. Övergången från {LIFE_PHASES[currentPhase].name} till {LIFE_PHASES[projectedPhase].name}
              kan innebära förändringar i {SHANARRI_SPOKES.filter(s =>
                phaseValues[LIFE_PHASES[projectedPhase].id][s.id] < phaseValues[LIFE_PHASES[currentPhase].id][s.id]
              ).map(s => s.name.toLowerCase()).join(', ') || 'inga identifierade dimensioner'}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // PDCA Mode (Mikroloopar)
  const renderPDCAMode = () => (
    <div className="space-y-6">
      {/* Workflow Progress */}
      <WorkflowProgress currentPhase={workflowPhase} progress={workflowProgress} />

      {/* Spoke selector */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-6 shadow-xl">
        <h3 className="font-bold text-gray-900 text-lg mb-4">Välj dimension för PDCA-mikroloop</h3>
        <div className="flex flex-wrap gap-3">
          {SHANARRI_SPOKES.map((spoke) => (
            <button
              key={spoke.id}
              onClick={() => setSelectedSpoke(spoke.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                selectedSpoke === spoke.id
                  ? 'bg-white shadow-lg ring-2'
                  : 'bg-gray-50 hover:bg-white hover:shadow'
              }`}
              style={{
                borderColor: selectedSpoke === spoke.id ? spoke.color : 'transparent',
                '--tw-ring-color': spoke.color
              } as React.CSSProperties}
            >
              <span className="text-xl">{spoke.icon}</span>
              <span className="font-medium">{spoke.name}</span>
              <span className={`text-sm font-bold ${getValueColor(spokeValues[spoke.id])}`}>
                {spokeValues[spoke.id]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* PDCA wheel and actions */}
      <div className="grid grid-cols-12 gap-6">
        {/* PDCA wheel */}
        <div className="col-span-5 bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-6 shadow-xl">
          <h4 className="font-bold text-gray-900 mb-4 text-center">PDCA-cykel för {SHANARRI_SPOKES.find(s => s.id === selectedSpoke)?.name}</h4>

          <div className="relative w-64 h-64 mx-auto">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {PDCA_PHASES.map((phase, idx) => {
                const startAngle = (idx * 90 - 90) * (Math.PI / 180);
                const endAngle = ((idx + 1) * 90 - 90) * (Math.PI / 180);
                const x1 = 100 + 80 * Math.cos(startAngle);
                const y1 = 100 + 80 * Math.sin(startAngle);
                const x2 = 100 + 80 * Math.cos(endAngle);
                const y2 = 100 + 80 * Math.sin(endAngle);
                const isActive = pdcaPhase === phase.id;

                return (
                  <g key={phase.id} onClick={() => setPdcaPhase(phase.id)} className="cursor-pointer">
                    <path
                      d={`M 100 100 L ${x1} ${y1} A 80 80 0 0 1 ${x2} ${y2} Z`}
                      fill={phase.color}
                      opacity={isActive ? 1 : 0.5}
                      className="transition-opacity duration-300"
                    />
                    <text
                      x={100 + 50 * Math.cos(startAngle + Math.PI / 4)}
                      y={100 + 50 * Math.sin(startAngle + Math.PI / 4)}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {phase.name}
                    </text>
                    {isActive && (
                      <circle
                        cx={100 + 50 * Math.cos(startAngle + Math.PI / 4)}
                        cy={100 + 50 * Math.sin(startAngle + Math.PI / 4)}
                        r="25"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        className="animate-pulse"
                      />
                    )}
                  </g>
                );
              })}
              <circle cx="100" cy="100" r="25" fill="white" />
              <text x="100" y="100" textAnchor="middle" dominantBaseline="middle" fontSize="20">
                {SHANARRI_SPOKES.find(s => s.id === selectedSpoke)?.icon}
              </text>
            </svg>
          </div>

          <div className="mt-4 p-4 bg-gray-50 rounded-xl">
            <h5 className="font-bold text-gray-900 mb-1">{PDCA_PHASES.find(p => p.id === pdcaPhase)?.name}</h5>
            <p className="text-sm text-gray-600">{PDCA_PHASES.find(p => p.id === pdcaPhase)?.description}</p>
          </div>
        </div>

        {/* Actions panel */}
        <div className="col-span-7 bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-6 shadow-xl">
          <h4 className="font-bold text-gray-900 mb-4">Förbättringsåtgärder</h4>

          <div className="space-y-4">
            {pdcaActions[selectedSpoke]?.map((action, idx) => (
              <div key={idx} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <span className="flex-1 text-gray-900">{action}</span>
                <button className="text-xs px-3 py-1.5 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                  Simulera effekt
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
            <h5 className="font-bold text-emerald-800 mb-2">Förväntad effekt</h5>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-900">{spokeValues[selectedSpoke]}</span>
                <ArrowRight className="w-5 h-5 text-gray-400" />
                <span className="text-2xl font-bold text-emerald-600">{Math.min(5, spokeValues[selectedSpoke] + 1)}</span>
              </div>
              <span className="text-sm text-gray-600">
                Om åtgärderna genomförs enligt plan inom 4-8 veckor
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Semantic Mode (Semantisk lekplats)
  const renderSemanticMode = () => (
    <div className="space-y-6">
      {/* Classification system selector */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-6 shadow-xl">
        <h3 className="font-bold text-gray-900 text-lg mb-4">Semantisk brygga - Utforska mappningar</h3>
        <div className="flex flex-wrap gap-3">
          {CLASSIFICATION_SYSTEMS.map((sys) => (
            <button
              key={sys.id}
              onClick={() => setSelectedClassification(sys.id)}
              className={`px-4 py-2 rounded-xl font-medium transition-all ${
                selectedClassification === sys.id
                  ? 'text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={{
                backgroundColor: selectedClassification === sys.id ? sys.color : undefined
              }}
            >
              {sys.name}
            </button>
          ))}
        </div>
      </div>

      {/* Mapping table */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-gray-900">
            {CLASSIFICATION_SYSTEMS.find(s => s.id === selectedClassification)?.fullName}
          </h4>
          <button
            onClick={() => setShowMappings(!showMappings)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            {showMappings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {showMappings ? 'Dölj detaljer' : 'Visa detaljer'}
          </button>
        </div>

        <div className="space-y-4">
          {SHANARRI_DATA.map((dim) => {
            const mappingValue = (dim as any)[selectedClassification] || 'Ingen mappning';

            return (
              <div key={dim.id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow"
                    style={{ backgroundColor: dim.color }}
                  >
                    {dim.name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900">{dim.name}</h5>
                    <p className="text-xs text-gray-500">{dim.nameEn}</p>
                  </div>
                </div>

                {showMappings && (
                  <div className="mt-3 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-start gap-2">
                      <GitBranch className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                      <div className="text-sm text-gray-700 font-mono break-all">
                        {mappingValue}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ICF Qualifier Sliders */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-bold text-gray-900">ICF-kvalifikatorer (0-4 skala)</h4>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Activity className="w-4 h-4" />
            <span>WHO ICF standardbedömning</span>
          </div>
        </div>

        <div className="space-y-4">
          {SHANARRI_SPOKES.map((spoke) => {
            const qualifier = icfQualifiers[spoke.id] ?? 0;
            const qualifierInfo = ICF_QUALIFIER_LABELS[qualifier];

            return (
              <div key={spoke.id} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{spoke.icon}</span>
                    <span className="font-medium text-gray-900">{spoke.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${qualifierInfo.color}`}>
                      {qualifier} - {qualifierInfo.label}
                    </span>
                    <span className="text-xs text-gray-500">{qualifierInfo.description}</span>
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="range"
                    min="0"
                    max="4"
                    step="1"
                    value={qualifier}
                    onChange={(e) => handleICFQualifierChange(spoke.id, parseInt(e.target.value))}
                    className="w-full h-3 rounded-full appearance-none cursor-pointer bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500"
                  />
                  <div className="flex justify-between mt-1 text-xs text-gray-400">
                    <span>0</span>
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded-xl">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-500 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">WHO ICF Qualifier Scale</p>
              <p>0=Inget problem (0-4%), 1=Lätt (5-24%), 2=Måttligt (25-49%), 3=Gravt (50-95%), 4=Totalt (96-100%)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mapping playground */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-6 text-white shadow-xl">
        <div className="flex items-start gap-4">
          <GitBranch className="w-8 h-8 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-lg mb-2">Semantisk integration</h4>
            <p className="text-white/90 text-sm">
              Denna vy visar hur skolans information kan mappas till nationella och internationella klassifikationssystem.
              Genom att experimentera med olika system kan du hitta meningsfulla kopplingar för samverkan mellan skola,
              vård och socialtjänst.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Data Minimization Mode
  const renderDataMinMode = () => (
    <div className="space-y-6">
      {/* Level selector */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-6 shadow-xl">
        <h3 className="font-bold text-gray-900 text-lg mb-4">Dataminimering vid nivåbyten</h3>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Nuvarande nivå</label>
            <div className="flex gap-3">
              {(['N1', 'N2', 'N3'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => {
                    setCurrentLevel(level);
                    updateDataVisibility(level);
                  }}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                    currentLevel === level
                      ? level === 'N1' ? 'bg-emerald-500 text-white' :
                        level === 'N2' ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Målnivå (vid eskalering)</label>
            <div className="flex gap-3">
              {(['N1', 'N2', 'N3'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setTargetLevel(level)}
                  className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                    targetLevel === level
                      ? level === 'N1' ? 'bg-emerald-500 text-white' :
                        level === 'N2' ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Data points visualization */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-6 shadow-xl">
          <h4 className="font-bold text-gray-900 mb-4">Datapunkter - {currentLevel}</h4>
          <div className="space-y-3">
            {Object.entries(visibleDataPoints).map(([key, visible]) => (
              <div
                key={key}
                className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                  visible ? 'bg-emerald-50' : 'bg-gray-50 opacity-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  {visible ? (
                    <Unlock className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Lock className="w-5 h-5 text-gray-400" />
                  )}
                  <span className={visible ? 'text-gray-900' : 'text-gray-500'}>
                    {key === 'wheelIndicators' ? 'Välbefinnandehjul (indikatorer)' :
                     key === 'trend' ? 'Trenddata (historik)' :
                     key === 'icfGap' ? 'ICF Gap-analys' :
                     key === 'environmentalFactors' ? 'Miljöfaktorer (risk/skydd)' :
                     key === 'riskFactors' ? 'Riskfaktorer' :
                     key === 'sipGoals' ? 'SIP-mål och insatser' :
                     'Detaljerade anteckningar'}
                  </span>
                </div>
                <button
                  onClick={() => setVisibleDataPoints(prev => ({ ...prev, [key]: !prev[key] }))}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    visible ? 'bg-emerald-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {visible ? 'Synlig' : 'Dold'}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-6 shadow-xl">
          <h4 className="font-bold text-gray-900 mb-4">Eskaleringsvy - {targetLevel}</h4>

          <div className="p-4 bg-amber-50 rounded-xl mb-4">
            <div className="flex items-center gap-2 text-amber-800 mb-2">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-bold">Simulerad eskalering {currentLevel} → {targetLevel}</span>
            </div>
            <p className="text-sm text-amber-700">
              Vid eskalering aktiveras ytterligare datapunkter för att ge en mer komplett bild.
            </p>
          </div>

          <div className="space-y-2">
            {targetLevel !== 'N1' && (
              <div className="flex items-center gap-2 text-emerald-700 p-2 bg-emerald-50 rounded-lg">
                <ArrowUpRight className="w-4 h-4" />
                <span className="text-sm">Trenddata aktiveras</span>
              </div>
            )}
            {targetLevel !== 'N1' && (
              <div className="flex items-center gap-2 text-emerald-700 p-2 bg-emerald-50 rounded-lg">
                <ArrowUpRight className="w-4 h-4" />
                <span className="text-sm">ICF Gap-analys aktiveras</span>
              </div>
            )}
            {targetLevel === 'N3' && (
              <>
                <div className="flex items-center gap-2 text-emerald-700 p-2 bg-emerald-50 rounded-lg">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="text-sm">Miljöfaktorer aktiveras</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-700 p-2 bg-emerald-50 rounded-lg">
                  <ArrowUpRight className="w-4 h-4" />
                  <span className="text-sm">SIP-mål och ansvar aktiveras</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Principle reminder */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl p-6 text-white shadow-xl">
        <div className="flex items-start gap-4">
          <Database className="w-8 h-8 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-lg mb-2">Dataminimeringsproincip</h4>
            <p className="text-white/90 text-sm">
              "Endast den data som behövs för aktuell nivå ska vara synlig. Vid eskalering 'tänds'
              ytterligare datapunkter stegvis. Detta skyddar barnets integritet samtidigt som rätt
              information finns tillgänglig för de som behöver den."
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Trend Mode
  const renderTrendMode = () => (
    <div className="space-y-6">
      {/* Trend direction selector */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-6 shadow-xl">
        <h3 className="font-bold text-gray-900 text-lg mb-4">Simulera trendriktning</h3>

        <div className="grid grid-cols-3 gap-4">
          {[
            { id: 'improving' as const, name: 'Förbättring', icon: TrendingUp, color: 'emerald' },
            { id: 'stable' as const, name: 'Stabil', icon: Minus, color: 'amber' },
            { id: 'declining' as const, name: 'Försämring', icon: TrendingDown, color: 'rose' },
          ].map((trend) => (
            <button
              key={trend.id}
              onClick={() => {
                setTrendDirection(trend.id);
                generateTrendSuggestions();
              }}
              className={`p-4 rounded-2xl border-2 transition-all ${
                trendDirection === trend.id
                  ? `border-${trend.color}-400 bg-${trend.color}-50 shadow-lg`
                  : 'border-gray-100 bg-white/50 hover:border-gray-200'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl bg-${trend.color}-500 flex items-center justify-center mb-3 mx-auto`}>
                <trend.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 text-center">{trend.name}</h4>
            </button>
          ))}
        </div>
      </div>

      {/* Current state + suggestions */}
      <div className="grid grid-cols-12 gap-6">
        {/* Current indicators */}
        <div className="col-span-6 bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-6 shadow-xl">
          <h4 className="font-bold text-gray-900 mb-4">Nuvarande indikatorer</h4>
          <div className="space-y-3">
            {SHANARRI_SPOKES.map((spoke) => {
              const value = spokeValues[spoke.id];
              const baseValue = baselineValues[spoke.id];
              const change = value - baseValue;

              return (
                <div key={spoke.id} className="flex items-center gap-3">
                  <span className="text-xl">{spoke.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">{spoke.name}</span>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${getValueColor(value)}`}>{value}</span>
                        {change !== 0 && (
                          <span className={`text-xs ${change > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {change > 0 ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${getValueBg(value)}`} style={{ width: `${(value / 5) * 100}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Suggested actions */}
        <div className="col-span-6 bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-6 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              trendDirection === 'improving' ? 'bg-emerald-500' :
              trendDirection === 'stable' ? 'bg-amber-500' : 'bg-rose-500'
            }`}>
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <h4 className="font-bold text-gray-900">AI-förslag baserat på trend</h4>
          </div>

          <div className="space-y-3">
            {suggestedActions.length > 0 ? suggestedActions.map((action, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  trendDirection === 'improving' ? 'bg-emerald-100 text-emerald-700' :
                  trendDirection === 'stable' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  {idx + 1}
                </div>
                <span className="text-gray-700">{action}</span>
              </div>
            )) : (
              <button
                onClick={generateTrendSuggestions}
                className="w-full p-4 bg-gray-50 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Klicka för att generera förslag
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Trend insight */}
      <div className={`rounded-3xl p-6 text-white shadow-xl ${
        trendDirection === 'improving' ? 'bg-gradient-to-r from-emerald-500 to-teal-500' :
        trendDirection === 'stable' ? 'bg-gradient-to-r from-amber-500 to-orange-500' :
        'bg-gradient-to-r from-rose-500 to-pink-500'
      }`}>
        <div className="flex items-start gap-4">
          <TrendingUp className="w-8 h-8 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-lg mb-2">
              {trendDirection === 'improving' ? 'Positiv utveckling' :
               trendDirection === 'stable' ? 'Stabil situation' : 'Varningssignaler'}
            </h4>
            <p className="text-white/90 text-sm">
              {trendDirection === 'improving'
                ? 'Trenden visar förbättring. Dokumentera vad som fungerar och fortsätt med nuvarande strategi.'
                : trendDirection === 'stable'
                ? 'Situationen är stabil men kräver fortsatt uppföljning. Överväg förebyggande åtgärder.'
                : 'Försämringstrend identifierad. Överväg att intensifiera insatser eller eskalera till nästa nivå.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Metrics Panel (reused across modes)
  const renderMetricsPanel = () => (
    <>
      {/* Recommended Level */}
      <div className={`bg-gradient-to-br ${getLevelGradient()} rounded-3xl p-8 shadow-xl text-white`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg opacity-90">Rekommenderad nivå</h3>
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
        </div>
        <div className="text-6xl font-black mb-2">{metrics.recommendedLevel}</div>
        <p className="text-white/80 text-sm">
          {metrics.recommendedLevel === 'N1' && 'Universell nivå - Inga riktade insatser'}
          {metrics.recommendedLevel === 'N2' && 'Stödprofil - Riktade insatser behövs'}
          {metrics.recommendedLevel === 'N3' && 'Samordning - SIP rekommenderas'}
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* ICF Gap */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 p-5 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900 text-sm">ICF Gap</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-3xl font-bold text-gray-900">{metrics.gapScore}</span>
              <span className="text-sm text-gray-500 ml-1">gap</span>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-emerald-600">{metrics.facilitatorScore}</span>
              <span className="text-xs text-gray-500 block">facilitatorer</span>
            </div>
          </div>
        </div>

        {/* Risk/Protection */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 p-5 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900 text-sm">Balans</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-3xl font-bold ${
              metrics.balance >= 0 ? 'text-emerald-600' : 'text-red-600'
            }`}>
              {metrics.balance >= 0 ? '+' : ''}{metrics.balance}
            </span>
            {metrics.balance >= 2 ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            ) : metrics.balance <= -2 ? (
              <AlertTriangle className="w-5 h-5 text-red-500" />
            ) : (
              <Minus className="w-5 h-5 text-amber-500" />
            )}
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Risk: {metrics.riskFactors} | Skydd: {metrics.protectionFactors}
          </div>
        </div>

        {/* Resilience Score */}
        <div className="col-span-2 bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 p-5 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center shadow-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900">Resilience Score</span>
            </div>
            <span className={`text-4xl font-black ${
              metrics.resilience >= 7 ? 'text-emerald-600' :
              metrics.resilience >= 5 ? 'text-amber-600' :
              metrics.resilience >= 3 ? 'text-orange-600' : 'text-red-600'
            }`}>
              {metrics.resilience}/10
            </span>
          </div>

          {/* Resilience bar */}
          <div className="relative h-4 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`absolute h-full rounded-full transition-all duration-500 ${
                metrics.resilience >= 7 ? 'bg-gradient-to-r from-emerald-400 to-teal-500' :
                metrics.resilience >= 5 ? 'bg-gradient-to-r from-amber-400 to-orange-500' :
                metrics.resilience >= 3 ? 'bg-gradient-to-r from-orange-400 to-red-500' :
                'bg-gradient-to-r from-red-500 to-rose-600'
              }`}
              style={{ width: `${metrics.resilience * 10}%` }}
            />
          </div>

          <p className="text-xs text-gray-500 mt-3">
            {metrics.resilience >= 7 ? 'Hög motståndskraft - Goda skyddsfaktorer' :
             metrics.resilience >= 5 ? 'Medelhög motståndskraft - Balanserad situation' :
             metrics.resilience >= 3 ? 'Låg motståndskraft - Förstärk skyddsfaktorer' :
             'Mycket låg motståndskraft - Akuta insatser behövs'}
          </p>
        </div>
      </div>

      {/* Average Score */}
      <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 p-5 shadow-lg">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-900">Genomsnitt SHANARRI</span>
          <span className={`text-2xl font-bold ${getValueColor(Math.round(metrics.average))}`}>
            {metrics.average.toFixed(1)}
          </span>
        </div>
        <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getValueBg(Math.round(metrics.average))}`}
            style={{ width: `${(metrics.average / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Statistics Summary */}
      <StatisticsSummary spokeValues={spokeValues} baselineValues={baselineValues} />

      {/* Insights */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full bg-white/70 backdrop-blur-xl rounded-2xl border border-white/50 p-5 shadow-lg hover:shadow-xl transition-all text-left"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900">Insikter & rekommendationer</span>
          </div>
          <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${showDetails ? 'rotate-90' : ''}`} />
        </div>

        {showDetails && (
          <div className="mt-4 space-y-3">
            {metrics.gapScore > 0 && (
              <div className="flex items-start gap-3 p-3 bg-red-50 rounded-xl">
                <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
                <p className="text-sm text-red-700">
                  {metrics.gapScore} ekrar visar stora gap (≤2). Dessa områden behöver prioriteras.
                </p>
              </div>
            )}

            {metrics.balance < 0 && (
              <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl">
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5" />
                <p className="text-sm text-amber-700">
                  Riskfaktorer dominerar. Fokusera på att stärka skyddsfaktorer.
                </p>
              </div>
            )}

            {metrics.facilitatorScore >= 5 && (
              <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />
                <p className="text-sm text-emerald-700">
                  {metrics.facilitatorScore} starka ekrar (≥4). Bygg vidare på dessa styrkor.
                </p>
              </div>
            )}

            {metrics.totalChange !== 0 && (
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl">
                {metrics.totalChange > 0 ? (
                  <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-blue-500 mt-0.5" />
                )}
                <p className="text-sm text-blue-700">
                  Total förändring från baseline: {metrics.totalChange > 0 ? '+' : ''}{metrics.totalChange} poäng
                </p>
              </div>
            )}
          </div>
        )}
      </button>
    </>
  );

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getLevelBgGradient()}`}>
      <div className="max-w-7xl mx-auto space-y-8 py-8 px-4">
        {/* Decorative background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-20 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-violet-200/20 to-purple-200/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-200/20 to-blue-200/20 blur-3xl" />
        </div>

        {/* Header */}
        <div className="text-center py-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br ${getLevelGradient()} text-white mb-6 shadow-2xl shadow-violet-200/50 transform hover:scale-105 transition-transform duration-300`}>
            <Sparkles className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3 tracking-tight">
            Improviserad Scenariogenerator
          </h1>
          <p className="text-gray-500 text-lg font-light tracking-wide">
            "Tänk om..." • Interaktiv simulering • SHANARRI × ICF × Resilience
          </p>
        </div>

        {/* Escalation Alert - triggered when level change is recommended */}
        {showEscalationAlert && (
          <EscalationAlert
            currentLevel={currentLevel}
            suggestedLevel={metrics.recommendedLevel}
            reasons={escalationReasons}
            onConfirm={handleEscalationConfirm}
            onDismiss={handleEscalationDismiss}
          />
        )}

        {/* Mode tabs */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-4 shadow-xl">
          <div className="flex flex-wrap gap-2">
            {IMPROVISATION_MODES.map((mode) => {
              const isActive = activeMode === mode.id;
              return (
                <button
                  key={mode.id}
                  onClick={() => setActiveMode(mode.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                    isActive
                      ? `bg-${mode.color}-100 text-${mode.color}-700 shadow-sm ring-2 ring-${mode.color}-200`
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  }`}
                >
                  <mode.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{mode.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-8 shadow-xl shadow-gray-100/50 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-200/50">
              <Info className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-3 text-lg">
                {activeMode === 'scenario' && 'Scenarioskiss - Dra i ekrarna'}
                {activeMode === 'perspective' && 'Roll-improvisation - Byt perspektiv'}
                {activeMode === 'lifecycle' && 'Framåtblick - Projicera över livsfaser'}
                {activeMode === 'pdca' && 'PDCA-mikroloop - Förbättring per dimension'}
                {activeMode === 'semantic' && 'Semantisk lekplats - Utforska mappningar'}
                {activeMode === 'datamin' && 'Dataminimering - Simulera nivåbyten'}
                {activeMode === 'trend' && 'Trendanalys - Datadriven improvisation'}
              </h3>
              <p className="text-sm text-gray-600">
                {activeMode === 'scenario' && 'Justera SHANARRI-ekrarna och se hur ICF-gap, risk/skydd-balans och Resilience Matrix påverkas i realtid.'}
                {activeMode === 'perspective' && 'Simulera hur barn, vårdnadshavare och professionella kan uppfatta situationen olika. Identifiera avvikelser som kräver dialog.'}
                {activeMode === 'lifecycle' && 'Projicera barnets situation framåt i tiden för att identifiera potentiella utmaningar vid övergångar och planera förebyggande.'}
                {activeMode === 'pdca' && 'Välj en dimension och planera små förbättringsåtgärder genom PDCA-cykeln. Se förväntad effekt på trenden.'}
                {activeMode === 'semantic' && 'Utforska hur skolans information mappas till nationella klassifikationssystem som ICF, KSI, BBIC och SNOMED CT.'}
                {activeMode === 'datamin' && 'Simulera vilka datapunkter som "tänds" vid eskalering mellan nivåer. Förstå dataminimeringsprincipen i praktiken.'}
                {activeMode === 'trend' && 'Baserat på trendsignaler (förbättring/stabil/försämring) genereras förslag på nästa åtgärd.'}
              </p>
            </div>
          </div>
        </div>

        {/* Preset Scenarios (only for scenario mode) */}
        {activeMode === 'scenario' && (
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/50 p-8 shadow-xl shadow-gray-100/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-gray-900 text-lg">Snabbval: Scenarion</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsAnimating(!isAnimating)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isAnimating
                      ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isAnimating ? 'Animering på' : 'Animering av'}
                </button>
                <button
                  onClick={resetValues}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                >
                  <RotateCcw className="w-4 h-4" />
                  Återställ
                </button>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-4">
              {SCENARIO_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-300 text-left hover:shadow-lg hover:-translate-y-1 ${
                    selectedPreset === preset.id
                      ? `border-${preset.color}-400 bg-${preset.color}-50 shadow-md`
                      : 'border-gray-100 bg-white/50 hover:border-gray-200'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-${preset.color}-400 to-${preset.color}-500 flex items-center justify-center mb-3 shadow-lg`}>
                    <span className="text-white text-lg font-bold">
                      {preset.id.startsWith('n') ? preset.name.slice(0, 2) : preset.name.charAt(0)}
                    </span>
                  </div>
                  <h4 className="font-semibold text-gray-900 text-sm mb-1">{preset.name}</h4>
                  <p className="text-xs text-gray-500 line-clamp-2">{preset.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        {renderModeContent()}

        {/* Footer */}
        <div className="text-center py-6">
          <p className="text-sm text-gray-400 font-light tracking-wide">
            Improviserad Scenariogenerator • SHANARRI × ICF × Resilience Matrix × PDCA • 7 improvisationslägen
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScenarioGenerator;
