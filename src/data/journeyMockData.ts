/**
 * Mock data för Barnets Resa Journey Profiles
 * Demonstrerar de tre nivåerna med realistisk data
 */

import {
  JourneyProfile,
  WelfareWheelSpokeData,
  EscalationTrigger,
  JourneyLevelChange,
  SupportPlanData,
  CoordinationPlanData
} from '../types/types';

// ==========================================
// Erik - Universell nivå (allt går bra)
// ==========================================

const erikWelfareWheel: WelfareWheelSpokeData[] = [
  {
    spoke: 'trygg',
    name: 'TRYGG',
    childIndicator: 'Jag känner mig trygg',
    guardianIndicator: 'Mitt barn är tryggt',
    professionalIndicator: 'Trygghetsmarkör/trend',
    icfDomains: ['b152', 'd240', 'e3/e4/e5'],
    ksiTargets: ['Target: psykosocial miljö', 'Action: bedömning/stödsamtal/miljöanpassning', 'Means: individ/grupp/samverkansmöte'],
    snomedCT: 'Känsla av trygghet',
    ss12000Source: ['Trygghetsenkät', 'Incident', 'Frånvaro', 'Elevhälsokontakt'],
    status: 5,
    history: [
      { date: '2025-08-15', value: 5, source: 'elementary-school', measurement: 'survey' },
      { date: '2025-11-20', value: 5, source: 'elementary-school', measurement: 'survey' }
    ]
  },
  {
    spoke: 'halsa',
    name: 'HÄLSA / MÅ BRA',
    childIndicator: 'Jag mår bra',
    guardianIndicator: 'Hälsa fungerar i vardagen',
    professionalIndicator: 'Frånvarotrend eller hälsosamtal gjort',
    icfDomains: ['b130', 'b134', 'b152', 'd570', 'e-faktorer'],
    ksiTargets: ['Target: hälsa/egenvård', 'Action: råd/uppföljning', 'Means: individ/digitalt'],
    ss12000Source: ['EMI-hälsobesök', 'Elevhälsosamtal', 'Frånvaro'],
    status: 4,
    history: [
      { date: '2025-09-01', value: 4, source: 'student-health', measurement: 'assessment' },
      { date: '2025-12-10', value: 4, source: 'student-health', measurement: 'assessment' }
    ]
  },
  {
    spoke: 'utvecklas',
    name: 'UTVECKLAS',
    childIndicator: 'Jag hänger med',
    guardianIndicator: 'Utvecklas i sin takt',
    professionalIndicator: 'Risk för ej nå mål (ja/nej)',
    icfDomains: ['d1/d8', 'b140–b144', 'e-faktorer (lärmiljö)'],
    ksiTargets: ['Target: utbildning/lärande', 'Action: undervisning/anpassning/färdighetsträning', 'Means: klass/grupp/1:1'],
    ss12000Source: ['Extra anpassningar', 'Åtgärdsprogram', 'Prov/betyg'],
    status: 4,
    history: [
      { date: '2025-10-15', value: 4, source: 'elementary-school', measurement: 'observation' }
    ]
  },
  {
    spoke: 'larande',
    name: 'LÄRANDE',
    childIndicator: 'Jag får hjälp när jag behöver',
    guardianIndicator: 'Skolan anpassar',
    professionalIndicator: 'Anpassningar aktiva (ja/nej)',
    icfDomains: ['d155–d179', 'd820', 'e-faktorer'],
    ksiTargets: ['Target: lärmiljö', 'Action: anpassning/tillgängliggörande', 'Means: material/struktur/stödperson'],
    ss12000Source: ['Anpassningar', 'Schema/strukturstöd'],
    status: 5,
    history: []
  },
  {
    spoke: 'hemmet',
    name: 'HEMMET',
    childIndicator: 'Det känns bra hemma',
    guardianIndicator: 'Vi klarar vardagen',
    professionalIndicator: 'Samverkansbehov (nivå)',
    icfDomains: ['e310–e315', 'd760', 'e5'],
    ksiTargets: ['Target: hemliv', 'Action: rådgivning/stöd', 'Means: samtal/hembesök/samverkansmöte'],
    ss12000Source: ['Kontaktlogik/möten'],
    status: 5,
    history: []
  },
  {
    spoke: 'relationer',
    name: 'RELATIONER',
    childIndicator: 'Jag har någon att vara med',
    guardianIndicator: 'Relationer fungerar',
    professionalIndicator: 'Trivselindikator',
    icfDomains: ['d710–d740', 'd750', 'e4'],
    ksiTargets: ['Target: relationer', 'Action: social färdighetsträning/stöd', 'Means: grupp/individ'],
    ss12000Source: ['Enkät/observation', 'Elevhälsoplan'],
    status: 4,
    history: []
  },
  {
    spoke: 'aktiv',
    name: 'AKTIV',
    childIndicator: 'Jag gör något jag gillar varje vecka',
    guardianIndicator: 'Meningsfull fritid',
    professionalIndicator: 'Deltagande/hinder',
    icfDomains: ['d920', 'd450–d455', 'e3'],
    ksiTargets: ['Target: fritid/aktivitet', 'Action: tillgängliggöra/råd', 'Means: grupp/assistans'],
    ss12000Source: ['Aktivitetsindikator'],
    status: 5,
    history: []
  },
  {
    spoke: 'delaktig',
    name: 'DELAKTIG',
    childIndicator: 'Jag får vara med och påverka',
    guardianIndicator: 'Barnets syn tas tillvara',
    professionalIndicator: 'Barnets röst dokumenterad (ja/nej)',
    icfDomains: ['d910', 'd750', 'e5'],
    ksiTargets: ['Target: delaktighet', 'Action: planering/uppföljning', 'Means: möte/digitalt'],
    ss12000Source: ['Elevinflytande', 'Barnets plan'],
    status: 5,
    history: []
  }
];

