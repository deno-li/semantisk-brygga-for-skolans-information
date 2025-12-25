# Implementationsplan: ICF-integration enligt WHO Beginner's Guide

## Sammanfattning av befintlig struktur

### ✅ Redan implementerat:
1. **ICF-koder** - Finns i ShanarriIndicator (constants.ts)
2. **BBIC/KSI/KVÅ-integration** - Semantisk brygga finns
3. **Nivåindelning** - JourneyLevel (universell/stödprofil/samordning)
4. **Risk/Skyddsfaktorer** - RiskFactor och ProtectiveFactor typer
5. **Longitudinell data** - LongitudinalDataPoint för uppföljning över tid
6. **WelfareWheel** - Visuell representation av 8 ekrar

### ❌ Saknas (enligt guiden):
1. **Performance vs Capacity** - Dubbla kvalifikatorer för gap-analys
2. **Environmental Factors** - ICF e-koder med barriers (+/-) och facilitators
3. **Gap-analys beräkning** - Performance - Capacity = effekt av anpassningar
4. **ICF core sets** - Begränsade urval per eker och nivå (N1/N2/N3)
5. **Risk/Skydd-visualisering** - Balansdiagram för e-koder
6. **AI-stödd ICF-kodning** - Förslag på koder från fritext
7. **Metadata per bedömning** - Källa, tidsspann, kontext, datum
8. **N1/N2/N3 workflow** - Triage och uppflyttning mellan nivåer

---

## Fas 1: Datamodell - Utöka TypeScript-typer (2-3 timmar)

### 1.1 Skapa ICF-specifika typer

```typescript
// src/types/icf-types.ts (NY FIL)

// WHO ICF Qualifier för Activities & Participation
export type ICFQualifierValue = 0 | 1 | 2 | 3 | 4 | 9;  // 0-4 + 9 (ej bedömt)

export interface ICFQualifier {
  value: ICFQualifierValue;
  description: string;  // "Inga svårigheter", "Lätta svårigheter", etc.
}

// Performance vs Capacity
export interface ICFAssessment {
  code: string;                    // ICF-kod, t.ex. "d140"
  domain: string;                  // "Lära sig läsa"
  performance: ICFQualifier;       // Vad barnet GÖR med anpassningar
  capacity: ICFQualifier;          // Vad barnet KAN utan anpassningar
  gap: number;                     // Performance - Capacity
  gapInterpretation: 'facilitators-work' | 'barriers-exist' | 'neutral';

  // Metadata
  assessedDate: string;            // ISO 8601
  assessedBy: ActorSector;         // Vem gjorde bedömningen
  timeSpan: string;                // "Senaste 2 veckor", "Senaste 4 veckor"
  context: 'home' | 'school' | 'healthcare' | 'leisure';
  source: 'observation' | 'survey' | 'assessment' | 'parent-report' | 'child-report';
}

// Environmental Factors (e-koder)
export type EnvironmentalFactorType = 'barrier' | 'facilitator';
export type BarrierLevel = 0 | 1 | 2 | 3 | 4;  // .0 till .4
export type FacilitatorLevel = 0 | 1 | 2 | 3 | 4;  // +0 till +4

export interface EnvironmentalFactor {
  code: string;                    // t.ex. "e310", "e1301", "e250"
  domain: string;                  // "Närmaste familj", "Läromedel", "Ljud"
  type: EnvironmentalFactorType;
  level: BarrierLevel | FacilitatorLevel;  // .0-.4 eller +0-+4
  description: string;             // Fritext beskrivning
  relatedSpokes: WelfareWheelSpoke[];  // Vilka ekrar påverkas

  // Metadata
  identifiedDate: string;
  identifiedBy: ActorSector;
  context: 'home' | 'school' | 'healthcare' | 'community';
  status: 'active' | 'resolved' | 'monitoring';
}

// ICF Core Set per eker och nivå
export interface ICFCoreSetItem {
  code: string;                    // ICF-kod
  domain: string;                  // Domän på svenska
  indicatorQuestions: string[];    // 2-3 indikatorfrågor
  requiredLevel: 'N1' | 'N2' | 'N3';  // Vilken nivå krävs
}

export interface ICFCoreSet {
  spoke: WelfareWheelSpoke;        // Vilken eker
  level: 'N1' | 'N2' | 'N3';
  items: ICFCoreSetItem[];
}

// Utökad ShanarriIndicator (lägg till i types.ts)
export interface EnhancedShanarriIndicator extends ShanarriIndicator {
  // Performance/Capacity (endast N2 och N3)
  icfAssessments?: ICFAssessment[];

  // Environmental Factors
  environmentalFactors?: EnvironmentalFactor[];

  // Gap-analys sammanfattning
  overallGap?: number;             // Genomsnittlig gap över alla assessments
  gapTrend?: 'improving' | 'stable' | 'declining';

  // Risk/Skydd-balans
  riskScore?: number;              // Summa barriers
  protectionScore?: number;        // Summa facilitators
  balance?: number;                // protectionScore - riskScore
}
```

