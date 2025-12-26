## Välbefinnandehjul för Sammanhållen Planering i 1177

En interaktiv prototyp som demonstrerar hur skolans, socialtjänstens och hälso- och sjukvårdens informationsmängder kan harmoniseras genom semantiskt lager för **sammanhållen planering** kring barn och unga.
Designen bygger på välbefinnandehjul och dimensioner från **GIRFEC (Getting It Right For Every Child)**, samt arbetssätt från **Kronobarnsmodellen** och **Gävlemodellen** för systematiskt trygghetsarbete.

**Detta är ett **privat initiativ** av en yrkesperson inom kvalitetsutveckling i offentlig sektor för att bidra med ett perspektiv från praktiken. Projektet representerar inte någon organisations officiella ståndpunkt.

---

## Syfte

Ett **standardiserat välbefinnandehjul** som följer individen genom hela livet från MVC/BVC till vuxenliv, med samma dimensioner för att möjliggöra:

- 🏥 Hälsofrämjande och förebyggande arbete från början
- 🔍 Tidig identifiering av risk- och skyddsfaktorer
- 🤝 Tvärsektoriell samverkan kring gemensam informationsprofil
- 📊 Longitudinell datauppföljning över tid
- 🎓 Kontinuitet genom alla livsfaser

---

## Huvudfunktioner

### 1. Välbefinnandehjul (SHANARRI)
8 välbefinnandedimensioner visualiserade i ett interaktivt cirkeldiagram:
- **Trygg** (Safe)
- **Må bra** (Healthy)
- **Utvecklas** (Achieving)
- **Omvårdad** (Nurtured)
- **Aktiv** (Active)
- **Respekterad** (Respected)
- **Ansvarstagende** (Responsible)
- **Delaktig** (Included)

**Tre perspektiv:**
- **Vårdnadshavare** - Förälder/målsmans vy
- **Barn** - Barnets egen röst med barnanpassat språk
- **Professionell** - Tjänstepersonens vy med klassifikationer

**Exempel semantisk integration mellan skolans information och (ICF/KSI/BBIC/IBIC/KVÅ/Snomed CT)**

### 2. WHO ICF Integration 🆕
**Internationell klassifikation av funktionstillstånd, funktionshinder och hälsa**

Tre-stegs bedömningssystem enligt WHO ICF:
- **N1 Screening** - Universell nivå för alla barn (Performance-bedömning, 5-10 min)
- **N2 Fördjupad analys** - Riktad nivå med Performance vs Capacity gap-analys (30-60 min)
- **Gap-analys** - Visar om anpassningar fungerar genom att jämföra prestation mot kapacitet

**Nyckelkoncept:**
- **Performance Qualifier:** Vad barnet GÖR i sin nuvarande miljö med anpassningar
- **Capacity Qualifier:** Vad barnet KAN göra i standardiserad miljö utan stöd
- **Environmental Factors:** Barriers (.0-.4) och Facilitators (+0-+4)
- **Risk/Skydd-balans:** Kvantifiering av hinder och möjliggörare per välfärdseker

### 3. My World Triangle (GIRFEC)
3-dimensionell helhetsbedömning:
- Hur jag växer och utvecklas
- Vad jag behöver från andra
- Min omvärld

Integration med BBIC-triangeln (Barnets utveckling, föräldraförmåga, familj och miljö)

### 4. Resilience Matrix
För komplexa situationer (nivå 3-4 stöd):
- Adversity (motgångar) - skala 1-10
- Vulnerability (sårbarhet) - skala 1-10
- Protective Environment (skyddande miljö) - skala 1-10

### 5. Livsloppsperspektiv
Visualisering genom 6 livsfaser:
- **MVC/BVC** → **Förskola** → **Grundskola** → **Gymnasiet** → **Ung vuxen** → **Vuxen och äldre**

Med longitudinell data, risk- och skyddsfaktorer, samt övergångar mellan faser.