export const erikJourneyProfile: JourneyProfile = {
  childId: 'erik',
  currentLevel: 'universell',
  levelHistory: [
    {
      date: '2025-08-15',
      fromLevel: null,
      toLevel: 'universell',
      reason: 'Skol start - initial bedömning',
      triggeredBy: null,
      decidedBy: 'elementary-school',
      notes: 'Erik börjar åk 7, inga kända behov'
    }
  ],
  welfareWheel: erikWelfareWheel,
  activeTriggers: [],
  dataSharingConsent: [],
  lastAssessment: '2025-12-10',
  nextFollowUp: '2026-03-15'
};

// ==========================================
// Lisa - Stödprofil (behöver riktat stöd)
// ==========================================

const lisaWelfareWheel: WelfareWheelSpokeData[] = [
  {
    spoke: 'trygg',
    name: 'TRYGG',
    childIndicator: 'Jag känner mig trygg',
    guardianIndicator: 'Mitt barn är tryggt',
    professionalIndicator: 'Trygghetsmarkör/trend',
    icfDomains: ['b152', 'd240', 'e3/e4/e5'],
    ksiTargets: ['Target: psykosocial miljö', 'Action: bedömning/stödsamtal/miljöanpassning', 'Means: individ/grupp/samverkansmöte'],
    ss12000Source: ['Trygghetsenkät', 'Incident', 'Frånvaro', 'Elevhälsokontakt'],
    status: 2,
    history: [
      { date: '2025-08-20', value: 3, source: 'elementary-school', measurement: 'survey' },
      { date: '2025-10-15', value: 2, source: 'elementary-school', measurement: 'survey' },
      { date: '2025-12-10', value: 2, source: 'student-health', measurement: 'assessment' }
    ],
    notes: 'Lisa upplever oro inför skolsituationer, särskilt grupparbeten'
  },
  {
    spoke: 'halsa',
    name: 'HÄLSA / MÅ BRA',
    childIndicator: 'Jag mår bra',
    guardianIndicator: 'Hälsa fungerar i vardagen',
    professionalIndicator: 'Frånvarotrend eller hälsosamtal gjort',
    icfDomains: ['b130', 'b134', 'b152', 'd570', 'e-faktorer'],
    ksiTargets: ['Target: hälsa/egenvård', 'Action: råd/uppföljning', 'Means: individ/digitalt'],
    ss12000Source: ['EMI-hälsobesök', 'Elevhälsosamtal', 'Frånvaro'],
    status: 3,
    history: [
      { date: '2025-09-01', value: 3, source: 'student-health', measurement: 'assessment' },
      { date: '2025-11-20', value: 3, source: 'student-health', measurement: 'assessment' }
    ],
    notes: 'Sömnsvårigheter rapporterade. Uppföljning med skolsköterska pågår.'
  },
  {
    spoke: 'utvecklas',
    name: 'UTVECKLAS',
    childIndicator: 'Jag hänger med',
    guardianIndicator: 'Utvecklas i sin takt',
    professionalIndicator: 'Risk för ej nå mål (ja/nej)',
    icfDomains: ['d1/d8', 'b140–b144', 'e-faktorer (lärmiljö)'],
    ksiTargets: ['Target: utbildning/lärande', 'Action: undervisning/anpassning/färdighetsträning', 'Means: klass/grupp/1:1'],
    ss12000Source: ['Extra anpassningar', 'Åtgärdsprogram', 'Prov/betyg'],
    status: 4,
    history: []
  },
  {
    spoke: 'larande',
    name: 'LÄRANDE',
    childIndicator: 'Jag får hjälp när jag behöver',
    guardianIndicator: 'Skolan anpassar',
    professionalIndicator: 'Anpassningar aktiva (ja/nej)',
    icfDomains: ['d155–d179', 'd820', 'e-faktorer'],
    ksiTargets: ['Target: lärmiljö', 'Action: anpassning/tillgängliggörande', 'Means: material/struktur/stödperson'],
    ss12000Source: ['Anpassningar', 'Schema/strukturstöd'],
    status: 4,
    history: []
  },
  {
    spoke: 'hemmet',
    name: 'HEMMET',
    childIndicator: 'Det känns bra hemma',
    guardianIndicator: 'Vi klarar vardagen',
    professionalIndicator: 'Samverkansbehov (nivå)',
    icfDomains: ['e310–e315', 'd760', 'e5'],
    ksiTargets: ['Target: hemliv', 'Action: rådgivning/stöd', 'Means: samtal/hembesök/samverkansmöte'],
    ss12000Source: ['Kontaktlogik/möten'],
    status: 4,
    history: []
  },
  {
    spoke: 'relationer',
    name: 'RELATIONER',
    childIndicator: 'Jag har någon att vara med',
    guardianIndicator: 'Relationer fungerar',
    professionalIndicator: 'Trivselindikator',
    icfDomains: ['d710–d740', 'd750', 'e4'],
    ksiTargets: ['Target: relationer', 'Action: social färdighetsträning/stöd', 'Means: grupp/individ'],
    ss12000Source: ['Enkät/observation', 'Elevhälsoplan'],
    status: 2,
    history: [
      { date: '2025-09-15', value: 3, source: 'elementary-school', measurement: 'observation' },
      { date: '2025-11-10', value: 2, source: 'elementary-school', measurement: 'observation' }
    ],
    notes: 'Lisa har svårt att hitta kamrater. Social färdighetsträning påbörjad.'
  },
  {
    spoke: 'aktiv',
    name: 'AKTIV',
    childIndicator: 'Jag gör något jag gillar varje vecka',
    guardianIndicator: 'Meningsfull fritid',
    professionalIndicator: 'Deltagande/hinder',
    icfDomains: ['d920', 'd450–d455', 'e3'],
    ksiTargets: ['Target: fritid/aktivitet', 'Action: tillgängliggöra/råd', 'Means: grupp/assistans'],
    ss12000Source: ['Aktivitetsindikator'],
    status: 3,
    history: []
  },
  {
    spoke: 'delaktig',
    name: 'DELAKTIG',
    childIndicator: 'Jag får vara med och påverka',
    guardianIndicator: 'Barnets syn tas tillvara',
    professionalIndicator: 'Barnets röst dokumenterad (ja/nej)',
    icfDomains: ['d910', 'd750', 'e5'],
    ksiTargets: ['Target: delaktighet', 'Action: planering/uppföljning', 'Means: möte/digitalt'],
    ss12000Source: ['Elevinflytande', 'Barnets plan'],
    status: 4,
    history: []
  }
];

