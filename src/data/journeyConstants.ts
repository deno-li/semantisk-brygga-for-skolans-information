/**
 * Barnets Resa Matris - Konstanter och konfiguration
 * Baserat på matrisen för nivåmodell, välbefinnandehjul och eskalering
 */

import {
  JourneyLevelConfig,
  WelfareWheelSpokeData,
  DataSharingRule,
  JourneyLevel,
  WelfareWheelSpoke
} from '../types/types';

// ==========================================
// NIVÅMODELL - Tre nivåer
// ==========================================

export const JOURNEY_LEVELS: JourneyLevelConfig[] = [
  {
    level: 'universell',
    name: 'Universell',
    targetGroup: 'Alla barn',
    purpose: 'Hälsofrämjande + tidig upptäckt utan att skapa "ärende" för alla',
    familyView: [
      'Välbefinnandehjul (enkla indikatorer)',
      'Tidslinje (trend)'
    ],
    professionalView: [
      'Samma hjul + grunddata/trend (t.ex. frånvaro/trygghetsmarkör) inom behörighet'
    ],
    dataMinimization: 'Endast indikatorer + grova domäner; inga diagnoser/inga journaltexter',
    followUpFrequency: 'Terminsvis (skola) + vid hälsosamtal',
    escalationTriggers: [
      'Röd i 1 eker två gånger',
      'Gul-röd i 2 ekrar',
      'Tydlig negativ trend'
    ]
  },
  {
    level: 'stodprofil',
    name: 'Stödprofil',
    targetGroup: 'Barn med behov av stöd (inom huvudman)',
    purpose: 'Riktat stöd och uppföljning utan full samordningsplan',
    familyView: [
      'Hjul + mål i klarspråk',
      'Vilka stöd som pågår (översikt)'
    ],
    professionalView: [
      'Hjul + kopplade stödinsatser',
      'Ansvarig',
      'Uppföljningsplan',
      'Referenser till källsystem'
    ],
    dataMinimization: 'Dela domännivå + kort sammanfattning; detaljer stannar i källsystem',
    followUpFrequency: '4–8 veckor (vid behov)',
    escalationTriggers: [
      'Minst 2 ekrar + fler huvudmän krävs',
      'Kvarstående rött trots stöd',
      'Familjen efterfrågar samordning'
    ]
  },
  {
    level: 'samordning',
    name: 'Samordningsprofil',
    targetGroup: 'Barn med behov av samordnade insatser',
    purpose: 'Samlad plan + gemensamma mål + tydligt ansvar över huvudmannagränser',
    familyView: [
      'Barnets plan (SIP-lik)',
      'Hjul',
      'Vem gör vad',
      'Uppföljning'
    ],
    professionalView: [
      'Plan + ansvar + samtycken',
      'Uppföljning',
      'Länkar till källsystem (journal, social dokumentation, skolstöd)'
    ],
    dataMinimization: 'Visa endast nödvändigt; sammanfattningar; loggning och spårbarhet',
    followUpFrequency: '4–6 veckor (initialt), glesare vid stabilisering',
    escalationTriggers: [
      'Stabilisering → nedtrappning till stöd/universell',
      'Ny försämring → upptrappning'
    ]
  }
];

// ==========================================
// VÄLBEFINNANDEHJUL - 8 ekrar
// ==========================================

