# Barnets Resa Matris Prototyp

**Version:** 1.0.0
**Datum:** 2025-12-27

---

## 📋 Översikt

**Barnets Resa Matris** är en omfattande, evidensbaserad modell för att följa och stödja barns välbefinnande genom tre nivåer:

1. **Universell nivå** - Alla barn, hälsofrämjande + tidig upptäckt
2. **Stödprofil** - Riktat stöd inom huvudman
3. **Samordningsprofil** - Samordnade insatser över huvudmannagränser

### Nyckelkomponenter

- ✅ **8 välbefinnandeekrar** med multi-perspektiv (barn/vårdnadshavare/profession)
- ✅ **Semantisk mappning** till ICF, KSI, SNOMED CT, SS 12000
- ✅ **Automatisk eskalering** baserat på triggers
- ✅ **Dataminimering** per nivå
- ✅ **Interaktiv matrisöversikt**

---

## 🚀 Nya Funktioner

### 1. OptimalWelfareWheel (`OptimalWelfareWheel.tsx`)

**8 ekrar baserat på matrisen:**

| Eker | Barnets indikator | ICF-domäner | KSI Targets |
|------|------------------|-------------|-------------|
| **TRYGG** | Jag känner mig trygg | b152, d240, e3/e4/e5 | Target: psykosocial miljö |
| **HÄLSA / MÅ BRA** | Jag mår bra | b130, b134, b152, d570 | Target: hälsa/egenvård |
| **UTVECKLAS** | Jag hänger med | d1/d8, b140-b144 | Target: utbildning/lärande |
| **LÄRANDE** | Jag får hjälp när jag behöver | d155-d179, d820 | Target: lärmiljö |
| **HEMMET** | Det känns bra hemma | e310-e315, d760, e5 | Target: hemliv |
| **RELATIONER** | Jag har någon att vara med | d710-d740, d750, e4 | Target: relationer |
| **AKTIV** | Jag gör något jag gillar varje vecka | d920, d450-d455, e3 | Target: fritid/aktivitet |
| **DELAKTIG** | Jag får vara med och påverka | d910, d750, e5 | Target: delaktighet |

**Features:**
- 📊 Multi-perspektiv visning (anpassas efter rollvy)
- 📈 Historisk trend per eker
- 🎨 Färgkodad status (1-5 skala)
- 🔍 Semantisk mappningsvy (ICF/KSI/SNOMED/SS12000)
- ⚡ Eskaleringsvarningar vid behov

### 2. ChildJourneyLevel (`ChildJourneyLevel.tsx`)

**Nivåhantering med full transparens:**

- 📍 Visar aktuell nivå (Universell/Stödprofil/Samordning)
- 📜 Nivåhistorik med fullständig logg
- ⚡ Aktiva eskaleringstriggrar med åtgärdsförslag
- 📅 Uppföljningsfrekvens per nivå
- 🔒 Dataminimering
- 🎯 Triggers till nästa nivå

**Nivåöversikt:**
```
[Universell] → [Stödprofil] → [Samordning]
    ↓              ↓              ↓
Alla barn    Barn med stöd   Samordnade
                 behov         insatser
```

### 3. MatrixOverview (`MatrixOverview.tsx`)

**Interaktiv guide till hela modellen:**

6 flikar:
1. **Översikt** - Introduktion och nyckelprinciper
2. **Nivåmodell** - Detaljer om de 3 nivåerna
3. **Välbefinnandehjul** - De 8 ekrarna med semantik
4. **Datadelning** - Vad delas
5. **Eskalering** - Triggers och åtgärder
6. **Kodsystem** - ICF, KSI, SNOMED, ICD, KVÅ, SS 12000

---

## 📊 Mock Data

Fyra fullständiga exempelprofiler:

### Erik (Universell nivå)
- ✅ Alla ekrar gröna/ljusgröna
- 📅 Uppföljning: Terminsvis
- Status: Inga stödbehov

### Lisa (Stödprofil)
- ⚠️ 2 röda ekrar (Trygg, Relationer)
- 🎯 Aktiv stödplan med 2 mål och 2 insatser
- 📅 Uppföljning: Var 6:e vecka
- Status: Social färdighetsträning + stödsamtal pågår

### Omar (Universell nivå med tidig uppmärksamhet)
- 🟡 3 gula ekrar (Trygg, Utvecklas, Relationer)
- 📝 Språksvårigheter identifierade
- 📅 Uppföljning: Per termin
- Status: Extra stöd i svenska, hanteras inom universell nivå

### Sofia (Samordningsprofil)
- 🚨 Flera röda ekrar (Trygg, Hälsa, Hemmet)
- 🤝 Samordningsplan över 4 sektorer (Gymnasium, Elevhälsa, BUP, Socialtjänst)
- 📅 Uppföljning: Var 4:e vecka
- Status: Barnets plan/SIP aktiverad

---

## 🗂️ Filstruktur

