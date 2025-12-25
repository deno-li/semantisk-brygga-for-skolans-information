"""
Semantic Mapping Engine
Maps between ICF, KSI, BBIC, IBIC, KVÅ, and SS 12000
Confidence scores based on validated mappings from document
"""

from typing import List, Dict, Optional, Tuple, Any
from dataclasses import dataclass
from enum import Enum

from .icf_models import ICFCode, ICF_DATABASE, ICF_CORE_SETS
from .ksi_models import (
    KSITarget, KSIAction, KSIStatus, KSICode,
    KSI_TO_ICF_MAPPINGS, ICF_TO_KSI_MAPPINGS,
    KSI_TARGET_NAMES, KSI_ACTION_NAMES
)


class MappingConfidence(float, Enum):
    """Documented confidence scores for different system mappings"""
    ICF_KSI = 0.97  # KSI Target = ICF codes (exact)
    ICF_IBIC = 1.00  # IBIC uses ICF natively
    ICF_BBIC = 0.95  # Socialstyrelsen method, ICF-based
    SHANARRI_ICF = 0.90  # Conceptual mapping
    ICF_KVA = 0.87  # ICHI structure, WHO family
    SS12000_ICF = 0.76  # CRITICAL GAP - needs extension
    SS12000_EXTENDED_ICF = 0.95  # After adding new entities


@dataclass
class MappingResult:
    """Result of a semantic mapping operation"""
    source_code: str
    target_system: str
    target_codes: List[str]
    target_descriptions: List[str]
    confidence: float
    mapping_path: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    warnings: List[str] = None

    def __post_init__(self):
        if self.warnings is None:
            self.warnings = []