const lisaSupportPlan: SupportPlanData = {
  id: 'lisa-support-001',
  created: '2025-10-20',
  updated: '2025-12-01',
  goals: [
    {
      id: 'goal-1',
      text: 'Lisa ska känna sig trygg i grupparbeten inom 8 veckor',
      targetDate: '2026-02-15',
      relatedSpokes: ['trygg', 'relationer'],
      ksiTarget: 'Target: psykosocial miljö',
      progress: 'in-progress',
      lastReviewed: '2025-12-01'
    },
    {
      id: 'goal-2',
      text: 'Förbättrad sömn och minskat oro genom rutiner',
      targetDate: '2026-01-30',
      relatedSpokes: ['halsa'],
      ksiTarget: 'Target: hälsa/egenvård',
      progress: 'in-progress',
      lastReviewed: '2025-12-01'
    }
  ],
  interventions: [
    {
      id: 'int-1',
      name: 'Social färdighetsträning',
      description: 'Gruppsessioner med fokus på samarbete och kommunikation',
      ksiCode: 'KSI: Action: social färdighetsträning, Means: grupp',
      responsible: 'student-health',
      startDate: '2025-10-25',
      frequency: '1 gång/vecka',
      status: 'active',
      effectOnSpokes: ['trygg', 'relationer']
    },
    {
      id: 'int-2',
      name: 'Stödsamtal med skolkurator',
      description: 'Individuella samtal för att hantera oro',
      ksiCode: 'KSI: Action: stödsamtal, Means: individ',
      responsible: 'student-health',
      startDate: '2025-10-20',
      frequency: '2 gånger/månad',
      status: 'active',
      effectOnSpokes: ['trygg', 'halsa']
    }
  ],
  responsible: 'student-health',
  participants: ['elementary-school', 'student-health'],
  followUpSchedule: 'Var 6:e vecka',
  status: 'active'
};

export const lisaJourneyProfile: JourneyProfile = {
  childId: 'lisa',
  currentLevel: 'stodprofil',
  levelHistory: [
    {
      date: '2025-08-15',
      fromLevel: null,
      toLevel: 'universell',
      reason: 'Skolstart - initial bedömning',
      triggeredBy: null,
      decidedBy: 'elementary-school'
    },
    {
      date: '2025-10-20',
      fromLevel: 'universell',
      toLevel: 'stodprofil',
      reason: 'Röd i 2 ekrar (Trygg & Relationer) under två mätningar',
      triggeredBy: {
        id: 'trigger-lisa-001',
        triggeredDate: '2025-10-15',
        fromLevel: 'universell',
        toLevel: 'stodprofil',
        situation: 'Röd/orange i 2 ekrar samtidigt',
        affectedSpokes: ['trygg', 'relationer'],
        action: 'Aktivera stödprofil med riktat stöd',
        responsible: 'student-health',
        status: 'completed'
      },
      decidedBy: 'student-health',
      notes: 'Föräldrar informerade och samtycke givet. Stödplan upprättad.'
    }
  ],
  welfareWheel: lisaWelfareWheel,
  activeTriggers: [],
  supportPlan: lisaSupportPlan,
  dataSharingConsent: [
    {
      id: 'consent-001',
      consentDate: '2025-10-20',
      givenBy: 'guardian',
      consentType: 'data-sharing',
      scope: 'Delning av välbefinnandedata mellan skola och elevhälsa',
      fromSector: 'elementary-school',
      toSector: ['student-health'],
      status: 'active'
    }
  ],
  lastAssessment: '2025-12-01',
  nextFollowUp: '2026-01-15'
};

