import React, { useState, useEffect, useCallback } from 'react';
import {
  BookOpen,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Heart,
  Star,
  Users,
  Shield,
  Zap,
  Target,
  Award,
  MessageCircle,
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  Volume2,
  VolumeX
} from 'lucide-react';

// ============================================
// NARRATIVE STORY TYPES
// ============================================
interface StoryCharacter {
  id: string;
  name: string;
  age: number;
  emoji: string;
  description: string;
  color: string;
}

interface StoryChapter {
  id: string;
  title: string;
  emoji: string;
  narration: string;
  spokesFocus: string[];
  mood: 'hopeful' | 'challenging' | 'growing' | 'celebrating';
  choices?: StoryChoice[];
  reflection?: string;
  spokeChanges?: Record<string, number>;
}

interface StoryChoice {
  id: string;
  text: string;
  emoji: string;
  outcome: string;
  spokeEffect: Record<string, number>;
  nextChapterId?: string;
}

interface Story {
  id: string;
  title: string;
  description: string;
  character: StoryCharacter;
  chapters: StoryChapter[];
  theme: string;
  duration: string;
}

// ============================================
// SAMPLE STORIES
// ============================================
const STORIES: Story[] = [
  {
    id: 'alex-new-school',
    title: 'Alex börjar ny skola',
    description: 'Följ med Alex genom första veckan på en helt ny skola',
    theme: 'Anpassning och vänskap',
    duration: '5 min',
    character: {
      id: 'alex',
      name: 'Alex',
      age: 10,
      emoji: '👦',
      description: 'En nyfiken 10-åring som just flyttat till en ny stad',
      color: '#4F46E5'
    },
    chapters: [
      {
        id: 'ch1',
        title: 'Första dagen',
        emoji: '🏫',
        narration: `Det är måndag morgon och Alex står utanför den nya skolan. Hjärtat slår lite snabbare än vanligt. Alla andra verkar redan känna varandra.

"Vad händer om ingen vill prata med mig?" tänker Alex.

En lärare kommer fram och ler vänligt.`,
        spokesFocus: ['safe', 'included'],
        mood: 'challenging',
        choices: [
          {
            id: 'c1a',
            text: 'Hälsa och fråga var klassrummet är',
            emoji: '👋',
            outcome: 'Läraren visar vägen och berättar att klassen ser fram emot att träffa Alex.',
            spokeEffect: { safe: 1, included: 1 }
          },
          {
            id: 'c1b',
            text: 'Stanna tyst och följa efter de andra',
            emoji: '🚶',
            outcome: 'Alex hittar klassrummet men känner sig fortfarande osäker.',
            spokeEffect: { safe: 0, included: 0 }
          }
        ],
        reflection: 'Hur känns det att börja något nytt?'
      },
      {
        id: 'ch2',
        title: 'Rasten',
        emoji: '⚽',
        narration: `På rasten står Alex ensam vid sidan av fotbollsplanen. Några barn spelar och skrattar.

Plötsligt rullar bollen mot Alex. Alla tittar.

"Kan du passa tillbaka?" ropar en av spelarna.`,
        spokesFocus: ['active', 'included', 'respected'],
        mood: 'growing',
        choices: [
          {
            id: 'c2a',
            text: 'Sparka tillbaka bollen och le',
            emoji: '⚽',
            outcome: '"Bra spark! Vill du vara med?" Alex går med i laget och börjar spela.',
            spokeEffect: { active: 2, included: 2, respected: 1 }
          },
          {
            id: 'c2b',
            text: 'Ge tillbaka bollen försiktigt',
            emoji: '🤲',
            outcome: 'En av spelarna säger "Tack!" och fortsätter spela. Alex tittar på ett tag till.',
            spokeEffect: { active: 1, included: 1 }
          }
        ],
        reflection: 'Vad hjälper dig att våga prova nya saker?'
      },
      {
        id: 'ch3',
        title: 'Lunchkompisar',
        emoji: '🍽️',
        narration: `I matsalen ser Alex ett bord där några barn från klassen sitter. De vinkar!

"Kom och sitt med oss!" säger Emma. "Vi såg att du spelade fotboll. Du är bra!"

Alex känner hur ett leende sprider sig.`,
        spokesFocus: ['nurtured', 'included', 'healthy'],
        mood: 'hopeful',
        choices: [
          {
            id: 'c3a',
            text: 'Sätta sig och berätta om gamla skolan',
            emoji: '💬',
            outcome: 'Barnen lyssnar intresserat och delar sina egna berättelser. Alex känner sig välkommen.',
            spokeEffect: { nurtured: 2, included: 2, healthy: 1 }
          },
          {
            id: 'c3b',
            text: 'Sätta sig och lyssna på de andra',
            emoji: '👂',
            outcome: 'Alex lär känna de nya kompisarna genom att lyssna på deras historier.',
            spokeEffect: { nurtured: 1, included: 1 }
          }
        ]
      },
      {
        id: 'ch4',
        title: 'Hemma igen',
        emoji: '🏠',
        narration: `Efter skolan berättar Alex för mamma och pappa om dagen.

"Jag var nervös på morgonen," säger Alex, "men sedan hände det roliga saker!"

Mamma kramar om Alex. "Vi är så stolta över dig."`,
        spokesFocus: ['safe', 'nurtured', 'responsible'],
        mood: 'celebrating',
        reflection: 'Vem kan du prata med när du har haft en stor dag?',
        spokeChanges: { safe: 1, nurtured: 1 }
      }
    ]
  },
  {
    id: 'mia-big-feelings',
    title: 'Mias stora känslor',
    description: 'Mia lär sig förstå och hantera sina känslor',
    theme: 'Känsloreglering',
    duration: '4 min',
    character: {
      id: 'mia',
      name: 'Mia',
      age: 8,
      emoji: '👧',
      description: 'En kreativ 8-åring som ibland har stora känslor',
      color: '#EC4899'
    },
    chapters: [
      {
        id: 'ch1',
        title: 'Morgonkaoset',
        emoji: '😤',
        narration: `Mia vaknar och allt känns fel. Frukosten smakar inte bra. Strumporna sitter konstigt. Lillebror tar hennes favoritmugg!

Mia känner hur ilskan bubblar upp som en vulkan.

"Jag HATAR allt idag!" skriker Mia.`,
        spokesFocus: ['healthy', 'safe'],
        mood: 'challenging',
        choices: [
          {
            id: 'c1a',
            text: 'Andas djupt tre gånger',
            emoji: '🌬️',
            outcome: 'Mia stannar upp och andas. Vulkanen blir lite lugnare.',
            spokeEffect: { healthy: 2, safe: 1 }
          },
          {
            id: 'c1b',
            text: 'Gå till sitt rum en stund',
            emoji: '🚪',
            outcome: 'Mia tar en paus ensam och känner sig lite bättre efteråt.',
            spokeEffect: { healthy: 1, safe: 1 }
          }
        ],
        reflection: 'Vad gör du när känslorna blir väldigt stora?'
      },
      {
        id: 'ch2',
        title: 'Känslokortet',
        emoji: '🎨',
        narration: `I skolan pratar fröken om känslor. Hon delar ut "Känslokartor" - en regnbåge av olika känslor.

"Vilken färg har din känsla just nu?" frågar fröken.

Mia tittar på kartan och tänker...`,
        spokesFocus: ['healthy', 'achieving', 'respected'],
        mood: 'growing',
        choices: [
          {
            id: 'c2a',
            text: 'Välja en färg och berätta',
            emoji: '🗣️',
            outcome: 'Mia väljer orange - "lite irriterad men det går över". Fröken nickar förstående.',
            spokeEffect: { healthy: 2, achieving: 1, respected: 2 }
          },
          {
            id: 'c2b',
            text: 'Rita en egen känsla',
            emoji: '✏️',
            outcome: 'Mia ritar en blandning av färger - "det är komplicerat". Fröken säger att det är helt okej.',
            spokeEffect: { healthy: 1, achieving: 2, respected: 1 }
          }
        ]
      },
      {
        id: 'ch3',
        title: 'Verktyg för stora känslor',
        emoji: '🧰',
        narration: `Fröken ger alla barn en "känsloverktygslåda" - inte en riktig låda, utan idéer att använda:

🌬️ Andas som en drake
🎵 Sjunga en lugn sång
🏃 Springa en runda
🤗 Be om en kram
✏️ Rita känslan

"Vilket verktyg vill du prova först?" frågar fröken.`,
        spokesFocus: ['healthy', 'responsible', 'active'],
        mood: 'hopeful',
        choices: [
          {
            id: 'c3a',
            text: 'Drake-andningen!',
            emoji: '🐉',
            outcome: 'Mia övar att andas in lugnt och ut som en drake. Det känns bra!',
            spokeEffect: { healthy: 2, responsible: 1 }
          },
          {
            id: 'c3b',
            text: 'Rita känslan!',
            emoji: '🖼️',
            outcome: 'Mia ritar sin känsla och den ser rolig ut på papper. Mia skrattar lite.',
            spokeEffect: { healthy: 1, active: 1, achieving: 1 }
          }
        ]
      },
      {
        id: 'ch4',
        title: 'En bättre kväll',
        emoji: '🌙',
        narration: `Hemma den kvällen börjar lillebror busa igen. Mia känner vulkanen...

Men nu har hon verktyg! Mia andas som en drake och säger lugnt: "Kan du sluta, snälla?"

Mamma ser förvånat glad ut. "Mia, vad bra du hanterade det!"

Mia känner sig stolt.`,
        spokesFocus: ['responsible', 'nurtured', 'safe'],
        mood: 'celebrating',
        reflection: 'Vilket verktyg vill du prova nästa gång du har stora känslor?',
        spokeChanges: { healthy: 2, responsible: 2, safe: 1 }
      }
    ]
  },
  {
    id: 'omar-team-project',
    title: 'Omars grupparbete',
    description: 'Omar lär sig samarbeta och ta ansvar',
    theme: 'Samarbete och ansvar',
    duration: '4 min',
    character: {
      id: 'omar',
      name: 'Omar',
      age: 11,
      emoji: '🧑',
      description: 'En smart 11-åring som föredrar att jobba ensam',
      color: '#059669'
    },
    chapters: [
      {
        id: 'ch1',
        title: 'Gruppuppgiften',
        emoji: '📋',
        narration: `"Vi ska göra ett grupparbete om rymden!" säger fröken.

Omar suckar. Han gillar rymden, men grupparbeten... inte så mycket.

Han hamnar i grupp med Aisha och Leo. Aisha vill göra planeter, Leo vill göra raketer, och Omar vill göra svarta hål.

"Hur ska vi bestämma?" frågar Leo.`,
        spokesFocus: ['achieving', 'included', 'responsible'],
        mood: 'challenging',
        choices: [
          {
            id: 'c1a',
            text: 'Föreslå att alla gör sin del',
            emoji: '🧩',
            outcome: 'Gruppen bestämmer att alla gör sin del som sedan sätts ihop. Smart!',
            spokeEffect: { responsible: 2, included: 1, achieving: 1 }
          },
          {
            id: 'c1b',
            text: 'Låta de andra bestämma',
            emoji: '🤷',
            outcome: 'Aisha och Leo bestämmer tillsammans. Omar känner sig lite utanför.',
            spokeEffect: { included: -1, responsible: 0 }
          }
        ]
      },
      {
        id: 'ch2',
        title: 'Problem uppstår',
        emoji: '😰',
        narration: `Dagen innan redovisningen har Leo inte gjort sin del. Han ser ledsen ut.

"Min pappa har varit sjuk..." säger Leo tyst. "Jag har inte haft tid."

Aisha tittar på Omar. Vad ska de göra?`,
        spokesFocus: ['nurtured', 'responsible', 'respected'],
        mood: 'challenging',
        choices: [
          {
            id: 'c2a',
            text: 'Hjälpa Leo och dela upp hans del',
            emoji: '🤝',
            outcome: 'Alla tre jobbar tillsammans. Leo blir tacksam. Arbetet blir klart!',
            spokeEffect: { nurtured: 2, responsible: 2, respected: 2, included: 1 }
          },
          {
            id: 'c2b',
            text: 'Berätta för fröken om situationen',
            emoji: '👩‍🏫',
            outcome: 'Fröken ger gruppen extra tid och beröm för att de berättade.',
            spokeEffect: { responsible: 1, safe: 1 }
          }
        ],
        reflection: 'Hur kan man visa omtanke när någon i gruppen har det svårt?'
      },
      {
        id: 'ch3',
        title: 'Redovisningen',
        emoji: '🎤',
        narration: `Det är dags! Gruppen står framför klassen.

Omar börjar berätta om svarta hål. Han märker att han faktiskt tycker det är kul att presentera tillsammans.

När Aisha visar planeterna hjälper Omar med att peka. Leo får applåder för raketteckningen.

De är ett team!`,
        spokesFocus: ['achieving', 'included', 'active'],
        mood: 'celebrating',
        spokeChanges: { achieving: 2, included: 2, responsible: 1 }
      },
      {
        id: 'ch4',
        title: 'Efteråt',
        emoji: '⭐',
        narration: `"Ni jobbade verkligen bra tillsammans!" säger fröken.

Omar ler. Kanske är grupparbeten inte så dåliga ändå - speciellt när alla hjälps åt.

"Ska vi sitta ihop på nästa grupparbete också?" frågar Leo.

Omar nickar. "Det vill jag gärna."`,
        spokesFocus: ['included', 'nurtured', 'responsible'],
        mood: 'celebrating',
        reflection: 'Vad lärde du dig av Omars historia om att jobba tillsammans?'
      }
    ]
  }
];

