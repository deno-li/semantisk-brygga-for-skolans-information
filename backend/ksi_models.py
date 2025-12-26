"""
KSI 2025 Data Models
Klassifikation av stödinsatser (Classification of Support Interventions)
Based on KSI 2025 v1.0 - Socialstyrelsen
"""

from enum import Enum
from typing import Optional, List, Dict
from pydantic import BaseModel, Field
from datetime import datetime


class KSITarget(str, Enum):
    """KSI Axel 1: INRIKTNING (Target) - All mappade till ICF-koder"""

    # Learning and applying knowledge (d1)
    SA1 = "SA1"  # Lärande och att tillämpa kunskap → d1
    SA2 = "SA2"  # Målinriktade sinnesupplevelser → d110-d129
    SB2 = "SB2"  # Grundläggande lärande → d130-d159
    SBQ = "SBQ"  # Att förvärva färdigheter → d155
    SBV = "SBV"  # Att läsa → d140
    SC2 = "SC2"  # Att tillämpa kunskap → d160-d179
    SCA = "SCA"  # Att fokusera uppmärksamhet → d160
    SC4 = "SC4"  # Att läsa och skriva → d166
    SC5 = "SC5"  # Att skriva → d145
    SCJ = "SCJ"  # Att lösa problem → d175
    SCL = "SCL"  # Att fatta beslut → d177
    SBX = "SBX"  # Att räkna → d150

    # Communication (d3)
    SE2 = "SE2"  # Att kommunicera - mottagare → d310-d329
    SEA = "SEA"  # Att ta emot talade meddelanden → d310
    SED = "SED"  # Att ta emot icke-verbala meddelanden → d315
    S2 = "S2"  # Att kommunicera - sändare → d330-d349
    SFA = "SFA"  # Att tala → d330
    SFB = "SFB"  # Preverbal vokalisation → d331
    SG2 = "SG2"  # Konversation och utrustning → d350-d369
    SGA = "SGA"  # Konversation → d350
    SGG = "SGG"  # Kommunikationsutrustning → d360

    # General tasks (d2)
    SDA = "SDA"  # Att genomföra uppgifter → d210-d220
    SDJ = "SDJ"  # Att hantera stress → d240
    SDK = "SDK"  # Att hantera beteende → d298A

    # Mobility (d4)
    SH2 = "SH2"  # Kroppsställning → d410-d429
    SJ2 = "SJ2"  # Att gå och röra sig → d450-d469
    SJB = "SJB"  # Att gå i trappor → d451
    SK2 = "SK2"  # Transportmedel → d470-d489
    SIF = "SIF"  # Bära och hantera föremål → d430-d449
    SIA = "SIA"  # Lyfta och bära → d430

    # Self-care (d5)
    SM1 = "SM1"  # Personlig vård → d5
    SMB = "SMB"  # Att tvätta sig → d510
    SMC = "SMC"  # Att sköta kroppen → d520
    SMD = "SMD"  # Att sköta toalettbehov → d530

    # Recreation (d9)
    SY = "SY"  # Rekreation och fritid → d920

    # Interpersonal (d7)
    SUA = "SUA"  # Grundläggande interaktioner → d710

    # Body functions (b)
    SAT = "SAT"  # Känslomässiga funktioner → b152
    SCR = "SCR"  # Sömnfunktioner → b134
    SAS = "SAS"  # Energi och drift → b130
    SAH = "SAH"  # Smärta → b280

    # Environmental (e)
    QD2 = "QD2"  # Naturliga omgivningsfaktorer → e2
    QE2 = "QE2"  # Stödaktörer → e3
    QF = "QF"  # Samhälleliga attityder → e4


class KSIAction(str, Enum):
    """KSI Axel 2: AGERANDE (Action) - Vad gör professionen?"""

    # Kategori A: Utredande eller uppföljande
    AA = "AA"  # Bedömning
    AC = "AC"  # Manualbaserat test eller samtal
    AM = "AM"  # Observation
    AS = "AS"  # Utredande samtal
    AT = "AT"  # Inhämta uppgifter från professionell
    AU = "AU"  # Inhämta uppgifter från annan (barn/vårdnadshavare)
    AV = "AV"  # Uppföljande samtal
    AZ = "AZ"  # Utredande aktivitet, ospecificerad

    # Kategori B: Individstödjande
    PH = "PH"  # Färdighetsträning
    PM = "PM"  # Undervisning
    PN = "PN"  # Råd eller information
    PU = "PU"  # Stödjande samtal
    PV = "PV"  # Behandlande samtal
    RA = "RA"  # Kompensatoriskt stöd
    RB = "RB"  # Praktiskt stöd
    RC = "RC"  # Emotionellt stöd
    RD = "RD"  # Tillhandahållande
    SM = "SM"  # Hantering av utrustning eller miljö
    SZ = "SZ"  # Individstödjande, ospecificerad


