"""
Support Intervention Models for SS 12000 Extension
New entities to bridge the semantic gap (76% -> 95% confidence)
"""

from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum

from .ksi_models import KSITarget, KSIAction, KSIStatus


class SHANARRIDomain(str, Enum):
    """SHANARRI/Behovskompassen domains (Scottish GIRFEC framework)"""

    SAFE = "trygghet"  # Safe - Trygghet
    HEALTHY = "ma_bra"  # Healthy - Må bra
    ACHIEVING = "utvecklas"  # Achieving - Utvecklas
    NURTURED = "omtanke"  # Nurtured - Omtanke
    ACTIVE = "aktivitet"  # Active - Aktivitet
    RESPECTED = "respekterad"  # Respected - Respekterad
    RESPONSIBLE = "ansvarstagande"  # Responsible - Ansvarstagande
    INCLUDED = "delaktighet"  # Included - Delaktighet


class InterventionSource(str, Enum):
    """Source of intervention data"""

    GAVLEMODELLEN_SURVEY = "gavlemodellen_survey"
    TEACHER_OBSERVATION = "teacher_observation"
    PEDAGOGICAL_ASSESSMENT = "pedagogical_assessment"
    STUDENT_HEALTH_TEAM = "student_health_team"
    PARENT_MEETING = "parent_meeting"
    STANDARDIZED_TEST = "standardized_test"
    MANUAL = "manual"


class SemanticMappings(BaseModel):
    """Semantic mappings to other welfare systems"""

    bbic: Optional[Dict[str, Any]] = Field(
        None, description="BBIC mapping with confidence"
    )
    ibic: Optional[Dict[str, Any]] = Field(
        None, description="IBIC mapping (100% - ICF native)"
    )
    kva: Optional[List[Dict[str, Any]]] = Field(None, description="KVÅ procedure codes")
    ss12000: Optional[Dict[str, Any]] = Field(
        None, description="SS 12000 programme mapping"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "bbic": {
                    "dimension": "Barnets utveckling",
                    "subdimension": "Kognitiv utveckling och inlärning",
                    "confidence": 0.95,
                },
                "ibic": {
                    "area": "Funktionsnedsättning",
                    "subarea": "Koncentration",
                    "icf_native": ["b140", "d160"],
                    "confidence": 1.00,
                },
                "kva": [
                    {
                        "code": "DV015",
                        "text": "Rådgivning om studieteknik",
                        "confidence": 0.85,
                    }
                ],
                "ss12000": {
                    "programme_type": "EXTRA_ANPASSNINGAR",
                    "confidence": 0.76,
                    "warning": "Manual verification recommended",
                },
            }
        }


class SupportIntervention(BaseModel):
    """
    Support Intervention entity for SS 12000 extension
    Links pedagogical support to semantic codes (KSI + ICF)
    """

    id: str = Field(..., description="Unique identifier")
    student_id: str = Field(..., description="Student reference")

    # KSI structure
    ksi_code: str = Field(..., description="Full KSI code (e.g., SCA-PM-2)")
    ksi_target: KSITarget = Field(..., description="KSI Target (Axel 1)")
    ksi_action: KSIAction = Field(..., description="KSI Action (Axel 2)")
    ksi_status: KSIStatus = Field(..., description="KSI Status (Axel 3)")

    # ICF linkage
    icf_codes: List[str] = Field(..., description="Related ICF codes")

    # Structured description
    description_structured: Dict[str, Any] = Field(
        ..., description="Structured intervention description"
    )

    # Metadata
    source: InterventionSource = Field(..., description="Source of this intervention")
    shanarri_domain: Optional[SHANARRIDomain] = Field(
        None, description="Related SHANARRI domain"
    )
    start_date: datetime = Field(..., description="Intervention start date")
    planned_end_date: Optional[datetime] = Field(
        None, description="Planned completion date"
    )
    actual_end_date: Optional[datetime] = Field(
        None, description="Actual completion date"
    )
    review_schedule: Optional[str] = Field(None, description="Review frequency")

    # Professional involvement
    documented_by: str = Field(..., description="Professional who documented")
    responsible_roles: List[str] = Field(
        ..., description="Roles responsible for implementation"
    )
    validated_by: Optional[List[str]] = Field(
        None, description="Professionals who validated"
    )
    validation_date: Optional[datetime] = Field(None, description="When validated")

    # Confidence and mappings
    confidence: float = Field(
        ..., ge=0.0, le=1.0, description="Overall confidence score"
    )
    semantic_mappings: Optional[SemanticMappings] = Field(
        None, description="Mappings to other systems"
    )

    # PDCA tracking
    pdca_phase: Optional[str] = Field(
        None, description="Current PDCA phase (Plan/Do/Check/Act)"
    )
    effectiveness_rating: Optional[float] = Field(
        None, ge=0.0, le=10.0, description="How effective (0-10)"
    )
    notes: Optional[List[str]] = Field(
        default_factory=list, description="Additional notes"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "id": "uuid-int-001",
                "student_id": "emma-uuid",
                "ksi_code": "SCA-RA-2",
                "ksi_target": "SCA",
                "ksi_action": "RA",
                "ksi_status": "2",
                "icf_codes": ["d160", "b140"],
                "description_structured": {
                    "target_function": "Att fokusera uppmärksamhet",
                    "intervention_type": "Kompensatoriskt stöd",
                    "specific_actions": [
                        "Extra tid vid prov (1.5x normal tid)",
                        "Datorskrivning tillåten",
                        "Placering främst i klassrum",
                    ],
                    "context": "Vid längre uppgifter och prov",
                },
                "source": "pedagogical_assessment",
                "shanarri_domain": "utvecklas",
                "start_date": "2024-11-01T00:00:00Z",
                "planned_end_date": "2025-05-01T00:00:00Z",
                "review_schedule": "Månadsvis",
                "documented_by": "lärare-uuid-001",
                "responsible_roles": ["Lärare", "Specialpedagog"],
                "validated_by": ["specialped-uuid-001"],
                "validation_date": "2024-11-05T00:00:00Z",
                "confidence": 0.97,
                "pdca_phase": "Do",
            }
        }


