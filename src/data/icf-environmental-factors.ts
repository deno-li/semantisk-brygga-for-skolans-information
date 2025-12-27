/**
 * ICF Environmental Factors Library
 * Organized by welfare wheel spoke with common barriers and facilitators
 * Based on WHO ICF Environmental Factors (e-codes)
 */

import { EnvironmentalFactor, BarrierLevel, FacilitatorLevel, EnvironmentalFactorType } from '../types/icf-types';
import { ActorSector, WelfareWheelSpoke } from '../types/types';

// ==========================================
// COMMON ENVIRONMENTAL FACTORS BY SPOKE
// ==========================================

export const COMMON_ENVIRONMENTAL_FACTORS = {
  // EKER 1: HÄLSA (halsa)
  health: [
    { code: 'e580', domain: 'Hälso- och sjukvårdstjänster', category: 'health' },
    { code: 'e1101', domain: 'Läkemedel', category: 'health' },
    { code: 'e355', domain: 'Hälso- och sjukvårdspersonal', category: 'health' },
    { code: 'e5800', domain: 'Primärvård', category: 'health' },
    { code: 'e5801', domain: 'Specialistvård', category: 'health' },
  ],
  
  // EKER 2: TRYGGHET (trygg)
  safety: [
    { code: 'e310', domain: 'Närmaste familjen', category: 'safety' },
    { code: 'e320', domain: 'Vänner och bekanta', category: 'safety' },
    { code: 'e330', domain: 'Personer i överordnad ställning', category: 'safety' },
    { code: 'e325', domain: 'Kamrater, kollegor, grannar och samhällsmedlemmar', category: 'safety' },
    { code: 'e410', domain: 'Individuella attityder hos närmaste familjen', category: 'safety' },
    { code: 'e420', domain: 'Individuella attityder hos vänner', category: 'safety' },
    { code: 'e5750', domain: 'Allmänna socialtjänster', category: 'safety' },
  ],
  
  // EKER 3: LÄRANDE (larande)
  learning: [
    { code: 'e585', domain: 'Utbildnings- och träningstjänster', category: 'learning' },
    { code: 'e1301', domain: 'Läromedel för utbildning', category: 'learning' },
    { code: 'e250', domain: 'Ljud (fysisk miljö)', category: 'learning' },
    { code: 'e130', domain: 'Produkter och teknologi för utbildning', category: 'learning' },
    { code: 'e330', domain: 'Lärare och pedagoger', category: 'learning' },
    { code: 'e240', domain: 'Ljus (fysisk miljö)', category: 'learning' },
    { code: 'e135', domain: 'Hjälpmedel för utbildning', category: 'learning' },
  ],
  
  // EKER 4: AKTIV (aktiv)
  active: [
    { code: 'e5700', domain: 'Sociala trygghetssystem', category: 'active' },
    { code: 'e150', domain: 'Produkter och teknologi för rekreation', category: 'active' },
    { code: 'e9201', domain: 'Sport och fritidsaktiviteter', category: 'active' },
    { code: 'e155', domain: 'Design och konstruktion av byggnader för rekreation', category: 'active' },
    { code: 'e165', domain: 'Tillgångar (ekonomi)', category: 'active' },
  ],
  
  // EKER 5: RESPEKTERAD (respekterad)
  respected: [
    { code: 'e460', domain: 'Samhälleliga attityder', category: 'respected' },
    { code: 'e410', domain: 'Individuella attityder hos närmaste familjen', category: 'respected' },
    { code: 'e420', domain: 'Individuella attityder hos vänner', category: 'respected' },
    { code: 'e430', domain: 'Individuella attityder hos personer i överordnad ställning', category: 'respected' },
    { code: 'e465', domain: 'Normer, sedvänjor och ideologier', category: 'respected' },
  ],
  
  // EKER 6: ANSVARIG (ansvarig)
  responsible: [
    { code: 'e570', domain: 'Sociala trygghetssystem, tjänster och policy', category: 'responsible' },
    { code: 'e310', domain: 'Närmaste familjen (stöd för ansvar)', category: 'responsible' },
    { code: 'e330', domain: 'Personer i överordnad ställning (vägledning)', category: 'responsible' },
  ],
  
  // EKER 7: INKLUDERAD (inkluderad)
  included: [
    { code: 'e5750', domain: 'Allmän socialpolitik', category: 'included' },
    { code: 'e240', domain: 'Ljus (fysisk miljö)', category: 'included' },
    { code: 'e325', domain: 'Kamrater och bekanta', category: 'included' },
    { code: 'e150', domain: 'Design av byggnader för offentligt bruk', category: 'included' },
    { code: 'e460', domain: 'Samhälleliga attityder', category: 'included' },
  ],
  
  // EKER 8: OMHÄNDERTAGEN (nurtured)
  nurtured: [
    { code: 'e310', domain: 'Närmaste familjen', category: 'nurtured' },
    { code: 'e410', domain: 'Individuella attityder hos närmaste familjen', category: 'nurtured' },
    { code: 'e340', domain: 'Personligt stöd och assistenter', category: 'nurtured' },
    { code: 'e5750', domain: 'Allmän socialpolitik', category: 'nurtured' },
    { code: 'e355', domain: 'Vårdpersonal', category: 'nurtured' },
  ]
};

