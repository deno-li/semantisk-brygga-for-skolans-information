// Multiple child profiles showing different support levels and situations
import { ChildProfile, EnhancedChildProfile, SupportLevel, LifePhase } from './types';

// ==========================================
// BASIC CHILD PROFILES
// ==========================================

export const CHILD_PROFILES: {[key: string]: ChildProfile} = {
  // NIVÅ 3: Förstärkt stöd (Erik - existing profile)
  'erik': {
    name: "Erik A.",
    ssn: "YYYYMMDD-XXXX",
    age: 15,
    school: "Exempel Grundskola",
    grade: "Åk 9",
    sipActive: true,
    sipGoal: {
      child: "Målet är att jag ska bli bättre på att läsa och känna mig lugn i skolan.",
      professional: "Erik ska uppnå åldersadekvat läsförmåga och känna trygghet i sin skolsituation senast juni 2026."
    }
  },

  // NIVÅ 1: Universell - Barn som mår bra
  'lisa': {
    name: "Lisa J.",
    ssn: "YYYYMMDD-XXXX",
    age: 12,
    school: "Exempel Grundskola",
    grade: "Åk 6",
    sipActive: false,
    sipGoal: {
      child: "Fortsätta må bra och utvecklas i skolan.",
      professional: "Lisa ska fortsätta sin positiva utveckling och bibehålla goda studieresultat."
    }
  },

  // NIVÅ 2: Tidig uppmärksamhet - Lätt oro
  'omar': {
    name: "Omar H.",
    ssn: "YYYYMMDD-XXXX",
    age: 11,
    school: "Exempel Grundskola",
    grade: "Åk 5",
    sipActive: false,
    sipGoal: {
      child: "Jag ska bli tryggare i att prata svenska och hitta nya kompisar.",
      professional: "Omar ska utveckla sitt svenska språk och stärka sina sociala relationer."
    }
  },

  // NIVÅ 4: Intensivt stöd - Komplex problematik
  'sofia': {
    name: "Sofia B.",
    ssn: "YYYYMMDD-XXXX",
    age: 16,
    school: "Exempel Gymnasium",
    grade: "TE 1",
    sipActive: true,
    sipGoal: {
      child: "Jag ska må bättre, sova bättre och klara av skolan.",
      professional: "Sofia ska få stöd för sin psykiska hälsa, förbättra sömnkvaliteten och uppnå stabil närvaro i skolan senast december 2025."
    }
  }
};

// ==========================================
// PROFILE METADATA
// ==========================================

export interface ChildProfileMetadata {
  id: string;
  supportLevel: SupportLevel;
  currentPhase: LifePhase;
  description: string;
  emoji: string;
  colorScheme: {
    primary: string;
    background: string;
  };
}

export const PROFILE_METADATA: {[key: string]: ChildProfileMetadata} = {
  'erik': {
    id: 'erik',
    supportLevel: 'enhanced-support',
    currentPhase: 'elementary-school',
    description: 'Förstärkt stöd - ADHD och dyslexi med SIP',
    emoji: '👦',
    colorScheme: {
      primary: '#E87C00',
      background: '#FFF4E6'
    }
  },

  'lisa': {
    id: 'lisa',
    supportLevel: 'universal',
    currentPhase: 'elementary-school',
    description: 'Universell nivå - Mår bra, inga bekymmer',
    emoji: '👧',
    colorScheme: {
      primary: '#378056',
      background: '#E8F5E9'
    }
  },

  'omar': {
    id: 'omar',
    supportLevel: 'early-attention',
    currentPhase: 'elementary-school',
    description: 'Tidig uppmärksamhet - Språksvårigheter och social oro',
    emoji: '👦🏽',
    colorScheme: {
      primary: '#FFC107',
      background: '#FFFEF7'
    }
  },

  'sofia': {
    id: 'sofia',
    supportLevel: 'intensive-support',
    currentPhase: 'high-school',
    description: 'Intensivt stöd - Psykisk ohälsa och familjesituation',
    emoji: '👧🏼',
    colorScheme: {
      primary: '#B00020',
      background: '#FFEBEE'
    }
  }
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================

export function getProfileById(id: string): ChildProfile {
  return CHILD_PROFILES[id] || CHILD_PROFILES['erik'];
}

export function getProfileMetadata(id: string): ChildProfileMetadata {
  return PROFILE_METADATA[id] || PROFILE_METADATA['erik'];
}

export function getAllProfileIds(): string[] {
  return Object.keys(CHILD_PROFILES);
}

export function getSupportLevelColor(level: SupportLevel): string {
  switch (level) {
    case 'universal': return '#378056'; // Grön
    case 'early-attention': return '#FFC107'; // Gul
    case 'enhanced-support': return '#E87C00'; // Orange
    case 'intensive-support': return '#B00020'; // Röd
    default: return '#005595';
  }
}

export function getSupportLevelLabel(level: SupportLevel): string {
  switch (level) {
    case 'universal': return 'Nivå 1: Universell';
    case 'early-attention': return 'Nivå 2: Tidig uppmärksamhet';
    case 'enhanced-support': return 'Nivå 3: Förstärkt stöd';
    case 'intensive-support': return 'Nivå 4: Intensivt stöd';
    default: return 'Okänd nivå';
  }
}
