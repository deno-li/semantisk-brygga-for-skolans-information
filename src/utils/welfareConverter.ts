/**
 * Utility to convert WelfareWheelSpokeData (Journey Profile format) 
 * to ShanarriIndicator format for compatibility with existing components
 */

import { WelfareWheelSpokeData, ShanarriIndicator } from '../types/types';

// Color mapping for each spoke matching the SHANARRI_DATA colors
const SPOKE_COLORS: Record<string, string> = {
  trygg: '#005595',      // Safe - Blue
  halsa: '#378056',      // Healthy - Green
  utvecklas: '#C12143',  // Achieving - Red
  omvardad: '#B00020',   // Nurtured - Dark Red
  aktiv: '#E87C00',      // Active - Orange
  respekterad: '#6D8F13',// Respected - Olive Green
  ansvarstagande: '#00838F', // Responsible - Teal
  delaktig: '#6A2A5B'    // Included - Purple
};

// Spoke ID mapping for consistency
const SPOKE_ID_MAP: Record<string, string> = {
  trygg: 'safe',
  halsa: 'healthy',
  utvecklas: 'achieving',
  omvardad: 'nurtured',
  aktiv: 'active',
  respekterad: 'respected',
  ansvarstagande: 'responsible',
  delaktig: 'included'
};

// English name mapping
const SPOKE_NAME_EN_MAP: Record<string, string> = {
  trygg: 'Safe',
  halsa: 'Healthy',
  utvecklas: 'Achieving',
  omvardad: 'Nurtured',
  aktiv: 'Active',
  respekterad: 'Respected',
  ansvarstagande: 'Responsible',
  delaktig: 'Included'
};

// IBIC mapping for each spoke based on ICF life areas (d1-d9)
const SPOKE_IBIC_MAP: Record<string, string> = {
  trygg: 'Känsla av otrygghet, Omgivningsfaktorer, Stöd och relationer',
  halsa: 'Personlig vård, Sköta sin egen hälsa, Kroppsfunktioner',
  utvecklas: 'Lärande och tillämpa kunskap, Utbildning',
  omvardad: 'Att bistå andra, Familjerelationer, Stöd från närstående',
  aktiv: 'Samhällsgemenskap, socialt och medborgerligt liv, Rekreation och fritid',
  respekterad: 'Mellanmänskliga interaktioner, Attityder i omgivningen',
  ansvarstagande: 'Allmänna uppgifter och krav, Handläggning av stress, Handläggning av ansvar',
  delaktig: 'Samhällsgemenskap, Sociala relationer, Informella relationer'
};

// SNOMED CT mapping for each spoke
const SPOKE_SNOMED_MAP: Record<string, string> = {
  trygg: '371609003 (Känsla av trygghet)',
  halsa: '271919001 (God hälsa)',
  utvecklas: '224497003 (Skolprestation)',
  omvardad: '105455006 (Omsorgsstatus)',
  aktiv: '256235009 (Fritidsaktivitet)',
  respekterad: '125678000 (Självkänsla)',
  ansvarstagande: '288600008 (Förmåga att ta ansvar)',
  delaktig: '86603000 (Social delaktighet)'
};

// KVÅ (Klassifikation av Vårdåtgärder) mapping for each spoke
const SPOKE_KVA_MAP: Record<string, string> = {
  trygg: 'GD001 (Stödsamtal), GB009 (Krisintervention)',
  halsa: 'AU120 (Hälsobesök EMI), QV001 (Råd om fysisk aktivitet)',
  utvecklas: 'DU011 (Logopedutredning), QA010 (Pedagogisk kartläggning)',
  omvardad: 'XS005 (Social utredning), GB001 (Familjerådgivning)',
  aktiv: 'QV001 (Råd om fys. aktivitet), XV001 (Fritidsaktivitet)',
  respekterad: 'GD005 (Stödsamtal), GB010 (Psykosocialt stöd)',
  ansvarstagande: 'GB010 (Psykosocialt stöd), QA001 (Strukturerad observation)',
  delaktig: 'UX001 (Nätverkskarta), GD001 (Stödsamtal)'
};

// Default target value for all indicators
const DEFAULT_TARGET = 4;

/**
 * Convert a single WelfareWheelSpokeData to ShanarriIndicator format
 */