// ==========================================
// HELPER FUNCTION: Create Environmental Factor
// ==========================================

/**
 * Helper function to create an EnvironmentalFactor instance
 * 
 * @param code - ICF e-code (e.g., "e310", "e1301")
 * @param domain - Domain in Swedish
 * @param type - 'barrier' or 'facilitator'
 * @param level - 0-4 for barriers (.0-.4) or facilitators (+0-+4)
 * @param description - Free text description
 * @param relatedSpokes - Which welfare wheel spokes are affected
 * @param context - Where the factor operates
 * @param identifiedBy - Which sector identified this factor
 * @returns EnvironmentalFactor object
 */
export function createEnvironmentalFactor(
  code: string,
  domain: string,
  type: EnvironmentalFactorType,
  level: number,
  description: string,
  relatedSpokes: WelfareWheelSpoke[],
  context: 'home' | 'school' | 'healthcare' | 'community',
  identifiedBy: ActorSector
): EnvironmentalFactor {
  return {
    code,
    domain,
    type,
    level: level as BarrierLevel | FacilitatorLevel,
    description,
    relatedSpokes,
    identifiedDate: new Date().toISOString().split('T')[0],
    identifiedBy,
    context,
    status: 'active'
  };
}

// ==========================================
// EXAMPLE BARRIERS
// ==========================================

export const EXAMPLE_BARRIERS = {
  noise: {
    code: 'e250',
    domain: 'Ljud (fysisk miljö)',
    category: 'learning',
    exampleDescription: 'Hög ljudnivå i klassrummet stressar och hindrar koncentration'
  },
  socialAttitudes: {
    code: 'e460',
    domain: 'Samhälleliga attityder',
    category: 'respected',
    exampleDescription: 'Stigmatisering kring funktionsnedsättning påverkar självbild'
  },
  economicResources: {
    code: 'e165',
    domain: 'Tillgångar (ekonomi)',
    category: 'active',
    exampleDescription: 'Begränsade ekonomiska resurser hindrar deltagande i fritidsaktiviteter'
  },
  familyStress: {
    code: 'e310',
    domain: 'Närmaste familjen',
    category: 'nurtured',
    exampleDescription: 'Hög stressnivå i familjen påverkar barnet negativt'
  }
};

// ==========================================
// EXAMPLE FACILITATORS
// ==========================================

export const EXAMPLE_FACILITATORS = {
  adaptedMaterials: {
    code: 'e1301',
    domain: 'Läromedel för utbildning',
    category: 'learning',
    exampleDescription: 'Inlästa böcker och bildstöd underlättar läsning'
  },
  supportiveFamily: {
    code: 'e310',
    domain: 'Närmaste familjen',
    category: 'nurtured',
    exampleDescription: 'Engagerade föräldrar som stöttar läxläsning och utveckling'
  },
  medication: {
    code: 'e1101',
    domain: 'Läkemedel',
    category: 'health',
    exampleDescription: 'ADHD-medicinering förbättrar koncentration och impulskontroll'
  },
  healthcare: {
    code: 'e580',
    domain: 'Hälso- och sjukvårdstjänster',
    category: 'health',
    exampleDescription: 'Regelbunden BUP-kontakt ger psykologiskt stöd'
  },
  specialEducation: {
    code: 'e585',
    domain: 'Utbildnings- och träningstjänster',
    category: 'learning',
    exampleDescription: 'Specialpedagog 3 tim/vecka ger anpassat lärande'
  }
};

// ==========================================
// HELPER: Get Environmental Factors for Spoke
// ==========================================

export function getEnvironmentalFactorsForSpoke(spoke: WelfareWheelSpoke): { code: string; domain: string; category: string }[] {
  switch (spoke) {
    case 'halsa':
      return COMMON_ENVIRONMENTAL_FACTORS.health;
    case 'trygg':
      return COMMON_ENVIRONMENTAL_FACTORS.safety;
    case 'ansvarstagande':
      return COMMON_ENVIRONMENTAL_FACTORS.learning;
    case 'aktiv':
      return COMMON_ENVIRONMENTAL_FACTORS.active;
    case 'respekterad':
      return COMMON_ENVIRONMENTAL_FACTORS.respected;
    case 'omvardad':
      return COMMON_ENVIRONMENTAL_FACTORS.nurtured;
    case 'delaktig':
      return COMMON_ENVIRONMENTAL_FACTORS.included;
    case 'utvecklas':
      return COMMON_ENVIRONMENTAL_FACTORS.learning;
    default:
      return [];
  }
}
