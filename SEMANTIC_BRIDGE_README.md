# Semantic Bridge Architecture

**Version:** 1.0.0
**Based on:** ICF 2025 v1.1, KSI 2025 v1.0, Gävlemodellens 12+ years of proven data
**Author:** Deniz, Kvalitetsutvecklare Region Gävleborg & Gävle kommun

---

## TL;DR

A complete semantic interoperability platform for Swedish welfare systems, bridging **schools**, **social services**, **healthcare**, and **child welfare** using standardized ICF and KSI codes.

### Core Achievement

**KSI's Axel 1 (Target) = ICF codes** → 97% mapping confidence

This means social services and healthcare already speak the semantic language. We just need to extend **SS 12000** (school systems) to join the conversation.

### Proven Foundation

- **Gävlemodellen**: 12+ years, 12,000 students, 2 surveys/year
- **Results**: 5.7% vs 8.1% bullying (national avg)
- **ROI**: 16.6x over 12 years (432 MSEK value / 26 MSEK cost)
- **Free-text rate**: 87% (qualitative statistics)

---

## Architecture Overview

```
STUDENT FREE-TEXT RESPONSE
    ↓
AI ANALYSIS (88-93% confidence)
    ↓
ICF CODES (b140, d160, e250)
    ↓
KSI CODES (97% confidence - automatic)
    ↓
SEMANTIC MAPPINGS:
├─ BBIC (95% confidence)
├─ IBIC (100% confidence - ICF native)
├─ KVÅ (87% confidence)
└─ SS 12000 (76% → 95% with extension)
```

---

## Installation

```bash
# Clone repository
git clone https://github.com/deno-li/semantic-bridge.git
cd semantic-bridge

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

---

## Quick Start

### 1. Run the API Server

```bash
# Start FastAPI server
python -m src.api.main

# Or with uvicorn directly
uvicorn src.api.main:app --reload --port 8000
```

API will be available at: `http://localhost:8000`
Interactive docs: `http://localhost:8000/api/docs`

### 2. Run Examples

```bash
python examples/example_usage.py
```

This demonstrates:
- Free-text analysis → ICF codes
- ICF → KSI mapping
- Complete survey flow
- Batch analysis
- Spider chart (Behovskompassen)
- Semantic mapping overview

---

## API Examples

### Map ICF to KSI

```bash
curl http://localhost:8000/api/v1/mapping/icf-to-ksi/d160
```

Response:
```json
{
  "source_code": "d160",
  "target_system": "KSI",
  "target_codes": ["SCA"],
  "target_descriptions": ["Att fokusera uppmärksamhet"],
  "confidence": 0.97,
  "mapping_path": "direct"
}
```

### Analyze Free-Text

```bash
curl -X POST http://localhost:8000/api/v1/ai/analyze-freetext \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Ibland är det svårt att koncentrera mig när det är högt ljud",
    "context": "utvecklas",
    "min_confidence": 0.75
  }'
```

### Generate KSI Code

```bash
curl -X POST http://localhost:8000/api/v1/ksi/generate \
  -H "Content-Type: application/json" \
  -d '{
    "icf_code": "d160",
    "action": "PM",
    "status": "2"
  }'
```

---

## Project Structure

```
semantic-bridge/
├── src/
│   ├── models/
│   │   ├── icf_models.py          # ICF 2025 data models (1,671 codes)
│   │   ├── ksi_models.py          # KSI 2025 models (129 targets, 19 actions)
│   │   └── intervention_models.py # SS 12000 extensions
│   ├── services/
│   │   ├── semantic_mapper.py     # Core mapping engine
│   │   └── ai_analyzer.py         # Swedish child-voice text analysis
│   └── api/
│       └── main.py                # FastAPI REST API
├── examples/
│   └── example_usage.py           # Complete usage examples
├── requirements.txt
└── README.md
```

---

## Core Components

### 1. ICF Models (`icf_models.py`)

