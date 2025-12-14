"""
Semantic Bridge Architecture - REST API
FastAPI application for semantic mapping and intervention management
"""

from fastapi import FastAPI, HTTPException, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel

from ..models.icf_models import ICFCode, ICFFunctionDescription, ICFEnvironmentalFactor
from ..models.ksi_models import KSITarget, KSIAction, KSIStatus, KSICode
from ..models.intervention_models import (
    SupportIntervention,
    SurveyResponse,
    SpiderChartData,
    PDCARecord,
    WelfareProfile,
    SHANARRIDomain,
    InterventionSource
)
from ..services.semantic_mapper import SemanticMappingEngine, MappingResult
from ..services.ai_analyzer import AITextAnalyzer, ICFSuggestion


# Initialize FastAPI app
app = FastAPI(
    title="Semantic Bridge Architecture API",
    description="API for semantic mapping between ICF, KSI, BBIC, IBIC, KVÅ, and SS 12000",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
semantic_mapper = SemanticMappingEngine()
ai_analyzer = AITextAnalyzer()


# ============================================================================
# Health Check
# ============================================================================

@app.get("/")
async def root():
    """API root endpoint"""
    return {
        "name": "Semantic Bridge Architecture API",
        "version": "1.0.0",
        "status": "operational",
        "documentation": "/api/docs"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "services": {
            "semantic_mapper": "operational",
            "ai_analyzer": "operational"
        }
    }


# ============================================================================
# Semantic Mapping Endpoints
# ============================================================================

@app.get("/api/v1/mapping/icf-to-ksi/{icf_code}", response_model=MappingResult)
async def map_icf_to_ksi(icf_code: str):
    """
    Map ICF code to KSI Target codes
    Confidence: 97% (KSI Axel 1 = ICF)
    """
    result = semantic_mapper.icf_to_ksi(icf_code)
    if not result.target_codes:
        raise HTTPException(
            status_code=404,
            detail=f"No KSI mapping found for ICF code: {icf_code}"
        )
    return result


@app.get("/api/v1/mapping/ksi-to-icf/{ksi_target}", response_model=MappingResult)
async def map_ksi_to_icf(ksi_target: str):
    """
    Map KSI Target to ICF codes
    Confidence: 97% (exact mapping)
    """
    try:
        target = KSITarget(ksi_target)
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid KSI target: {ksi_target}"
        )

    result = semantic_mapper.ksi_to_icf(target)
    return result


@app.get("/api/v1/mapping/icf-to-bbic/{icf_code}", response_model=MappingResult)
async def map_icf_to_bbic(icf_code: str):
    """
    Map ICF code to BBIC dimensions
    Confidence: 95% (Socialstyrelsen method)
    """
    result = semantic_mapper.icf_to_bbic(icf_code)
    return result


@app.get("/api/v1/mapping/icf-to-ibic/{icf_code}", response_model=MappingResult)
async def map_icf_to_ibic(icf_code: str):
    """
    Map ICF code to IBIC
    Confidence: 100% (IBIC uses ICF natively)
    """
    result = semantic_mapper.icf_to_ibic(icf_code)
    return result


@app.get("/api/v1/mapping/icf-to-kva/{icf_code}", response_model=MappingResult)
async def map_icf_to_kva(icf_code: str):
    """
    Map ICF code to KVÅ procedure codes
    Confidence: 87% (ICHI structure)
    """
    result = semantic_mapper.icf_to_kva(icf_code)
    return result


@app.get("/api/v1/mapping/shanarri-to-icf/{domain}", response_model=MappingResult)
async def map_shanarri_to_icf(domain: str):
    """
    Map SHANARRI/Behovskompassen domain to ICF codes
    Confidence: 90% (conceptual mapping)
    """
    result = semantic_mapper.shanarri_to_icf(domain)
    if not result.target_codes:
        raise HTTPException(
            status_code=404,
            detail=f"Unknown SHANARRI domain: {domain}"
        )
    return result


@app.get("/api/v1/mapping/icf-to-all/{icf_code}")
async def map_icf_to_all_systems(icf_code: str):
    """
    Map single ICF code to all welfare systems
    Returns mappings for KSI, BBIC, IBIC, and KVÅ
    """
    mappings = semantic_mapper.map_to_all_systems(icf_code)
    return {
        "icf_code": icf_code,
        "mappings": {
            system: {
                "target_codes": result.target_codes,
                "target_descriptions": result.target_descriptions,
                "confidence": result.confidence,
                "metadata": result.metadata
            }
            for system, result in mappings.items()
        }
    }


# ============================================================================
# KSI Code Generation
# ============================================================================

class KSIGenerationRequest(BaseModel):
    icf_code: str
    action: str
    status: str = "1"  # Default to PLANNED