// ==========================================
// Sofia - Samordningsprofil (Gymnasiet, intensivt stöd)
// ==========================================

const sofiaWelfareWheel: WelfareWheelSpokeData[] = [
  {
    spoke: 'trygg',
    name: 'TRYGG',
    childIndicator: 'Jag känner mig trygg',
    guardianIndicator: 'Mitt barn är tryggt',
    professionalIndicator: 'Trygghetsmarkör/trend',
    icfDomains: ['b152', 'd240', 'e3/e4/e5'],
    ksiTargets: ['Target: psykosocial miljö', 'Action: bedömning/stödsamtal/miljöanpassning', 'Means: individ/grupp/samverkansmöte'],
    ss12000Source: ['Trygghetsenkät', 'Incident', 'Frånvaro', 'Elevhälsokontakt'],
    status: 1,
    history: [
      { date: '2025-06-01', value: 2, source: 'elementary-school', measurement: 'survey' },
      { date: '2025-09-15', value: 1, source: 'student-health', measurement: 'assessment' },
      { date: '2025-12-05', value: 1, source: 'social-services', measurement: 'assessment' }
    ],
    notes: 'Svår hemmasituation påverkar trygghet på gymnasiet. Socialtjänst involverad.'
  },
  {
    spoke: 'halsa',
    name: 'HÄLSA / MÅ BRA',
    childIndicator: 'Jag mår bra',
    guardianIndicator: 'Hälsa fungerar i vardagen',
    professionalIndicator: 'Frånvarotrend eller hälsosamtal gjort',
    icfDomains: ['b130', 'b134', 'b152', 'd570', 'e-faktorer'],
    ksiTargets: ['Target: hälsa/egenvård', 'Action: råd/uppföljning', 'Means: individ/digitalt'],
    ss12000Source: ['EMI-hälsobesök', 'Elevhälsosamtal', 'Frånvaro'],
    status: 1,
    history: [
      { date: '2025-08-20', value: 2, source: 'student-health', measurement: 'assessment' },
      { date: '2025-11-10', value: 1, source: 'bup', measurement: 'assessment' }
    ],
    notes: 'Psykisk ohälsa. BUP-kontakt etablerad.'
  },
  {
    spoke: 'utvecklas',
    name: 'UTVECKLAS',
    childIndicator: 'Jag hänger med',
    guardianIndicator: 'Utvecklas i sin takt',
    professionalIndicator: 'Risk för ej nå mål (ja/nej)',
    icfDomains: ['d1/d8', 'b140–b144', 'e-faktorer (lärmiljö)'],
    ksiTargets: ['Target: utbildning/lärande', 'Action: undervisning/anpassning/färdighetsträning', 'Means: klass/grupp/1:1'],
    ss12000Source: ['Extra anpassningar', 'Åtgärdsprogram', 'Prov/betyg'],
    status: 2,
    history: [],
    notes: 'Risk att ej nå kunskapsmål. Hög frånvaro påverkar.'
  },
  {
    spoke: 'larande',
    name: 'LÄRANDE',
    childIndicator: 'Jag får hjälp när jag behöver',
    guardianIndicator: 'Skolan anpassar',
    professionalIndicator: 'Anpassningar aktiva (ja/nej)',
    icfDomains: ['d155–d179', 'd820', 'e-faktorer'],
    ksiTargets: ['Target: lärmiljö', 'Action: anpassning/tillgängliggörande', 'Means: material/struktur/stödperson'],
    ss12000Source: ['Anpassningar', 'Schema/strukturstöd'],
    status: 3,
    history: [],
    notes: 'Åtgärdsprogram aktivt med omfattande anpassningar.'
  },
  {
    spoke: 'hemmet',
    name: 'HEMMET',
    childIndicator: 'Det känns bra hemma',
    guardianIndicator: 'Vi klarar vardagen',
    professionalIndicator: 'Samverkansbehov (nivå)',
    icfDomains: ['e310–e315', 'd760', 'e5'],
    ksiTargets: ['Target: hemliv', 'Action: rådgivning/stöd', 'Means: samtal/hembesök/samverkansmöte'],
    ss12000Source: ['Kontaktlogik/möten'],
    status: 1,
    history: [],
    notes: 'Familjen får stöd av socialtjänst. Hög sekretess.'
  },
  {
    spoke: 'relationer',
    name: 'RELATIONER',
    childIndicator: 'Jag har någon att vara med',
    guardianIndicator: 'Relationer fungerar',
    professionalIndicator: 'Trivselindikator',
    icfDomains: ['d710–d740', 'd750', 'e4'],
    ksiTargets: ['Target: relationer', 'Action: social färdighetsträning/stöd', 'Means: grupp/individ'],
    ss12000Source: ['Enkät/observation', 'Elevhälsoplan'],
    status: 2,
    history: [],
    notes: 'Få kamratrelationer. Social isolering.'
  },
  {
    spoke: 'aktiv',
    name: 'AKTIV',
    childIndicator: 'Jag gör något jag gillar varje vecka',
    guardianIndicator: 'Meningsfull fritid',
    professionalIndicator: 'Deltagande/hinder',
    icfDomains: ['d920', 'd450–d455', 'e3'],
    ksiTargets: ['Target: fritid/aktivitet', 'Action: tillgängliggöra/råd', 'Means: grupp/assistans'],
    ss12000Source: ['Aktivitetsindikator'],
    status: 2,
    history: [],
    notes: 'Ingen fritidsaktivitet. Fritidsgård kontaktad.'
  },
  {
    spoke: 'delaktig',
    name: 'DELAKTIG',
    childIndicator: 'Jag får vara med och påverka',
    guardianIndicator: 'Barnets syn tas tillvara',
    professionalIndicator: 'Barnets röst dokumenterad (ja/nej)',
    icfDomains: ['d910', 'd750', 'e5'],
    ksiTargets: ['Target: delaktighet', 'Action: planering/uppföljning', 'Means: möte/digitalt'],
    ss12000Source: ['Elevinflytande', 'Barnets plan'],
    status: 3,
    history: [],
    notes: 'Sofias önskemål dokumenterade i Barnets plan.'
  }
];

