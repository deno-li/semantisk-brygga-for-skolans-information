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
- 👦 **Barn** - Barnets egen röst med barnanpassat språk
- 👩‍🏫 **Professionell** - Tjänstepersonens vy med klassifikationer

**Exempel semantisk integration mellan skolans information och (ICF/KSI/BBIC/IBIC/KVÅ/Snomed CT)**

### 2. My World Triangle (GIRFEC)
3-dimensionell helhetsbedömning:
- Hur jag växer och utvecklas
- Vad jag behöver från andra
- Min omvärld

Integration med BBIC-triangeln (Barnets utveckling, föräldraförmåga, familj och miljö)

### 3. Resilience Matrix
För komplexa situationer (nivå 3-4 stöd):
- Adversity (motgångar) - skala 1-10
- Vulnerability (sårbarhet) - skala 1-10
- Protective Environment (skyddande miljö) - skala 1-10

### 4. Livsloppsperspektiv
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
- Förbättringshjul (PDCA) för Gävlemodellens systematiskt tygghetsarbete

---

## 📖 Dokumentation

- **`README.md`** - Denna fil (översikt)
- **`BARNETS_RESA_MATRIS_README.md`** - Komplett dokumentation för Journey-systemet

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

---

## 🚀 Deployment

### Vercel (Rekommenderat)
1. Gå till [vercel.com](https://vercel.com)
2. Importera ditt GitHub-repo
3. Välj branch: `claude/optimize-journey-prototype-uB7Up`
4. Deploya!

Din delningsbara länk: `https://your-project.vercel.app`

---

## 📖 Bakgrund & Kontext

**Projekt:** Prototyputveckling för välbefinnandehjul

**Stödjer:** [Handslaget för digitalisering](https://skr.se/digitaliseringivalfarden/handslagfordigitalisering.html) - SKR

Detta är ett **privat initiativ** av en yrkesperson inom kvalitetsutveckling i offentlig sektor för att bidra med ett perspektiv från praktiken. Projektet representerar inte någon organisations officiella ståndpunkt.

**Syfte:** Att främja utvecklingen av en gemensam, livsloppsbaserad informationsprofil för barn och unga som binder ihop skolans pedagogiska dokumentation med socialtjänstens och hälso- och sjukvårdens strukturer.

---

## Bidrag & Samarbete

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
- **Skolverket** och **SiS** - SS 12000 standard
- **Edtech** - Edtechkarta, IT-standarder, informationsflöden, områden och processer för skola

---

## 📞 Kontakt

För frågor, feedback eller samarbetsförslag:
- Öppna ett Issue på GitHub
- Skicka en Pull Request
- Kontakta via GitHub

---

**Status**: Prototyp
**Repository**: [github.com/deno-li/semantisk-brygga-f-r-skolans-information](https://github.com/deno-li/semantisk-brygga-for-skolans-information)
