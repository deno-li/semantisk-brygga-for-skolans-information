import React, { useState, useEffect, useMemo } from 'react';
import {
  Trophy,
  Star,
  Zap,
  Target,
  Heart,
  Shield,
  Users,
  Award,
  Flame,
  Crown,
  Gem,
  Medal,
  Gift,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Lock,
  Unlock,
  TrendingUp,
  Calendar,
  Clock,
  BookOpen,
  MessageCircle,
  ThumbsUp,
  Lightbulb,
  Rocket,
  Sun,
  Moon,
  Cloud,
  Rainbow
} from 'lucide-react';

// ============================================
// TYPES
// ============================================
interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: 'wellbeing' | 'social' | 'learning' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  requirement: {
    type: 'spoke_level' | 'streak' | 'quests_completed' | 'total_xp' | 'special';
    value: number;
    spoke?: string;
  };
  unlockedAt?: Date;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: 'daily' | 'weekly' | 'challenge';
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  steps: QuestStep[];
  expiresAt?: Date;
  completedAt?: Date;
}

interface QuestStep {
  id: string;
  description: string;
  completed: boolean;
}

interface UserProgress {
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  lastActivityDate: string;
  achievements: string[];
  completedQuests: string[];
  spokeProgress: Record<string, number>;
}

// ============================================
// ACHIEVEMENTS DATA
// ============================================
const ACHIEVEMENTS: Achievement[] = [
  // Wellbeing achievements
  {
    id: 'first-check-in',
    title: 'Första incheckningen',
    description: 'Slutför din första dagliga incheckning',
    emoji: '🌟',
    category: 'wellbeing',
    rarity: 'common',
    xpReward: 50,
    requirement: { type: 'quests_completed', value: 1 }
  },
  {
    id: 'feeling-good',
    title: 'Må bra-mästare',
    description: 'Nå nivå 4 i "Må bra"',
    emoji: '💚',
    category: 'wellbeing',
    rarity: 'rare',
    xpReward: 100,
    requirement: { type: 'spoke_level', value: 4, spoke: 'healthy' }
  },
  {
    id: 'super-safe',
    title: 'Trygghetshjälte',
    description: 'Nå nivå 5 i "Trygg"',
    emoji: '🛡️',
    category: 'wellbeing',
    rarity: 'epic',
    xpReward: 200,
    requirement: { type: 'spoke_level', value: 5, spoke: 'safe' }
  },
  {
    id: 'balanced-life',
    title: 'Balanserad',
    description: 'Ha minst nivå 3 i alla områden',
    emoji: '⚖️',
    category: 'wellbeing',
    rarity: 'legendary',
    xpReward: 500,
    requirement: { type: 'special', value: 0 }
  },

  // Social achievements
  {
    id: 'team-player',
    title: 'Lagspelare',
    description: 'Delta i en gruppaktivitet',
    emoji: '🤝',
    category: 'social',
    rarity: 'common',
    xpReward: 50,
    requirement: { type: 'quests_completed', value: 3 }
  },
  {
    id: 'friend-maker',
    title: 'Kompisskapare',
    description: 'Nå nivå 4 i "Delaktig"',
    emoji: '👋',
    category: 'social',
    rarity: 'rare',
    xpReward: 100,
    requirement: { type: 'spoke_level', value: 4, spoke: 'included' }
  },
  {
    id: 'super-supporter',
    title: 'Superstödjare',
    description: 'Hjälp 5 andra genom uppmuntrande meddelanden',
    emoji: '💪',
    category: 'social',
    rarity: 'epic',
    xpReward: 200,
    requirement: { type: 'special', value: 5 }
  },

  // Learning achievements
  {
    id: 'curious-mind',
    title: 'Nyfiken hjärna',
    description: 'Slutför din första berättelse',
    emoji: '🧠',
    category: 'learning',
    rarity: 'common',
    xpReward: 50,
    requirement: { type: 'quests_completed', value: 1 }
  },
  {
    id: 'growth-mindset',
    title: 'Utvecklingstänk',
    description: 'Nå nivå 4 i "Utvecklas"',
    emoji: '🌱',
    category: 'learning',
    rarity: 'rare',
    xpReward: 100,
    requirement: { type: 'spoke_level', value: 4, spoke: 'achieving' }
  },
  {
    id: 'story-master',
    title: 'Berättelsemästare',
    description: 'Slutför alla berättelser',
    emoji: '📚',
    category: 'learning',
    rarity: 'epic',
    xpReward: 300,
    requirement: { type: 'special', value: 0 }
  },

  // Streak achievements
  {
    id: 'streak-3',
    title: 'Tredje dagen',
    description: 'Håll en 3-dagars svit',
    emoji: '🔥',
    category: 'special',
    rarity: 'common',
    xpReward: 75,
    requirement: { type: 'streak', value: 3 }
  },
  {
    id: 'streak-7',
    title: 'En hel vecka!',
    description: 'Håll en 7-dagars svit',
    emoji: '🌟',
    category: 'special',
    rarity: 'rare',
    xpReward: 150,
    requirement: { type: 'streak', value: 7 }
  },
  {
    id: 'streak-30',
    title: 'Månadsmästare',
    description: 'Håll en 30-dagars svit',
    emoji: '👑',
    category: 'special',
    rarity: 'legendary',
    xpReward: 1000,
    requirement: { type: 'streak', value: 30 }
  },

  // XP achievements
  {
    id: 'xp-100',
    title: 'På rätt spår',
    description: 'Samla 100 XP',
    emoji: '✨',
    category: 'special',
    rarity: 'common',
    xpReward: 25,
    requirement: { type: 'total_xp', value: 100 }
  },
  {
    id: 'xp-500',
    title: 'Stigande stjärna',
    description: 'Samla 500 XP',
    emoji: '⭐',
    category: 'special',
    rarity: 'rare',
    xpReward: 100,
    requirement: { type: 'total_xp', value: 500 }
  },
  {
    id: 'xp-2000',
    title: 'Superstjärna',
    description: 'Samla 2000 XP',
    emoji: '🌟',
    category: 'special',
    rarity: 'epic',
    xpReward: 300,
    requirement: { type: 'total_xp', value: 2000 }
  },
  {
    id: 'xp-10000',
    title: 'Legendarisk!',
    description: 'Samla 10000 XP',
    emoji: '💎',
    category: 'special',
    rarity: 'legendary',
    xpReward: 1000,
    requirement: { type: 'total_xp', value: 10000 }
  }
];