class KSIStatus(str, Enum):
    """KSI Axel 3: STATUS"""

    PLANNED = "1"  # Planerad
    ONGOING = "2"  # Pågående
    COMPLETED = "3"  # Avslutad
    DISCONTINUED = "4"  # Avbruten


# KSI Target to ICF mappings (100% confidence - exact mappings)
KSI_TO_ICF_MAPPINGS = {
    # Learning
    KSITarget.SA1: ["d1"],
    KSITarget.SA2: ["d110", "d115", "d120", "d129"],
    KSITarget.SB2: ["d130", "d135", "d140", "d145", "d150", "d155", "d159"],
    KSITarget.SBQ: ["d155"],
    KSITarget.SBV: ["d140"],
    KSITarget.SC2: ["d160", "d163", "d166", "d172", "d175", "d177", "d179"],
    KSITarget.SCA: ["d160"],
    KSITarget.SC4: ["d166"],
    KSITarget.SC5: ["d145"],
    KSITarget.SCJ: ["d175"],
    KSITarget.SCL: ["d177"],
    KSITarget.SBX: ["d150"],
    # Communication
    KSITarget.SE2: ["d310", "d315", "d320", "d329"],
    KSITarget.SEA: ["d310"],
    KSITarget.SED: ["d315"],
    KSITarget.S2: ["d330", "d335", "d340", "d345", "d349"],
    KSITarget.SFA: ["d330"],
    KSITarget.SFB: ["d331"],
    KSITarget.SG2: ["d350", "d355", "d360", "d369"],
    KSITarget.SGA: ["d350"],
    KSITarget.SGG: ["d360"],
    # Tasks and demands
    KSITarget.SDA: ["d210", "d220"],
    KSITarget.SDJ: ["d240"],
    KSITarget.SDK: ["d298A"],
    # Mobility
    KSITarget.SH2: ["d410", "d415", "d420", "d429"],
    KSITarget.SJ2: ["d450", "d455", "d460", "d465", "d469"],
    KSITarget.SJB: ["d451"],
    KSITarget.SK2: ["d470", "d475", "d480", "d489"],
    KSITarget.SIF: ["d430", "d435", "d440", "d445", "d449"],
    KSITarget.SIA: ["d430"],
    # Self-care
    KSITarget.SM1: ["d5"],
    KSITarget.SMB: ["d510"],
    KSITarget.SMC: ["d520"],
    KSITarget.SMD: ["d530"],
    # Recreation
    KSITarget.SY: ["d920"],
    # Interpersonal
    KSITarget.SUA: ["d710"],
    # Body functions
    KSITarget.SAT: ["b152"],
    KSITarget.SCR: ["b134"],
    KSITarget.SAS: ["b130", "b1300"],
    KSITarget.SAH: ["b280"],
    # Environmental
    KSITarget.QD2: ["e2", "e250", "e260"],
    KSITarget.QE2: ["e3", "e310", "e330", "e355"],
    KSITarget.QF: ["e4", "e165", "e410", "e420", "e430"],
}


# Reverse mapping: ICF to KSI (for automatic KSI code generation)
ICF_TO_KSI_MAPPINGS = {}
for ksi_target, icf_codes in KSI_TO_ICF_MAPPINGS.items():
    for icf_code in icf_codes:
        if icf_code not in ICF_TO_KSI_MAPPINGS:
            ICF_TO_KSI_MAPPINGS[icf_code] = []
        ICF_TO_KSI_MAPPINGS[icf_code].append(ksi_target)