export const WELFARE_WHEEL_SPOKES: Omit<WelfareWheelSpokeData, 'status' | 'history' | 'notes'>[] = [
  {
    spoke: 'trygg',
    name: 'TRYGG',
    childIndicator: 'Jag känner mig trygg',
    guardianIndicator: 'Mitt barn är tryggt',
    professionalIndicator: 'Trygghetsmarkör/trend',
    icfDomains: ['b152', 'd240', 'e3/e4/e5'],
    ksiTargets: [
      'Target: psykosocial miljö',
      'Action: bedömning/stödsamtal/miljöanpassning',
      'Means: individ/grupp/samverkansmöte'
    ],
    snomedCT: 'Känsla av trygghet/otrygghet (ConceptID vid vård-källa)',
    ss12000Source: ['Trygghetsenkät', 'Incident', 'Frånvaro', 'Elevhälsokontakt']
  },
  {
    spoke: 'halsa',
    name: 'MÅ BRA',
    childIndicator: 'Jag mår bra',
    guardianIndicator: 'Hälsa fungerar i vardagen',
    professionalIndicator: 'Frånvarotrend eller hälsosamtal gjort',
    icfDomains: ['b130', 'b134', 'b152', 'd570', 'e-faktorer'],
    ksiTargets: [
      'Target: hälsa/egenvård',
      'Action: råd/uppföljning',
      'Means: individ/digitalt'
    ],
    snomedCT: 'Relevanta observationer/fynd (om vård källa)',
    ss12000Source: ['EMI-hälsobesök', 'Elevhälsosamtal', 'Frånvaro']
  },
  {
    spoke: 'utvecklas',
    name: 'UTVECKLAS',
    childIndicator: 'Jag hänger med',
    guardianIndicator: 'Utvecklas i sin takt',
    professionalIndicator: 'Risk för ej nå mål (ja/nej)',
    icfDomains: ['d1/d8', 'b140–b144', 'e-faktorer (lärmiljö)'],
    ksiTargets: [
      'Target: utbildning/lärande',
      'Action: undervisning/anpassning/färdighetsträning',
      'Means: klass/grupp/1:1'
    ],
    snomedCT: 'Endast när vårdinfo finns (t.ex. logoped)',
    ss12000Source: ['Extra anpassningar', 'Åtgärdsprogram (sammanfattning)', 'Prov/betyg (grovt)']
  },
  {
    spoke: 'omvardad',
    name: 'OMVÅRDAD',
    childIndicator: 'Jag blir omhändertagen',
    guardianIndicator: 'Vi klarar vardagen',
    professionalIndicator: 'Samverkansbehov (nivå)',
    icfDomains: ['e310–e315', 'd760', 'e5'],
    ksiTargets: [
      'Target: hemliv',
      'Action: rådgivning/stöd',
      'Means: samtal/hembesök/samverkansmöte'
    ],
    snomedCT: 'Omsorgsstatus',
    ss12000Source: ['Kontaktlogik/möten (inte innehåll)']
  },
  {
    spoke: 'aktiv',
    name: 'AKTIV',
    childIndicator: 'Jag gör något jag gillar varje vecka',
    guardianIndicator: 'Meningsfull fritid',
    professionalIndicator: 'Deltagande/hinder',
    icfDomains: ['d920', 'd450–d455', 'e3'],
    ksiTargets: [
      'Target: fritid/aktivitet',
      'Action: tillgängliggöra/råd',
      'Means: grupp/assistans'
    ],
    ss12000Source: ['Aktivitetsindikator (grovt)']
  },
  {
    spoke: 'respekterad',
    name: 'RESPEKTERAD',
    childIndicator: 'Jag blir respekterad',
    guardianIndicator: 'Barnets syn tas tillvara',
    professionalIndicator: 'Trivselindikator',
    icfDomains: ['d710–d740', 'd750', 'e4'],
    ksiTargets: [
      'Target: relationer',
      'Action: social färdighetsträning/stöd',
      'Means: grupp/individ'
    ],
    ss12000Source: ['Enkät/observation', 'Elevhälsoplan']
  },
  {
    spoke: 'ansvarstagande',
    name: 'ANSVARSTAGANDE',
    childIndicator: 'Jag tar ansvar',
    guardianIndicator: 'Barnet tar ansvar',
    professionalIndicator: 'Ansvarstagande dokumenterat',
    icfDomains: ['d250', 'd7', 'd8'],
    ksiTargets: [
      'Target: beteende/ansvar',
      'Action: färdighetsträning',
      'Means: individ/grupp'
    ],
    ss12000Source: ['Lärarbedömning', 'Elevhälsoplan']
  },
  {
    spoke: 'delaktig',
    name: 'DELAKTIG',
    childIndicator: 'Jag får vara med och påverka',
    guardianIndicator: 'Barnets syn tas tillvara',
    professionalIndicator: 'Barnets röst dokumenterad (ja/nej)',
    icfDomains: ['d910', 'd750', 'e5'],
    ksiTargets: [
      'Target: delaktighet',
      'Action: planering/uppföljning',
      'Means: möte/digitalt'
    ],
    ss12000Source: ['Elevinflytande', 'Barnets plan']
  }
];