// ============================================
// QUESTS DATA
// ============================================
const generateDailyQuests = (): Quest[] => [
  {
    id: 'daily-checkin',
    title: 'Morgonkoll',
    description: 'Starta dagen med att reflektera över hur du mår',
    emoji: '☀️',
    category: 'daily',
    difficulty: 'easy',
    xpReward: 30,
    steps: [
      { id: 's1', description: 'Välj en emoji som visar hur du mår', completed: false },
      { id: 's2', description: 'Skriv en kort tanke om dagen', completed: false }
    ]
  },
  {
    id: 'daily-gratitude',
    title: 'Tacksamhetsminut',
    description: 'Tänk på tre saker du är tacksam för idag',
    emoji: '🙏',
    category: 'daily',
    difficulty: 'easy',
    xpReward: 25,
    steps: [
      { id: 's1', description: 'Första tacksamma tanken', completed: false },
      { id: 's2', description: 'Andra tacksamma tanken', completed: false },
      { id: 's3', description: 'Tredje tacksamma tanken', completed: false }
    ]
  },
  {
    id: 'daily-movement',
    title: 'Rörelserus',
    description: 'Rör på dig i minst 10 minuter',
    emoji: '🏃',
    category: 'daily',
    difficulty: 'medium',
    xpReward: 40,
    steps: [
      { id: 's1', description: 'Välj en aktivitet (promenad, dans, lek...)', completed: false },
      { id: 's2', description: 'Genomför aktiviteten', completed: false },
      { id: 's3', description: 'Berätta hur det kändes', completed: false }
    ]
  }
];

