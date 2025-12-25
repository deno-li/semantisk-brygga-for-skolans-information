/**
 * ICF Core Sets - Begränsade urval av ICF-koder per eker och nivå
 * Baserat på WHO ICF och praktiska behov i svensk välfärd
 */

import { ICFCoreSet, ICFCoreSetItem } from '../types/icf-types';

// ==========================================
// EKER 1: HÄLSA (halsa)
// ==========================================

export const HEALTH_CORE_SET_N1: ICFCoreSet = {
  spoke: 'halsa',
  level: 'N1',
  items: [
    {
      code: 'b134',
      domain: 'Sömnfunktioner',
      indicatorQuestions: [
        'Sover barnet tillräckligt för sin ålder?',
        'Vaknar barnet ofta under natten?',
        'Är barnet utvilad på morgonen?'
      ],
      requiredLevel: 'N1'
    },
    {
      code: 'b152',
      domain: 'Känslofunktioner',
      indicatorQuestions: [
        'Kan barnet reglera känslor (glädje, ilska, sorg)?',
        'Har barnet god känslomässig balans?',
        'Kan barnet hantera frustration?'
      ],
      requiredLevel: 'N1'
    },
    {
      code: 'b280',
      domain: 'Smärtupplevelse',
      indicatorQuestions: [
        'Har barnet återkommande smärta (huvud, mage)?',
        'Begränsar smärtan barnets vardag?'
      ],
      requiredLevel: 'N1'
    },
    {
      code: 'd570',
      domain: 'Ta hand om sin hälsa',
      indicatorQuestions: [
        'Kan barnet ta hand om hygien?',
        'Äter barnet hälsosam mat?',
        'Rör barnet på sig tillräckligt?'
      ],
      requiredLevel: 'N1'
    }
  ]
};

export const HEALTH_CORE_SET_N2: ICFCoreSet = {
  spoke: 'halsa',
  level: 'N2',
  items: [
    ...HEALTH_CORE_SET_N1.items,  // Inkludera alla från N1
    {
      code: 'b130',
      domain: 'Energi och drift',
      indicatorQuestions: [
        'Har barnet tillräckligt med energi för dagliga aktiviteter?',
        'Visar barnet initiativförmåga?'
      ],
      requiredLevel: 'N2'
    },
    {
      code: 'b455',
      domain: 'Träningstolerens',
      indicatorQuestions: [
        'Klarar barnet fysiska aktiviteter för sin ålder?',
        'Blir barnet lätt andfådd eller utmattad?'
      ],
      requiredLevel: 'N2'
    },
    {
      code: 'd510',
      domain: 'Tvätta sig',
      indicatorQuestions: [
        'Kan barnet tvätta sig själv?',
        'Klarar barnet dusch/bad självständigt?'
      ],
      requiredLevel: 'N2'
    }
  ]
};

// ==========================================
// EKER 2: TRYGGHET (trygg)
// ==========================================

export const SAFETY_CORE_SET_N1: ICFCoreSet = {
  spoke: 'trygg',
  level: 'N1',
  items: [
    {
      code: 'd240',
      domain: 'Hantera stress',
      indicatorQuestions: [
        'Kan barnet hantera stress och förändringar?',
        'Återhämtar sig barnet efter svåra situationer?',
        'Kan barnet be om hjälp när det behövs?'
      ],
      requiredLevel: 'N1'
    },
    {
      code: 'd710',
      domain: 'Grundläggande interaktioner',
      indicatorQuestions: [
        'Känner barnet tillit till vuxna?',
        'Kan barnet visa respekt i bemötande?',
        'Vågar barnet fråga om hjälp?'
      ],
      requiredLevel: 'N1'
    },
    {
      code: 'e310',
      domain: 'Närmaste familjen',
      indicatorQuestions: [
        'Ger familjen trygghet och omsorg?',
        'Finns stabila vuxna i barnets närhet?',
        'Känner sig barnet trygg hemma?'
      ],
      requiredLevel: 'N1'
    },
    {
      code: 'e320',
      domain: 'Vänner och bekanta',
      indicatorQuestions: [
        'Finns trygga vänrelationer?',
        'Har barnet någon att leka/umgås med?',
        'Känner sig barnet trygg med kompisar?'
      ],
      requiredLevel: 'N1'
    },
    {
      code: 'e330',
      domain: 'Personer i överordnad ställning',
      indicatorQuestions: [
        'Är lärare/pedagoger trygga vuxna?',
        'Litar barnet på skolpersonal?',
        'Vågar barnet prata med vuxna i skolan?'
      ],
      requiredLevel: 'N1'
    }
  ]
};

