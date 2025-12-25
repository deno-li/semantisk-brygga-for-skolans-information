/**
 * ICF Demo Profiles
 * Example children from the WHO ICF guide with complete ICF assessments
 * Demonstrates Performance vs Capacity, Environmental Factors, and Gap Analysis
 */

import {
  ICFAssessment,
  EnvironmentalFactor,
  GapTrend,
  GapTrendPoint,
  RiskProtectionBalance
} from '../types/icf-types';

// ==========================================
// ELSA, 10 år - Exempel från guiden
// ==========================================

/**
 * Elsa har stora svårigheter med läsning och skrivning trots att
 * skolan har infört bildstöd i all undervisning. Det hjälper något men
 * hon är fortfarande mycket efter sina klasskamrater. Hon använder
 * lugnrum 2-3 gånger per vecka när klassrummet blir för högljutt.
 * Hennes föräldrar är mycket engagerade och stöttar hemma med läxor
 * varje dag.
 */

// ICF Assessments för Elsa
export const ELSA_ICF_ASSESSMENTS: ICFAssessment[] = [
  // EKER 3: LÄRANDE - d140 Lära sig läsa
  {
    code: 'd140',
    domain: 'Lära sig läsa',

    // Capacity (utan bildstöd): Stora svårigheter
    capacity: {
      value: 3,
      description: 'Stora svårigheter'
    },

    // Performance (med bildstöd): Måttliga svårigheter
    performance: {
      value: 2,
      description: 'Måttliga svårigheter'
    },

    // Gap-analys
    gap: -1,  // Performance (2) - Capacity (3) = -1
    gapInterpretation: 'facilitators-work',  // Bildstöd FUNGERAR!

    // Metadata
    assessedDate: '2025-01-15',
    assessedBy: 'elementary-school',
    timeSpan: 'Senaste 4 veckorna',
    context: 'school',
    source: 'assessment',

    notes: 'Läser enstaka ord utan stöd, men med bildstöd läser enkla texter med förståelse. Bildstöd har tydlig positiv effekt.'
  },

  // EKER 3: LÄRANDE - d150 Lära sig skriva
  {
    code: 'd150',
    domain: 'Lära sig skriva',

    capacity: {
      value: 3,
      description: 'Stora svårigheter'
    },

    performance: {
      value: 3,
      description: 'Stora svårigheter'
    },

    gap: 0,  // Inga anpassningar för skrivning än
    gapInterpretation: 'neutral',

    assessedDate: '2025-01-15',
    assessedBy: 'elementary-school',
    timeSpan: 'Senaste 4 veckorna',
    context: 'school',
    source: 'assessment',

    notes: 'Skrivning är fortfarande mycket utmanande. Behöver utökat stöd även här.'
  },

  // EKER 1: HÄLSA - b134 Sömnfunktioner
  {
    code: 'b134',
    domain: 'Sömnfunktioner',

    capacity: {
      value: 2,
      description: 'Måttliga svårigheter'
    },

    performance: {
      value: 1,
      description: 'Lätta svårigheter'
    },

    gap: -1,  // Kvällsrutiner + melatonin hjälper
    gapInterpretation: 'facilitators-work',

    assessedDate: '2025-01-15',
    assessedBy: 'healthcare',
    timeSpan: 'Senaste 2 veckorna',
    context: 'home',
    source: 'parent-report',

    notes: 'Svårt somna, vaken 2-3 ggr/natt utan stöd. Med kvällsrutiner och melatonin: somnar lättare, vaknar 1 gång/natt.'
  },

  // EKER 2: TRYGGHET - d240 Hantera stress
  {
    code: 'd240',
    domain: 'Hantera stress',

    capacity: {
      value: 2,
      description: 'Måttliga svårigheter'
    },

    performance: {
      value: 1,
      description: 'Lätta svårigheter'
    },

    gap: -1,  // Lugnrum hjälper
    gapInterpretation: 'facilitators-work',

    assessedDate: '2025-01-15',
    assessedBy: 'elementary-school',
    timeSpan: 'Senaste 4 veckorna',
    context: 'school',
    source: 'observation',

    notes: 'Använder lugnrum 2-3 ggr/vecka när klassrummet blir för högljutt. Detta hjälper Elsa att reglera stress.'
  }
];

