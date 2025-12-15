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
      child: "Barnets mål",
      professional: "Se Eriks plan."
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
      child: "Barnets mål.",
      professional: "Se Lisas plan."
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
      child: "Barnets mål.",
      professional: "Se Omars plan."
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
      child: "Barnets mål.",
      professional: "Se Sofias plan."
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