// ============================================
// MOOD STYLES
// ============================================
const MOOD_STYLES = {
  hopeful: {
    gradient: 'from-blue-400 to-cyan-300',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-900',
    emoji: '✨'
  },
  challenging: {
    gradient: 'from-amber-400 to-orange-300',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-900',
    emoji: '💪'
  },
  growing: {
    gradient: 'from-emerald-400 to-green-300',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-900',
    emoji: '🌱'
  },
  celebrating: {
    gradient: 'from-purple-400 to-pink-300',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-900',
    emoji: '🎉'
  }
};

// ============================================
// SPOKE ICONS
// ============================================
const SPOKE_ICONS: Record<string, React.ReactNode> = {
  safe: <Shield className="w-4 h-4" />,
  healthy: <Heart className="w-4 h-4" />,
  achieving: <Target className="w-4 h-4" />,
  nurtured: <Users className="w-4 h-4" />,
  active: <Zap className="w-4 h-4" />,
  respected: <Star className="w-4 h-4" />,
  responsible: <Award className="w-4 h-4" />,
  included: <Users className="w-4 h-4" />
};

const SPOKE_NAMES: Record<string, string> = {
  safe: 'Trygg',
  healthy: 'Må bra',
  achieving: 'Utvecklas',
  nurtured: 'Omvårdad',
  active: 'Aktiv',
  respected: 'Respekterad',
  responsible: 'Ansvarsfull',
  included: 'Delaktig'
};

