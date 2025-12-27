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

/**
 * Convert a single WelfareWheelSpokeData to ShanarriIndicator format
 */
export function convertWelfareWheelToShanarri(spokeData: WelfareWheelSpokeData): ShanarriIndicator {
  const spokeKey = spokeData.spoke;
  const spokeId = SPOKE_ID_MAP[spokeKey] || spokeKey;
  const color = SPOKE_COLORS[spokeKey] || '#005595';
  const nameEn = SPOKE_NAME_EN_MAP[spokeKey] || spokeData.name;

  // Extract ICF domains - join array into pipe-separated string
  const icfString = spokeData.icfDomains.join(', ');
  
  // Extract KSI targets - join array into pipe-separated string
  const ksiString = spokeData.ksiTargets.join(' | ');

  // Build notes from childIndicator and any existing notes
  let notes = spokeData.childIndicator;
  if (spokeData.notes) {
    notes += ` | ${spokeData.notes}`;
  }

  // Default target to 4 if not specified
  const target = 4;

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
    ibic: icfString, // Use ICF as IBIC fallback
    kva: '-', // Not provided in Journey format, use placeholder
    source: source,
    notes: notes
  };

  // Add optional SNOMED if available
  if (spokeData.snomedCT) {
    indicator.snomed = spokeData.snomedCT;
  }

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
