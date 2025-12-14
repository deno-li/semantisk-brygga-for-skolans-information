"""
AI Text Analysis Service
Analyzes free-text responses from Gävlemodellen surveys
Suggests ICF codes with confidence scores (88-93% typical)
Swedish child-voice model
"""

from typing import List, Dict, Optional, Any, Tuple
from dataclasses import dataclass
import re
from collections import Counter

from ..models.icf_models import ICF_DATABASE, ICFComponent


@dataclass
class ICFSuggestion:
    """AI-suggested ICF code with confidence"""
    icf_code: str
    icf_name: str
    confidence: float
    source: str  # "keyword_match", "semantic_analysis", "theme_cluster"
    matched_text: Optional[str] = None
    rationale: Optional[str] = None


@dataclass
class ThemeCluster:
    """Identified theme from multiple responses"""
    theme_name: str
    frequency: int
    percentage: float
    icf_codes: List[str]
    example_responses: List[str]
    confidence: float


class AITextAnalyzer:
    """
    AI text analyzer for Swedish child voices
    Analyzes free-text survey responses and suggests ICF codes
    """

    def __init__(self):
        self._initialize_keywords()
        self._initialize_patterns()

    def _initialize_keywords(self):
        """Initialize Swedish keyword mappings to ICF codes"""
        # Based on document examples with actual student responses
        self.keyword_to_icf = {
            # Concentration and attention (b140, d160)
            "koncentrera": [("b140", 0.92), ("d160", 0.87)],
            "koncentration": [("b140", 0.92), ("d160", 0.87)],
            "fokusera": [("b140", 0.90), ("d160", 0.88)],
            "fokus": [("b140", 0.90), ("d160", 0.88)],
            "uppmärksamhet": [("b140", 0.92), ("d160", 0.89)],
            "distrahera": [("b140", 0.88), ("d160", 0.85)],
            "tankarna flyger": [("b140", 0.87), ("d160", 0.84)],

            # Sound/noise (e250)
            "ljud": [("e250", 0.88)],
            "ljudnivå": [("e250", 0.90)],
            "högt": [("e250", 0.82)],
            "oväsen": [("e250", 0.85)],
            "buller": [("e250", 0.86)],

            # Reading (d140)
            "läsa": [("d140", 0.90)],
            "läsning": [("d140", 0.92)],
            "läsförståelse": [("d140", 0.93)],

            # Writing (d145)
            "skriva": [("d145", 0.90)],
            "skrivning": [("d145", 0.92)],
            "handstil": [("d145", 0.88)],

            # Math (d150)
            "räkna": [("d150", 0.92)],
            "matte": [("d150", 0.90)],
            "matematik": [("d150", 0.91)],

            # Problem solving (d175)
            "lösa problem": [("d175", 0.90)],
            "problemlösning": [("d175", 0.91)],

            # Emotional functions (b152)
            "oro": [("b152", 0.94)],
            "orolig": [("b152", 0.94)],
            "stress": [("b152", 0.91), ("d240", 0.88)],
            "stressad": [("b152", 0.91), ("d240", 0.88)],
            "ängslig": [("b152", 0.93)],
            "nervös": [("b152", 0.92)],
            "prestationsångest": [("b152", 0.94), ("d240", 0.89)],
            "känsla": [("b152", 0.85)],

            # Sleep (b134)
            "sova": [("b134", 0.91)],
            "sömn": [("b134", 0.93)],
            "somna": [("b134", 0.90)],
            "trött": [("b1300", 0.88), ("b134", 0.82)],

            # Energy (b1300)
            "energi": [("b1300", 0.90)],
            "orka": [("b1300", 0.89)],
            "utmattad": [("b1300", 0.91)],

            # Social interaction (d710)
            "mobbad": [("d710", 0.95), ("e165", 0.88)],
            "mobbning": [("d710", 0.95), ("e165", 0.88)],
            "retad": [("d710", 0.93), ("e165", 0.85)],
            "utfryst": [("d710", 0.94), ("e165", 0.87)],
            "kompisar": [("d710", 0.82)],
            "vänner": [("d710", 0.82)],
            "ensam": [("d710", 0.85)],
            "ingen att vara med": [("d710", 0.88)],

            # Safety/environment (e165, e355)
            "trygg": [("d710", 0.80), ("e165", 0.85)],
            "otrygg": [("d710", 0.83), ("e165", 0.87)],
            "säker": [("e165", 0.84)],
            "rädd": [("b152", 0.88), ("e165", 0.82)],

            # Support (e355, e330)
            "hjälp": [("e355", 0.85)],
            "stöd": [("e355", 0.87)],
            "vuxna": [("e355", 0.83), ("e330", 0.82)],
            "lärare": [("e330", 0.88)],

            # Family (e310)
            "föräldrar": [("e310", 0.88)],
            "mamma": [("e310", 0.86)],
            "pappa": [("e310", 0.86)],
            "familj": [("e310", 0.87)],

            # Recreation (d920)
            "fritid": [("d920", 0.88)],
            "idrott": [("d920", 0.85)],
            "hobby": [("d920", 0.86)],
            "lek": [("d920", 0.83)],
        }

    def _initialize_patterns(self):
        """Initialize regex patterns for more complex matching"""
        self.patterns = [
            # Concentration difficulties
            (r"svårt att (koncentrera|fokusera)", [("b140", 0.92), ("d160", 0.87)]),
            (r"kan inte (koncentrera|fokusera)", [("b140", 0.93), ("d160", 0.88)]),

            # Learning difficulties
            (r"svårt att (läsa|skriva|räkna)", [("d140", 0.90), ("d145", 0.90), ("d150", 0.90)]),

            # Emotional stress
            (r"känner mig (stressad|orolig|nervös)", [("b152", 0.94)]),
            (r"orkar inte", [("b1300", 0.89), ("b152", 0.82)]),

            # Social difficulties
            (r"ingen att (prata|vara|leka) med", [("d710", 0.88)]),
            (r"känner mig (ensam|utanför)", [("d710", 0.87)]),

            # Safety concerns
            (r"rädd (att|för)", [("b152", 0.88), ("e165", 0.83)]),
            (r"känns (otrygg|osäker)", [("e165", 0.87)]),
        ]

    def analyze_freetext(
        self,
        text: str,
        context: Optional[str] = None,
        min_confidence: float = 0.75
    ) -> List[ICFSuggestion]:
        """
        Analyze single free-text response and suggest ICF codes

        Args:
            text: Student's free-text response
            context: Optional context (e.g., "utvecklas", "trygghet")
            min_confidence: Minimum confidence threshold

        Returns:
            List of ICF suggestions with confidence scores
        """
        text_lower = text.lower()
        suggestions = []
        seen_codes = set()

        # 1. Pattern matching (higher confidence)
        for pattern, icf_mappings in self.patterns:
            if re.search(pattern, text_lower):
                for icf_code, confidence in icf_mappings:
                    if icf_code not in seen_codes and confidence >= min_confidence:
                        icf_obj = ICF_DATABASE.get(icf_code)
                        suggestions.append(ICFSuggestion(
                            icf_code=icf_code,
                            icf_name=icf_obj.name_sv if icf_obj else icf_code,
                            confidence=confidence,
                            source="pattern_match",
                            matched_text=re.search(pattern, text_lower).group(0),
                            rationale=f"Mönster matchade: '{pattern}'"
                        ))
                        seen_codes.add(icf_code)

        # 2. Keyword matching
        for keyword, icf_mappings in self.keyword_to_icf.items():
            if keyword in text_lower:
                for icf_code, confidence in icf_mappings:
                    if icf_code not in seen_codes and confidence >= min_confidence:
                        icf_obj = ICF_DATABASE.get(icf_code)
                        suggestions.append(ICFSuggestion(
                            icf_code=icf_code,
                            icf_name=icf_obj.name_sv if icf_obj else icf_code,
                            confidence=confidence,
                            source="keyword_match",
                            matched_text=keyword,
                            rationale=f"Nyckelord: '{keyword}'"
                        ))
                        seen_codes.add(icf_code)

        # 3. Context-based boosting
        if context:
            suggestions = self._apply_context_boost(suggestions, context)

        # Sort by confidence
        suggestions.sort(key=lambda x: x.confidence, reverse=True)

        return suggestions

    def _apply_context_boost(
        self,
        suggestions: List[ICFSuggestion],
        context: str
    ) -> List[ICFSuggestion]:
        """Boost confidence for codes relevant to context"""
        context_relevance = {
            "utvecklas": ["d1", "b140", "d160", "d140", "d145", "d150"],
            "trygghet": ["d710", "e165", "e250", "e355"],
            "ma_bra": ["b152", "b134", "b1300", "b280"],
        }

        relevant_codes = context_relevance.get(context, [])

        for suggestion in suggestions:
            # Check if code or its parent is relevant
            for relevant in relevant_codes:
                if suggestion.icf_code.startswith(relevant):
                    # Boost confidence by 5% but cap at 0.98
                    suggestion.confidence = min(0.98, suggestion.confidence * 1.05)
                    break

        return suggestions

    def analyze_batch(
        self,
        texts: List[str],
        min_frequency: int = 2,
        min_confidence: float = 0.80
    ) -> Tuple[List[ThemeCluster], Dict[str, int]]:
        """
        Analyze multiple free-text responses and identify themes

        Args:
            texts: List of student responses
            min_frequency: Minimum number of responses to form a theme
            min_confidence: Minimum confidence for ICF suggestions

        Returns:
            (theme_clusters, icf_code_frequencies)
        """
        all_suggestions = []
        icf_counter = Counter()

        # Analyze each text
        for text in texts:
            suggestions = self.analyze_freetext(text, min_confidence=min_confidence)
            all_suggestions.extend(suggestions)

            # Count ICF codes
            for sugg in suggestions:
                icf_counter[sugg.icf_code] += 1

        # Cluster by ICF code
        clusters = []
        total_responses = len(texts)

        for icf_code, frequency in icf_counter.most_common():
            if frequency < min_frequency:
                continue

            percentage = (frequency / total_responses) * 100

            # Get example responses
            examples = []
            for i, text in enumerate(texts):
                suggs = self.analyze_freetext(text, min_confidence=min_confidence)
                if any(s.icf_code == icf_code for s in suggs):
                    examples.append(text)
                    if len(examples) >= 3:
                        break

            # Calculate average confidence
            confidences = [s.confidence for s in all_suggestions if s.icf_code == icf_code]
            avg_confidence = sum(confidences) / len(confidences) if confidences else 0.0

            icf_obj = ICF_DATABASE.get(icf_code)
            theme_name = icf_obj.name_sv if icf_obj else icf_code

            clusters.append(ThemeCluster(
                theme_name=theme_name,
                frequency=frequency,
                percentage=percentage,
                icf_codes=[icf_code],
                example_responses=examples,
                confidence=avg_confidence
            ))

        # Sort by frequency
        clusters.sort(key=lambda x: x.frequency, reverse=True)

        return clusters, dict(icf_counter)

    def analyze_survey_domain(
        self,
        responses: List[Dict[str, Any]],
        domain: str
    ) -> Dict[str, Any]:
        """
        Analyze all free-text responses for a SHANARRI domain
        Returns comprehensive analysis with themes and ICF codes
        """
        freetext_responses = [
            r["response"]
            for r in responses
            if "response" in r and r["response"].strip()
        ]

        if not freetext_responses:
            return {
                "domain": domain,
                "total_responses": 0,
                "themes": [],
                "icf_codes": {},
                "recommendations": []
            }

        # Analyze batch
        themes, icf_frequencies = self.analyze_batch(
            freetext_responses,
            min_frequency=max(2, len(freetext_responses) // 20),  # 5% threshold
            min_confidence=0.80
        )

        # Generate recommendations
        recommendations = self._generate_recommendations(themes, icf_frequencies)

        return {
            "domain": domain,
            "total_responses": len(freetext_responses),
            "response_rate": len(freetext_responses) / len(responses) * 100 if responses else 0,
            "themes": [
                {
                    "name": t.theme_name,
                    "frequency": t.frequency,
                    "percentage": t.percentage,
                    "icf_codes": t.icf_codes,
                    "confidence": t.confidence,
                    "examples": t.example_responses[:2]  # Limit examples
                }
                for t in themes
            ],
            "icf_codes": icf_frequencies,
            "top_icf_codes": sorted(
                icf_frequencies.items(),
                key=lambda x: x[1],
                reverse=True
            )[:5],
            "recommendations": recommendations
        }

    def _generate_recommendations(
        self,
        themes: List[ThemeCluster],
        icf_frequencies: Dict[str, int]
    ) -> List[str]:
        """Generate action recommendations based on themes"""
        recommendations = []

        for theme in themes[:3]:  # Top 3 themes
            if theme.percentage > 20:  # High frequency
                recommendations.append(
                    f"Hög frekvens ({theme.percentage:.1f}%) rapporterar: {theme.theme_name}. "
                    f"Föreslår strukturerad kartläggning och insatser."
                )
            elif theme.percentage > 10:  # Moderate frequency
                recommendations.append(
                    f"Betydande andel ({theme.percentage:.1f}%) nämner: {theme.theme_name}. "
                    f"Överväg förebyggande åtgärder."
                )

        return recommendations

    def validate_suggestion(
        self,
        suggestion: ICFSuggestion,
        professional_override: Optional[str] = None
    ) -> ICFSuggestion:
        """
        Allow professional to validate or override AI suggestion
        Returns updated suggestion with validation metadata
        """
        if professional_override:
            # Professional chose different code
            icf_obj = ICF_DATABASE.get(professional_override)
            return ICFSuggestion(
                icf_code=professional_override,
                icf_name=icf_obj.name_sv if icf_obj else professional_override,
                confidence=1.0,  # Professional validation = 100% confidence
                source="professional_validation",
                matched_text=suggestion.matched_text,
                rationale="Professionell validering"
            )
        else:
            # Professional approved AI suggestion
            suggestion.confidence = min(0.98, suggestion.confidence * 1.05)
            suggestion.source = f"{suggestion.source}_validated"
            return suggestion