class SurveyResponse(BaseModel):
    """Gävlemodellen survey response data"""

    survey_id: str = Field(..., description="Survey identifier (e.g., v42_2024)")
    student_id: str = Field(..., description="Student reference")
    survey_date: datetime = Field(..., description="When survey was completed")
    survey_period: str = Field(..., description="v.12 or v.42")

    # SHANARRI domain responses
    domain_scores: Dict[SHANARRIDomain, float] = Field(
        ..., description="Scores 1-10 per domain"
    )

    # Question-level responses
    question_responses: List[Dict[str, Any]] = Field(
        ..., description="Individual question responses"
    )

    # Free-text responses (kvalitativ statistik)
    freetext_responses: List[Dict[str, str]] = Field(
        default_factory=list, description="Open-ended responses"
    )

    # AI analysis results
    ai_analysis: Optional[Dict[str, Any]] = Field(
        None, description="AI-generated ICF suggestions"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "survey_id": "v42_2024_001",
                "student_id": "emma-uuid",
                "survey_date": "2024-11-01T00:00:00Z",
                "survey_period": "v.42",
                "domain_scores": {"utvecklas": 7.5, "trygghet": 8.9, "ma_bra": 8.1},
                "question_responses": [
                    {
                        "question_id": "q_utvecklas_01",
                        "question_text": "Jag förstår vad jag ska lära mig",
                        "score": 7,
                    }
                ],
                "freetext_responses": [
                    {
                        "question_id": "q_utvecklas_freetext",
                        "question_text": "Finns det något som gör det svårt att lära?",
                        "response": "Ibland är det svårt att koncentrera mig när det är högt ljud",
                    }
                ],
                "ai_analysis": {
                    "icf_suggestions": [
                        {"code": "b140", "confidence": 0.92},
                        {"code": "d160", "confidence": 0.87},
                        {"code": "e250", "confidence": 0.82},
                    ],
                    "themes": ["concentration", "noise_distraction"],
                },
            }
        }