// ==========================================
// DATADELNING & LAGRING
// ==========================================

export const DATA_SHARING_RULES: DataSharingRule[] = [
  {
    informationLayer: 'Barnets röst',
    master: 'Barn/1177',
    example: 'Självskattning per eker + fritext (valfritt)',
    storedIn: '1177/profil',
    sharedInProfile: true,
    why: 'Universell, låg risk, hög nytta',
    sensitivity: 'L',
    consentRequired: 'no'
  },
  {
    informationLayer: 'Välbefinnandeindikatorer',
    master: 'Skola/kommun/vård',
    example: 'Trygghetsmarkör, trivsel, frånvarotrend',
    storedIn: 'Respektive system + profil',
    sharedInProfile: true,
    why: 'Tidig upptäckt utan diagnos',
    sensitivity: 'L',
    consentRequired: 'varies'
  },
  {
    informationLayer: 'ICF-domäner (under ytan)',
    master: 'Profil-spec',
    example: 'Domäner b/d/e på grov nivå',
    storedIn: 'Profilens semantiska lager',
    sharedInProfile: true,
    why: 'Interoperabilitet + aggregering',
    sensitivity: 'M',
    consentRequired: 'varies'
  },
  {
    informationLayer: 'KSI-insatsetiketter',
    master: 'SoT/kommun + profil',
    example: 'Stödjande samtal, miljöanpassning',
    storedIn: 'Källsystem + profil',
    sharedInProfile: true,
    why: 'Gemensamt insatsspråk över sektorer',
    sensitivity: 'M',
    consentRequired: 'varies'
  },
  {
    informationLayer: 'SNOMED CT (kliniska begrepp)',
    master: 'Vård',
    example: 'Fynd/observation/bedömning',
    storedIn: 'Journal',
    sharedInProfile: false,
    why: 'Detaljer kvar i journal; profilen visar miniminivå',
    sensitivity: 'H',
    consentRequired: 'yes'
  },
  {
    informationLayer: 'ICD-diagnos',
    master: 'Vård',
    example: 'Diagnoskod',
    storedIn: 'Journal/register',
    sharedInProfile: false,
    why: 'Diagnos behövs sällan för plan; risk för stämpling',
    sensitivity: 'H',
    consentRequired: 'yes'
  },
  {
    informationLayer: 'KVÅ/rapport',
    master: 'Vård',
    example: 'Rapportkod',
    storedIn: 'Journal/rapport',
    sharedInProfile: false,
    why: 'Rapportering, inte familjevy',
    sensitivity: 'M',
    consentRequired: 'no'
  },
  {
    informationLayer: 'Skolans dokument',
    master: 'Skola',
    example: 'ÅP, pedagogisk kartläggning',
    storedIn: 'Skolsystem',
    sharedInProfile: false,
    why: 'Dataminimering + begriplighet',
    sensitivity: 'M',
    consentRequired: 'varies'
  }
];

// ==========================================
// ESKALERING - Triggers och åtgärder
// ==========================================

export const ESCALATION_RULES = {
  'red-one-spoke-twice': {
    situation: 'Röd i 1 eker två gånger',
    universalAction: 'Extra dialog + lokal åtgärd + uppföljning',
    supportAction: 'Aktivera stödprofil',
    coordinationAction: null,
    comment: 'Tidsintervall: t.ex. 8–12 veckor mellan mätningar'
  },
  'yellow-red-two-spokes': {
    situation: 'Gul/röd i 2 ekrar samtidigt',
    universalAction: 'Kort analys + plan för uppföljning',
    supportAction: 'Aktivera stödprofil',
    coordinationAction: 'Överväg om fler huvudmän krävs',
    comment: 'Särskilt om frånvaro ökar'
  },
  'no-improvement-with-support': {
    situation: 'Stödprofil utan förbättring',
    universalAction: null,
    supportAction: 'Revidera insatser + tätare uppföljning',
    coordinationAction: 'Aktivera samordningsprofil/Barnets plan',
    comment: 'Koppla tydliga mål/ansvar'
  },
  'family-requests-coordination': {
    situation: 'Familj efterfrågar samordning',
    universalAction: null,
    supportAction: null,
    coordinationAction: 'Aktivera samordningsprofil direkt',
    comment: 'Barnets/ familjens röst är trigger'
  },
  'stabilization': {
    situation: 'Stabilisering',
    universalAction: 'Fortsätt terminsvis',
    supportAction: 'Trappa ned',
    coordinationAction: 'Trappa ned; plan avslutas men historik kvar',
    comment: 'Undvik "reset"; behåll trend'
  }
};