const sofiaCoordinationPlan: CoordinationPlanData = {
  id: 'sofia-coord-001',
  created: '2025-09-20',
  updated: '2025-12-05',
  sipLike: true,
  goals: [
    {
      id: 'goal-1',
      text: 'Sofia ska känna sig trygg hemma och i skolan inom 6 månader',
      targetDate: '2026-03-20',
      relatedSpokes: ['trygg', 'hemmet'],
      ksiTarget: 'Target: psykosocial miljö + hemliv',
      progress: 'in-progress',
      lastReviewed: '2025-12-05'
    },
    {
      id: 'goal-2',
      text: 'Sofias psykiska hälsa förbättras med stöd av BUP',
      targetDate: '2026-06-01',
      relatedSpokes: ['halsa'],
      ksiTarget: 'Target: hälsa',
      progress: 'in-progress',
      lastReviewed: '2025-12-05'
    },
    {
      id: 'goal-3',
      text: 'Sofia ska klara första året på gymnasiet med godkända betyg',
      targetDate: '2026-06-15',
      relatedSpokes: ['utvecklas', 'larande'],
      ksiTarget: 'Target: utbildning',
      progress: 'in-progress',
      lastReviewed: '2025-12-05'
    }
  ],
  crossSectorGoals: [
    {
      id: 'cross-goal-1',
      text: 'Samordnade insatser för familjen',
      targetDate: '2026-03-01',
      relatedSpokes: ['trygg', 'hemmet', 'halsa'],
      primarySector: 'social-services',
      supportingSectors: ['high-school', 'bup', 'student-health'],
      sectorResponsibilities: [
        { sector: 'social-services', responsibility: 'Familjestöd och ekonomiskt bistånd' },
        { sector: 'high-school', responsibility: 'Anpassad studiemiljö och uppföljning' },
        { sector: 'bup', responsibility: 'Psykiatrisk behandling' },
        { sector: 'student-health', responsibility: 'Samordning och elevhälsostöd' }
      ],
      progress: 'in-progress',
      lastReviewed: '2025-12-05'
    }
  ],
  interventions: [
    {
      id: 'int-1',
      name: 'BUP-behandling',
      description: 'Kognitiv beteendeterapi för ångest',
      ksiCode: 'KSI: Action: psykoterapeutisk behandling, Means: individ',
      responsible: 'bup',
      startDate: '2025-09-25',
      frequency: '1 gång/vecka',
      status: 'active',
      effectOnSpokes: ['halsa', 'trygg']
    },
    {
      id: 'int-2',
      name: 'Familjestöd',
      description: 'Hembesök och praktiskt stöd',
      ksiCode: 'KSI: Action: familjestöd, Means: hembesök',
      responsible: 'social-services',
      startDate: '2025-09-20',
      frequency: '2 gånger/månad',
      status: 'active',
      effectOnSpokes: ['hemmet', 'trygg']
    },
    {
      id: 'int-3',
      name: 'Anpassad studiegång',
      description: 'Flexibel studietakt och återhämtningsrum',
      ksiCode: 'KSI: Action: miljöanpassning, Means: struktur',
      responsible: 'high-school',
      startDate: '2025-10-01',
      frequency: 'Kontinuerligt',
      status: 'active',
      effectOnSpokes: ['utvecklas', 'larande', 'trygg']
    }
  ],
  responsible: 'student-health',
  participants: ['high-school', 'student-health', 'bup', 'social-services'],
  followUpSchedule: 'Var 4:e vecka',
  status: 'active',
  responsibilityMatrix: [
    {
      sector: 'social-services',
      contactPerson: 'Maria Andersson',
      role: 'Socialsekreterare',
      responsibilities: ['Familjestöd', 'Ekonomiskt bistånd', 'Samordning med BUP'],
      availableResources: ['Hembesök', 'Familjeterapi', 'Ekonomiskt stöd']
    },
    {
      sector: 'bup',
      contactPerson: 'Dr. Erik Svensson',
      role: 'Barnpsykiater',
      responsibilities: ['Psykiatrisk bedömning', 'KBT-behandling', 'Medicinering vid behov'],
      availableResources: ['Psykoterapisessioner', 'Krisintervention']
    },
    {
      sector: 'high-school',
      contactPerson: 'Anna Johansson',
      role: 'Studievägledare',
      responsibilities: ['Anpassad studiegång', 'Uppföljning av frånvaro', 'Kontakt med familj'],
      availableResources: ['Åtgärdsprogram', 'Återhämtningsrum', 'Flexibel studietakt']
    },
    {
      sector: 'student-health',
      contactPerson: 'Lisa Berg',
      role: 'Skolkurator',
      responsibilities: ['Samordning', 'Stödsamtal', 'Uppföljning'],
      availableResources: ['Individuella samtal', 'Gruppaktiviteter']
    }
  ],
  meetingSchedule: 'Barnets plan-möte var 4:e vecka',
  coordinatorName: 'Lisa Berg',
  coordinatorSector: 'student-health'
};