### 5. Barnets Resa Matris
- **3-nivåmodell** Universell → Stödprofil → Samordning
- **8 välbefinnandeekrar**
- **Semantisk koppling**
- **Dataminimering:** Olika information delas på varje nivå
- **Eskalering:** Automatiska triggers för nivåbyte

### 6. Demo-profiler
Prototypen innehåller 4 realistiska barnprofiler:

- **Erik A. (15 år, Åk 9)** - Universell nivå, allt fungerar bra
- **Lisa J. (12 år, Åk 6)** - Stödprofil, behöver riktat stöd
- **Omar H. (11 år, Åk 5)** - Universell med tidig uppmärksamhet
- **Sofia B. (16 år, TE 1)** - Samordningsprofil, flera aktörer

### 7. Min Röst - Barnets perspektiv
Enkätverktyg för barn att uttrycka sina egna upplevelser:
- Välbefinnandefrågor anpassade för barn
- Emotionell temperaturkontroll
- Barnvänligt språk och gränssnitt
- Stödjer barnets rätt till information och delaktighet

**Dataskydd & Säkerhet**
**VIKTIGT:** Detta är en prototyp med **fiktiva demonstrationsdata**.
Inga personuppgifter eller känslig information lagras. Alla namn, personnummer och skolnamn är påhittade exempel för demonstrationsändamål.

### 8. Övriga funktioner
- AI-analys
- Trendanalys & diagram
- PDF-export
- Mörkt läge
- Journalsystem (DFIK)
- Förbättringshjul (PDCA) för Gävlemodellens systematiska trygghetsarbete

---

## 📁 Projektstruktur

Projektet har en clean, välorganiserad mappstruktur:

```
semantisk-brygga-for-skolans-information/
├── src/                          # Källkod
│   ├── components/               # React-komponenter (22 st)
│   │   ├── App.tsx              # Huvudapplikation
│   │   ├── Dashboard.tsx        # Översiktsdashboard
│   │   ├── WelfareWheel.tsx     # SHANARRI-hjul
│   │   ├── OptimalWelfareWheel.tsx
│   │   ├── MyWorldTriangle.tsx  # GIRFEC-bedömning
│   │   ├── ResilienceMatrix.tsx
│   │   ├── ChildJourneyLevel.tsx
│   │   └── ...                  # Övriga komponenter
│   ├── types/                   # TypeScript-typdefinitioner
│   │   └── types.ts
│   ├── data/                    # Mockdata och konstanter
│   │   ├── constants.ts         # Applikationskonstanter
│   │   ├── childProfiles.ts     # Demo-barnprofiler
│   │   ├── profileData.ts
│   │   ├── journeyConstants.ts
│   │   └── journeyMockData.ts
│   ├── api/                     # API-klienter
│   │   └── semanticBridgeApi.ts
│   ├── hooks/                   # Custom React hooks
│   │   └── usePDFExport.ts
│   ├── index.tsx                # Applikationens entry point
│   └── index.html               # HTML-template
├── backend/                     # Python-backend
│   ├── icf_models.py           # ICF-klassificering
│   ├── ksi_models.py           # KSI-klassificering
│   ├── intervention_models.py
│   └── semantic_mapper.py      # Semantisk mappning
├── data/                        # Klassifikationsdata
│   ├── icf.tsv                 # ICF-klassifikation (349 KB)
│   ├── ksi.tsv                 # KSI-klassifikation (664 KB)
│   ├── kva-medicinska-atgarder-kma.tsv (937 KB)
│   └── *.xlsx                  # Excel-filer med standarder
├── docs/                        # Dokumentation
│   ├── BARNETS_RESA_MATRIS_README.md
│   ├── LICENSE.md
│   └── metadata.json
├── package.json                 # NPM-beroenden
├── tsconfig.json               # TypeScript-konfiguration
├── vite.config.ts              # Vite build-konfiguration
└── README.md                   # Denna fil
```

