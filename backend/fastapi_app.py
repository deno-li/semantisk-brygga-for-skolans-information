"""
FastAPI wrapper around the semantic mapping engine.
Exposes lightweight endpoints used by the React prototype.
"""

from dataclasses import asdict
import os
from typing import List, Optional

from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .icf_models import ICFCode, ICF_DATABASE
from .ksi_models import KSITarget, KSI_TARGET_NAMES
from .semantic_mapper import MappingResult, SemanticMappingEngine


app = FastAPI(
    title="Semantic Bridge API",
    version="1.0.0",
    description="Minimal FastAPI adapter for the semantic mapping engine",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = SemanticMappingEngine()


def require_api_key(x_api_key: Optional[str] = Header(None)) -> None:
    """
    Optional API key guard. If SEMANTIC_BRIDGE_API_KEY is set, requests must include it.
    """
    expected = os.getenv("SEMANTIC_BRIDGE_API_KEY")
    if expected and x_api_key != expected:
        raise HTTPException(status_code=401, detail="Invalid API key")


class SearchRequest(BaseModel):
    query: str
    systems: List[str] = ["icf", "ksi", "bbic"]


class AnalyzeTextRequest(BaseModel):
    text: str
    context: Optional[str] = None
    standards: List[str] = []


def serialize_result(result: MappingResult) -> dict:
    """
    Convert MappingResult dataclass to JSON-friendly dict.
    """
    return asdict(result)


@app.get("/health", summary="Health check")
def health() -> dict:
    return {
        "status": "ok",
        "timestamp": os.getenv("NOW", ""),
        "services": {"semantic_mapper": "ready"},
    }


@app.get(
    "/api/v1/mapping/icf-to-ksi/{icf_code}",
    dependencies=[Depends(require_api_key)],
    response_model=dict,
)
def map_icf_to_ksi(icf_code: str) -> dict:
    result = engine.icf_to_ksi(icf_code)
    return serialize_result(result)


@app.get(
    "/api/v1/mapping/ksi-to-icf/{ksi_target}",
    dependencies=[Depends(require_api_key)],
    response_model=dict,
)
def map_ksi_to_icf(ksi_target: str) -> dict:
    try:
        target_enum = KSITarget(ksi_target)
    except ValueError:
        raise HTTPException(status_code=400, detail="Unknown KSI target")
    result = engine.ksi_to_icf(target_enum)
    return serialize_result(result)


@app.get(
    "/api/v1/mapping/icf-to-bbic/{icf_code}",
    dependencies=[Depends(require_api_key)],
    response_model=dict,
)
def map_icf_to_bbic(icf_code: str) -> dict:
    result = engine.icf_to_bbic(icf_code)
    return serialize_result(result)


@app.get(
    "/api/v1/mapping/bbic-to-icf/{bbic_domain}",
    dependencies=[Depends(require_api_key)],
    response_model=dict,
)
def map_bbic_to_icf(bbic_domain: str) -> dict:
    matches = [
        (code, meta)
        for code, meta in engine.icf_to_bbic_map.items()
        if meta[0].lower() == bbic_domain.lower()
    ]

    if not matches:
        raise HTTPException(status_code=404, detail="BBIC dimension not found")

    codes = [code for code, _ in matches]
    descriptions = [meta[1] for _, meta in matches]
    avg_confidence = sum(meta[2] for _, meta in matches) / len(matches)

    return {
        "source_code": bbic_domain,
        "source_system": "BBIC",
        "target_system": "ICF",
        "target_codes": codes,
        "target_descriptions": descriptions,
        "confidence": avg_confidence,
    }


@app.get(
    "/api/v1/codes/icf",
    dependencies=[Depends(require_api_key)],
    response_model=dict,
)
def list_icf_codes(
    category: Optional[str] = None, limit: int = 100, offset: int = 0
) -> dict:
    codes: List[ICFCode] = []
    for code in ICF_DATABASE.values():
        if category and not code.code.startswith(category):
            continue
        codes.append(code)

    total = len(codes)
    sliced = codes[offset : offset + limit]
    return {
        "codes": [code.model_dump() for code in sliced],
        "total": total,
    }


@app.get(
    "/api/v1/codes/icf/{code}",
    dependencies=[Depends(require_api_key)],
    response_model=dict,
)
def get_icf_code(code: str) -> dict:
    icf_code = ICF_DATABASE.get(code)
    if not icf_code:
        raise HTTPException(status_code=404, detail="ICF code not found")
    return icf_code.model_dump()


@app.get(
    "/api/v1/codes/ksi",
    dependencies=[Depends(require_api_key)],
    response_model=List[dict],
)
def list_ksi_codes() -> List[dict]:
    return [
        {"code": target.value, "description": KSI_TARGET_NAMES[target]}
        for target in KSITarget
    ]


@app.post(
    "/api/v1/codes/search",
    dependencies=[Depends(require_api_key)],
    response_model=List[dict],
)
def search_codes(request: SearchRequest) -> List[dict]:
    query = request.query.lower()
    systems = set(request.systems)
    results: List[dict] = []

    if "icf" in systems:
        for icf in ICF_DATABASE.values():
            if query in icf.name_sv.lower() or query in icf.code.lower():
                results.append(
                    {"system": "icf", "code": icf.code, "description": icf.name_sv}
                )
    if "ksi" in systems:
        for target, description in KSI_TARGET_NAMES.items():
            if query in description.lower() or query in target.value.lower():
                results.append(
                    {
                        "system": "ksi",
                        "code": target.value,
                        "description": description,
                    }
                )
    return results


@app.post(
    "/api/v1/ai/analyze-text",
    dependencies=[Depends(require_api_key)],
)
def analyze_text(request: AnalyzeTextRequest) -> dict:
    """
    Lightweight, rule-based analyzer that maps key phrases to ICF codes.
    Acts as a placeholder for a ML-powered service.
    """
    text = request.text.lower()
    candidates = {
        "koncentration": "d160",
        "läs": "d140",
        "skriv": "d145",
        "social": "d710",
        "oro": "b152",
    }
    matched_codes = [code for keyword, code in candidates.items() if keyword in text]
    mapped = [serialize_result(engine.icf_to_bbic(code)) for code in matched_codes]

    suggestions = []
    for code in matched_codes:
        icf_entry = ICF_DATABASE.get(code)
        suggestions.append(
            {
                "code": code,
                "description": icf_entry.name_sv if icf_entry else code,
                "confidence": 0.65,
                "category": "rule-based",
                "reasoning": "Keyword match",
            }
        )

    return {
        "text": request.text,
        "icf_suggestions": suggestions,
        "bbic_domains": [item["target_descriptions"] for item in mapped],
        "analysis_summary": "Rule-based analysis for demo purposes",
        "confidence": 0.65 if matched_codes else 0.0,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "backend.fastapi_app:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", "8000")),
        reload=False,
    )