export const SAFETY_CORE_SET_N2: ICFCoreSet = {
  spoke: 'trygg',
  level: 'N2',
  items: [
    ...SAFETY_CORE_SET_N1.items,
    {
      code: 'b1528',
      domain: 'Känsla av otrygghet',
      indicatorQuestions: [
        'Känner barnet rädsla eller oro ofta?',
        'Påverkar otryggheten barnets vardag?'
      ],
      requiredLevel: 'N2'
    },
    {
      code: 'd7200',
      domain: 'Skapa relationer',
      indicatorQuestions: [
        'Kan barnet initiera kontakt med andra?',
        'Känner barnet tillit i nya situationer?'
      ],
      requiredLevel: 'N2'
    },
    {
      code: 'e325',
      domain: 'Kamrater',
      indicatorQuestions: [
        'Är kamrater en resurs eller risk?',
        'Finns positiva kamratrelationer?'
      ],
      requiredLevel: 'N2'
    }
  ]
};

// ==========================================
// EKER 3: LÄRANDE & NÄRVARO (larande)
// ==========================================

export const LEARNING_CORE_SET_N1: ICFCoreSet = {
  spoke: 'larande',
  level: 'N1',
  items: [
    {
      code: 'd140',
      domain: 'Lära sig läsa',
      indicatorQuestions: [
        'Klarar barnet läsning för sin ålder?',
        'Läser barnet för nöje eller lärande?',
        'Förstår barnet vad hen läser?'
      ],
      requiredLevel: 'N1'
    },
    {
      code: 'd150',
      domain: 'Lära sig skriva',
      indicatorQuestions: [
        'Kan barnet skriva begripligt?',
        'Klarar barnet att uttrycka tankar skriftligt?',
        'Är skrivhastigheten adekvat för ålder?'
      ],
      requiredLevel: 'N1'
    },
    {
      code: 'd820',
      domain: 'Skolutbildning',
      indicatorQuestions: [
        'Deltar barnet i skolan regelbundet?',
        'Trivs barnet i skolan?',
        'Närvarar barnet för sin ålder? (närvarograd > 90%)'
      ],
      requiredLevel: 'N1'
    },
    {
      code: 'd166',
      domain: 'Läsning',
      indicatorQuestions: [
        'Läser barnet självständigt?',
        'Kan barnet läsa olika typer av texter?'
      ],
      requiredLevel: 'N1'
    }
  ]
};

export const LEARNING_CORE_SET_N2: ICFCoreSet = {
  spoke: 'larande',
  level: 'N2',
  items: [
    ...LEARNING_CORE_SET_N1.items,
    {
      code: 'd160',
      domain: 'Fokusera uppmärksamhet',
      indicatorQuestions: [
        'Kan barnet koncentrera sig på uppgifter?',
        'Klarar barnet längre arbetspass?',
        'Distraheras barnet lätt?'
      ],
      requiredLevel: 'N2'
    },
    {
      code: 'd175',
      domain: 'Lösa problem',
      indicatorQuestions: [
        'Kan barnet lösa problem för sin ålder?',
        'Ger barnet upp lätt eller försöker olika strategier?'
      ],
      requiredLevel: 'N2'
    },
    {
      code: 'e585',
      domain: 'Utbildnings- och träningstjänster',
      indicatorQuestions: [
        'Får barnet stöd från skolan vid behov?',
        'Finns anpassningar vid behov?',
        'Fungerar skolans stödinsatser?'
      ],
      requiredLevel: 'N2'
    },
    {
      code: 'e1301',
      domain: 'Läromedel för utbildning',
      indicatorQuestions: [
        'Har barnet tillgång till lämpliga läromedel?',
        'Finns anpassade läromedel vid behov (bildstöd, talböcker)?',
        'Fungerar läromedlen för barnets behov?'
      ],
      requiredLevel: 'N2'
    },
    {
      code: 'e250',
      domain: 'Ljud (fysisk miljö)',
      indicatorQuestions: [
        'Kan barnet arbeta i klassrummet trots ljud?',
        'Behöver barnet lugnare miljö?',
        'Är ljudnivån i skolan hanterbar för barnet?'
      ],
      requiredLevel: 'N2'
    }
  ]
};