const generateWeeklyQuests = (): Quest[] => [
  {
    id: 'weekly-story',
    title: 'Veckans berättelse',
    description: 'Läs en hel berättelse och gör alla val',
    emoji: '📖',
    category: 'weekly',
    difficulty: 'medium',
    xpReward: 100,
    steps: [
      { id: 's1', description: 'Välj en berättelse', completed: false },
      { id: 's2', description: 'Läs alla kapitel', completed: false },
      { id: 's3', description: 'Reflektera över vad du lärde dig', completed: false }
    ]
  },
  {
    id: 'weekly-kindness',
    title: 'Vänlighetsuppdrag',
    description: 'Gör något snällt för någon annan varje dag',
    emoji: '💝',
    category: 'weekly',
    difficulty: 'medium',
    xpReward: 150,
    steps: [
      { id: 's1', description: 'Måndag: En snäll handling', completed: false },
      { id: 's2', description: 'Tisdag: En snäll handling', completed: false },
      { id: 's3', description: 'Onsdag: En snäll handling', completed: false },
      { id: 's4', description: 'Torsdag: En snäll handling', completed: false },
      { id: 's5', description: 'Fredag: En snäll handling', completed: false }
    ]
  },
  {
    id: 'weekly-reflection',
    title: 'Veckoreflektion',
    description: 'Sammanfatta din vecka med välbefinnandehjulet',
    emoji: '🔄',
    category: 'weekly',
    difficulty: 'easy',
    xpReward: 75,
    steps: [
      { id: 's1', description: 'Uppdatera ditt välbefinnandehjul', completed: false },
      { id: 's2', description: 'Identifiera vad som gick bra', completed: false },
      { id: 's3', description: 'Sätt ett mål för nästa vecka', completed: false }
    ]
  }
];

const CHALLENGE_QUESTS: Quest[] = [
  {
    id: 'challenge-30-days',
    title: '30-dagarsutmaningen',
    description: 'Checka in varje dag i 30 dagar',
    emoji: '🏆',
    category: 'challenge',
    difficulty: 'hard',
    xpReward: 500,
    steps: Array.from({ length: 30 }, (_, i) => ({
      id: `day-${i + 1}`,
      description: `Dag ${i + 1}`,
      completed: false
    }))
  },
  {
    id: 'challenge-all-stories',
    title: 'Berättelsesamlare',
    description: 'Läs och slutför alla berättelser i biblioteket',
    emoji: '📚',
    category: 'challenge',
    difficulty: 'hard',
    xpReward: 400,
    steps: [
      { id: 's1', description: 'Alex börjar ny skola', completed: false },
      { id: 's2', description: 'Mias stora känslor', completed: false },
      { id: 's3', description: 'Omars grupparbete', completed: false }
    ]
  },
  {
    id: 'challenge-balance',
    title: 'Balansutmaningen',
    description: 'Nå nivå 4 i alla välbefinnandeområden',
    emoji: '⚖️',
    category: 'challenge',
    difficulty: 'hard',
    xpReward: 750,
    steps: [
      { id: 's1', description: 'Trygg: Nivå 4', completed: false },
      { id: 's2', description: 'Må bra: Nivå 4', completed: false },
      { id: 's3', description: 'Utvecklas: Nivå 4', completed: false },
      { id: 's4', description: 'Omvårdad: Nivå 4', completed: false },
      { id: 's5', description: 'Aktiv: Nivå 4', completed: false },
      { id: 's6', description: 'Respekterad: Nivå 4', completed: false },
      { id: 's7', description: 'Ansvarsfull: Nivå 4', completed: false },
      { id: 's8', description: 'Delaktig: Nivå 4', completed: false }
    ]
  }
];

