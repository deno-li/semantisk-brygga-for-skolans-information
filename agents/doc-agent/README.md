# Dokumentationsagent för Semantisk Brygga

## Översikt

Denna agent är designad för att stödja professionella inom skola, socialtjänst och hälso- och sjukvård med dokumentation och kodning enligt etablerade klassifikationssystem.

## Konfiguration för Intric

### Rekommenderade inställningar

| Parameter | Värde | Motivering |
|-----------|-------|------------|
| **Modell** | `claude-sonnet-4-5-20250514` | Balans mellan prestanda och kostnad |
| **Temperatur** | `0.3` | Låg för konsekvent, deterministisk kodning |
| **Max tokens** | `8192` | Tillräckligt för detaljerade kodsvar |
| **Top-p** | `0.95` | Hög precision för klassifikationssystem |

### Steg-för-steg i Intric

1. **Skapa ny agent** i din Intric-miljö
2. **Ladda upp systemprompt** - kopiera innehållet från `system-prompt.md`
3. **Konfigurera kunskapskällor** - ladda upp klassifikationsfilerna:
   - `data/icf.tsv` (WHO ICF)
   - `data/ksi.tsv` (KSI)
   - `data/kva-medicinska-atgarder-kma.tsv` (KVÅ)
4. **Sätt modellparametrar** enligt tabellen ovan
5. **Testa med exempelobservationer**

### Kunskapskällor att ladda upp

Prioritera dessa filer för RAG (Retrieval-Augmented Generation):

```
data/
├── icf.tsv                              # 349 KB - WHO ICF-klassificering
├── ksi.tsv                              # 664 KB - Socialtjänstens klassifikation
├── kva-medicinska-atgarder-kma.tsv      # 937 KB - Vårdåtgärder
├── icf-2025-inkl-core-sets.xlsx         # 295 KB - ICF core sets
└── Barnets_resa_matris.xlsx             # 21 KB - 3-nivåmodellen
```

### Kompletterande kontext

Lägg till dessa dokument som bakgrundskunskap:

- `BARNETS_RESA_MATRIS_README.md` - Fördjupning i 3-nivåmodellen
- `docs/json-schemas/semantic-bridge.schema.json` - API-struktur

## Användningsområden

### 1. Kodning av observationer
Agenten kan ta fritext-observationer och föreslå lämpliga ICF-, KSI- och BBIC-koder.

**Exempel:**
```
Input: "Eleven har svårt att delta i grupparbeten och undviker ofta sociala situationer."

Output:
- ICF:d9205 - Socialisera (Confidence: Hög)
- ICF:d7504 - Informella relationer med kamrater (Confidence: Medel)
- SHANARRI: Included (Inkluderad) - risk för gult/rött
- Rekommendation: Överväg N2-screening
```

### 2. Cross-system mappning
Översätt mellan olika klassifikationssystem med angivna confidence-nivåer.

### 3. Dokumentationsstöd
Generera strukturerad dokumentationstext baserat på bedömningar.

### 4. Kvalitetssäkring
Granska befintlig dokumentation och föreslå kompletteringar.

## Testfall för validering

### Test 1: Grundläggande ICF-kodning
```
Input: "Barnet kan gå kortare sträckor men behöver rullstol för längre avstånd."
Förväntat: ICF:d450 (Gå), kvalifikator 2 (måttlig svårighet)
```

### Test 2: SHANARRI-mappning
```
Input: "Eleven presterar bra akademiskt men saknar vänner."
Förväntat: Achieving=grön, Included=gul/röd
```

### Test 3: Nivåbedömning
```
Input: "Stöd från flera aktörer behövs - skola, BUP och socialtjänst samverkar."
Förväntat: N3 (Samordningsprofil)
```

## Utökningsmöjligheter

### Fas 2: Integrera med backend
Anslut agenten till `backend/fastapi_app.py` för realtidsmappning via API:
- `/api/v1/mapping/icf-to-ksi/{icf_code}`
- `/api/v1/ai/analyze-text`

### Fas 3: RAG med vektordatabas
Indexera klassifikationsfilerna i en vektordatabas för förbättrad semantisk sökning.

### Fas 4: Flerspråkighet
Utöka med stöd för engelska ICF-termer för internationell kompatibilitet.

## Begränsningar

- **Prototyp**: Agenten är utvecklad för test- och utvecklingsmiljöer
- **Ej klinisk**: Ersätter inte professionell bedömning
- **Mockdata**: Använd endast exempeldata, inga riktiga personuppgifter

## Felsökning

| Problem | Lösning |
|---------|---------|
| Agenten föreslår felaktiga koder | Kontrollera att kunskapskällorna är korrekt uppladdade |
| Låg confidence på mappningar | Ge mer kontext i observationen |
| Svar på fel språk | Verifiera att systemprompt specificerar svenska |

## Kontakt

För frågor om denna agent, se projektets GitHub-repository.