export const sofiaJourneyProfile: JourneyProfile = {
  childId: 'sofia',
  currentLevel: 'samordning',
  levelHistory: [
    {
      date: '2025-08-15',
      fromLevel: null,
      toLevel: 'universell',
      reason: 'Gymnasiestart - initial bedömning',
      triggeredBy: null,
      decidedBy: 'high-school'
    },
    {
      date: '2025-09-10',
      fromLevel: 'universell',
      toLevel: 'stodprofil',
      reason: 'Flera röda ekrar och hög frånvaro',
      triggeredBy: null,
      decidedBy: 'student-health'
    },
    {
      date: '2025-09-20',
      fromLevel: 'stodprofil',
      toLevel: 'samordning',
      reason: 'Kvarstående röda värden trots stöd + fler huvudmän krävs (BUP, socialtjänst)',
      triggeredBy: {
        id: 'trigger-sofia-001',
        triggeredDate: '2025-09-18',
        fromLevel: 'stodprofil',
        toLevel: 'samordning',
        situation: 'Stödprofil utan förbättring + fler huvudmän krävs',
        affectedSpokes: ['trygg', 'halsa', 'hemmet'],
        action: 'Aktivera samordningsprofil med Barnets plan/SIP',
        responsible: 'student-health',
        status: 'completed',
        notes: 'Familjen och Sofia samtyckt till samordnad plan. BUP och socialtjänst involverade.'
      },
      decidedBy: 'student-health',
      notes: 'Barnets plan upprättad med gemensamma mål över sektorsgränser. Fokus på gymnasiet, psykisk hälsa och familjesituation.'
    }
  ],
  welfareWheel: sofiaWelfareWheel,
  activeTriggers: [],
  coordinationPlan: sofiaCoordinationPlan,
  dataSharingConsent: [
    {
      id: 'consent-001',
      consentDate: '2025-09-20',
      givenBy: 'both',
      consentType: 'coordination',
      scope: 'Delning av information mellan gymnasiet, BUP och socialtjänst för samordnad plan',
      fromSector: 'high-school',
      toSector: ['student-health', 'bup', 'social-services'],
      status: 'active'
    }
  ],
  lastAssessment: '2025-12-05',
  nextFollowUp: '2026-01-05'
};

// ==========================================
// Omar - Universell med tidig uppmärksamhet
// ==========================================