// ============================================
// RARITY STYLES
// ============================================
const RARITY_STYLES = {
  common: {
    bg: 'bg-gray-100',
    border: 'border-gray-300',
    text: 'text-gray-700',
    glow: '',
    label: 'Vanlig'
  },
  rare: {
    bg: 'bg-blue-100',
    border: 'border-blue-400',
    text: 'text-blue-700',
    glow: 'shadow-blue-200',
    label: 'Sällsynt'
  },
  epic: {
    bg: 'bg-purple-100',
    border: 'border-purple-400',
    text: 'text-purple-700',
    glow: 'shadow-purple-200',
    label: 'Episk'
  },
  legendary: {
    bg: 'bg-gradient-to-r from-amber-100 to-yellow-100',
    border: 'border-amber-400',
    text: 'text-amber-700',
    glow: 'shadow-amber-200 shadow-lg',
    label: 'Legendarisk'
  }
};

const DIFFICULTY_STYLES = {
  easy: { color: 'text-emerald-600', bg: 'bg-emerald-100', label: 'Lätt' },
  medium: { color: 'text-amber-600', bg: 'bg-amber-100', label: 'Medel' },
  hard: { color: 'text-red-600', bg: 'bg-red-100', label: 'Svår' }
};

// ============================================
// LEVEL CALCULATION
// ============================================
const calculateLevel = (xp: number): { level: number; currentXp: number; xpToNext: number } => {
  // XP curve: each level requires more XP
  let level = 1;
  let totalXpRequired = 0;
  let xpForCurrentLevel = 100;

  while (totalXpRequired + xpForCurrentLevel <= xp) {
    totalXpRequired += xpForCurrentLevel;
    level++;
    xpForCurrentLevel = Math.floor(100 * Math.pow(1.2, level - 1));
  }

  return {
    level,
    currentXp: xp - totalXpRequired,
    xpToNext: xpForCurrentLevel
  };
};