export function convertWelfareWheelToShanarri(spokeData: WelfareWheelSpokeData): ShanarriIndicator {
  const spokeKey = spokeData.spoke;
  const spokeId = SPOKE_ID_MAP[spokeKey] || spokeKey;
  const color = SPOKE_COLORS[spokeKey] || '#005595';
  const nameEn = SPOKE_NAME_EN_MAP[spokeKey] || spokeData.name;

  // Extract ICF domains - join array into comma-separated string for consistency with existing SHANARRI data
  const icfString = spokeData.icfDomains.join(', ');
  
  // Extract KSI targets - join array into pipe-separated string for consistency with existing SHANARRI data
  const ksiString = spokeData.ksiTargets.join(' | ');

  // Build notes from childIndicator and any existing notes
  let notes = spokeData.childIndicator;
  if (spokeData.notes) {
    notes += ` | ${spokeData.notes}`;
  }

  // Use default target value
  const target = DEFAULT_TARGET;

  // Extract BBIC info - use generic values that match spoke themes
  let bbic = '';
  let bbicCategory: 'child-development' | 'parenting' | 'family-environment' = 'child-development';
  let bbicArea = '';

  // Map spoke to BBIC categories based on common patterns
  switch (spokeKey) {
    case 'trygg':
      bbic = 'Säkerhet, Familj och miljö';
      bbicCategory = 'family-environment';
      bbicArea = 'Nuvarande familjesituation';
      break;
    case 'halsa':
      bbic = 'Hälsa, Känslor och beteende';
      bbicCategory = 'child-development';
      bbicArea = 'Hälsa';
      break;
    case 'utvecklas':
      bbic = 'Utbildning, Känslor och beteende';
      bbicCategory = 'child-development';
      bbicArea = 'Utbildning';
      break;
    case 'omvardad':
      bbic = 'Föräldrarnas förmåga, Grundläggande omsorg';
      bbicCategory = 'parenting';
      bbicArea = 'Grundläggande omsorg';
      break;
    case 'aktiv':
      bbic = 'Sociala relationer, Fritid';
      bbicCategory = 'family-environment';
      bbicArea = 'Social tillhörighet och integration';
      break;
    case 'respekterad':
      bbic = 'Sociala relationer, Känslor och beteende, Identitet och självbild';
      bbicCategory = 'parenting';
      bbicArea = 'Känslomässig tillgänglighet';
      break;
    case 'ansvarstagande':
      bbic = 'Känslor och beteende, Sociala relationer';
      bbicCategory = 'child-development';
      bbicArea = 'Känslor och beteende';
      break;
    case 'delaktig':
      bbic = 'Sociala relationer, Familj och miljö, Socialt nätverk';
      bbicCategory = 'child-development';
      bbicArea = 'Sociala relationer';
      break;
    default:
      bbic = 'Generellt område';
      bbicArea = 'Ej specificerat';
  }

  // Extract source from ss12000Source array
  const source = spokeData.ss12000Source[0] || 'Bedömning';

  // Get IBIC mapping from lookup table
  const ibic = SPOKE_IBIC_MAP[spokeKey] || '-';

  // Get SNOMED mapping - prefer data from journey profile, fallback to lookup table
  const snomed = spokeData.snomedCT || SPOKE_SNOMED_MAP[spokeKey];

  // Get KVÅ mapping from lookup table
  const kva = SPOKE_KVA_MAP[spokeKey] || '-';

  // Create the ShanarriIndicator object
  const indicator: ShanarriIndicator = {
    id: spokeId,
    name: spokeData.name,
    nameEn: nameEn,
    color: color,
    status: spokeData.status,
    target: target,
    icf: icfString,
    ksi: ksiString,
    bbic: bbic,
    bbicCategory: bbicCategory,
    bbicArea: bbicArea,
    ibic: ibic,
    kva: kva,
    snomed: snomed,
    source: source,
    notes: notes
  };

  return indicator;
}

/**
 * Convert an array of WelfareWheelSpokeData to ShanarriIndicator array
 */
export function convertWelfareWheelArrayToShanarri(
  spokeDataArray: WelfareWheelSpokeData[]
): ShanarriIndicator[] {
  return spokeDataArray.map(convertWelfareWheelToShanarri);
}