class SpiderChartData(BaseModel):
    """Spider chart (spindeldiagram) data for visualization"""

    student_id: str = Field(..., description="Student reference")
    timestamp: datetime = Field(..., description="When this snapshot was taken")
    source: str = Field(..., description="Source (e.g., v.42 survey)")

    # 8 SHANARRI domains (0-10 scale)
    scores: Dict[SHANARRIDomain, float] = Field(
        ..., description="Scores for each domain"
    )

    # Historical comparison
    previous_scores: Optional[Dict[SHANARRIDomain, float]] = Field(
        None, description="Previous period scores"
    )
    change_delta: Optional[Dict[SHANARRIDomain, float]] = Field(
        None, description="Change since last period"
    )

    # Related interventions
    active_interventions: List[str] = Field(
        default_factory=list, description="Active intervention IDs"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "student_id": "emma-uuid",
                "timestamp": "2024-11-01T00:00:00Z",
                "source": "gavlemodellen_v42_2024",
                "scores": {
                    "trygghet": 8.9,
                    "ma_bra": 8.1,
                    "utvecklas": 7.5,
                    "omtanke": 9.2,
                    "aktivitet": 8.0,
                    "respekterad": 8.5,
                    "ansvarstagande": 7.8,
                    "delaktighet": 8.3,
                },
                "previous_scores": {"utvecklas": 7.0},
                "change_delta": {"utvecklas": 0.5},
                "active_interventions": ["uuid-int-001", "uuid-int-002"],
            }
        }


class PDCARecord(BaseModel):
    """PDCA cycle tracking for continuous improvement"""

    id: str = Field(..., description="Unique identifier")
    student_id: str = Field(..., description="Student reference")
    intervention_id: Optional[str] = Field(None, description="Related intervention")
    shanarri_domain: SHANARRIDomain = Field(..., description="Which domain")

    # PDCA phase
    phase: str = Field(..., description="Plan, Do, Check, or Act")
    timestamp: datetime = Field(..., description="When this record was created")

    # Phase-specific data
    plan_data: Optional[Dict[str, Any]] = Field(
        None, description="Planning information"
    )
    do_data: Optional[Dict[str, Any]] = Field(
        None, description="Implementation details"
    )
    check_data: Optional[Dict[str, Any]] = Field(None, description="Evaluation results")
    act_data: Optional[Dict[str, Any]] = Field(None, description="Lessons learned")

    # Professional notes
    documented_by: str = Field(..., description="Who documented this")
    notes: Optional[str] = Field(None, description="Additional notes")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "pdca-001",
                "student_id": "emma-uuid",
                "intervention_id": "uuid-int-001",
                "shanarri_domain": "utvecklas",
                "phase": "Check",
                "timestamp": "2025-05-01T00:00:00Z",
                "check_data": {
                    "previous_score": 7.5,
                    "current_score": 8.2,
                    "improvement": 0.7,
                    "target_met": True,
                    "qualitative_feedback": "Emma säger att extra tid hjälper mycket",
                },
                "documented_by": "elevhälsa-uuid-001",
                "notes": "Fortsätt nuvarande insatser",
            }
        }


class WelfareProfile(BaseModel):
    """Complete welfare profile for a student (1177 integration)"""

    student_id: str = Field(..., description="Student unique identifier")
    created_at: datetime = Field(..., description="Profile creation date")
    updated_at: datetime = Field(..., description="Last update")

    # Current spider chart
    current_wellbeing: SpiderChartData = Field(
        ..., description="Current wellbeing scores"
    )

    # Active interventions
    active_interventions: List[SupportIntervention] = Field(
        default_factory=list, description="Current interventions"
    )

    # ICF function descriptions
    icf_functions: List[Any] = Field(
        default_factory=list, description="ICF function descriptions"
    )

    # Environmental factors
    environmental_factors: List[Any] = Field(
        default_factory=list, description="ICF environmental factors"
    )

    # Historical data
    survey_history: List[SurveyResponse] = Field(
        default_factory=list, description="Survey responses over time"
    )
    spider_chart_history: List[SpiderChartData] = Field(
        default_factory=list, description="Historical scores"
    )

    # PDCA tracking
    pdca_records: List[PDCARecord] = Field(
        default_factory=list, description="PDCA cycle records"
    )

    # Metadata
    last_review_date: Optional[datetime] = Field(
        None, description="Last professional review"
    )
    next_review_date: Optional[datetime] = Field(
        None, description="Next scheduled review"
    )
    responsible_team: List[str] = Field(
        default_factory=list, description="Responsible professionals"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "student_id": "emma-uuid",
                "created_at": "2024-01-01T00:00:00Z",
                "updated_at": "2024-11-05T00:00:00Z",
                "current_wellbeing": {
                    "student_id": "emma-uuid",
                    "timestamp": "2024-11-01T00:00:00Z",
                    "source": "gavlemodellen_v42_2024",
                    "scores": {"utvecklas": 7.5},
                },
                "last_review_date": "2024-11-01T00:00:00Z",
                "next_review_date": "2024-12-01T00:00:00Z",
                "responsible_team": ["lärare-uuid", "elevhälsa-uuid"],
            }
        }