@app.post("/api/v1/ksi/generate")
async def generate_ksi_code(request: KSIGenerationRequest):
    """
    Generate complete KSI code from ICF code and action
    Returns full KSI code (Target-Action-Status) with confidence
    """
    try:
        action = KSIAction(request.action)
        status = KSIStatus(request.status)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    ksi_code, confidence = semantic_mapper.generate_ksi_code(
        request.icf_code,
        action,
        status
    )

    if not ksi_code:
        raise HTTPException(
            status_code=404,
            detail=f"Could not generate KSI code from ICF: {request.icf_code}"
        )

    return {
        "full_code": ksi_code.full_code,
        "target": ksi_code.target.value,
        "target_icf": ksi_code.target_icf_codes,
        "action": ksi_code.action.value,
        "status": ksi_code.status.value,
        "description": ksi_code.get_description(),
        "confidence": confidence
    }


@app.post("/api/v1/ksi/suggest-interventions")
async def suggest_interventions(
    icf_codes: List[str] = Body(...),
    context: str = Body("school")
):
    """
    Suggest KSI interventions based on ICF codes
    Returns list of suggested intervention configurations
    """
    suggestions = semantic_mapper.suggest_interventions(icf_codes, context)
    return {
        "icf_codes": icf_codes,
        "context": context,
        "suggestions": suggestions,
        "total_suggestions": len(suggestions)
    }


# ============================================================================
# AI Text Analysis Endpoints
# ============================================================================

class FreetextAnalysisRequest(BaseModel):
    text: str
    context: Optional[str] = None
    min_confidence: float = 0.75

@app.post("/api/v1/ai/analyze-freetext", response_model=List[ICFSuggestion])
async def analyze_freetext(request: FreetextAnalysisRequest):
    """
    Analyze single free-text response and suggest ICF codes
    Swedish child-voice model with 88-93% typical confidence
    """
    suggestions = ai_analyzer.analyze_freetext(
        request.text,
        request.context,
        request.min_confidence
    )
    return suggestions


class BatchAnalysisRequest(BaseModel):
    texts: List[str]
    min_frequency: int = 2
    min_confidence: float = 0.80

@app.post("/api/v1/ai/analyze-batch")
async def analyze_batch(request: BatchAnalysisRequest):
    """
    Analyze multiple free-text responses and identify themes
    Returns theme clusters and ICF code frequencies
    """
    themes, icf_frequencies = ai_analyzer.analyze_batch(
        request.texts,
        request.min_frequency,
        request.min_confidence
    )

    return {
        "total_responses": len(request.texts),
        "themes": [
            {
                "theme_name": t.theme_name,
                "frequency": t.frequency,
                "percentage": t.percentage,
                "icf_codes": t.icf_codes,
                "confidence": t.confidence,
                "example_responses": t.example_responses
            }
            for t in themes
        ],
        "icf_frequencies": icf_frequencies,
        "top_codes": sorted(
            icf_frequencies.items(),
            key=lambda x: x[1],
            reverse=True
        )[:10]
    }


# ============================================================================
# Support Intervention Endpoints
# ============================================================================

@app.post("/api/v1/students/{student_id}/support-interventions", response_model=Dict[str, Any])
async def create_support_intervention(
    student_id: str,
    intervention: SupportIntervention
):
    """
    Create new support intervention for student
    Automatically generates semantic mappings to all systems
    """
    # Validate student_id matches
    if intervention.student_id != student_id:
        raise HTTPException(
            status_code=400,
            detail="Student ID mismatch"
        )

    # Generate semantic mappings for all ICF codes
    all_mappings = {}
    for icf_code in intervention.icf_codes:
        mappings = semantic_mapper.map_to_all_systems(icf_code)
        all_mappings[icf_code] = mappings

    # Return intervention with mappings
    return {
        "intervention": intervention.dict(),
        "semantic_mappings": {
            icf_code: {
                system: {
                    "codes": result.target_codes,
                    "descriptions": result.target_descriptions,
                    "confidence": result.confidence
                }
                for system, result in mappings.items()
            }
            for icf_code, mappings in all_mappings.items()
        },
        "created_at": datetime.utcnow().isoformat()
    }


# ============================================================================
# Survey Analysis Endpoints (Gävlemodellen)
# ============================================================================

@app.post("/api/v1/surveys/analyze")
async def analyze_survey(survey: SurveyResponse):
    """
    Analyze Gävlemodellen survey response
    Processes quantitative scores and qualitative free-text
    """
    analysis_results = {}

    # Analyze free-text responses
    if survey.freetext_responses:
        for freetext in survey.freetext_responses:
            response_text = freetext.get("response", "")
            if response_text:
                suggestions = ai_analyzer.analyze_freetext(
                    response_text,
                    min_confidence=0.75
                )
                analysis_results[freetext.get("question_id", "unknown")] = [
                    {
                        "icf_code": s.icf_code,
                        "icf_name": s.icf_name,
                        "confidence": s.confidence,
                        "source": s.source,
                        "matched_text": s.matched_text
                    }
                    for s in suggestions
                ]

    # Aggregate ICF codes
    all_icf_codes = []
    for suggestions in analysis_results.values():
        all_icf_codes.extend([s["icf_code"] for s in suggestions])

    # Get unique codes
    unique_icf_codes = list(set(all_icf_codes))

    # Generate KSI intervention suggestions
    ksi_suggestions = semantic_mapper.suggest_interventions(
        unique_icf_codes,
        context="school"
    )

    return {
        "survey_id": survey.survey_id,
        "student_id": survey.student_id,
        "domain_scores": survey.domain_scores,
        "freetext_analysis": analysis_results,
        "aggregated_icf_codes": unique_icf_codes,
        "ksi_suggestions": ksi_suggestions[:5],  # Top 5 suggestions
        "analysis_timestamp": datetime.utcnow().isoformat()
    }