// Environmental Factors för Elsa
export const ELSA_ENVIRONMENTAL_FACTORS: EnvironmentalFactor[] = [
  // FACILITATORS (Skyddsfaktorer)
  {
    code: 'e1301',
    domain: 'Läromedel för utbildning (Bildstöd)',
    type: 'facilitator',
    level: 1,  // Lätt underlättare
    description: 'Bildstöd i all undervisning hjälper Elsa läsa enkla texter med förståelse',
    relatedSpokes: ['larande'],
    identifiedDate: '2024-09-01',
    identifiedBy: 'elementary-school',
    context: 'school',
    status: 'active',
    notes: 'Infört hösten 2024, tydlig positiv effekt'
  },

  {
    code: 'e330',
    domain: 'Specialpedagog Maria',
    type: 'facilitator',
    level: 2,  // Måttlig underlättare
    description: 'Specialpedagog Maria ger individuellt stöd 3h/vecka',
    relatedSpokes: ['larande', 'trygg'],
    identifiedDate: '2024-09-01',
    identifiedBy: 'elementary-school',
    context: 'school',
    status: 'active',
    notes: 'Maria är en viktig trygg vuxen för Elsa'
  },

  {
    code: 'e585',
    domain: 'Skolan - Lugnrum',
    type: 'facilitator',
    level: 1,  // Lätt underlättare
    description: 'Tillgång till lugnrum vid behov, används 2-3 ggr/vecka',
    relatedSpokes: ['trygg', 'larande'],
    identifiedDate: '2024-09-01',
    identifiedBy: 'elementary-school',
    context: 'school',
    status: 'active'
  },

  {
    code: 'e310',
    domain: 'Närmaste familjen',
    type: 'facilitator',
    level: 3,  // Betydande underlättare
    description: 'Engagerade föräldrar, stöttar hemma med läxor varje dag',
    relatedSpokes: ['larande', 'trygg', 'hemmet'],
    identifiedDate: '2024-09-01',
    identifiedBy: 'elementary-school',
    context: 'home',
    status: 'active',
    notes: 'Föräldrarna är mycket engagerade och ger starkt stöd'
  },

  {
    code: 'e1101',
    domain: 'Läkemedel (Melatonin)',
    type: 'facilitator',
    level: 1,  // Lätt underlättare
    description: 'Melatonin hjälper något med insomning',
    relatedSpokes: ['halsa'],
    identifiedDate: '2024-11-01',
    identifiedBy: 'healthcare',
    context: 'home',
    status: 'active'
  },

  // BARRIERS (Riskfaktorer)
  {
    code: 'e250',
    domain: 'Ljud (fysisk miljö)',
    type: 'barrier',
    level: 1,  // Lätt barriär
    description: 'Klassrum kan bli för högljutt, sensorisk överkänslighet',
    relatedSpokes: ['larande', 'trygg'],
    identifiedDate: '2024-09-01',
    identifiedBy: 'elementary-school',
    context: 'school',
    status: 'monitoring',
    notes: 'Lugnrum används som kompensation'
  }
];

// Risk/Skydd-balans för Elsa
export const ELSA_RISK_PROTECTION_BALANCE: RiskProtectionBalance = {
  barriers: ELSA_ENVIRONMENTAL_FACTORS.filter(ef => ef.type === 'barrier'),
  facilitators: ELSA_ENVIRONMENTAL_FACTORS.filter(ef => ef.type === 'facilitator'),

  riskScore: 1,  // .1
  protectionScore: 8,  // +1+2+1+3+1
  balance: 7,  // 8 - 1 = +7

  interpretation: 'protection-dominates',

  spokeBalances: [
    {
      spoke: 'larande',
      riskScore: 1,  // e250
      protectionScore: 4,  // e1301(+1) + e330(+2) + e585(+1)
      balance: 3
    },
    {
      spoke: 'trygg',
      riskScore: 1,  // e250
      protectionScore: 3,  // e330(+2) + e585(+1)
      balance: 2
    },
    {
      spoke: 'halsa',
      riskScore: 0,
      protectionScore: 1,  // e1101(+1)
      balance: 1
    },
    {
      spoke: 'hemmet',
      riskScore: 0,
      protectionScore: 3,  // e310(+3)
      balance: 3
    }
  ]
};