class SemanticMappingEngine:
    """
    Core semantic mapping engine
    Handles bidirectional mappings between all welfare systems
    """

    def __init__(self):
        self.icf_database = ICF_DATABASE
        self.ksi_to_icf_map = KSI_TO_ICF_MAPPINGS
        self.icf_to_ksi_map = ICF_TO_KSI_MAPPINGS
        self._initialize_system_mappings()

    def _initialize_system_mappings(self):
        """Initialize mappings to BBIC, IBIC, KVÅ, etc."""
        # BBIC mappings (95% confidence)
        self.icf_to_bbic = {
            # Barnets utveckling
            "b140": ("Barnets utveckling", "Kognitiv utveckling och inlärning", 0.95),
            "b1400": ("Barnets utveckling", "Kognitiv utveckling och inlärning", 0.95),
            "d160": ("Barnets utveckling", "Kognitiv utveckling och inlärning", 0.95),
            "d140": ("Barnets utveckling", "Utbildning och lärande", 0.95),
            "d145": ("Barnets utveckling", "Utbildning och lärande", 0.95),
            "d150": ("Barnets utveckling", "Utbildning och lärande", 0.95),
            "b152": ("Barnets hälsa", "Känslomässig och beteendemässig utveckling", 0.95),
            "b134": ("Barnets hälsa", "Hälsa", 0.95),
            "d710": ("Barnets utveckling", "Identitet och social presentation", 0.95),
            "d920": ("Barnets utveckling", "Sociala relationer", 0.95),
            # Familj och miljö
            "e250": ("Familj och miljö", "Boendesituation", 0.90),
            "e310": ("Familj och miljö", "Familj och familjerelationer", 0.95),
            "e355": ("Familj och miljö", "Samhällets resurser", 0.93),
        }

        # IBIC mappings (100% confidence - uses ICF natively)
        self.icf_to_ibic = {
            "b140": ("Funktionsnedsättning", "Koncentration", 1.00),
            "b152": ("Funktionsnedsättning", "Känslomässig reglering", 1.00),
            "d160": ("Funktionsnedsättning", "Koncentration", 1.00),
            "d710": ("Delaktighet", "Social interaktion", 1.00),
            "d140": ("Aktivitet", "Läsning", 1.00),
            "d145": ("Aktivitet", "Skrivning", 1.00),
            # IBIC is ICF-native, so all ICF codes map 1:1
        }

        # KVÅ mappings (87% confidence - ICHI structure)
        self.icf_to_kva = {
            "d160": [("DV015", "Rådgivning om studieteknik", 0.87)],
            "b140": [("DV015", "Rådgivning om studieteknik", 0.85)],
            "b152": [
                ("AH030", "Psykoterapi individuell", 0.90),
                ("GD012", "Stödsamtal", 0.88)
            ],
            "d710": [("GD012", "Stödsamtal", 0.87)],
            "d140": [
                ("DV015", "Rådgivning om studieteknik", 0.85),
                ("DV017", "Läs- och skrivträning", 0.90)
            ],
        }

        # SHANARRI to ICF mappings (90% confidence - conceptual)
        self.shanarri_to_icf = {
            "trygghet": {  # Safe
                "icf_codes": ["d710", "d7100", "d7107", "e165", "e250", "e355", "d920"],
                "confidence": 0.90
            },
            "utvecklas": {  # Achieving
                "icf_codes": ["d1", "d140", "d145", "d150", "d160", "d175", "d177", "b140", "b164"],
                "confidence": 0.92
            },
            "ma_bra": {  # Healthy
                "icf_codes": ["b152", "b134", "b1300", "b1263", "b280"],
                "confidence": 0.93
            },
            "omtanke": {  # Nurtured
                "icf_codes": ["e310", "e330", "e355", "d710"],
                "confidence": 0.88
            },
            "aktivitet": {  # Active
                "icf_codes": ["d920", "d450", "d460", "d470"],
                "confidence": 0.90
            },
            "respekterad": {  # Respected
                "icf_codes": ["d710", "d7107", "e165", "e410"],
                "confidence": 0.91
            },
            "ansvarstagande": {  # Responsible
                "icf_codes": ["d177", "d240", "b164"],
                "confidence": 0.89
            },
            "delaktighet": {  # Included
                "icf_codes": ["d710", "d350", "d920", "e165"],
                "confidence": 0.90
            }
        }

    def icf_to_ksi(self, icf_code: str) -> MappingResult:
        """
        Map ICF code to KSI Target codes
        Confidence: 97% (KSI Axel 1 = ICF)
        """
        ksi_targets = self.icf_to_ksi_map.get(icf_code, [])

        if not ksi_targets:
            # Try parent code (e.g., b140 -> b1)
            if len(icf_code) > 2:
                parent = icf_code[:2]
                ksi_targets = self.icf_to_ksi_map.get(parent, [])
        ksi_targets = self.icf_to_ksi_map.get(icf_code, [])

        if not ksi_targets:
            # Try parent code (e.g., b140 -> b1)
            if len(icf_code) > 2:
                parent = icf_code[:2]
                ksi_targets = self.icf_to_ksi_map.get(parent, [])

        target_descriptions = [
            KSI_TARGET_NAMES.get(target, target.value)
            for target in ksi_targets
        ]

        return MappingResult(
            source_code=icf_code,
            target_system="KSI",
            target_codes=[t.value for t in ksi_targets],
            target_descriptions=target_descriptions,
            confidence=MappingConfidence.ICF_KSI.value,
            mapping_path="direct",
            metadata={
                "mapping_type": "ICF Target to KSI Target (Axel 1)",
                "note": "KSI Axel 1 uses ICF codes directly"
            }
        )

    def ksi_to_icf(self, ksi_target: KSITarget) -> MappingResult:
        """
        Map KSI Target to ICF codes
        Confidence: 97% (exact mapping)
        """
        icf_codes = self.ksi_to_icf_map.get(ksi_target, [])
        icf_codes = self.ksi_to_icf_map.get(ksi_target, [])

        target_descriptions = []
        for icf_code in icf_codes:
            icf_obj = self.icf_database.get(icf_code)
            if icf_obj:
                target_descriptions.append(icf_obj.name_sv)
            else:
                target_descriptions.append(icf_code)

        return MappingResult(
            source_code=ksi_target.value,
            target_system="ICF",
            target_codes=icf_codes,
            target_descriptions=target_descriptions,
            confidence=MappingConfidence.ICF_KSI.value,
            mapping_path="direct",
            metadata={
                "mapping_type": "KSI Target (Axel 1) to ICF",
                "note": "Direct mapping - KSI uses ICF structure"
            }
        )

    def icf_to_bbic(self, icf_code: str) -> MappingResult:
        """
        Map ICF to BBIC dimensions
        Confidence: 95% (Socialstyrelsen method)
        """
        mapping = self.icf_to_bbic.get(icf_code)

        if not mapping:
            # Try to infer from component
            if icf_code.startswith('b'):
                dimension = "Barnets hälsa"
                subdimension = "Hälsa (inferred)"
                confidence = 0.75
            elif icf_code.startswith('d'):
                dimension = "Barnets utveckling"
                subdimension = "Aktiviteter (inferred)"
                confidence = 0.75
            elif icf_code.startswith('e'):
                dimension = "Familj och miljö"
                subdimension = "Miljöfaktorer (inferred)"
                confidence = 0.70
            else:
                return MappingResult(
                    source_code=icf_code,
                    target_system="BBIC",
                    target_codes=[],
                    target_descriptions=[],
                    confidence=0.0,
                    warnings=["No BBIC mapping found"]
                )
        else:
            dimension, subdimension, confidence = mapping

        return MappingResult(
            source_code=icf_code,
            target_system="BBIC",
            target_codes=[dimension],
            target_descriptions=[subdimension],
            confidence=confidence,
            metadata={
                "dimension": dimension,
                "subdimension": subdimension
            }
        )

    def icf_to_ibic(self, icf_code: str) -> MappingResult:
        """
        Map ICF to IBIC
        Confidence: 100% (IBIC uses ICF natively)
        """
        mapping = self.icf_to_ibic.get(icf_code)

        if mapping:
            area, subarea, confidence = mapping
        else:
            # IBIC is ICF-native, so we can always map
            area = "Funktionsnedsättning"
            subarea = f"ICF {icf_code}"
            confidence = 1.00

        return MappingResult(
            source_code=icf_code,
            target_system="IBIC",
            target_codes=[icf_code],  # IBIC uses ICF codes directly
            target_descriptions=[subarea],
            confidence=confidence,
            metadata={
                "area": area,
                "subarea": subarea,
                "note": "IBIC uses ICF codes natively"
            }
        )

    def icf_to_kva(self, icf_code: str) -> MappingResult:
        """
        Map ICF to KVÅ procedure codes
        Confidence: 87% (ICHI structure)
        """
        mappings = self.icf_to_kva.get(icf_code, [])

        if not mappings:
            return MappingResult(
                source_code=icf_code,
                target_system="KVÅ",
                target_codes=[],
                target_descriptions=[],
                confidence=0.0,
                warnings=["No KVÅ procedure code found for this ICF code"]
            )

        codes = [m[0] for m in mappings]
        descriptions = [m[1] for m in mappings]
        avg_confidence = sum(m[2] for m in mappings) / len(mappings)

        return MappingResult(
            source_code=icf_code,
            target_system="KVÅ",
            target_codes=codes,
            target_descriptions=descriptions,
            confidence=avg_confidence,
            metadata={
                "kva_codes": [
                    {"code": m[0], "description": m[1], "confidence": m[2]}
                    for m in mappings
                ]
            }
        )

    def shanarri_to_icf(self, shanarri_domain: str) -> MappingResult:
        """
        Map SHANARRI/Behovskompassen domain to ICF codes
        Confidence: 90% (conceptual mapping)
        """
        mapping = self.shanarri_to_icf.get(shanarri_domain)

        if not mapping:
            return MappingResult(
                source_code=shanarri_domain,
                target_system="ICF",
                target_codes=[],
                target_descriptions=[],
                confidence=0.0,
                warnings=[f"Unknown SHANARRI domain: {shanarri_domain}"]
            )

        icf_codes = mapping["icf_codes"]
        confidence = mapping["confidence"]

        descriptions = []
        for code in icf_codes:
            icf_obj = self.icf_database.get(code)
            if icf_obj:
                descriptions.append(icf_obj.name_sv)
            else:
                descriptions.append(code)

        return MappingResult(
            source_code=shanarri_domain,
            target_system="ICF",
            target_codes=icf_codes,
            target_descriptions=descriptions,
            confidence=confidence,
            metadata={
                "shanarri_domain": shanarri_domain,
                "note": "Conceptual mapping from GIRFEC framework"
            }
        )

    def generate_ksi_code(
        self,
        icf_code: str,
        action: KSIAction,
        status: KSIStatus
    ) -> Tuple[Optional[KSICode], float]:
        """
        Generate complete KSI code from ICF code
        Returns (KSICode, confidence)
        """
        # Get KSI target from ICF
        mapping = self.icf_to_ksi(icf_code)

        if not mapping.target_codes:
            return None, 0.0

        # Use first (most specific) target
        target_str = mapping.target_codes[0]
        try:
            target = KSITarget(target_str)
        except ValueError:
            return None, 0.0

        ksi_code = KSICode(
            target=target,
            action=action,
            status=status
        )

        return ksi_code, mapping.confidence

    def map_to_all_systems(self, icf_code: str) -> Dict[str, MappingResult]:
        """
        Map a single ICF code to all welfare systems
        Returns dict with results for each system
        """
        return {
            "KSI": self.icf_to_ksi(icf_code),
            "BBIC": self.icf_to_bbic(icf_code),
            "IBIC": self.icf_to_ibic(icf_code),
            "KVÅ": self.icf_to_kva(icf_code),
        }

    def suggest_interventions(
        self,
        icf_codes: List[str],
        context: str = "school"
    ) -> List[Dict[str, Any]]:
        """
        Suggest KSI interventions based on ICF codes
        Returns list of suggested intervention configurations
        """
        suggestions = []

        for icf_code in icf_codes:
            icf_obj = self.icf_database.get(icf_code)
            if not icf_obj:
                continue

            # Get KSI targets
            ksi_mapping = self.icf_to_ksi(icf_code)

            for ksi_target_str in ksi_mapping.target_codes:
                try:
                    ksi_target = KSITarget(ksi_target_str)
                except ValueError:
                    continue

                # Suggest appropriate actions based on context
                if context == "school":
                    suggested_actions = self._suggest_school_actions(icf_obj, ksi_target)
                else:
                    suggested_actions = [KSIAction.AA, KSIAction.PM, KSIAction.RA]

                for action in suggested_actions:
                    suggestions.append({
                        "icf_code": icf_code,
                        "icf_name": icf_obj.name_sv,
                        "ksi_target": ksi_target.value,
                        "ksi_target_name": KSI_TARGET_NAMES.get(ksi_target, ksi_target.value),
                        "ksi_action": action.value,
                        "ksi_action_name": KSI_ACTION_NAMES.get(action, action.value),
                        "suggested_code": f"{ksi_target.value}-{action.value}",
                        "confidence": ksi_mapping.confidence,
                        "rationale": self._get_action_rationale(icf_obj, action)
                    })

        return suggestions

    def _suggest_school_actions(self, icf_obj: ICFCode, ksi_target: KSITarget) -> List[KSIAction]:
        """Suggest appropriate KSI actions for school context"""
        # For d-codes (activities), suggest pedagogical interventions
        if icf_obj.component.value == "d":
            return [
                KSIAction.AA,  # Assessment first
                KSIAction.PM,  # Teaching
                KSIAction.RA,  # Compensatory support
                KSIAction.PN,  # Advice
            ]
        # For b-codes (body functions), suggest assessment + support
        elif icf_obj.component.value == "b":
            return [
                KSIAction.AA,  # Assessment
                KSIAction.PH,  # Skills training
                KSIAction.PU,  # Supportive conversation
            ]
        # For e-codes (environmental), suggest environment management
        elif icf_obj.component.value == "e":
            return [
                KSIAction.SM,  # Environment management
                KSIAction.RB,  # Practical support
            ]
        else:
            return [KSIAction.AA]

    def _get_action_rationale(self, icf_obj: ICFCode, action: KSIAction) -> str:
        """Get rationale for suggested action"""
        action_rationales = {
            KSIAction.AA: "Bedömning behövs för att kartlägga omfattning",
            KSIAction.PM: "Undervisning kan träna denna förmåga",
            KSIAction.RA: "Kompensatoriskt stöd kan avhjälpa svårigheter",
            KSIAction.PN: "Råd kan hjälpa eleven att utveckla strategier",
            KSIAction.PH: "Färdighetsträning kan förbättra funktionen",
            KSIAction.SM: "Miljöanpassning kan minska barriärer",
            KSIAction.RB: "Praktiskt stöd kan underlätta vardagen",
            KSIAction.PU: "Stödjande samtal kan bearbeta svårigheter",
        }
        return action_rationales.get(action, "Rekommenderad insats")

    def get_icf_core_set(self, condition: str) -> List[str]:
        """Get ICF Core Set for a specific condition"""
        return ICF_CORE_SETS.get(condition, [])

    def calculate_overall_confidence(self, mappings: List[MappingResult]) -> float:
        """Calculate average confidence across multiple mappings"""
        if not mappings:
            return 0.0
        valid_confidences = [m.confidence for m in mappings if m.confidence > 0]
        if not valid_confidences:
            return 0.0
        return sum(valid_confidences) / len(valid_confidences)