// ============================================
// STORYTELLING MODULE COMPONENT
// ============================================
export const StorytellingModule: React.FC = () => {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [choices, setChoices] = useState<Record<string, string>>({});
  const [spokeScores, setSpokeScores] = useState<Record<string, number>>({
    safe: 3, healthy: 3, achieving: 3, nurtured: 3,
    active: 3, respected: 3, responsible: 3, included: 3
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [showReflection, setShowReflection] = useState(false);
  const [storyComplete, setStoryComplete] = useState(false);

  const currentChapter = selectedStory?.chapters[currentChapterIndex];
  const moodStyle = currentChapter ? MOOD_STYLES[currentChapter.mood] : MOOD_STYLES.hopeful;

  const handleChoiceSelect = useCallback((choice: StoryChoice) => {
    if (!currentChapter) return;

    // Record choice
    setChoices(prev => ({ ...prev, [currentChapter.id]: choice.id }));

    // Apply spoke effects
    setSpokeScores(prev => {
      const newScores = { ...prev };
      Object.entries(choice.spokeEffect).forEach(([spoke, change]) => {
        newScores[spoke] = Math.max(0, Math.min(5, prev[spoke] + change));
      });
      return newScores;
    });

    // Show outcome briefly, then move to next
    setTimeout(() => {
      if (selectedStory && currentChapterIndex < selectedStory.chapters.length - 1) {
        setCurrentChapterIndex(prev => prev + 1);
      } else {
        setStoryComplete(true);
      }
    }, 2000);
  }, [currentChapter, currentChapterIndex, selectedStory]);

  const handleNextChapter = () => {
    if (!selectedStory) return;

    // Apply any automatic spoke changes
    if (currentChapter?.spokeChanges) {
      setSpokeScores(prev => {
        const newScores = { ...prev };
        Object.entries(currentChapter.spokeChanges!).forEach(([spoke, change]) => {
          newScores[spoke] = Math.max(0, Math.min(5, prev[spoke] + change));
        });
        return newScores;
      });
    }

    if (currentChapterIndex < selectedStory.chapters.length - 1) {
      setCurrentChapterIndex(prev => prev + 1);
      setShowReflection(false);
    } else {
      setStoryComplete(true);
    }
  };

  const handleRestart = () => {
    setCurrentChapterIndex(0);
    setChoices({});
    setSpokeScores({
      safe: 3, healthy: 3, achieving: 3, nurtured: 3,
      active: 3, respected: 3, responsible: 3, included: 3
    });
    setStoryComplete(false);
    setShowReflection(false);
  };

  const handleBackToStories = () => {
    setSelectedStory(null);
    handleRestart();
  };

  // Story selection view
  if (!selectedStory) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-3xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-3xl mb-4 shadow-lg">
            <BookOpen className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Berättelseverkstad</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Följ med på spännande berättelser och gör val som påverkar hur historien utvecklas!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {STORIES.map(story => (
            <button
              key={story.id}
              onClick={() => setSelectedStory(story)}
              className="group bg-white rounded-2xl p-6 border-2 border-transparent hover:border-indigo-300 transition-all duration-300 hover:shadow-lg text-left"
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="text-4xl w-14 h-14 rounded-xl flex items-center justify-center shadow-md"
                  style={{ backgroundColor: story.character.color + '20' }}
                >
                  {story.character.emoji}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {story.title}
                  </h3>
                  <p className="text-sm text-gray-500">{story.character.name}, {story.character.age} år</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4">{story.description}</p>

              <div className="flex items-center justify-between">
                <span className="text-xs px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">
                  {story.theme}
                </span>
                <span className="text-xs text-gray-500">⏱️ {story.duration}</span>
              </div>

              <div className="mt-4 flex items-center gap-2 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="w-4 h-4" />
                <span className="text-sm font-medium">Börja läsa</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Story complete view
  if (storyComplete) {
    const totalChanges = Object.entries(spokeScores).reduce((acc, [spoke, score]) => {
      const change = score - 3;
      if (change !== 0) acc.push({ spoke, change, score });
      return acc;
    }, [] as { spoke: string; change: number; score: number }[]);

    return (
      <div className={`${moodStyle.bgColor} rounded-3xl p-8 shadow-xl`}>
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎊</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Berättelsen är slut!</h2>
          <p className="text-gray-600">
            Bra jobbat! Du hjälpte {selectedStory.character.name} genom berättelsen.
          </p>
        </div>

        {/* Spoke summary */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Dina val påverkade:
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {Object.entries(spokeScores).map(([spoke, score]) => {
              const change = score - 3;
              return (
                <div
                  key={spoke}
                  className={`p-3 rounded-xl text-center ${
                    change > 0 ? 'bg-emerald-100' : change < 0 ? 'bg-red-100' : 'bg-gray-100'
                  }`}
                >
                  <div className="mb-1">{SPOKE_ICONS[spoke]}</div>
                  <div className="text-xs font-medium text-gray-700">{SPOKE_NAMES[spoke]}</div>
                  <div className={`text-lg font-bold ${
                    change > 0 ? 'text-emerald-600' : change < 0 ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {change > 0 ? '+' : ''}{change}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reflection */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            Tänk efter...
          </h3>
          <p className="text-gray-700">
            Vad lärde du dig av {selectedStory.character.name}s berättelse?
            Finns det något du vill prova själv?
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-colors border-2 border-gray-200"
          >
            <RotateCcw className="w-4 h-4" />
            Läs igen
          </button>
          <button
            onClick={handleBackToStories}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:opacity-90 transition-opacity shadow-lg"
          >
            <BookOpen className="w-4 h-4" />
            Fler berättelser
          </button>
        </div>
      </div>
    );
  }

  // Story reading view
  return (
    <div className={`${moodStyle.bgColor} rounded-3xl shadow-xl overflow-hidden`}>
      {/* Header */}
      <div className={`bg-gradient-to-r ${moodStyle.gradient} p-6`}>
        <div className="flex items-center justify-between">
          <button
            onClick={handleBackToStories}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Tillbaka
          </button>

          <div className="flex items-center gap-3">
            <span className="text-4xl">{selectedStory.character.emoji}</span>
            <div className="text-white">
              <h2 className="font-bold">{selectedStory.title}</h2>
              <p className="text-sm text-white/80">
                Kapitel {currentChapterIndex + 1} av {selectedStory.chapters.length}
              </p>
            </div>
          </div>

          <div className="text-2xl">{moodStyle.emoji}</div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-2 bg-white/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${((currentChapterIndex + 1) / selectedStory.chapters.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Chapter content */}
      <div className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">{currentChapter?.emoji}</span>
          <h3 className={`text-2xl font-bold ${moodStyle.textColor}`}>
            {currentChapter?.title}
          </h3>
        </div>

        {/* Narration */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 mb-6 shadow-lg">
          <p className="text-gray-800 leading-relaxed whitespace-pre-line text-lg">
            {currentChapter?.narration}
          </p>
        </div>

        {/* Focus spokes */}
        <div className="flex items-center gap-2 mb-6">
          <span className="text-sm text-gray-500">Denna del handlar om:</span>
          {currentChapter?.spokesFocus.map(spoke => (
            <span
              key={spoke}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white shadow-sm text-sm font-medium text-gray-700"
            >
              {SPOKE_ICONS[spoke]}
              {SPOKE_NAMES[spoke]}
            </span>
          ))}
        </div>

        {/* Choices */}
        {currentChapter?.choices && !choices[currentChapter.id] && (
          <div className="space-y-3">
            <p className="font-medium text-gray-900 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-indigo-500" />
              Vad ska {selectedStory.character.name} göra?
            </p>
            {currentChapter.choices.map(choice => (
              <button
                key={choice.id}
                onClick={() => handleChoiceSelect(choice)}
                className="w-full flex items-center gap-4 p-4 bg-white rounded-xl border-2 border-gray-200 hover:border-indigo-400 hover:shadow-md transition-all text-left group"
              >
                <span className="text-2xl">{choice.emoji}</span>
                <span className="flex-1 font-medium text-gray-800 group-hover:text-indigo-700">
                  {choice.text}
                </span>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
              </button>
            ))}
          </div>
        )}

        {/* Choice outcome */}
        {currentChapter?.choices && choices[currentChapter.id] && (
          <div className="bg-gradient-to-r from-emerald-100 to-green-100 rounded-2xl p-6 animate-fade-in">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium text-emerald-800 mb-2">
                  {currentChapter.choices.find(c => c.id === choices[currentChapter.id])?.outcome}
                </p>
                <div className="flex items-center gap-2">
                  {Object.entries(currentChapter.choices.find(c => c.id === choices[currentChapter.id])?.spokeEffect || {}).map(([spoke, change]) => (
                    <span
                      key={spoke}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        change > 0 ? 'bg-emerald-200 text-emerald-800' : 'bg-red-200 text-red-800'
                      }`}
                    >
                      {SPOKE_ICONS[spoke]}
                      {change > 0 ? '+' : ''}{change}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reflection */}
        {currentChapter?.reflection && !currentChapter.choices && (
          <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-2xl p-6 mb-6">
            <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Fundera...
            </h4>
            <p className="text-amber-800">{currentChapter.reflection}</p>
          </div>
        )}

        {/* Navigation (when no choices or choice made) */}
        {(!currentChapter?.choices || choices[currentChapter.id]) && (
          <div className="flex justify-end mt-6">
            <button
              onClick={handleNextChapter}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:opacity-90 transition-opacity shadow-lg"
            >
              {currentChapterIndex < selectedStory.chapters.length - 1 ? (
                <>
                  Fortsätt
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  Avsluta berättelsen
                  <Star className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Mini spoke wheel */}
      <div className="px-8 pb-6">
        <div className="bg-white/50 backdrop-blur rounded-xl p-4">
          <p className="text-xs text-gray-500 mb-2 text-center">
            {selectedStory.character.name}s välbefinnande just nu:
          </p>
          <div className="flex justify-center gap-2">
            {Object.entries(spokeScores).map(([spoke, score]) => (
              <div key={spoke} className="text-center">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
                  style={{
                    backgroundColor: score >= 4 ? '#10b981' : score >= 3 ? '#f59e0b' : '#ef4444'
                  }}
                >
                  {score}
                </div>
                <div className="text-[10px] text-gray-500 mt-1">{SPOKE_NAMES[spoke].substring(0, 3)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorytellingModule;