### 1.2 Uppdatera befintliga typer

```typescript
// src/types/types.ts - UPPDATERA

// Lägg till level till WelfareWheelSpokeData
export interface WelfareWheelSpokeData {
  spoke: WelfareWheelSpoke;
  name: string;
  // ... befintliga fält ...

  // NYA FÄLT:
  level: 'N1' | 'N2' | 'N3';       // Vilken nivå bedömningen är på
  icfCoreSet: ICFCoreSetItem[];    // Core set för denna eker + nivå
  icfAssessments: ICFAssessment[]; // Performance/Capacity (N2/N3)
  environmentalFactors: EnvironmentalFactor[];  // e-koder

  // Status omdefinieras till ICF-skala
  status: ICFQualifierValue;       // 0-4 skala (Performance)
  capacity?: ICFQualifierValue;    // Endast N2/N3
  gap?: number;                    // Performance - Capacity

  // Risk/Skydd från Environmental Factors
  riskScore: number;               // Summa .1-.4
  protectionScore: number;         // Summa +1-+4
  balance: number;                 // protection - risk
}
```

---

## Fas 2: Data - Skapa ICF Core Sets (3-4 timmar)

### 2.1 Definiera Core Sets per eker

```typescript
// src/data/icf-core-sets.ts (NY FIL)

import { ICFCoreSet, WelfareWheelSpoke } from '../types/types';

// EKER 1: HÄLSA
export const HEALTH_CORE_SET_N1: ICFCoreSet = {
  spoke: 'halsa',
  level: 'N1',
  items: [
    {
      code: 'b134',
      domain: 'Sömnfunktioner',
      indicatorQuestions: [
        'Sover barnet tillräckligt för sin ålder?',
        'Vaknar barnet ofta under natten?'
      ],
      requiredLevel: 'N1'
    },
    {
      code: 'b152',
      domain: 'Känslofunktioner',
      indicatorQuestions: [
        'Kan barnet reglera känslor (glädje, ilska, sorg)?',
        'Har barnet god känslomässig balans?'
      ],
      requiredLevel: 'N1'
    },
    // ... mer enligt guiden
  ]
};

// Fortsätt för alla 8 ekrar × 3 nivåer = 24 core sets
```

### 2.2 Skapa Environmental Factors-bibliotek

```typescript
// src/data/icf-environmental-factors.ts (NY FIL)

export const COMMON_ENVIRONMENTAL_FACTORS = {
  // EKER 1: Hälsa
  health: [
    { code: 'e580', domain: 'Hälso- och sjukvårdstjänster', category: 'health' },
    { code: 'e1101', domain: 'Läkemedel', category: 'health' },
  ],

  // EKER 2: Trygghet
  safety: [
    { code: 'e310', domain: 'Närmaste familjen', category: 'safety' },
    { code: 'e320', domain: 'Vänner och bekanta', category: 'safety' },
    { code: 'e330', domain: 'Personer i överordnad ställning', category: 'safety' },
  ],

  // EKER 3: Lärande
  learning: [
    { code: 'e585', domain: 'Utbildnings- och träningstjänster', category: 'learning' },
    { code: 'e1301', domain: 'Läromedel för utbildning', category: 'learning' },
    { code: 'e250', domain: 'Ljud (fysisk miljö)', category: 'learning' },
  ],

  // ... osv för alla ekrar
};
```

---

## Fas 3: UI-komponenter - Nya visualiseringar (4-5 timmar)

### 3.1 Performance vs Capacity Gap-analys

```typescript
// src/components/ICFGapAnalysis.tsx (NY FIL)

// Visar:
// - Capacity (förmåga utan stöd)
// - Performance (funktion med anpassningar)
// - Gap (visuellt med pilar)
// - Interpretation (fungerar anpassningar?)
```

### 3.2 Risk/Skydd-balans visualisering

```typescript
// src/components/RiskProtectionBalance.tsx (NY FIL)

// Visar:
// - Barriers (röda staplar .1-.4)
// - Facilitators (gröna staplar +1-+4)
// - Netto-balans (protection - risk)
// - Tolkningstext
```

### 3.3 N1/N2/N3 Level Indicator

```typescript
// src/components/LevelIndicator.tsx (NY FIL)

// Visar:
// - Nuvarande nivå (N1/N2/N3)
// - Vilka ekrar som triggar uppflyttning
// - Knapp för att trigga nivåbyte
```