const omarWelfareWheel: WelfareWheelSpokeData[] = [
  {
    spoke: 'trygg',
    name: 'TRYGG',
    childIndicator: 'Jag känner mig trygg',
    guardianIndicator: 'Mitt barn är tryggt',
    professionalIndicator: 'Trygghetsmarkör/trend',
    icfDomains: ['b152', 'd240', 'e3/e4/e5'],
    ksiTargets: ['Target: psykosocial miljö', 'Action: bedömning/stödsamtal/miljöanpassning', 'Means: individ/grupp/samverkansmöte'],
    ss12000Source: ['Trygghetsenkät', 'Incident', 'Frånvaro', 'Elevhälsokontakt'],
    status: 3,
    history: [
      { date: '2025-08-20', value: 4, source: 'elementary-school', measurement: 'survey' },
      { date: '2025-11-15', value: 3, source: 'elementary-school', measurement: 'survey' }
    ],
    notes: 'Omar visar viss oro i vissa situationer, särskilt vid språkliga krav'
  },
  {
    spoke: 'halsa',
    name: 'HÄLSA / MÅ BRA',
    childIndicator: 'Jag mår bra',
    guardianIndicator: 'Hälsa fungerar i vardagen',
    professionalIndicator: 'Frånvarotrend eller hälsosamtal gjort',
    icfDomains: ['b130', 'b134', 'b152', 'd570', 'e-faktorer'],
    ksiTargets: ['Target: hälsa/egenvård', 'Action: råd/uppföljning', 'Means: individ/digitalt'],
    ss12000Source: ['EMI-hälsobesök', 'Elevhälsosamtal', 'Frånvaro'],
    status: 4,
    history: []
  },
  {
    spoke: 'utvecklas',
    name: 'UTVECKLAS',
    childIndicator: 'Jag hänger med',
    guardianIndicator: 'Utvecklas i sin takt',
    professionalIndicator: 'Risk för ej nå mål (ja/nej)',
    icfDomains: ['d1/d8', 'b140–b144', 'e-faktorer (lärmiljö)'],
    ksiTargets: ['Target: utbildning/lärande', 'Action: undervisning/anpassning/färdighetsträning', 'Means: klass/grupp/1:1'],
    ss12000Source: ['Extra anpassningar', 'Åtgärdsprogram', 'Prov/betyg'],
    status: 3,
    history: [
      { date: '2025-09-10', value: 3, source: 'elementary-school', measurement: 'observation' },
      { date: '2025-12-01', value: 3, source: 'elementary-school', measurement: 'assessment' }
    ],
    notes: 'Språksvårigheter påverkar vissa ämnen. Extra stöd ges i svenska.'
  },
  {
    spoke: 'larande',
    name: 'LÄRANDE',
    childIndicator: 'Jag får hjälp när jag behöver',
    guardianIndicator: 'Skolan anpassar',
    professionalIndicator: 'Anpassningar aktiva (ja/nej)',
    icfDomains: ['d155–d179', 'd820', 'e-faktorer'],
    ksiTargets: ['Target: lärmiljö', 'Action: anpassning/tillgängliggörande', 'Means: material/struktur/stödperson'],
    ss12000Source: ['Anpassningar', 'Schema/strukturstöd'],
    status: 4,
    history: []
  },
  {
    spoke: 'hemmet',
    name: 'HEMMET',
    childIndicator: 'Det känns bra hemma',
    guardianIndicator: 'Vi klarar vardagen',
    professionalIndicator: 'Samverkansbehov (nivå)',
    icfDomains: ['e310–e315', 'd760', 'e5'],
    ksiTargets: ['Target: hemliv', 'Action: rådgivning/stöd', 'Means: samtal/hembesök/samverkansmöte'],
    ss12000Source: ['Kontaktlogik/möten'],
    status: 4,
    history: []
  },
  {
    spoke: 'relationer',
    name: 'RELATIONER',
    childIndicator: 'Jag har någon att vara med',
    guardianIndicator: 'Relationer fungerar',
    professionalIndicator: 'Trivselindikator',
    icfDomains: ['d710–d740', 'd750', 'e4'],
    ksiTargets: ['Target: relationer', 'Action: social färdighetsträning/stöd', 'Means: grupp/individ'],
    ss12000Source: ['Enkät/observation', 'Elevhälsoplan'],
    status: 3,
    history: [
      { date: '2025-10-01', value: 3, source: 'elementary-school', measurement: 'observation' }
    ],
    notes: 'Viss social osäkerhet, men har ett par nära kamrater'
  },
  {
    spoke: 'aktiv',
    name: 'AKTIV',
    childIndicator: 'Jag gör något jag gillar varje vecka',
    guardianIndicator: 'Meningsfull fritid',
    professionalIndicator: 'Deltagande/hinder',
    icfDomains: ['d920', 'd450–d455', 'e3'],
    ksiTargets: ['Target: fritid/aktivitet', 'Action: tillgängliggöra/råd', 'Means: grupp/assistans'],
    ss12000Source: ['Aktivitetsindikator'],
    status: 4,
    history: []
  },
  {
    spoke: 'delaktig',
    name: 'DELAKTIG',
    childIndicator: 'Jag får vara med och påverka',
    guardianIndicator: 'Barnets syn tas tillvara',
    professionalIndicator: 'Barnets röst dokumenterad (ja/nej)',
    icfDomains: ['d910', 'd750', 'e5'],
    ksiTargets: ['Target: delaktighet', 'Action: planering/uppföljning', 'Means: möte/digitalt'],
    ss12000Source: ['Elevinflytande', 'Barnets plan'],
    status: 4,
    history: []
  }
];

export const omarJourneyProfile: JourneyProfile = {
  childId: 'omar',
  currentLevel: 'universell',
  levelHistory: [
    {
      date: '2025-08-15',
      fromLevel: null,
      toLevel: 'universell',
      reason: 'Skolstart - initial bedömning',
      triggeredBy: null,
      decidedBy: 'elementary-school',
      notes: 'Omar börjar åk 5. Språksvårigheter identifierade, men hanteras inom universell nivå.'
    }
  ],
  welfareWheel: omarWelfareWheel,
  activeTriggers: [],
  dataSharingConsent: [],
  lastAssessment: '2025-12-01',
  nextFollowUp: '2026-03-01'
};