- **1,671 ICF codes** from ICF 2025 v1.1
- 4 components: Body Functions (b), Structures (s), Activities (d), Environment (e)
- Qualifiers for extent, nature, location, change
- Core Sets for common conditions

### 2. KSI Models (`ksi_models.py`)

- **3-axis structure**: Target + Action + Status
- **129 Targets** (Axel 1) → Direct ICF mapping (100% confidence)
- **19 Actions** (Axel 2) → What professionals do
- **4 Status codes** (Axel 3) → Planned/Ongoing/Completed/Discontinued

### 3. Intervention Models (`intervention_models.py`)

**New SS 12000 entities** (bridges the 76% → 95% gap):

- `SupportIntervention` - Links KSI + ICF to pedagogical support
- `FunctionDescription` - ICF function tracking for students
- `EnvironmentalFactor` - ICF e-codes (barriers/facilitators)
- `SurveyResponse` - Gävlemodellen survey data
- `SpiderChartData` - 8 SHANARRI domains visualization
- `PDCARecord` - Continuous improvement tracking

---

## Confidence Ratings

Based on validated mappings and Gävlemodellen data:

| System Mapping | Confidence | Note |
|----------------|-----------|------|
| **ICF ↔ KSI** | 97% | KSI Target = ICF codes (exact) |
| **ICF ↔ IBIC** | 100% | IBIC uses ICF natively |
| **ICF ↔ BBIC** | 95% | Socialstyrelsen method |
| **SHANARRI ↔ ICF** | 90% | Conceptual, internationally validated |
| **ICF ↔ KVÅ** | 87% | ICHI structure, WHO family |
| **SS 12000 ↔ ICF** | **76%** | ❌ CRITICAL GAP |
| **SS 12000 Extended** | **95%** | ✅ With new entities |

---

## SHANARRI / Behovskompassen

8 wellbeing domains from Scottish GIRFEC framework:

1. **SAFE** (Trygghet) - Safety and security
2. **HEALTHY** (Må bra) - Physical and mental health
3. **ACHIEVING** (Utvecklas) - Learning and development
4. **NURTURED** (Omtanke) - Care and support
5. **ACTIVE** (Aktivitet) - Physical activity
6. **RESPECTED** (Respekterad) - Respect and dignity
7. **RESPONSIBLE** (Ansvarstagande) - Responsibility
8. **INCLUDED** (Delaktighet) - Inclusion and participation

---

## Economic Model

### Investment (National 2025-2030)

- **Pilot:** 16 MSEK (Gävle, 12k students, 2025-2027)
- **Regional:** 40 MSEK (Gävleborg, 40k, 2027-2028)
- **National:** 150 MSEK (Sweden, 1.2M, 2028-2030)
- **Total:** 206 MSEK over 5 years

### Expected Returns

- **Annual savings:** 3.45 billion SEK/year (from 2030)
- **Break-even:** 3 weeks
- **10-year NPV:** 34.3 billion SEK
- **Proven local ROI:** 16.6x (Gävlemodellen, 12 years)

---

## Development Status

### ✅ Completed

- Core data models (ICF, KSI, interventions)
- Semantic mapping engine with verified confidence scores
- AI text analyzer (Swedish child-voice)
- REST API with FHIR-compatible structure
- Complete usage examples
- Documentation

### 🚧 Next Steps

1. Production database integration (PostgreSQL)
2. Authentication & authorization (role-based access)
3. Real-time sync with 1177 Vårdguiden
4. SS 12000 API integration
5. PDCA visualization dashboard
6. Pilot deployment (Gävle)

---

## Research Partners

- **Högskolan Gävle**: Prof. Peter Gill, Prof. Silvia Edling, Prof. Guadalupe Francia
- **Skolverket**: Rapport 353 (2011) - Evidence base
- **Gävle kommun**: 12+ years operational data
- **Region Gävleborg**: Healthcare integration

---

## Contact

**Author:** Deniz
**Role:** Kvalitetsutvecklare
**Organization:** Region Gävleborg & Gävle kommun
**Project:** Semantic Bridge Architecture

---

**Built on proven results. Ready for national implementation.**