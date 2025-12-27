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
// LISA J., 12 år - Befintlig profil från systemet
// ==========================================

/**
 * Lisa J. har stödprofil med stödsamtal och social träning.
 * Hon har stora svårigheter med läsning och skrivning trots att
 * skolan har infört bildstöd i all undervisning. Det hjälper något men
 * hon är fortfarande mycket efter sina klasskamrater. Hon använder
 * lugnrum 2-3 gånger per vecka när klassrummet blir för högljutt.
 * Hennes föräldrar är mycket engagerade och stöttar hemma med läxor
 * varje dag.
 */

// ICF Assessments för Lisa
export const LISA_ICF_ASSESSMENTS: ICFAssessment[] = [
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

    notes: 'Använder lugnrum 2-3 ggr/vecka när klassrummet blir för högljutt. Detta hjälper Lisa att reglera stress.'
  }
];

// Environmental Factors för Lisa
export const LISA_ENVIRONMENTAL_FACTORS: EnvironmentalFactor[] = [
  // FACILITATORS (Skyddsfaktorer)
  {
    code: 'e1301',
    domain: 'Läromedel för utbildning (Bildstöd)',
    type: 'facilitator',
    level: 1,  // Lätt underlättare
    description: 'Bildstöd i all undervisning hjälper Lisa läsa enkla texter med förståelse',
    relatedSpokes: ['larande'],
    identifiedDate: '2024-09-01',
    identifiedBy: 'elementary-school',
    context: 'school',
    status: 'active',
    notes: 'Infört hösten 2024, tydlig positiv effekt'
  },

  {
    code: 'e330',
    domain: 'Kurator och specialpedagog',
    type: 'facilitator',
    level: 2,  // Måttlig underlättare
    description: 'Stödsamtal och social träning 3h/vecka',
    relatedSpokes: ['larande', 'trygg', 'relationer'],
    identifiedDate: '2024-09-01',
    identifiedBy: 'elementary-school',
    context: 'school',
    status: 'active',
    notes: 'Del av Lisas stödprofil'
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

// Risk/Skydd-balans för Lisa
export const LISA_RISK_PROTECTION_BALANCE: RiskProtectionBalance = {
  barriers: LISA_ENVIRONMENTAL_FACTORS.filter(ef => ef.type === 'barrier'),
  facilitators: LISA_ENVIRONMENTAL_FACTORS.filter(ef => ef.type === 'facilitator'),

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

// Longitudinell gap-trend för Lisa (12 månader)
export const LISA_GAP_TREND_LEARNING: GapTrend = {
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

export const LISA_PROFILE = {
  name: 'Lisa J.',
  age: 12,
  grade: 'Åk 6',
  schoolYear: '2024/2025',
  level: 'N2' as const,  // Fördjupad analys (Stödprofil)

  // ICF-data
  icfAssessments: LISA_ICF_ASSESSMENTS,
  environmentalFactors: LISA_ENVIRONMENTAL_FACTORS,
  riskProtectionBalance: LISA_RISK_PROTECTION_BALANCE,

  // Longitudinell data
  gapTrends: {
    learning: LISA_GAP_TREND_LEARNING
  },

  // Sammanfattning
  summary: {
    primaryConcerns: ['Lärande (läsning och skrivning)', 'Social träning'],
    strengths: ['Starkt familjestöd', 'Stödsamtal och social träning', 'Fungerande anpassningar'],
    interventionsWorking: true,
    nextSteps: [
      'Fortsätt bildstöd (fungerar!)',
      'Fortsätt social träning med kurator',
      'Överväg utökat bildstöd (e1301: +1→+2)',
      'Förstärk tillgång till lugnrum (e250: 1→0)',
      'Uppföljning om 3 månader: Sträva efter d140.2→d140.1'
    ]
  },

  // Barnets röst
  childsVoice: {
    goals: 'Jag vill bli bättre på att läsa så att jag kan läsa samma böcker som mina kompisar. Och jag vill ha fler kompisar att umgås med på rasterna.',
    howFeeling: 'Det är jobbigt att inte kunna läsa som alla andra, men kuratorn och specialläraren hjälper mig mycket. Bilderna i böckerna hjälper mig förstå bättre. Social träning hjälper mig våga prata med nya kompisar.',
    whatHelps: 'När det blir för högljutt går jag till lugnrummet. Då blir jag lugn igen. Mamma och pappa hjälper mig med läxor hemma varje dag. Och samtalen med kuratorn hjälper mig att våga mer.'
  }
};

// ==========================================
// ELSA BERGSTRÖM, 10 år - From WHO ICF Beginner's Guide page 7
// ==========================================

/**
 * Elsa, 10 år - Example from WHO ICF Beginner's Guide
 * Has dyslexia and uses adapted materials. Shows how facilitators
 * (assistive technology, supportive family) reduce the gap between
 * performance and capacity.
 */

import { ICFChildProfile } from '../types/icf-types';

export const ELSA_PROFILE: ICFChildProfile = {
  // Basic profile
  name: "Elsa Bergström",
  ssn: "DEMO-ELSA-B",
  age: 10,
  school: "Stigslundsskolan",
  grade: "Åk 4",
  sipActive: true,
  journeyLevel: 'N2',
  
  sipGoal: {
    child: "Jag vill kunna läsa böcker som mina kompisar läser och slippa vara rädd i skolan.",
    professional: "Elsa ska uppnå läsförmåga motsvarande åk 3-nivå och uppleva trygghet i skolmiljön senast juni 2026."
  },
  
  // ICF Assessments with Performance vs Capacity
  icfAssessments: [
    {
      code: 'd140',
      domain: 'Lära sig läsa',
      performance: { value: 2, description: 'Måttliga svårigheter (med ljudbok + bildstöd)' },
      capacity: { value: 3, description: 'Stora svårigheter (utan anpassningar)' },
      gap: -1,  // Negative = facilitators work!
      gapInterpretation: 'facilitators-work',
      assessedDate: '2025-11-15',
      assessedBy: 'elementary-school',
      timeSpan: 'Senaste 4 veckor',
      context: 'school',
      source: 'observation',
      notes: 'Ljudböcker och bildstöd fungerar bra. Elsa deltar aktivt när material är anpassat.'
    },
    {
      code: 'd350',
      domain: 'Konversation',
      performance: { value: 1, description: 'Lätta svårigheter' },
      capacity: { value: 1, description: 'Lätta svårigheter' },
      gap: 0,
      gapInterpretation: 'neutral',
      assessedDate: '2025-11-15',
      assessedBy: 'elementary-school',
      timeSpan: 'Senaste 4 veckor',
      context: 'school',
      source: 'observation'
    },
    {
      code: 'd160',
      domain: 'Fokusera uppmärksamhet',
      performance: { value: 2, description: 'Måttliga svårigheter' },
      capacity: { value: 2, description: 'Måttliga svårigheter' },
      gap: 0,
      gapInterpretation: 'neutral',
      assessedDate: '2025-11-15',
      assessedBy: 'elementary-school',
      timeSpan: 'Senaste 4 veckor',
      context: 'school',
      source: 'observation',
      notes: 'Kan koncentrera sig med strukturerat stöd'
    }
  ],
  
  // Environmental Factors - Barriers and Facilitators
  environmentalFactors: [
    // FACILITATORS (+)
    {
      code: 'e1301',
      domain: 'Läromedel för utbildning',
      type: 'facilitator',
      level: 3,  // +3 = Betydande underlättare
      description: 'Inlästa böcker via Legimus + digitala läromedel',
      relatedSpokes: ['larande'],
      identifiedDate: '2025-09-01',
      identifiedBy: 'elementary-school',
      context: 'school',
      status: 'active'
    },
    {
      code: 'e310',
      domain: 'Närmaste familjen',
      type: 'facilitator',
      level: 2,  // +2 = Måttlig underlättare
      description: 'Stöttande föräldrar som följer upp läxor',
      relatedSpokes: ['halsa', 'trygg', 'larande'],
      identifiedDate: '2025-09-01',
      identifiedBy: 'elementary-school',
      context: 'home',
      status: 'active'
    },
    {
      code: 'e585',
      domain: 'Utbildnings- och träningstjänster',
      type: 'facilitator',
      level: 2,  // +2 = Måttlig underlättare
      description: 'Specialpedagog 2 tim/vecka med fokus på läsning',
      relatedSpokes: ['larande'],
      identifiedDate: '2025-09-01',
      identifiedBy: 'elementary-school',
      context: 'school',
      status: 'active'
    },
    
    // BARRIERS (.)
    {
      code: 'e250',
      domain: 'Ljud (fysisk miljö)',
      type: 'barrier',
      level: 2,  // .2 = Måttlig barriär
      description: 'Hög ljudnivå i klassrummet och korridorer stressar Elsa',
      relatedSpokes: ['larande', 'trygg'],
      identifiedDate: '2025-09-15',
      identifiedBy: 'elementary-school',
      context: 'school',
      status: 'active'
    },
    {
      code: 'e460',
      domain: 'Samhälleliga attityder',
      type: 'barrier',
      level: 1,  // .1 = Lätt barriär
      description: 'Viss oro för att andra barn inte förstår hennes läsutmaningar',
      relatedSpokes: ['respekterad', 'inkluderad'],
      identifiedDate: '2025-09-15',
      identifiedBy: 'elementary-school',
      context: 'school',
      status: 'monitoring'
    }
  ],
  
  // Risk/Protection Balance
  overallGap: -0.33,  // Overall, facilitators are working (average gap: -1, 0, 0)
  riskProtectionBalance: 4  // Barriers: 2+1=3, Facilitators: 3+2+2=7, Balance: 7-3=+4
};

// Complete Elsa profile with same structure as LISA_PROFILE for ICFDemo component
export const ELSA_COMPLETE_PROFILE = {
  name: 'Elsa Bergström',
  age: 10,
  grade: 'Åk 4',
  schoolYear: '2024/2025',
  level: 'N2' as const,

  // ICF-data
  icfAssessments: ELSA_PROFILE.icfAssessments,
  environmentalFactors: ELSA_PROFILE.environmentalFactors,
  riskProtectionBalance: {
    barriers: ELSA_PROFILE.environmentalFactors.filter(ef => ef.type === 'barrier'),
    facilitators: ELSA_PROFILE.environmentalFactors.filter(ef => ef.type === 'facilitator'),
    riskScore: 3,  // 2+1
    protectionScore: 7,  // 3+2+2
    balance: 4,  // 7-3
    interpretation: 'protection-dominates' as const,
    spokeBalances: [
      {
        spoke: 'larande',
        riskScore: 2,
        protectionScore: 7,  // 3+2+2
        balance: 5
      },
      {
        spoke: 'trygg',
        riskScore: 2,
        protectionScore: 2,
        balance: 0
      },
      {
        spoke: 'halsa',
        riskScore: 0,
        protectionScore: 2,
        balance: 2
      }
    ]
  },

  // Sammanfattning
  summary: {
    primaryConcerns: ['Läsning (dyslexi)', 'Koncentration', 'Ljudkänslighet'],
    strengths: ['Stöttande familj', 'Fungerande anpassningar', 'God motivation'],
    interventionsWorking: true,
    nextSteps: [
      'Fortsätt ljudböcker och bildstöd (fungerar!)',
      'Fortsätt specialpedagogstöd 2h/vecka',
      'Överväg hörselskydd för klassrum',
      'Uppföljning om 3 månader'
    ]
  },

  // Barnets röst
  childsVoice: {
    goals: 'Jag vill kunna läsa böcker som mina kompisar läser och slippa vara rädd i skolan.',
    howFeeling: 'Det är svårt att läsa, men när jag får lyssna på ljudböcker och se bilder förstår jag mycket bättre. Ibland blir det för högt i klassrummet och då har jag svårt att koncentrera mig.',
    whatHelps: 'Ljudböckerna hjälper jätteme mycket! Och när läraren visar bilder. Mina föräldrar hjälper mig hemma också. Specialläraren är jättesnäll.'
  }
};

// ==========================================
// Ytterligare demo-profiler (använd befintliga)
// ==========================================

// Erik A., 15 år - Universell nivå (Placeholder för N1 demo)
export const ERIK_PROFILE = {
  name: 'Erik A.',
  age: 15,
  grade: 'Åk 9',
  level: 'N1' as const,
  // N1 screening-data implementeras i N1Screening-komponenten
};

// Omar H., 11 år - Tidig uppmärksamhet (Placeholder)
export const OMAR_PROFILE = {
  name: 'Omar H.',
  age: 11,
  grade: 'Åk 5',
  level: 'N1' as const,
  // TODO: Implementera om behövs
};

// Sofia B., 16 år - Samordningsnivå (Placeholder för N3)
export const SOFIA_PROFILE = {
  name: 'Sofia B.',
  age: 16,
  grade: 'TE 1',
  level: 'N3' as const,
  // TODO: N3 samordnad plan implementeras senare
};

// Export alla profiler
export const ICF_DEMO_PROFILES = {
  lisa: LISA_PROFILE,
  elsa: ELSA_COMPLETE_PROFILE,
  erik: ERIK_PROFILE,
  omar: OMAR_PROFILE,
  sofia: SOFIA_PROFILE
};