// ==========================================
// KODSYSTEM & VERSIONER
// ==========================================

export const CODE_SYSTEMS = {
  ICF: {
    role: 'Tvärsektoriell domänstruktur',
    masterFor: 'Funktion/delaktighet/miljö',
    maintainer: 'WHO',
    comment: 'Använd core set per flöde; domännivå i universell profil'
  },
  KSI: {
    role: 'Insatser (Target/Action/Means)',
    masterFor: 'Insatslogik tvärsektoriellt',
    maintainer: 'Socialstyrelsen',
    comment: 'Bra bro för skola/SoT/kommunal vård'
  },
  SNOMED: {
    role: 'Vårdens primärterminologi',
    masterFor: 'Kliniska begrepp i journal',
    maintainer: 'Socialstyrelsen / SNOMED International',
    comment: 'Använd vid vård-källa; lagra ConceptID+FSN+typ+release'
  },
  ICD: {
    role: 'Diagnosklassifikation',
    masterFor: 'Diagnos/rapport',
    maintainer: 'Socialstyrelsen / WHO',
    comment: 'Undvik i universell vy; endast vid behov+samtycke'
  },
  KVA: {
    role: 'Åtgärdsklassifikation',
    masterFor: 'Rapportering/uppföljning',
    maintainer: 'Socialstyrelsen',
    comment: 'Behövs ofta för rapport; kan mappas från SNOMED vid behov'
  },
  SS12000: {
    role: 'Skolans strukturella bärlager',
    masterFor: 'Vem/var/när/händelse',
    maintainer: 'SIS',
    comment: 'Semantik läggs via ICF/KSI i profilen'
  }
};

// ==========================================
// FÄRGSCHEMA FÖR STATUSNIVÅER
// ==========================================

export const STATUS_COLORS = {
  1: { bg: '#FEE2E2', text: '#991B1B', name: 'Röd', icon: '🔴' },      // Mycket låg
  2: { bg: '#FED7AA', text: '#9A3412', name: 'Orange', icon: '🟠' },   // Låg
  3: { bg: '#FEF3C7', text: '#92400E', name: 'Gul', icon: '🟡' },      // Medel
  4: { bg: '#D1FAE5', text: '#065F46', name: 'Ljusgrön', icon: '🟢' }, // Bra
  5: { bg: '#A7F3D0', text: '#064E3B', name: 'Grön', icon: '🟢' }      // Mycket bra
};

// ==========================================
// NIVÅFÄRGER
// ==========================================

export const LEVEL_COLORS: Record<JourneyLevel, { bg: string; text: string; border: string }> = {
  universell: {
    bg: '#EBF5FF',
    text: '#1E40AF',
    border: '#3B82F6'
  },
  stodprofil: {
    bg: '#FEF3C7',
    text: '#92400E',
    border: '#F59E0B'
  },
  samordning: {
    bg: '#FCE7F3',
    text: '#9F1239',
    border: '#EC4899'
  }
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================

export const getStatusColor = (status: 1 | 2 | 3 | 4 | 5) => STATUS_COLORS[status];

export const getLevelColor = (level: JourneyLevel) => LEVEL_COLORS[level];

export const getSpokeColor = (spoke: WelfareWheelSpoke): string => {
  const colors: Record<WelfareWheelSpoke, string> = {
    trygg: '#3B82F6',      // Blå
    halsa: '#10B981',      // Grön
    utvecklas: '#8B5CF6',  // Lila
    omvardad: '#EC4899',   // Rosa
    aktiv: '#F97316',      // Orange-röd
    respekterad: '#14B8A6', // Teal
    ansvarstagande: '#F59E0B', // Orange
    delaktig: '#6366F1'    // Indigo
  };
  return colors[spoke];
};

export const getLevelName = (level: JourneyLevel): string => {
  return JOURNEY_LEVELS.find(l => l.level === level)?.name || level;
};