class KSICode(BaseModel):
    """Complete KSI Code with all three axes"""

    target: KSITarget = Field(..., description="Axel 1: Inriktning/Target")
    action: KSIAction = Field(..., description="Axel 2: Agerande/Action")
    status: KSIStatus = Field(..., description="Axel 3: Status")

    @property
    def full_code(self) -> str:
        """Generate full KSI code string (e.g., 'SCA-PM-2')"""
        return f"{self.target.value}-{self.action.value}-{self.status.value}"

    @property
    def target_icf_codes(self) -> List[str]:
        """Get ICF codes for this target"""
        return KSI_TO_ICF_MAPPINGS.get(self.target, [])

    def get_description(self, language: str = "sv") -> str:
        """Get human-readable description"""
        target_text = KSI_TARGET_NAMES.get(self.target, "")
        action_text = KSI_ACTION_NAMES.get(self.action, "")
        status_text = KSI_STATUS_NAMES.get(self.status, "")
        return f"{target_text} - {action_text} - {status_text}"

    class Config:
        json_schema_extra = {
            "example": {"target": "SCA", "action": "PM", "status": "2"}
        }


# Human-readable names
KSI_TARGET_NAMES = {
    KSITarget.SCA: "Att fokusera uppmärksamhet",
    KSITarget.SUA: "Grundläggande mellanmänskliga interaktioner",
    KSITarget.SAT: "Känslomässiga funktioner",
    KSITarget.SBV: "Att läsa",
    KSITarget.SC5: "Att skriva",
    KSITarget.SBX: "Att räkna",
    KSITarget.SCJ: "Att lösa problem",
    KSITarget.SCR: "Sömnfunktioner",
    KSITarget.SAS: "Energi och driftfunktioner",
    KSITarget.QD2: "Naturliga omgivningsfaktorer",
    KSITarget.QE2: "Stödaktörer",
    KSITarget.QF: "Samhälleliga attityder",
    # Add more as needed
}

KSI_ACTION_NAMES = {
    KSIAction.AA: "Bedömning",
    KSIAction.AC: "Manualbaserat test eller samtal",
    KSIAction.AM: "Observation",
    KSIAction.AS: "Utredande samtal",
    KSIAction.AT: "Inhämta uppgifter från professionell",
    KSIAction.AU: "Inhämta uppgifter från annan",
    KSIAction.AV: "Uppföljande samtal",
    KSIAction.PH: "Färdighetsträning",
    KSIAction.PM: "Undervisning",
    KSIAction.PN: "Råd eller information",
    KSIAction.PU: "Stödjande samtal",
    KSIAction.PV: "Behandlande samtal",
    KSIAction.RA: "Kompensatoriskt stöd",
    KSIAction.RB: "Praktiskt stöd",
    KSIAction.RC: "Emotionellt stöd",
    KSIAction.RD: "Tillhandahållande",
    KSIAction.SM: "Hantering av utrustning eller miljö",
}

KSI_STATUS_NAMES = {
    KSIStatus.PLANNED: "Planerad",
    KSIStatus.ONGOING: "Pågående",
    KSIStatus.COMPLETED: "Avslutad",
    KSIStatus.DISCONTINUED: "Avbruten",
}


class KSIActionContext(BaseModel):
    """Detailed information about a KSI action in school context"""

    ksi_code: str = Field(..., description="Full KSI code (e.g., SCA-PM-2)")
    target: KSITarget
    action: KSIAction
    status: KSIStatus
    icf_codes: List[str] = Field(..., description="Linked ICF codes")
    specific_actions: List[str] = Field(
        default_factory=list, description="Concrete actions taken"
    )
    responsible_role: str = Field(..., description="Who is responsible")
    start_date: Optional[datetime] = Field(
        None, description="When intervention started"
    )
    planned_end_date: Optional[datetime] = Field(None, description="Planned completion")
    review_schedule: Optional[str] = Field(None, description="How often to review")
    confidence: float = Field(
        default=1.0, ge=0.0, le=1.0, description="Mapping confidence"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "ksi_code": "SCA-PM-2",
                "target": "SCA",
                "action": "PM",
                "status": "2",
                "icf_codes": ["d160", "b140"],
                "specific_actions": [
                    "Strategier för fokusering vid längre arbetspass",
                    "Visuellt stöd vid instruktioner",
                ],
                "responsible_role": "Specialpedagog",
                "start_date": "2024-11-01T00:00:00Z",
                "planned_end_date": "2025-05-01T00:00:00Z",
                "review_schedule": "Månadsvis",
                "confidence": 0.97,
            }
        }
