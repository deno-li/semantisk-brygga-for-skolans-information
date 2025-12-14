# Välbefinnandehjul för Sammanhållen Planering i 1177
## Gemensam informationsprofil för barnets hela resa (Livsloppsperspektiv)

En interaktiv prototyp som demonstrerar hur skolans, socialtjänstens och hälso- och sjukvårdens informationsmängder kan harmoniseras genom semantiskt lager för **sammanhållen planering** kring barn och unga.

Designen bygger på välbefinnandehjul och dimensioner från **GIRFEC (Getting It Right For Every Child)**, samt arbetssätt från **Kronobarnsmodellen** och **Gävlemodellen** för systematiskt trygghetsarbete.

---

## 🎯 Syfte

Ett **standardiserat välbefinnandehjul** som följer individen genom hela livet från MVC/BVC till vuxenliv, med samma dimensioner för att möjliggöra:

- 🏥 Hälsofrämjande och förebyggande arbete från början
- 🔍 Tidig identifiering av risk- och skyddsfaktorer
- 🤝 Tvärsektoriell samverkan kring gemensam informationsprofil
- 📊 Longitudinell datauppföljning över tid
- 🎓 Kontinuitet genom alla livsfaser

---

## ✨ Huvudfunktioner

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
- 👨‍👩‍👧 **Vårdnadshavare** - Förälder/målsmans vy
- 👦 **Barn (13+)** - Barnets egen röst med barnanpassat språk
- 👩‍🏫 **Professionell** - Tjänstepersonens vy med fullständiga klassifikationer

**Semantisk brygga till:**
- ICF (International Classification of Functioning)
- KSI (Klassifikation av Socialtjänstens Insatser)
- BBIC (Barns Behov i Centrum)
- IBIC (Individens Behov i Centrum)
- KVÅ (Klassifikation av Vårdåtgärder)
- SNOMED CT & ICD-10/11

### 2. My World Triangle (GIRFEC)
3-dimensionell helhetsbedömning:
- Hur jag växer och utvecklas
- Vad jag behöver från andra
- Min omvärld

Integration med BBIC-triangeln (Barnets utveckling, Föräldraförmåga, Familj och miljö)

### 3. Resilience Matrix
För komplexa situationer (nivå 3-4 stöd):
- Adversity (motgångar) - skala 1-10
- Vulnerability (sårbarhet) - skala 1-10
- Protective Environment (skyddande miljö) - skala 1-10

### 4. Livsloppsperspektiv
Visualisering genom 6 livsfaser:
- **MVC/BVC** (0-5 år) → **Förskola** → **Grundskola** → **Gymnasiet** → **Ung vuxen** → **Vuxen och äldre**

Med longitudinell data, risk- och skyddsfaktorer, samt övergångar mellan faser.

### 5. 4-nivåsystem för stöd
- **Nivå 1 (Grön)**: Universell - alla barn
- **Nivå 2 (Gul)**: Tidig uppmärksamhet
- **Nivå 3 (Orange)**: Förstärkt stöd
- **Nivå 4 (Röd)**: Intensivt stöd

### 6. Systematiskt Trygghetsarbete
Kvalitetscykel enligt **Gävlemodellen** med integration av lagkrav (SoL, HSL, Skollagen, Barnkonventionen):
- Q1: Kartläggning och enkäter
- Q2: Analys och åtgärdsplanering
- Q3: Genomförande och uppföljning
- Q4: Utvärdering och rapportering

### 7. Flerbarnsvy
Möjlighet att växla mellan olika barnprofiler:
- **Erik A.** - Nivå 3: Förstärkt stöd (ADHD och dyslexi)
- **Sofia B.** - Nivå 4: Intensivt stöd (psykisk ohälsa)
- **Omar H.** - Nivå 2: Tidig uppmärksamhet (språksvårigheter)
- **Lisa J.** - Nivå 1: Universell (mår bra)

Varje barn har unika SIP-mål, välbefinnandedata och individualiserade planer.

### 8. Min Röst - Barnets perspektiv
Enkätverktyg för barn att uttrycka sina egna upplevelser:
- Välbefinnandefrågor anpassade för barn
- Emotionell temperaturkontroll
- Barnvänligt språk och gränssnitt
- Stödjer barnets rätt till information och delaktighet

---

## 🚀 Kom igång

### Förutsättningar
- Node.js (v18 eller senare)
- npm

### Installation

```bash
# Klona repository
git clone https://github.com/deno-li/semantisk-brygga-f-r-skolans-information.git
cd semantisk-brygga-f-r-skolans-information

# Installera beroenden
npm install

# Starta utvecklingsserver
npm run dev
```

