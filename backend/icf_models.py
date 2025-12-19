"""
ICF 2025 Data Models
International Classification of Functioning, Disability and Health
Based on ICF 2025 v1.1 with 1,671 codes
"""

from enum import Enum
from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime


class ICFComponent(str, Enum):
    """ICF Main Components"""
    BODY_FUNCTIONS = "b"  # Kroppsfunktioner
    BODY_STRUCTURES = "s"  # Kroppsstrukturer
    ACTIVITIES_PARTICIPATION = "d"  # Aktiviteter och delaktighet
    ENVIRONMENTAL_FACTORS = "e"  # Miljöfaktorer


class QualifierExtent(str, Enum):
    """ICF Qualifier for extent of impairment/barrier/facilitator"""
    NO_PROBLEM = "0"  # 0-4%
    MILD = "1"  # 5-24%
    MODERATE = "2"  # 25-49%
    SEVERE = "3"  # 50-95%
    COMPLETE = "4"  # 96-100%
    NOT_SPECIFIED = "8"
    NOT_APPLICABLE = "9"


class ICFCode(BaseModel):
    """Individual ICF Code with metadata"""
    code: str = Field(..., description="ICF code (e.g., 'd160', 'b140')")
    component: ICFComponent = Field(..., description="Main ICF component")
    name_sv: str = Field(..., description="Swedish name")
    name_en: Optional[str] = Field(None, description="English name")
    description: Optional[str] = Field(None, description="Detailed description")
    parent_code: Optional[str] = Field(None, description="Parent code in hierarchy")
    level: int = Field(..., description="Hierarchy level (1=chapter, 2-7=subcategories)")

    class Config:
        json_schema_extra = {
            "example": {
                "code": "d160",
                "component": "d",
                "name_sv": "Att fokusera uppmärksamhet",
                "name_en": "Focusing attention",
                "description": "Att avsiktligt fokusera på specifika stimuli",
                "parent_code": "d1",
                "level": 3
            }
        }


class ICFQualifiedCode(BaseModel):
    """ICF Code with qualifiers applied"""
    icf_code: str = Field(..., description="Base ICF code")
    qualifier_extent: Optional[QualifierExtent] = Field(None, description="Extent of problem")
    qualifier_nature: Optional[str] = Field(None, description="Nature of impairment")
    qualifier_location: Optional[str] = Field(None, description="Location of problem")
    qualifier_change: Optional[str] = Field(None, description="Change over time")
    context: Optional[str] = Field(None, description="Context where this applies")

    class Config:
        json_schema_extra = {
            "example": {
                "icf_code": "b140",
                "qualifier_extent": "2",
                "context": "Skolsituation, särskilt vid längre uppgifter >20 min"
            }
        }


class ICFFunctionDescription(BaseModel):
    """Function Description entity for SS 12000 extension"""
    id: str = Field(..., description="Unique identifier")
    student_id: str = Field(..., description="Student reference")
    icf_chapter: str = Field(..., description="ICF chapter (e.g., 'b1', 'd1')")
    icf_code: str = Field(..., description="Primary ICF code")
    icf_subcodes: Optional[List[str]] = Field(default_factory=list, description="Additional detailed codes")
    function_name: str = Field(..., description="Function name in Swedish")
    qualifier_extent: Optional[QualifierExtent] = Field(None, description="Extent qualifier")
    qualifier_nature: Optional[str] = Field(None, description="Nature qualifier")
    context: Optional[str] = Field(None, description="Contextual description")
    documented_by_role: str = Field(..., description="Role who documented (Lärare, Specialpedagog)")
    validated_by_role: Optional[str] = Field(None, description="Role who validated")
    assessment_date: datetime = Field(..., description="Date of assessment")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score (0-1)")
    related_interventions: List[str] = Field(default_factory=list, description="Related intervention IDs")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "uuid-func-001",
                "student_id": "emma-uuid",
                "icf_chapter": "b1",
                "icf_code": "b140",
                "icf_subcodes": ["b1400", "b1401"],
                "function_name": "Uppmärksamhetsfunktioner",
                "qualifier_extent": "2",
                "context": "Skolsituation, särskilt längre uppgifter >20 min",
                "documented_by_role": "Lärare",
                "validated_by_role": "Specialpedagog",
                "assessment_date": "2024-10-15T00:00:00Z",
                "confidence": 0.92,
                "related_interventions": ["uuid-int-001"]
            }
        }


class ICFEnvironmentalFactor(BaseModel):
    """Environmental Factor entity for SS 12000 extension"""
    id: str = Field(..., description="Unique identifier")
    student_id: str = Field(..., description="Student reference")
    icf_code: str = Field(..., description="ICF e-code (environmental factor)")
    icf_subcode: Optional[str] = Field(None, description="Detailed e-code")
    factor_name: str = Field(..., description="Factor name in Swedish")
    qualifier: str = Field(..., description="Barrier (-) or facilitator (+)")
    description: str = Field(..., description="Description of the environmental factor")
    context: Optional[str] = Field(None, description="Where/when this applies")
    mitigation: Optional[List[dict]] = Field(default_factory=list, description="Mitigation strategies")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Confidence score")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "uuid-env-001",
                "student_id": "emma-uuid",
                "icf_code": "e250",
                "icf_subcode": "e2500",
                "factor_name": "Ljud - Ljudstyrka",
                "qualifier": "-2",
                "description": "Höga ljud i klassrum utgör måttlig barriär för koncentration",
                "context": "Grupparbeten, rastvärdar i korridoren",
                "mitigation": [
                    {
                        "ksi_code": "SCA-SM",
                        "action": "Ljuddämpande hörlurar tillgängliga",
                        "effectiveness": "Hög"
                    }
                ],
                "confidence": 0.88
            }
        }