```
/
├── App.tsx                      (✨ Uppdaterad med nya vyer)
├── Navigation.tsx               (✨ Uppdaterad med nya flikar)
├── types.ts                     (✨ Nya interfaces för Journey)
│
├── OptimalWelfareWheel.tsx      (⭐ NY - 8 ekrar)
├── ChildJourneyLevel.tsx        (⭐ NY - Nivåhantering)
├── MatrixOverview.tsx           (⭐ NY - Interaktiv guide)
│
├── journeyConstants.ts          (⭐ NY - Alla konstanter)
├── journeyMockData.ts           (⭐ NY - Exempel-data)
│
└── Barnets_resa_matris.xlsx     (📁 Ursprunglig matris)
```

---

## 🎨 Användargränssnitt

### Navigationsflikar (markerade med ⭐)

1. **Översikt** - Dashboard
2. **Välbefinnandehjul (8 ekrar)** ⭐ - Optimal version
3. **Nivåhantering** ⭐ - Journey levels
4. **Matrisöversikt** ⭐ - Komplett guide
5. Välbefinnandehjul (original) - Tidigare version
6. Min röst - Självskattning
7. ... (övriga vyer)

### Färgkodning

**Status (1-5 skala):**
- 🔴 Röd (1) - Mycket låg / Behöver åtgärd
- 🟠 Orange (2) - Låg / Behöver uppmärksamhet
- 🟡 Gul (3) - Medel / Följ upp
- 🟢 Ljusgrön (4) - Bra / Fortsätt så
- 🟢 Grön (5) - Mycket bra / Styrka

**Nivåer:**
- 🔵 Blå - Universell
- 🟡 Gul - Stödprofil
- 🔴 Rosa - Samordning

---

## 🔄 Eskaleringslogik

### Triggers från Universell → Stödprofil:
- ❌ Röd i 1 eker två gånger
- ⚠️ Gul-röd i 2 ekrar samtidigt
- 📉 Tydlig negativ trend

### Triggers från Stödprofil → Samordning:
- 🚫 Stödprofil utan förbättring
- 🤝 Minst 2 ekrar + fler huvudmän krävs
- 👨‍👩‍👧 Familjen efterfrågar samordning

### Nedtrappning:
- ✅ Stabilisering → Trappa ned till lägre nivå
- 📊 Historik bevaras

---

## 🧩 Semantisk Interoperabilitet

1. **ICF** (Socialstyrelsen/WHO)
   - Tvärsektoriell domänstruktur
   - Funktion, delaktighet, miljö

2. **KSI** (Socialstyrelsen)
   - Target/Action/Means
   - Gemensamt insatsspråk

3. **SNOMED CT** (Socialstyrelsen/SNOMED International)
   - Vårdens primärterminologi
   - Endast vid vård-källa

4. **ICD-10/11** (Socialstyrelsen/WHO)
   - Diagnosklassifikation
   - Undviks i universell vy

5. **KVÅ** (Socialstyrelsen)
   - Åtgärdsklassifikation
   - Rapportering

6. **SS 12000** (SIS)
   - Skolans strukturella bärlager
   - Vem/var/när/händelse

---

## 📖 Användarscenarier

### Scenario 1: Tidig upptäckt (Universell → Stödprofil)

**Situation:** Lisa visar låga värden i "Trygg" och "Relationer" under två mätningar.

**System:**
1. Automatisk trigger genereras
2. Förslag: "Aktivera stödprofil"
3. Pedagog/elevhälsa får notis

**Åtgärd:**
- Stödprofil aktiveras
- Stödplan upprättas med mål
- Social färdighetsträning startar
- Uppföljning var 6:e vecka

**Resultat:** Lisa får rätt stöd i tid.

### Scenario 2: Samordnad insats (Stödprofil → Samordning)

**Situation:** Sofia har kvarstående röda värden trots stödinsatser. BUP och socialtjänst behöver involveras.

**System:**
1. Trigger: "Stödprofil utan förbättring + fler huvudmän krävs"
2. Förslag: "Aktivera samordningsprofil"

**Åtgärd:**
- Samordningsprofil aktiveras (SIP-lik)
- Barnets plan upprättas
- Koordinator utses (skolkurator)
- Möten var 4:e vecka med alla sektorer
- Tydlig ansvarsmatris

**Resultat:** Sofia och familjen får samordnat stöd över sektorsgränser.

---

## 📞 Support & Kontakt

**Projektägare:** Privat initiativ

**Teknisk stack:**
- React 18 + TypeScript
- Vite (build)
- TailwindCSS (styling)
- Lucide Icons
- Chart.js (grafer)

**Licens:** MIT (Open source för utveckling)

---

## ✨ Sammanfattning

Barnets Resa Matris representerar en slutversion av prototypen med:

✅ **Komplett nivåmodell** (3 nivåer)
✅ **8 ekrar** med multi-perspektiv
✅ **Automatisk eskalering** med tydliga triggers
✅ **Semantisk interoperabilitet** (6 kodsystem)
✅ **Interaktiv guide** för pedagogisk förståelse
✅ **Realistisk mock-data** för demonstration

---

*Version: 1.0.0*