# ============================================================================
# Spider Chart / PDCA Endpoints
# ============================================================================

@app.post("/api/v1/students/{student_id}/spider-chart")
async def create_spider_chart(student_id: str, data: SpiderChartData):
    """
    Create spider chart data point for student
    Tracks wellbeing across 8 SHANARRI domains
    """
    if data.student_id != student_id:
        raise HTTPException(status_code=400, detail="Student ID mismatch")

    return {
        "student_id": student_id,
        "spider_chart": data.dict(),
        "change_analysis": {
            domain: {
                "current": data.scores.get(domain, 0),
                "previous": data.previous_scores.get(domain, 0) if data.previous_scores else None,
                "change": data.change_delta.get(domain, 0) if data.change_delta else None
            }
            for domain in SHANARRIDomain
        }
    }


@app.post("/api/v1/students/{student_id}/pdca")
async def create_pdca_record(student_id: str, pdca: PDCARecord):
    """
    Create PDCA cycle record for continuous improvement tracking
    """
    if pdca.student_id != student_id:
        raise HTTPException(status_code=400, detail="Student ID mismatch")

    return {
        "pdca_record": pdca.dict(),
        "created_at": datetime.utcnow().isoformat()
    }


# ============================================================================
# ICF Core Sets
# ============================================================================

@app.get("/api/v1/icf/core-sets/{condition}")
async def get_icf_core_set(condition: str):
    """
    Get ICF Core Set for specific condition
    Returns curated set of relevant ICF codes
    """
    core_set = semantic_mapper.get_icf_core_set(condition)

    if not core_set:
        raise HTTPException(
            status_code=404,
            detail=f"No core set found for condition: {condition}"
        )

    return {
        "condition": condition,
        "icf_codes": core_set,
        "total_codes": len(core_set),
        "codes_with_names": [
            {
                "code": code,
                "name": semantic_mapper.icf_database.get(code).name_sv
                if semantic_mapper.icf_database.get(code) else code
            }
            for code in core_set
        ]
    }


@app.get("/api/v1/icf/available-core-sets")
async def list_available_core_sets():
    """List all available ICF Core Sets"""
    from ..models.icf_models import ICF_CORE_SETS

    return {
        "available_core_sets": list(ICF_CORE_SETS.keys()),
        "total_sets": len(ICF_CORE_SETS)
    }


# ============================================================================
# Statistics and Reporting
# ============================================================================

@app.get("/api/v1/stats/mapping-confidence")
async def get_mapping_confidence_stats():
    """
    Get confidence statistics for all system mappings
    Based on documented validation from Gävlemodellen
    """
    from ..services.semantic_mapper import MappingConfidence

    return {
        "mapping_confidences": {
            "ICF ↔ KSI": {
                "confidence": MappingConfidence.ICF_KSI.value,
                "note": "KSI Target (Axel 1) = ICF codes, exact mapping"
            },
            "ICF ↔ IBIC": {
                "confidence": MappingConfidence.ICF_IBIC.value,
                "note": "IBIC uses ICF natively, direct mapping"
            },
            "ICF ↔ BBIC": {
                "confidence": MappingConfidence.ICF_BBIC.value,
                "note": "Socialstyrelsen method, ICF-based"
            },
            "SHANARRI ↔ ICF": {
                "confidence": MappingConfidence.SHANARRI_ICF.value,
                "note": "Conceptual mapping, internationally validated"
            },
            "ICF ↔ KVÅ": {
                "confidence": MappingConfidence.ICF_KVA.value,
                "note": "ICHI structure, WHO family"
            },
            "SS 12000 ↔ ICF (current)": {
                "confidence": MappingConfidence.SS12000_ICF.value,
                "note": "CRITICAL GAP - needs entity extension",
                "warning": True
            },
            "SS 12000 ↔ ICF (with extension)": {
                "confidence": MappingConfidence.SS12000_EXTENDED_ICF.value,
                "note": "After adding SupportIntervention, FunctionDescription, EnvironmentalFactor entities"
            }
        },
        "average_confidence": 0.91,
        "average_confidence_with_ss12000_extension": 0.94
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