# ICF 2025 Core Set mappings for common conditions
ICF_CORE_SETS = {
    "attention_difficulties": ["b140", "b1400", "b1401", "b1402", "d160", "d175"],
    "reading_difficulties": ["b140", "d140", "d166", "b1670"],
    "social_interaction": ["d710", "d7100", "d7103", "d7104", "d7107", "e165"],
    "emotional_regulation": ["b152", "b1263", "b134", "b280"],
    "mobility": ["d450", "d451", "d470", "s750"],
}


# Complete ICF code database (sample - would be full 1,671 codes in production)
ICF_DATABASE = {
    # Chapter b1: Mental functions
    "b1": ICFCode(code="b1", component=ICFComponent.BODY_FUNCTIONS, name_sv="Mentala funktioner", level=1),
    "b140": ICFCode(code="b140", component=ICFComponent.BODY_FUNCTIONS, name_sv="Uppmärksamhetsfunktioner",
                    name_en="Attention functions", parent_code="b1", level=3,
                    description="Specifika mentala funktioner för att fokusera på externa eller interna stimuli under den tid som krävs"),
    "b1400": ICFCode(code="b1400", component=ICFComponent.BODY_FUNCTIONS, name_sv="Funktioner för att vidmakthålla uppmärksamhet",
                     name_en="Sustaining attention", parent_code="b140", level=4,
                     description="Mentala funktioner att koncentrera sig under den tid som krävs"),
    "b1401": ICFCode(code="b1401", component=ICFComponent.BODY_FUNCTIONS, name_sv="Funktioner för att skifta uppmärksamhet",
                     name_en="Shifting attention", parent_code="b140", level=4,
                     description="Mentala funktioner att flytta koncentration mellan stimuli"),
    "b1402": ICFCode(code="b1402", component=ICFComponent.BODY_FUNCTIONS, name_sv="Funktioner för delad uppmärksamhet",
                     name_en="Dividing attention", parent_code="b140", level=4,
                     description="Mentala funktioner att fokusera på flera stimuli samtidigt"),
    "b1403": ICFCode(code="b1403", component=ICFComponent.BODY_FUNCTIONS, name_sv="Funktioner för gemensam uppmärksamhet",
                     name_en="Sharing attention", parent_code="b140", level=4,
                     description="Mentala funktioner för att dela uppmärksamhet med andra"),
    "b152": ICFCode(code="b152", component=ICFComponent.BODY_FUNCTIONS, name_sv="Känslofunktioner",
                    name_en="Emotional functions", parent_code="b1", level=3,
                    description="Funktioner för lämpliga känslor och reglering av känslor"),
    "b134": ICFCode(code="b134", component=ICFComponent.BODY_FUNCTIONS, name_sv="Sömnfunktioner",
                    name_en="Sleep functions", parent_code="b1", level=3),
    "b130": ICFCode(code="b130", component=ICFComponent.BODY_FUNCTIONS, name_sv="Energi och driftfunktioner",
                    name_en="Energy and drive functions", parent_code="b1", level=3),
    "b1300": ICFCode(code="b1300", component=ICFComponent.BODY_FUNCTIONS, name_sv="Energinivå",
                     name_en="Energy level", parent_code="b130", level=4),
    "b164": ICFCode(code="b164", component=ICFComponent.BODY_FUNCTIONS, name_sv="Högre kognitiva funktioner",
                    name_en="Higher-level cognitive functions", parent_code="b1", level=3),
    "b280": ICFCode(code="b280", component=ICFComponent.BODY_FUNCTIONS, name_sv="Smärta",
                    name_en="Pain", parent_code="b2", level=3),

    # Chapter d1: Learning and applying knowledge
    "d1": ICFCode(code="d1", component=ICFComponent.ACTIVITIES_PARTICIPATION, name_sv="Lärande och att tillämpa kunskap",
                  name_en="Learning and applying knowledge", level=1),
    "d110": ICFCode(code="d110", component=ICFComponent.ACTIVITIES_PARTICIPATION, name_sv="Att se",
                    name_en="Watching", parent_code="d1", level=3),
    "d115": ICFCode(code="d115", component=ICFComponent.ACTIVITIES_PARTICIPATION, name_sv="Att lyssna",
                    name_en="Listening", parent_code="d1", level=3),
    "d130": ICFCode(code="d130", component=ICFComponent.ACTIVITIES_PARTICIPATION, name_sv="Att härma",
                    name_en="Copying", parent_code="d1", level=3),
    "d140": ICFCode(code="d140", component=ICFComponent.ACTIVITIES_PARTICIPATION, name_sv="Att läsa",
                    name_en="Learning to read", parent_code="d1", level=3),
    "d145": ICFCode(code="d145", component=ICFComponent.ACTIVITIES_PARTICIPATION, name_sv="Att skriva",
                    name_en="Learning to write", parent_code="d1", level=3),
    "d150": ICFCode(code="d150", component=ICFComponent.ACTIVITIES_PARTICIPATION, name_sv="Att räkna",
                    name_en="Learning to calculate", parent_code="d1", level=3),
    "d155": ICFCode(code="d155", component=ICFComponent.ACTIVITIES_PARTICIPATION, name_sv="Att förvärva färdigheter",
                    name_en="Acquiring skills", parent_code="d1", level=3),
    "d160": ICFCode(code="d160", component=ICFComponent.ACTIVITIES_PARTICIPATION, name_sv="Att fokusera uppmärksamhet",
                    name_en="Focusing attention", parent_code="d1", level=3,
                    description="Att avsiktligt fokusera på specifika stimuli, t.ex. genom att filtrera bort distraherande ljud"),
    "d166": ICFCode(code="d166", component=ICFComponent.ACTIVITIES_PARTICIPATION, name_sv="Att läsa och skriva",
                    name_en="Reading and writing", parent_code="d1", level=3),
    "d175": ICFCode(code="d175", component=ICFComponent.ACTIVITIES_PARTICIPATION, name_sv="Att lösa problem",
                    name_en="Solving problems", parent_code="d1", level=3),
    "d177": ICFCode(code="d177", component=ICFComponent.ACTIVITIES_PARTICIPATION, name_sv="Att fatta beslut",
                    name_en="Making decisions", parent_code="d1", level=3),

    # Chapter d7: Interpersonal interactions
    "d710": ICFCode(code="d710", component=ICFComponent.ACTIVITIES_PARTICIPATION,
                    name_sv="Att engagera sig i grundläggande mellanmänskliga interaktioner",
                    name_en="Basic interpersonal interactions", parent_code="d7", level=3),
    "d7100": ICFCode(code="d7100", component=ICFComponent.ACTIVITIES_PARTICIPATION,
                     name_sv="Att interagera med värme i relationer",
                     name_en="Respect and warmth in relationships", parent_code="d710", level=4),
    "d7107": ICFCode(code="d7107", component=ICFComponent.ACTIVITIES_PARTICIPATION,
                     name_sv="Att interagera med respekt i relationer",
                     name_en="Tolerance in relationships", parent_code="d710", level=4),

    # Chapter d9: Community, social and civic life
    "d920": ICFCode(code="d920", component=ICFComponent.ACTIVITIES_PARTICIPATION, name_sv="Rekreation och fritid",
                    name_en="Recreation and leisure", parent_code="d9", level=3),

    # Chapter e2: Natural environment
    "e2": ICFCode(code="e2", component=ICFComponent.ENVIRONMENTAL_FACTORS, name_sv="Naturliga omgivningsfaktorer",
                  name_en="Natural environment", level=1),
    "e250": ICFCode(code="e250", component=ICFComponent.ENVIRONMENTAL_FACTORS, name_sv="Ljud",
                    name_en="Sound", parent_code="e2", level=3),
    "e2500": ICFCode(code="e2500", component=ICFComponent.ENVIRONMENTAL_FACTORS, name_sv="Ljudstyrka",
                     name_en="Sound intensity", parent_code="e250", level=4),
    "e2501": ICFCode(code="e2501", component=ICFComponent.ENVIRONMENTAL_FACTORS, name_sv="Ljudkvalitet",
                     name_en="Sound quality", parent_code="e250", level=4),

    # Chapter e3: Support and relationships
    "e3": ICFCode(code="e3", component=ICFComponent.ENVIRONMENTAL_FACTORS, name_sv="Stöd och relationer",
                  name_en="Support and relationships", level=1),
    "e310": ICFCode(code="e310", component=ICFComponent.ENVIRONMENTAL_FACTORS, name_sv="Närmaste familjen",
                    name_en="Immediate family", parent_code="e3", level=3),
    "e330": ICFCode(code="e330", component=ICFComponent.ENVIRONMENTAL_FACTORS, name_sv="Personer i auktoritetsställning",
                    name_en="People in positions of authority", parent_code="e3", level=3),
    "e355": ICFCode(code="e355", component=ICFComponent.ENVIRONMENTAL_FACTORS,
                    name_sv="Stöd från yrkesutövare inom hälso- och sjukvård",
                    name_en="Health professionals", parent_code="e3", level=3),

    # Chapter e4: Attitudes
    "e4": ICFCode(code="e4", component=ICFComponent.ENVIRONMENTAL_FACTORS, name_sv="Attityder",
                  name_en="Attitudes", level=1),
    "e165": ICFCode(code="e165", component=ICFComponent.ENVIRONMENTAL_FACTORS, name_sv="Attityder i omgivningen",
                    name_en="Individual attitudes", parent_code="e1", level=3),
}