Öppna [http://localhost:5173](http://localhost:5173) i din webbläsare.

### Bygg för produktion

```bash
npm run build
```

Byggda filer finns i `dist/` mappen.

---

## 🏗️ Teknisk Stack

- **React 18.2** - UI-ramverk
- **TypeScript 5.2** - Typsäkerhet
- **Vite 6.4** - Byggverktyg
- **Tailwind CSS 3.4** - Styling
- **Recharts 2.12** - Datavisualisering
- **Lucide React** - Ikoner
- **React Hooks** - State management

Optimerad med lazy loading och code splitting för bästa prestanda.

---

## 📊 Projektstruktur

```
semantisk-brygga-för-skolans-information/
├── src/
│   ├── components/          # React-komponenter
│   │   ├── Dashboard.tsx    # Översiktspanel
│   │   ├── WelfareWheel.tsx # SHANARRI-hjul
│   │   ├── WellbeingSurvey.tsx # Min röst-enkät
│   │   ├── LifeCourseView.tsx # Livsloppsperspektiv
│   │   ├── MyWorldTriangle.tsx # GIRFEC-triangel
│   │   ├── ResilienceMatrix.tsx # Resiliens-matris
│   │   ├── QualitySystem.tsx # Gävlemodellen
│   │   └── ...
│   ├── constants.ts         # SHANARRI-data och klassifikationer
│   ├── profileData.ts       # Barnprofiler (Lisa, Omar, Sofia, Erik)
│   ├── childProfiles.ts     # Profilmetadata och SIP-mål
│   ├── types.ts             # TypeScript-typer
│   └── App.tsx              # Huvudapplikation
├── data/                    # Referensdata (ICF, KSI, KVÅ)
├── public/                  # Statiska filer
├── package.json
└── README.md
```

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

Nationella informationsmängder används som semantisk referens vid utveckling, upphandling och kravställning av informationssystem samt vid utbyte av information inom och mellan system.

---

## 🔐 Dataskydd & Säkerhet

**⚠️ VIKTIGT:** Detta är en prototyp med **fiktiva demonstrationsdata**.

Inga personuppgifter eller känslig information lagras. Alla namn, personnummer och skolnamn är påhittade exempel för demonstrationsändamål.

För produktionsmiljö krävs:
- ✅ Korrekt informationssäkerhetsanalys
- ✅ GDPR-compliance
- ✅ Säker autentisering och behörighetsstyrning
- ✅ Krypterad datalagring och överföring
- ✅ Loggning och spårbarhet
- ✅ Rätt till insyn, rättelse och radering

---

## 🎨 Senaste Uppdateringar

**Version 1.1.0** (December 2024)

### Nya funktioner:
- ✅ Flerbarnsvy med växling mellan olika profiler (Lisa, Omar, Sofia, Erik)
- ✅ Dynamiska SIP-mål för varje barn
- ✅ Förenklat barngränssnitt utan oroväckande statistik
- ✅ Professionell vy med fullständiga ICF/KSI/BBIC-klassifikationer
- ✅ Borttaget samtycke-sida för renare gränssnitt
- ✅ Barnets namn följer med genom hela gränssnittet
- ✅ Gömda status-badges från barnvyn ("3 Bra", "5 OK")

### Tekniska förbättringar:
- ✅ Uppdaterad SHANARRI-data med detaljerade klassifikationer
- ✅ Konfidensnivåer (84-95%) för semantiska mappningar
- ✅ Förbättrad perspektivhantering (barn/vårdnadshavare/professionell)
- ✅ Optimerad prestanda med lazy loading

---

## 🚢 Deployment

Projektet är konfigurerat för GitHub Pages deployment:

```bash
# GitHub Actions bygger och deployer automatiskt vid push till main
# Se .github/workflows/deploy.yml
```

---

## 📖 Bakgrund & Kontext

**Projekt:** Koncept och prototyputveckling för välbefinnandehjul med livsloppsperspektiv

**Stödjer:** [Handslaget för digitalisering](https://skr.se/digitaliseringivalfarden/handslagfordigitalisering.html) - SKR

Detta är ett **privat initiativ** av en yrkesperson inom kvalitetsutveckling i offentlig sektor för att bidra med ett perspektiv från praktiken. Projektet representerar inte någon organisations officiella ståndpunkt.

**Syfte:** Att främja utvecklingen av en gemensam, livsloppsbaserad informationsprofil för barn och unga som binder ihop skolans pedagogiska dokumentation med socialtjänstens och hälso- och sjukvårdens strukturer.

---

## 🤝 Bidrag & Samarbete

Detta projekt välkomnar bidrag från:
- Forskare inom utbildning, socialtjänst och hälso- och sjukvård
- Praktiker inom kommunal verksamhet
- Systemutvecklare med intresse för interoperabilitet
- Policymakers inom digital infrastruktur

**Användning i offentlig sektor uppmuntras särskilt för:**
- ✅ Forskning och utvärdering
- ✅ Utveckling av digital infrastruktur
- ✅ Pilotprojekt för sammanhållen planering
- ✅ Utbildning och kompetensutveckling
- ✅ Vidareutveckling och anpassning till lokala behov

---

## 📄 Licens

- **Dokumentation**: Creative Commons Erkännande 4.0 Internationell (CC BY 4.0)
- **Källkod**: MIT License

Se [LICENSE.md](LICENSE.md) för fullständiga licensvillkor.

---

## 🙏 Erkännanden

- **Gävle kommun** - Gävlemodellen för systematiskt trygghetsarbete
- **Socialstyrelsen** - BBIC, KSI, KVÅ standarder och nationell informationsstruktur
- **WHO** - ICF klassifikation
- **Scottish Government** - GIRFEC/SHANARRI ramverk
- **Connected Children** - Forskningsprojekt vid Linnéuniversitetet
- **Region Kronoberg** - Kronobarnsmodellen
- **SKR** - Sveriges Kommuner och Regioner
- **Skolverket** - SS 12000 standard

---

## 📞 Kontakt

För frågor, feedback eller samarbetsförslag:
- Öppna ett Issue på GitHub
- Skicka en Pull Request
- Kontakta via GitHub

---

**Utvecklad med ❤️ för att förbättra samverkan kring barn och ungas välbefinnande**

**Version**: 1.1.0
**Senast uppdaterad**: December 2024
**Status**: Produktionsklar prototyp
**Repository**: [github.com/deno-li/semantisk-brygga-f-r-skolans-information](https://github.com/deno-li/semantisk-brygga-f-r-skolans-information)