---

## 📖 Dokumentation

- **`README.md`** - Denna fil (översikt)
- **`docs/BARNETS_RESA_MATRIS_README.md`** - Komplett dokumentation för Journey-systemet
- **`docs/LICENSE.md`** - Licensinformation
- **`docs/metadata.json`** - Projektmetadata
- **`docs/json-schemas/semantic-bridge.schema.json`** - JSON-schema för payloads mellan React och FastAPI

### Arkitektur och designmönster

- **Presentationslager:** React-komponenter i `src/components`
- **Logiklager:** API-klient och hooks i `src/api` och `src/hooks`
- **Datalager:** Mockdata i `src/data` och Python-motor i `backend/semantic_mapper.py`
- **Singleton:** `semanticBridgeApi` exporteras som en delad instans
- **Observer:** `src/utils/observer.ts` notifierar mapping-event till abonnenter

---

## 📚 Teoretisk Grund & Ramverk

### GIRFEC - Getting It Right For Every Child (Skottland)
[Scottish Government - GIRFEC](https://www.gov.scot/policies/girfec/)

- **SHANARRI Wellbeing Wheel**: 8 välbefinnandedimensioner
- **My World Triangle**: 3-dimensionell bedömning
- **Resilience Matrix**: Vid komplexa situationer

### Connected Children (Sverige)
Forskningscentrum för kunskapsbaserad prevention vid Linnéuniversitetet
[Connected Children projekt](https://lnu.se/forskning/forskningsprojekt/projekt-connected-children-ett-partnerskap/)

**Modifiering och implementering av GIRFEC i Sverige**

**Deltagande organisationer:**
- Linnéuniversitetet, FoU Nordost, Högskolan Dalarna, Örebro universitet
- Region Kronoberg och Kronobergs åtta kommuner
- Falun kommun, Ystad kommun, Hässleholms kommun
- Norra Örebro län, Krokum (Region Jämtland Härjedalen), Österåker (Sju Systrar)

**Lokala implementeringar:**
- **Kronobarnsmodellen** - [Region Kronoberg](https://www.regionkronoberg.se/vardgivare/arbetsomraden-processer/barn-och-unga/kronobarnsmodellen/)
- **Tillsammans För Varje Barn** - [Falun kommun](https://www.falun.se/utbildning--barnomsorg/tillsammans-for-varje-barn.html)
- **Backa Barnet** - [backabarnet.se](https://www.backabarnet.se/)

### BBIC & IBIC (Socialstyrelsen)
- [BBIC - Barns Behov i Centrum](https://www.socialstyrelsen.se/kunskapsstod-och-regler/omraden/barn-och-unga/barn-och-unga-i-socialtjansten/barns-behov-i-centrum/)
- [IBIC - Individens Behov i Centrum](https://www.socialstyrelsen.se/kunskapsstod-och-regler/omraden/individens-behov-i-centrum-ibic/)

### Gävlemodellen
Samarbete mellan Gävle kommun och Högskolan i Gävle för systematiskt trygghetsarbete:
- [Högskolan i Gävle - Gävlemodellen](https://www.hig.se/forskning/forskningsprojekt/aue/seeds/gavlemodellen)
- [Gävle kommun - Trygghetsarbete](https://www.gavle.se/utbildning-och-barnomsorg/grundskola-och-anpassad-grundskola/elevhalsa-och-trygghet/trygghetsarbete-i-skolan/)

**Beprövade resultat (12+ år):**
- Mobbning: 5,7% (jämfört med 8,1% rikssnitt)
- Systematisk uppföljning och åtgärdsarbete
- Tvärsektoriellt samarbete mellan skola och kommun

### Nationell Informationsstruktur (Socialstyrelsen)
[E-hälsa - Nationella informationsmängder](https://www.socialstyrelsen.se/kunskapsstod-och-regler/omraden/e-halsa/)

- **ICF**: Internationell klassifikation av funktionstillstånd, funktionshinder och hälsa (WHO)
- **KSI**: Klassifikation av socialtjänstens insatser och aktiviteter
- **KVÅ**: Klassifikation av vårdåtgärder
- **SNOMED CT**: Primärt terminologisystem för hälsodata
- **ICD-10**: Internationell klassifikation av sjukdomar

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Visit: **http://localhost:5173**

### Starta backend (FastAPI)

```bash
python -m pip install -r backend/requirements.txt
uvicorn backend.fastapi_app:app --reload
```

Ställ in `SEMANTIC_BRIDGE_API_KEY` om du vill kräva API-nyckel för alla anrop.

---

## 🚀 Deployment

### GitHub Pages (Säker Demo för Officiella Granskare) ✅
**Rekommenderat för att dela med offentliga aktörer**

Automatisk deployment via GitHub Actions till en säker, statisk demo:

1. **Aktivera GitHub Pages:**
   - Gå till Repository Settings → Pages
   - Under "Source", välj **GitHub Actions**

2. **Deployment sker automatiskt** vid push till `main`

3. **Din demo-URL:** `https://deno-li.github.io/semantisk-brygga-for-skolans-information/`

**Säkerhetsfördelar:**
- ✅ Inga API-nycklar exponerade
- ✅ Endast statisk frontend (ingen backend)
- ✅ Endast demo-data (inga riktiga personuppgifter)
- ✅ Transparant build-process via GitHub Actions
- ✅ Kan delas säkert med skola, socialtjänst och vård

📖 **Detaljerad säkerhetsdokumentation:**
- [README-DEPLOYMENT.md](README-DEPLOYMENT.md) - Deployment-guide
- [SECURITY.md](SECURITY.md) - Säkerhetsinformation för granskare

### Vercel (För utveckling med backend)
1. Gå till [vercel.com](https://vercel.com)
2. Importera ditt GitHub-repo
3. Deploya med backend API-support

Din delningsbara länk: `https://your-project.vercel.app`

---

## Erkännanden

- **Gävle kommun** - Gävlemodellen för systematiskt trygghetsarbete
- **Socialstyrelsen** - Nationell informationsstruktur och gemensamma informationsmängder
- **WHO** - ICF klassifikation
- **Scottish Government** - GIRFEC/SHANARRI ramverk
- **Connected Children** - Forskningsprojekt vid Linnéuniversitetet
- **Region Kronoberg** - Kronobarnsmodellen
- **SKR** - Sveriges Kommuner och Regioner
- **Skolverket** och **SiS** - SS 12000 standard
- **Edtech** - Edtechkarta, IT-standarder, informationsflöden, områden och processer för skola

---

## Användning i Offentlig Sektor

Detta projekt **uppmuntrar särskilt användning inom offentlig sektor** för utvärdering, vidareutveckling och anpassning till gemensamma behov och samverkan.

**Önskan från skaparen:**
Om detta material används i något form av utvecklingsarbete, skulle erkännande uppskattas (men är inte juridiskt krav utöver CC BY 4.0-villkoren).

---

## Licens

- **Dokumentation**: Creative Commons Erkännande 4.0 Internationell (CC BY 4.0)
- **Källkod**: MIT License

Se [LICENSE.md](LICENSE.md) för fullständiga licensvillkor.

---

## Kontakt

För frågor om projektet, använd GitHub Issues i detta repository:
https://github.com/deno-li/semantisk-brygga-for-skolans-information/issues

För användning i projekt kontakta via GitHub.

---

**Skapad:** 2025-12-08
**Senast uppdaterad:** 2025-12-19
**Repository:** https://github.com/deno-li/semantisk-brygga-for-skolans-information
**Licens (dokumentation):** CC BY 4.0
**Licens (kod):** MIT
**Status:** Öppen för användning, forskning och vidareutveckling