### 3.4 ICF Assessment Form

```typescript
// src/components/ICFAssessmentForm.tsx (NY FIL)

// För professionella att:
// - Skatta Performance (0-4)
// - Skatta Capacity (0-4)
// - Se gap automatiskt
// - Välja Environmental Factors med +/- nivåer
// - Lägga till metadata (källa, tidsspann, kontext)
```

---

## Fas 4: AI-integration - Kodningsförslag (2-3 timmar)

### 4.1 Uppdatera AI-analys för ICF

```typescript
// src/components/AIAnalysis.tsx - UPPDATERA

// Nytt: AI föreslår inte bara ICF-koder utan också:
// - Performance vs Capacity estimat
// - Environmental Factors (barriers/facilitators)
// - Gap-analys tolkningar
// - Eker-placering
// - Förslag på åtgärder
```

### 4.2 Exempel-prompt för AI

```typescript
const ICF_CODING_PROMPT = `
Du är en expert på WHO:s ICF-ramverk. Analysera följande text från
en professionell om ett barn och föreslå:

1. ICF-KODER (d-koder, b-koder)
2. PERFORMANCE qualifier (0-4): Vad barnet GÖR med anpassningar
3. CAPACITY qualifier (0-4): Vad barnet KAN utan anpassningar
4. GAP-ANALYS: Performance - Capacity
5. ENVIRONMENTAL FACTORS (e-koder):
   - BARRIERS (.1-.4): Hinder i miljön
   - FACILITATORS (+1-+4): Möjliggörare i miljön
6. RISK/SKYDD-BALANS: Summa barriers vs facilitators
7. EKER-PLACERING: Vilken av 8 ekrar påverkas mest
8. ÅTGÄRDSFÖRSLAG: Vad kan förbättras

Text: {userInput}

Svara i JSON-format.
`;
```

---

## Fas 5: Longitudinell uppföljning (2 timmar)

### 5.1 Utöka LifeCourseView

```typescript
// src/components/LifeCourseView.tsx - UPPDATERA

// Visa utveckling av:
// - Performance över tid (linjediagram)
// - Capacity över tid
// - Gap över tid (visar om anpassningar fortsätter fungera)
// - Risk/Skydd-balans över tid
```

### 5.2 Gap-trend visualisering

```typescript
// Exempel på visualisering:
// Elsa, 10 år - Lärande (12 månader)

// Månad 0:
// Capacity: 3, Performance: 3, Gap: 0
// → Inga anpassningar

// Månad 3:
// Capacity: 3, Performance: 2, Gap: -1
// → Anpassningar börjar fungera!

// Månad 6:
// Capacity: 2, Performance: 2, Gap: 0
// → Capacity förbättrad!

// Månad 12:
// Capacity: 2, Performance: 1, Gap: -1
// → Både Capacity OCH Performance förbättrade!
```

---

## Fas 6: Nivåindelad workflow (3 timmar)

### 6.1 N1 Screening-vy

```typescript
// src/components/N1Screening.tsx (NY FIL)

// Universell screening för ALLA barn:
// - 1 Performance-skattning per eker (0-4)
// - 2-3 ICF core set koder per eker
// - 2-3 indikatorfrågor
// - Automatisk triage:
//   - 0-1: Grön (följ årligen)
//   - 2: Gul (följ var 6:e mån, överväg N2)
//   - 3-4: Röd (vidare till N2 omedelbart)
```

### 6.2 N2 Fördjupad analys-vy

```typescript
// src/components/N2DeepDive.tsx (NY FIL)

// För barn med identifierade behov från N1:
// - Performance OCH Capacity mäts
// - Gap-analys synlig
// - Environmental Factors kvantifieras (.1-.4 och +1-+4)
// - Risk/Skydd-balans visualisering
// - Flera skattningskällor (barn, förälder, skola, vård)
```

### 6.3 N3 Samordnad plan-vy

```typescript
// src/components/N3CoordinatedPlan.tsx (NY FIL)

// Tvärsektoriell plan (SIP-liknande):
// - ICF-Target per eker
// - Kopplade insatser från alla sektorer (SS 12000, KSI, KVÅ)
// - Barnets röst dokumenterad
// - Uppföljningstidslinje med milestolpar
// - Ansvarig koordinator
// - Frekvens: Var 3:e månad
```

---

## Fas 7: Testing & Demo-data (2 timmar)

### 7.1 Skapa demo-profiler med ICF-data

```typescript
// src/data/icf-demo-profiles.ts (NY FIL)

// Elsa, 10 år (N2-exempel från guiden)
// Mira, 8 år (N2-exempel från guiden)
// Kevin, 12 år (N2-exempel från guiden)
// Erik, 15 år (N1-exempel - redan finns)
```