// ==========================================
// Elsa - Stödprofil (Dyslexi med anpassningar - från WHO ICF-guiden)
// ==========================================

const elsaWelfareWheel: WelfareWheelSpokeData[] = [
  {
    spoke: 'trygg',
    name: 'TRYGG',
    childIndicator: 'Jag känner mig trygg',
    guardianIndicator: 'Mitt barn är tryggt',
    professionalIndicator: 'Trygghetsmarkör/trend',
    icfDomains: ['b152', 'd240', 'e3/e4/e5'],
    ksiTargets: ['Target: psykosocial miljö'],
    ss12000Source: ['Trygghetsenkät'],
    status: 2,
    history: []
  },
  {
    spoke: 'halsa',
    name: 'HÄLSA / MÅ BRA',
    childIndicator: 'Jag mår bra',
    guardianIndicator: 'Hälsa fungerar i vardagen',
    professionalIndicator: 'Frånvarotrend eller hälsosamtal gjort',
    icfDomains: ['b130', 'b134', 'b152'],
    ksiTargets: ['Target: hälsa/egenvård'],
    ss12000Source: ['Elevhälsosamtal'],
    status: 3,
    history: []
  },
  {
    spoke: 'utvecklas',
    name: 'UTVECKLAS',
    childIndicator: 'Jag hänger med',
    guardianIndicator: 'Utvecklas i sin takt',
    professionalIndicator: 'Risk för ej nå mål',
    icfDomains: ['d1/d8', 'b140–b144'],
    ksiTargets: ['Target: utbildning/lärande'],
    ss12000Source: ['Extra anpassningar'],
    status: 3,
    history: []
  },
  {
    spoke: 'larande',
    name: 'LÄRANDE',
    childIndicator: 'Jag får hjälp när jag behöver',
    guardianIndicator: 'Skolan anpassar',
    professionalIndicator: 'Anpassningar aktiva',
    icfDomains: ['d140', 'd150', 'd160'],
    ksiTargets: ['Target: lärmiljö'],
    ss12000Source: ['Anpassningar'],
    status: 1,
    history: []
  },
  {
    spoke: 'hemmet',
    name: 'HEMMET',
    childIndicator: 'Det känns bra hemma',
    guardianIndicator: 'Vi klarar vardagen',
    professionalIndicator: 'Samverkansbehov',
    icfDomains: ['e310'],
    ksiTargets: ['Target: hemliv'],
    ss12000Source: ['Kontaktlogik/möten'],
    status: 4,
    history: []
  },
  {
    spoke: 'relationer',
    name: 'RELATIONER',
    childIndicator: 'Jag har någon att vara med',
    guardianIndicator: 'Relationer fungerar',
    professionalIndicator: 'Trivselindikator',
    icfDomains: ['d350', 'd710–d740'],
    ksiTargets: ['Target: relationer'],
    ss12000Source: ['Enkät/observation'],
    status: 3,
    history: []
  },
  {
    spoke: 'aktiv',
    name: 'AKTIV',
    childIndicator: 'Jag gör något jag gillar',
    guardianIndicator: 'Meningsfull fritid',
    professionalIndicator: 'Deltagande/hinder',
    icfDomains: ['d920'],
    ksiTargets: ['Target: fritid/aktivitet'],
    ss12000Source: ['Aktivitetsindikator'],
    status: 3,
    history: []
  },
  {
    spoke: 'delaktig',
    name: 'DELAKTIG',
    childIndicator: 'Jag får säga vad jag tycker',
    guardianIndicator: 'Barnet lyssnas på',
    professionalIndicator: 'Inflytande dokumenterat',
    icfDomains: ['d9'],
    ksiTargets: ['Target: delaktighet'],
    ss12000Source: ['Barnsamtal'],
    status: 3,
    history: []
  }
];

export const elsaJourneyProfile: JourneyProfile = {
  childId: 'elsa',
  currentLevel: 'stodprofil',
  levelHistory: [
    {
      date: '2025-09-01',
      fromLevel: 'universell',
      toLevel: 'stodprofil',
      reason: 'Dyslexi identifierad, behöver anpassningar och specialpedagogiskt stöd',
      triggeredBy: null,
      decidedBy: 'elementary-school',
      notes: 'WHO ICF exempel-profil. Elsa har dyslexi och använder ljudböcker och bildstöd.'
    }
  ],
  welfareWheel: elsaWelfareWheel,
  activeTriggers: [],
  dataSharingConsent: [],
  lastAssessment: '2025-11-15',
  nextFollowUp: '2026-02-15'
};

// Export all profiles
export const JOURNEY_PROFILES: Record<string, JourneyProfile> = {
  erik: erikJourneyProfile,
  lisa: lisaJourneyProfile,
  omar: omarJourneyProfile,
  elsa: elsaJourneyProfile,
  sofia: sofiaJourneyProfile
};