// Longitudinell gap-trend för Elsa (12 månader)
export const ELSA_GAP_TREND_LEARNING: GapTrend = {
  icfCode: 'd140',
  domain: 'Lära sig läsa',

  dataPoints: [
    {
      date: '2024-01-15',
      capacity: 3,
      performance: 3,
      gap: 0,
      activeInterventions: [],  // Inga anpassningar än
      assessedBy: 'elementary-school'
    },
    {
      date: '2024-04-15',
      capacity: 3,
      performance: 2,
      gap: -1,
      activeInterventions: ['Bildstöd infört', 'Specialpedagog 3h/vecka', 'Lugnrum'],
      assessedBy: 'elementary-school'
    },
    {
      date: '2024-07-15',
      capacity: 2,
      performance: 2,
      gap: 0,
      activeInterventions: ['Bildstöd', 'Specialpedagog', 'Lugnrum'],
      assessedBy: 'elementary-school'
    },
    {
      date: '2025-01-15',
      capacity: 2,
      performance: 1,
      gap: -1,
      activeInterventions: ['Bildstöd', 'Specialpedagog', 'Lugnrum', 'Utökat bildstöd'],
      assessedBy: 'elementary-school'
    }
  ],

  trend: 'improving',
  startDate: '2024-01-15',
  endDate: '2025-01-15',

  interpretation: 'Systematiska anpassningar har haft KRAFTIG effekt. Över 12 mån: Performance 3→1 (2 steg förbättring!), Capacity också förbättrad: 3→2 (1 steg). Fortsatt stöd nödvändigt men avtrappning möjlig inom 6 månader.'
};

// ==========================================
// Sammanställning för export
// ==========================================

export const ELSA_PROFILE = {
  name: 'Elsa Andersson',
  age: 10,
  grade: 'Åk 5',
  schoolYear: '2024/2025',
  level: 'N2' as const,  // Fördjupad analys

  // ICF-data
  icfAssessments: ELSA_ICF_ASSESSMENTS,
  environmentalFactors: ELSA_ENVIRONMENTAL_FACTORS,
  riskProtectionBalance: ELSA_RISK_PROTECTION_BALANCE,

  // Longitudinell data
  gapTrends: {
    learning: ELSA_GAP_TREND_LEARNING
  },

  // Sammanfattning
  summary: {
    primaryConcerns: ['Lärande (läsning och skrivning)'],
    strengths: ['Starkt familjestöd', 'Engagerad specialpedagog', 'Fungerande anpassningar'],
    interventionsWorking: true,
    nextSteps: [
      'Fortsätt bildstöd (fungerar!)',
      'Överväg utökat bildstöd (e1301: +1→+2)',
      'Förstärk tillgång till lugnrum (e250: 1→0)',
      'Uppföljning om 3 månader: Sträva efter d140.2→d140.1'
    ]
  },

  // Barnets röst
  childsVoice: {
    goals: 'Jag vill bli bättre på att läsa så att jag kan läsa samma böcker som mina kompisar. Och jag vill ha någon att leka med på rasterna.',
    howFeeling: 'Det är jobbigt att inte kunna läsa som alla andra, men Maria (specialläraren) är jättesnäll och hjälper mig. Bilderna i böckerna hjälper mig förstå bättre.',
    whatHelps: 'När det blir för högljutt går jag till lugnrummet. Då blir jag lugn igen. Mamma och pappa hjälper mig med läxor hemma varje dag.'
  }
};

// ==========================================
// Ytterligare demo-profiler (placeholders)
// ==========================================

// Mira, 8 år - Social färdighetsträning
export const MIRA_PROFILE = {
  name: 'Mira Hassan',
  age: 8,
  grade: 'Åk 2',
  level: 'N2' as const,
  // TODO: Implementera komplett profil enligt guiden
};

// Kevin, 12 år - Trygghet hemma vs skola
export const KEVIN_PROFILE = {
  name: 'Kevin Johansson',
  age: 12,
  grade: 'Åk 6',
  level: 'N2' as const,
  // TODO: Implementera komplett profil enligt guiden
};

// Export alla profiler
export const ICF_DEMO_PROFILES = {
  elsa: ELSA_PROFILE,
  mira: MIRA_PROFILE,
  kevin: KEVIN_PROFILE
};
