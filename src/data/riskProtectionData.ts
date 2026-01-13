import { RiskFactor, ProtectiveFactor } from '../types/types';

export const RISK_FACTORS: RiskFactor[] = [
  {
    id: 'rf-001',
    category: 'individual',
    severity: 'medium',
    name: 'Läs- och skrivsvårigheter',
    description: 'Specifik lässvårighet (dyslexi) som påverkar skolprestationer och självkänsla',
    identifiedDate: '2023-05-15',
    identifiedBy: 'elementary-school',
    relatedDimensions: ['achieving'],
    icfCodes: ['d166', 'd145', 'd160'],
    mitigationActions: [
      'Åtgärdsprogram upprättat',
      'Speciallärare 2x40 min/vecka',
      'Inlästa läromedel (Legimus)',
      'Bildstöd i klassrummet'
    ],
    status: 'monitoring'
  },
  {
    id: 'rf-002',
    category: 'individual',
    severity: 'low',
    name: 'Koncentrationssvårigheter',
    description: 'ADHD-diagnos med behov av strukturerat stöd',
    identifiedDate: '2024-03-10',
    identifiedBy: 'bup',
    relatedDimensions: ['achieving', 'responsible'],
    icfCodes: ['b140', 'd160', 'd220'],
    mitigationActions: [
      'Medicinsk behandling (centralstimulerande)',
      'Psykoedukation till föräldrar och skola',
      'Anpassad studiemiljö (mindre grupp)'
    ],
    status: 'monitoring'
  },
  {
    id: 'rf-003',
    category: 'environment',
    severity: 'low',
    name: 'Begränsad kamratkrets',
    description: 'Har några nära vänner men känner sig ibland ensam, särskilt vid grupparbeten',
    identifiedDate: '2024-10-14',
    identifiedBy: 'elementary-school',
    relatedDimensions: ['included', 'safe'],
    icfCodes: ['d750', 'd9205'],
    mitigationActions: [
      'Strukturerade sociala aktiviteter i skolan',
      'Fritidsaktiviteter (fotboll 2 ggr/vecka)',
      'Kontaktfamilj varannan helg'
    ],
    status: 'monitoring'
  },
  {
    id: 'rf-004',
    category: 'family',
    severity: 'low',
    name: 'Föräldrastress',
    description: 'Hög stressnivå kring morgonrutiner i hemmiljön',
    identifiedDate: '2024-09-01',
    identifiedBy: 'social-services',
    relatedDimensions: ['nurtured', 'safe'],
    icfCodes: ['e310', 'e355'],
    mitigationActions: [
      'Kontaktfamilj för avlastning',
      'Stödsamtal med socialsekreterare',
      'Strukturstöd för morgonrutiner'
    ],
    status: 'monitoring'
  }
];

export const PROTECTIVE_FACTORS: ProtectiveFactor[] = [
  {
    id: 'pf-001',
    category: 'family',
    strength: 'strong',
    name: 'Stabil familjesituation',
    description: 'Omsorgsfulla föräldrar som är engagerade i barnets skolgång och välbefinnande',
    identifiedDate: '2023-09-01',
    identifiedBy: 'elementary-school',
    relatedDimensions: ['nurtured', 'safe'],
    icfCodes: ['e310', 'd760']
  },
  {
    id: 'pf-002',
    category: 'individual',
    strength: 'strong',
    name: 'God fysisk hälsa',
    description: 'Normal BMI, inga hälsoproblem, aktiv på fritiden',
    identifiedDate: '2024-10-15',
    identifiedBy: 'healthcare',
    relatedDimensions: ['healthy', 'active'],
    icfCodes: ['b530', 'b152']
  },
  {
    id: 'pf-003',
    category: 'environment',
    strength: 'moderate',
    name: 'Meningsfulla fritidsaktiviteter',
    description: 'Spelar fotboll 2 ggr/vecka, deltar i Fritid för alla onsdagar',
    identifiedDate: '2024-09-01',
    identifiedBy: 'elementary-school',
    relatedDimensions: ['active', 'included'],
    icfCodes: ['d920', 'd9201']
  },
  {
    id: 'pf-004',
    category: 'individual',
    strength: 'strong',
    name: 'Ansvarskänsla',
    description: 'Tar ansvar för sina uppgifter, följsam till behandling',
    identifiedDate: '2024-10-01',
    identifiedBy: 'elementary-school',
    relatedDimensions: ['responsible', 'respected'],
    icfCodes: ['d230', 'd240']
  },
  {
    id: 'pf-005',
    category: 'environment',
    strength: 'strong',
    name: 'Positivt mentorskap',
    description: 'Känner sig lyssnad på av sin mentor (Lisa Svensson)',
    identifiedDate: '2024-09-01',
    identifiedBy: 'elementary-school',
    relatedDimensions: ['respected', 'safe'],
    icfCodes: ['e330', 'd710']
  },
  {
    id: 'pf-006',
    category: 'environment',
    strength: 'moderate',
    name: 'Tvärsektoriell samverkan (SIP)',
    description: 'Samordnad individuell plan mellan skola, hem och BUP',
    identifiedDate: '2024-09-01',
    identifiedBy: 'social-services',
    relatedDimensions: ['nurtured', 'achieving'],
    icfCodes: ['e355', 'e580']
  }
];

// Longitudinell data - Erik från BVC till nuvarande ålder