// ==========================================
// ENVIRONMENTAL FACTORS - Vanliga e-koder
// ==========================================

export const COMMON_ENVIRONMENTAL_FACTORS = {
  // EKER 1: Hälsa
  health: [
    { code: 'e580', domain: 'Hälso- och sjukvårdstjänster', category: 'health' },
    { code: 'e1101', domain: 'Läkemedel', category: 'health' },
    { code: 'e355', domain: 'Vårdpersonal', category: 'health' }
  ],

  // EKER 2: Trygghet
  safety: [
    { code: 'e310', domain: 'Närmaste familjen', category: 'safety' },
    { code: 'e320', domain: 'Vänner och bekanta', category: 'safety' },
    { code: 'e325', domain: 'Kamrater', category: 'safety' },
    { code: 'e330', domain: 'Personer i överordnad ställning (lärare, pedagoger)', category: 'safety' },
    { code: 'e5750', domain: 'Allmänna socialtjänster', category: 'safety' }
  ],

  // EKER 3: Lärande
  learning: [
    { code: 'e585', domain: 'Utbildnings- och träningstjänster', category: 'learning' },
    { code: 'e1301', domain: 'Läromedel för utbildning', category: 'learning' },
    { code: 'e250', domain: 'Ljud (fysisk miljö)', category: 'learning' },
    { code: 'e330', domain: 'Lärare och pedagoger', category: 'learning' }
  ],

  // EKER 4: Hem & levnadsvillkor
  home: [
    { code: 'e155', domain: 'Design och konstruktion av bostad', category: 'home' },
    { code: 'e165', domain: 'Tillgångar (ekonomi)', category: 'home' },
    { code: 'e5700', domain: 'Sociala trygghetssystem', category: 'home' }
  ],

  // EKER 5: Relationer
  relations: [
    { code: 'e325', domain: 'Kamrater', category: 'relations' },
    { code: 'e410', domain: 'Enskilda personers attityder, familjen', category: 'relations' },
    { code: 'e420', domain: 'Enskilda personers attityder, vänner', category: 'relations' }
  ],

  // EKER 6-8: Samhällsliv, omsorg, aktivitet
  community: [
    { code: 'e460', domain: 'Samhälleliga attityder', category: 'community' },
    { code: 'e150', domain: 'Design av byggnader för offentligt bruk', category: 'community' },
    { code: 'e340', domain: 'Personligt stöd och assistenter', category: 'community' },
    { code: 'e9201', domain: 'Sport (fritidsaktiviteter)', category: 'community' }
  ]
};

// Export alla core sets
export const ALL_CORE_SETS_N1: ICFCoreSet[] = [
  HEALTH_CORE_SET_N1,
  SAFETY_CORE_SET_N1,
  LEARNING_CORE_SET_N1
];

export const ALL_CORE_SETS_N2: ICFCoreSet[] = [
  HEALTH_CORE_SET_N2,
  SAFETY_CORE_SET_N2,
  LEARNING_CORE_SET_N2
];

// Helper function: Get core set for specific spoke and level
export function getCoreSet(spoke: string, level: 'N1' | 'N2' | 'N3'): ICFCoreSet | undefined {
  const allCoreSets = level === 'N1' ? ALL_CORE_SETS_N1 : ALL_CORE_SETS_N2;
  return allCoreSets.find(cs => cs.spoke === spoke);
}

// Helper function: Get environmental factors for spoke
export function getEnvironmentalFactorsForSpoke(spoke: string): { code: string; domain: string; category: string }[] {
  switch (spoke) {
    case 'halsa':
      return COMMON_ENVIRONMENTAL_FACTORS.health;
    case 'trygg':
      return COMMON_ENVIRONMENTAL_FACTORS.safety;
    case 'larande':
      return COMMON_ENVIRONMENTAL_FACTORS.learning;
    case 'hemmet':
      return COMMON_ENVIRONMENTAL_FACTORS.home;
    case 'relationer':
      return COMMON_ENVIRONMENTAL_FACTORS.relations;
    default:
      return COMMON_ENVIRONMENTAL_FACTORS.community;
  }
}