// ============================================
// GAMIFICATION SYSTEM COMPONENT
// ============================================
export const GamificationSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'quests' | 'achievements'>('overview');
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [showAchievementUnlock, setShowAchievementUnlock] = useState<Achievement | null>(null);

  // Simulated user progress (would come from backend)
  const [userProgress, setUserProgress] = useState<UserProgress>({
    level: 5,
    xp: 847,
    xpToNextLevel: 244,
    streak: 7,
    lastActivityDate: new Date().toISOString(),
    achievements: ['first-check-in', 'streak-3', 'xp-100', 'curious-mind', 'team-player', 'streak-7'],
    completedQuests: ['daily-checkin', 'daily-gratitude'],
    spokeProgress: {
      safe: 4, healthy: 3, achieving: 4, nurtured: 5,
      active: 3, respected: 4, responsible: 3, included: 4
    }
  });

  const dailyQuests = useMemo(() => generateDailyQuests(), []);
  const weeklyQuests = useMemo(() => generateWeeklyQuests(), []);
  const allQuests = useMemo(() => [...dailyQuests, ...weeklyQuests, ...CHALLENGE_QUESTS], [dailyQuests, weeklyQuests]);

  const levelInfo = useMemo(() => calculateLevel(userProgress.xp), [userProgress.xp]);

  const unlockedAchievements = useMemo(() =>
    ACHIEVEMENTS.filter(a => userProgress.achievements.includes(a.id)),
    [userProgress.achievements]
  );

  const lockedAchievements = useMemo(() =>
    ACHIEVEMENTS.filter(a => !userProgress.achievements.includes(a.id)),
    [userProgress.achievements]
  );

  const handleCompleteStep = (quest: Quest, stepId: string) => {
    // In a real app, this would update the backend
    const updatedQuest = {
      ...quest,
      steps: quest.steps.map(s =>
        s.id === stepId ? { ...s, completed: true } : s
      )
    };

    const allStepsComplete = updatedQuest.steps.every(s => s.completed);
    if (allStepsComplete) {
      // Award XP
      setUserProgress(prev => ({
        ...prev,
        xp: prev.xp + quest.xpReward,
        completedQuests: [...prev.completedQuests, quest.id]
      }));
    }

    setSelectedQuest(updatedQuest);
  };

  // Overview tab
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Level & XP Card */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl shadow-lg">
              {levelInfo.level < 5 ? '🌱' : levelInfo.level < 10 ? '🌿' : levelInfo.level < 20 ? '🌳' : '🌟'}
            </div>
            <div>
              <p className="text-white/80 text-sm">Din nivå</p>
              <p className="text-3xl font-bold">Nivå {levelInfo.level}</p>
            </div>
          </div>

          {/* Streak */}
          <div className="text-center">
            <div className="flex items-center gap-2 justify-center mb-1">
              <Flame className="w-6 h-6 text-orange-300" />
              <span className="text-3xl font-bold">{userProgress.streak}</span>
            </div>
            <p className="text-white/80 text-sm">dagars svit</p>
          </div>
        </div>

        {/* XP Progress */}
        <div className="bg-white/20 backdrop-blur rounded-2xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/80">Framsteg till nästa nivå</span>
            <span className="font-bold">{levelInfo.currentXp} / {levelInfo.xpToNext} XP</span>
          </div>
          <div className="h-4 bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-500"
              style={{ width: `${(levelInfo.currentXp / levelInfo.xpToNext) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-200 text-center">
          <Trophy className="w-8 h-8 mx-auto mb-2 text-amber-500" />
          <p className="text-2xl font-bold text-gray-900">{unlockedAchievements.length}</p>
          <p className="text-sm text-gray-500">Prestationer</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-200 text-center">
          <Target className="w-8 h-8 mx-auto mb-2 text-indigo-500" />
          <p className="text-2xl font-bold text-gray-900">{userProgress.completedQuests.length}</p>
          <p className="text-sm text-gray-500">Uppdrag klara</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-200 text-center">
          <Sparkles className="w-8 h-8 mx-auto mb-2 text-purple-500" />
          <p className="text-2xl font-bold text-gray-900">{userProgress.xp}</p>
          <p className="text-sm text-gray-500">Total XP</p>
        </div>
      </div>

      {/* Today's Quests */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Sun className="w-5 h-5 text-amber-500" />
          Dagens uppdrag
        </h3>
        <div className="space-y-3">
          {dailyQuests.slice(0, 3).map(quest => {
            const isCompleted = userProgress.completedQuests.includes(quest.id);
            return (
              <button
                key={quest.id}
                onClick={() => setSelectedQuest(quest)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                  isCompleted
                    ? 'bg-emerald-50 border-2 border-emerald-200'
                    : 'bg-gray-50 border-2 border-transparent hover:border-indigo-200'
                }`}
              >
                <span className="text-2xl">{quest.emoji}</span>
                <div className="flex-1 text-left">
                  <p className={`font-medium ${isCompleted ? 'text-emerald-700 line-through' : 'text-gray-900'}`}>
                    {quest.title}
                  </p>
                  <p className="text-sm text-gray-500">{quest.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${DIFFICULTY_STYLES[quest.difficulty].bg} ${DIFFICULTY_STYLES[quest.difficulty].color}`}>
                    +{quest.xpReward} XP
                  </span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Achievements */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          Senaste prestationer
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {unlockedAchievements.slice(-4).reverse().map(achievement => (
            <div
              key={achievement.id}
              className={`flex-shrink-0 w-24 p-3 rounded-xl text-center ${RARITY_STYLES[achievement.rarity].bg} border-2 ${RARITY_STYLES[achievement.rarity].border}`}
            >
              <span className="text-3xl">{achievement.emoji}</span>
              <p className="text-xs font-medium mt-2 text-gray-700 line-clamp-2">
                {achievement.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Quests tab
  const renderQuests = () => (
    <div className="space-y-6">
      {/* Daily Quests */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Sun className="w-5 h-5 text-amber-500" />
          Dagliga uppdrag
          <span className="text-sm font-normal text-gray-500">Återställs vid midnatt</span>
        </h3>
        <div className="space-y-3">
          {dailyQuests.map(quest => (
            <QuestCard
              key={quest.id}
              quest={quest}
              isCompleted={userProgress.completedQuests.includes(quest.id)}
              onClick={() => setSelectedQuest(quest)}
            />
          ))}
        </div>
      </div>

      {/* Weekly Quests */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-500" />
          Veckouppdrag
          <span className="text-sm font-normal text-gray-500">Återställs på måndag</span>
        </h3>
        <div className="space-y-3">
          {weeklyQuests.map(quest => (
            <QuestCard
              key={quest.id}
              quest={quest}
              isCompleted={userProgress.completedQuests.includes(quest.id)}
              onClick={() => setSelectedQuest(quest)}
            />
          ))}
        </div>
      </div>

      {/* Challenge Quests */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Rocket className="w-5 h-5 text-rose-500" />
          Utmaningar
          <span className="text-sm font-normal text-gray-500">Speciella uppdrag</span>
        </h3>
        <div className="space-y-3">
          {CHALLENGE_QUESTS.map(quest => (
            <QuestCard
              key={quest.id}
              quest={quest}
              isCompleted={userProgress.completedQuests.includes(quest.id)}
              onClick={() => setSelectedQuest(quest)}
            />
          ))}
        </div>
      </div>
    </div>
  );

  // Achievements tab
  const renderAchievements = () => (
    <div className="space-y-6">
      {/* Progress summary */}
      <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-2xl p-5 border border-amber-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-amber-900">Prestationsframsteg</h3>
            <p className="text-amber-700">
              {unlockedAchievements.length} av {ACHIEVEMENTS.length} upplåsta
            </p>
          </div>
          <div className="text-4xl">🏆</div>
        </div>
        <div className="mt-3 h-3 bg-amber-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-amber-500 rounded-full transition-all"
            style={{ width: `${(unlockedAchievements.length / ACHIEVEMENTS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Unlocked achievements */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Unlock className="w-5 h-5 text-emerald-500" />
          Upplåsta ({unlockedAchievements.length})
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {unlockedAchievements.map(achievement => (
            <AchievementCard key={achievement.id} achievement={achievement} unlocked />
          ))}
        </div>
      </div>

      {/* Locked achievements */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-gray-400" />
          Låsta ({lockedAchievements.length})
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {lockedAchievements.map(achievement => (
            <AchievementCard key={achievement.id} achievement={achievement} unlocked={false} />
          ))}
        </div>
      </div>
    </div>
  );

  // Quest detail modal
  const renderQuestDetail = () => {
    if (!selectedQuest) return null;

    const completedSteps = selectedQuest.steps.filter(s => s.completed).length;
    const isFullyCompleted = completedSteps === selectedQuest.steps.length;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
          <div className={`p-6 ${DIFFICULTY_STYLES[selectedQuest.difficulty].bg}`}>
            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${DIFFICULTY_STYLES[selectedQuest.difficulty].bg} ${DIFFICULTY_STYLES[selectedQuest.difficulty].color} border border-current`}>
                {DIFFICULTY_STYLES[selectedQuest.difficulty].label}
              </span>
              <button
                onClick={() => setSelectedQuest(null)}
                className="p-2 rounded-full hover:bg-black/10 transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-5xl">{selectedQuest.emoji}</span>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedQuest.title}</h2>
                <p className="text-gray-600">{selectedQuest.description}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Framsteg</span>
                <span className="text-sm text-gray-500">{completedSteps} / {selectedQuest.steps.length}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                  style={{ width: `${(completedSteps / selectedQuest.steps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-3 mb-6">
              {selectedQuest.steps.map((step, index) => (
                <button
                  key={step.id}
                  onClick={() => !step.completed && handleCompleteStep(selectedQuest, step.id)}
                  disabled={step.completed}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${
                    step.completed
                      ? 'bg-emerald-50 border-2 border-emerald-200'
                      : 'bg-gray-50 border-2 border-transparent hover:border-indigo-200 hover:bg-indigo-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step.completed ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step.completed ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
                  </div>
                  <span className={`flex-1 text-left ${step.completed ? 'text-emerald-700 line-through' : 'text-gray-700'}`}>
                    {step.description}
                  </span>
                </button>
              ))}
            </div>

            {/* Reward */}
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-amber-600" />
                  <span className="font-medium text-amber-900">Belöning</span>
                </div>
                <span className="font-bold text-amber-700">+{selectedQuest.xpReward} XP</span>
              </div>
            </div>

            {isFullyCompleted && (
              <div className="mt-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="font-bold text-emerald-800">Uppdraget slutfört!</p>
                <p className="text-sm text-emerald-600">Du fick {selectedQuest.xpReward} XP</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-3xl p-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Spelifiering</h2>
            <p className="text-gray-600">Samla XP, lås upp prestationer!</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-white/50 rounded-xl p-1">
        {[
          { id: 'overview', label: 'Översikt', icon: Star },
          { id: 'quests', label: 'Uppdrag', icon: Target },
          { id: 'achievements', label: 'Prestationer', icon: Trophy }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
              activeTab === tab.id
                ? 'bg-white shadow-md text-indigo-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'quests' && renderQuests()}
      {activeTab === 'achievements' && renderAchievements()}

      {/* Quest Detail Modal */}
      {renderQuestDetail()}
    </div>
  );
};

// ============================================
// HELPER COMPONENTS
// ============================================
const QuestCard: React.FC<{
  quest: Quest;
  isCompleted: boolean;
  onClick: () => void;
}> = ({ quest, isCompleted, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
      isCompleted
        ? 'bg-emerald-50 border-emerald-200'
        : 'bg-white border-gray-200 hover:border-indigo-300 hover:shadow-md'
    }`}
  >
    <span className="text-3xl">{quest.emoji}</span>
    <div className="flex-1 text-left">
      <p className={`font-semibold ${isCompleted ? 'text-emerald-700 line-through' : 'text-gray-900'}`}>
        {quest.title}
      </p>
      <p className="text-sm text-gray-500">{quest.description}</p>
      <div className="flex items-center gap-2 mt-2">
        <span className={`px-2 py-0.5 rounded-full text-xs ${DIFFICULTY_STYLES[quest.difficulty].bg} ${DIFFICULTY_STYLES[quest.difficulty].color}`}>
          {DIFFICULTY_STYLES[quest.difficulty].label}
        </span>
        <span className="text-xs text-gray-500">
          {quest.steps.filter(s => s.completed).length}/{quest.steps.length} steg
        </span>
      </div>
    </div>
    <div className="text-right">
      <span className="font-bold text-indigo-600">+{quest.xpReward}</span>
      <p className="text-xs text-gray-500">XP</p>
    </div>
  </button>
);

const AchievementCard: React.FC<{
  achievement: Achievement;
  unlocked: boolean;
}> = ({ achievement, unlocked }) => {
  const style = RARITY_STYLES[achievement.rarity];

  return (
    <div
      className={`p-4 rounded-xl border-2 transition-all ${
        unlocked
          ? `${style.bg} ${style.border} ${style.glow}`
          : 'bg-gray-100 border-gray-200 opacity-60'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className={`text-3xl ${!unlocked && 'grayscale'}`}>
          {unlocked ? achievement.emoji : '🔒'}
        </span>
        <div className="flex-1 min-w-0">
          <p className={`font-semibold ${unlocked ? style.text : 'text-gray-500'}`}>
            {achievement.title}
          </p>
          <p className="text-xs text-gray-500 line-clamp-2">
            {achievement.description}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`px-2 py-0.5 rounded-full text-xs ${style.bg} ${style.text} border ${style.border}`}>
              {style.label}
            </span>
            <span className="text-xs text-amber-600 font-medium">
              +{achievement.xpReward} XP
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamificationSystem;