### 7.2 Test-cases

```
1. Universell screening (N1) → Triage → N2
2. N2 Gap-analys → Visa att anpassningar fungerar
3. N3 Samordnad plan → Flera sektorer
4. Longitudinell uppföljning → 12 månaders trend
5. Risk/Skydd-balans → Positiv vs negativ balans
6. AI-kodning → Från fritext till ICF-koder
```

---

## Fas 8: Dokumentation (1 timme)

### 8.1 Uppdatera README

```markdown
## ICF-integration enligt WHO

Prototypen implementerar WHO:s ICF-ramverk med:

### Performance vs Capacity
- **Performance**: Vad barnet GÖR i sin nuvarande miljö
- **Capacity**: Vad barnet KAN utan anpassningar
- **Gap-analys**: Visar om anpassningar fungerar

### Environmental Factors
- **Barriers** (.1-.4): Hinder i miljön
- **Facilitators** (+1-+4): Möjliggörare i miljön
- **Risk/Skydd-balans**: Kvantifierad balans

### Nivåindelning (N1-N2-N3)
- **N1**: Universell screening (alla barn)
- **N2**: Fördjupad analys (riktat stöd)
- **N3**: Samordnad planering (tvärsektoriellt)

Se [IMPLEMENTATION-PLAN-ICF.md](IMPLEMENTATION-PLAN-ICF.md) för detaljer.
```

---

## Sammanfattning av leverabler

### Nya filer (10 st):
1. `src/types/icf-types.ts` - ICF-specifika TypeScript-typer
2. `src/data/icf-core-sets.ts` - Core sets per eker och nivå
3. `src/data/icf-environmental-factors.ts` - e-koder bibliotek
4. `src/data/icf-demo-profiles.ts` - Demo-profiler med ICF-data
5. `src/components/ICFGapAnalysis.tsx` - Gap-analys visualisering
6. `src/components/RiskProtectionBalance.tsx` - Risk/Skydd-balans
7. `src/components/LevelIndicator.tsx` - N1/N2/N3 indikator
8. `src/components/ICFAssessmentForm.tsx` - Bedömningsformulär
9. `src/components/N1Screening.tsx` - Universell screening
10. `src/components/N2DeepDive.tsx` - Fördjupad analys
11. `src/components/N3CoordinatedPlan.tsx` - Samordnad plan

### Uppdaterade filer (4 st):
1. `src/types/types.ts` - Utöka WelfareWheelSpokeData
2. `src/components/AIAnalysis.tsx` - ICF-kodningsförslag
3. `src/components/LifeCourseView.tsx` - Longitudinell gap-analys
4. `README.md` - Dokumentation

---

## Tidsestimering

| Fas | Beskrivning | Timmar |
|-----|------------|--------|
| 1 | Datamodell (TypeScript-typer) | 2-3h |
| 2 | Data (ICF core sets) | 3-4h |
| 3 | UI-komponenter | 4-5h |
| 4 | AI-integration | 2-3h |
| 5 | Longitudinell uppföljning | 2h |
| 6 | Nivåindelad workflow | 3h |
| 7 | Testing & Demo-data | 2h |
| 8 | Dokumentation | 1h |
| **TOTALT** | | **19-25 timmar** |

---

## Prioriteringsförslag

Om du vill börja med ett minimum viable product (MVP), rekommenderar jag:

### MVP Phase 1 (6-8 timmar):
1. ✅ Fas 1: Datamodell
2. ✅ Fas 2: ICF core sets (endast N1 för 3 ekrar)
3. ✅ Fas 3.1: Gap-analys visualisering
4. ✅ Fas 3.2: Risk/Skydd-balans
5. ✅ Fas 7.1: En demo-profil (Elsa)

### MVP Phase 2 (6-8 timmar):
6. ✅ Fas 6.1: N1 Screening-vy
7. ✅ Fas 6.2: N2 Fördjupad analys-vy
8. ✅ Fas 4: AI-integration

### MVP Phase 3 (7-9 timmar):
9. ✅ Fas 2: Komplettera alla ekrar & nivåer
10. ✅ Fas 5: Longitudinell uppföljning
11. ✅ Fas 6.3: N3 Samordnad plan
12. ✅ Fas 8: Dokumentation

---

## Fråga till dig

Vill du att jag:
1. **Kör på MVP Phase 1** (6-8h, ger en fungerande demo av core-funktioner)?
2. **Kör på hela planen** (19-25h, komplett implementation)?
3. **Annan prioritering**?

Låt mig veta så startar jag implementeringen!
