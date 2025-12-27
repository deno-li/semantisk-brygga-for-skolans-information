// Multiple child profiles showing different support levels and situations
import { ChildProfile, EnhancedChildProfile, SupportLevel, LifePhase } from '../types/types';

// ==========================================
// BASIC CHILD PROFILES
// ==========================================

export const CHILD_PROFILES: {[key: string]: ChildProfile} = {
  // NIVÅ 1: Universell - Barn som mår bra
  'erik': {
    name: "Erik A.",
    ssn: "YYYYMMDD-XXXX",
    age: 15,
    school: "Exempel Grundskola",
    grade: "Åk 9",
    sipActive: false,
    sipGoal: {
      child: "Barnets mål",
      professional: "Se Eriks plan."
    }
  },

  // NIVÅ 2: Stödprofil - Aktiv stödplan
  'lisa': {
    name: "Lisa J.",
    ssn: "YYYYMMDD-XXXX",
    age: 12,
    school: "Exempel Grundskola",
    grade: "Åk 6",
    sipActive: true,
    sipGoal: {
      child: "Barnets mål.",
      professional: "Se Lisas plan."
    }
  },

  // NIVÅ 2: Stödprofil - Dyslexi med anpassningar (från WHO ICF-guiden)
  'elsa': {
    name: "Elsa Bergström",
    ssn: "20141015-5678",
    age: 10,
    school: "Stigslundsskolan",
    grade: "Åk 4",
    sipActive: true,
    sipGoal: {
      child: "Jag vill kunna läsa böcker som mina kompisar läser och slippa vara rädd i skolan.",
      professional: "Elsa ska uppnå läsförmåga motsvarande åk 3-nivå och uppleva trygghet i skolmiljön senast juni 2026."
    }
  },

  // NIVÅ 1: Universell med tidig uppmärksamhet
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

  // NIVÅ 3: Samordning - Samordnad plan över sektorer
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
    supportLevel: 'universal',
    currentPhase: 'elementary-school',
    description: 'Universell nivå - Allt fungerar bra',
    emoji: '👦',
    colorScheme: {
      primary: '#378056',
      background: '#E8F5E9'
    }
  },

  'lisa': {
    id: 'lisa',
    supportLevel: 'enhanced-support',
    currentPhase: 'elementary-school',
    description: 'Stödprofil - Stödsamtal och social träning',
    emoji: '👧',
    colorScheme: {
      primary: '#E87C00',
      background: '#FFF4E6'
    }
  },

  'elsa': {
    id: 'elsa',
    supportLevel: 'enhanced-support',
    currentPhase: 'elementary-school',
    description: 'Stödprofil - Dyslexi med anpassningar (ICF-exempel)',
    emoji: '👧🏼',
    colorScheme: {
      primary: '#E87C00',
      background: '#FFF4E6'
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
    description: 'Samordning - BUP, socialtjänst och skola samverkar',
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
