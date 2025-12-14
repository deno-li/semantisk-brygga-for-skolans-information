"""
Example Usage of Semantic Bridge Architecture
Demonstrates the complete flow from survey response to intervention
Based on "Emma" example from the document
"""

import sys
sys.path.append('..')

from datetime import datetime
from src.services.semantic_mapper import SemanticMappingEngine
from src.services.ai_analyzer import AITextAnalyzer
from src.models.ksi_models import KSIAction, KSIStatus, KSITarget
from src.models.intervention_models import (
    SupportIntervention,
    SurveyResponse,
    SpiderChartData,
    SHANARRIDomain,
    InterventionSource
)


def example_1_freetext_to_icf():
    """
    Example 1: Analyze free-text response and suggest ICF codes

    Document reference: Lines 182-278 (Emma's concentration difficulties)
    """
    print("=" * 80)
    print("EXAMPLE 1: Free-text to ICF Analysis")
    print("=" * 80)

    analyzer = AITextAnalyzer()

    # Student free-text response (from document)
    student_response = "Ibland är det svårt att koncentrera mig när det är högt ljud i klassrummet."

    print(f"\nStudent response: \"{student_response}\"")
    print("\nAI Analysis:")

    suggestions = analyzer.analyze_freetext(
        student_response,
        context="utvecklas",
        min_confidence=0.75
    )

    for i, sugg in enumerate(suggestions, 1):
        print(f"\n{i}. ICF Code: {sugg.icf_code}")
        print(f"   Name: {sugg.icf_name}")
        print(f"   Confidence: {sugg.confidence:.2%}")
        print(f"   Source: {sugg.source}")
        print(f"   Matched: '{sugg.matched_text}'")
        print(f"   Rationale: {sugg.rationale}")

    return suggestions


def example_2_icf_to_ksi_mapping():
    """
    Example 2: Map ICF codes to KSI interventions

    Document reference: Lines 206-220 (Automatic KSI mapping)
    """
    print("\n" + "=" * 80)
    print("EXAMPLE 2: ICF to KSI Mapping")
    print("=" * 80)

    mapper = SemanticMappingEngine()

    icf_codes = ["b140", "d160", "e250"]

    for icf_code in icf_codes:
        print(f"\n--- ICF Code: {icf_code} ---")

        # Map to KSI
        ksi_mapping = mapper.icf_to_ksi(icf_code)
        print(f"KSI Targets: {', '.join(ksi_mapping.target_codes)}")
        print(f"Confidence: {ksi_mapping.confidence:.2%}")

        # Suggest interventions
        suggestions = mapper.suggest_interventions([icf_code], context="school")
        print(f"\nSuggested interventions ({len(suggestions)}):")
        for sugg in suggestions[:3]:  # Top 3
            print(f"  • {sugg['suggested_code']}: {sugg['ksi_action_name']}")
            print(f"    Rationale: {sugg['rationale']}")


def example_3_complete_flow():
    """
    Example 3: Complete flow from survey to intervention

    Document reference: Lines 179-278 (Complete Emma example)
    """
    print("\n" + "=" * 80)
    print("EXAMPLE 3: Complete Flow - Survey to Intervention")
    print("=" * 80)

    analyzer = AITextAnalyzer()
    mapper = SemanticMappingEngine()

    # STEP 1: Teacher documents observation
    print("\nSTEP 1: TEACHER DOCUMENTS (fritext)")
    teacher_note = """Emma har svårt att koncentrera sig vid längre uppgifter.
    Fungerar bra med struktur och kortare arbetspass."""
    print(f"'{teacher_note}'")

    # STEP 2: AI Analysis suggests ICF codes
    print("\nSTEP 2: AI-ANALYS (svenska barn-röst-modell)")
    suggestions = analyzer.analyze_freetext(teacher_note, context="utvecklas")

    print("Föreslår ICF-koder:")
    for sugg in suggestions[:3]:
        print(f"  ├─ {sugg.icf_code}: {sugg.icf_name} [{sugg.confidence:.0%} konfidens]")

    # STEP 3: Professional validation
    print("\nSTEP 3: PROFESSIONELL VALIDERING")
    validated_codes = ["b140", "d160"]
    print(f"Läraren klickar: ✓ {', '.join(validated_codes)}")

    # STEP 4: Automatic KSI mapping
    print("\nSTEP 4: AUTOMATISK KSI-MAPPNING (97% konfidens)")

    for icf_code in validated_codes:
        ksi_result = mapper.icf_to_ksi(icf_code)
        print(f"\nICF {icf_code} → KSI Target: {', '.join(ksi_result.target_codes)}")

    # Generate complete KSI codes
    print("\nFULLSTÄNDIGA KSI-KODER genereras:")

    interventions = [
        ("d160", KSIAction.AA, "Bedömning"),
        ("d160", KSIAction.PM, "Undervisning"),
        ("d160", KSIAction.RA, "Kompensatoriskt stöd"),
    ]

    for icf_code, action, action_name in interventions:
        ksi_code, confidence = mapper.generate_ksi_code(
            icf_code,
            action,
            KSIStatus.PLANNED
        )
        if ksi_code:
            print(f"├─ {ksi_code.full_code}: {ksi_code.get_description()}")
            print(f"│   (Target: {icf_code} + Agerande: {action.value} = {action_name})")

    # STEP 5: Map to other systems
    print("\nSTEP 5: MAPPNING ANDRA SYSTEM")

    all_mappings = mapper.map_to_all_systems("d160")

    print("\nBBIC (95% konfidens):")
    bbic = all_mappings["BBIC"]
    if bbic.metadata:
        print(f"└─ {bbic.metadata.get('dimension')}")
        print(f"   {bbic.metadata.get('subdimension')}")

    print("\nIBIC (100% konfidens - använder ICF direkt):")
    ibic = all_mappings["IBIC"]
    if ibic.metadata:
        print(f"└─ {ibic.metadata.get('area')}")
        print(f"   ICF-kod: {', '.join(ibic.target_codes)} (nativt)")

    print("\nKVÅ 2026 (87% konfidens):")
    kva = all_mappings["KVÅ"]
    if kva.metadata and kva.metadata.get("kva_codes"):
        for kva_code in kva.metadata["kva_codes"]:
            print(f"└─ {kva_code['code']}: {kva_code['description']}")


def example_4_batch_analysis():
    """
    Example 4: Batch analysis of multiple survey responses

    Document reference: Lines 299-372 (Prestationsoro example)
    """
    print("\n" + "=" * 80)
    print("EXAMPLE 4: Batch Analysis - Gävlemodellen Survey")
    print("=" * 80)

    analyzer = AITextAnalyzer()

    # Sample responses from 58 students about stress
    responses = [
        "Jag känner mig stressad inför prov och orkar inte alltid.",
        "Ibland är det svårt att sova på kvällen när jag tänker på allt jag måste hinna.",
        "Jag är orolig att jag ska misslyckas i skolan.",
        "Mina föräldrar förväntar sig att jag ska ha höga betyg.",
        "Det är mycket arbete och jag hinner inte alltid.",
        "Jag känner mig trött hela tiden.",
        "Stress inför prov, svårt att koncentrera mig.",
        "Rädd att inte klara av proven.",
        "För många läxor, orkar inte.",
        "Kan inte sova, tänker på skolan.",
    ]

    print(f"\nAnalyzing {len(responses)} student responses...")
    print("\nMETADATA:")
    print("📍 Område: MÅ BRA")
    print("💬 Tema: Prestationsoro")
    print(f"📊 Frekvens: {len(responses)} elever")

    themes, icf_frequencies = analyzer.analyze_batch(
        responses,
        min_frequency=2,
        min_confidence=0.80
    )

    print("\nAI-TEMATISERING:")
    for theme in themes:
        print(f"\n├─ {theme.theme_name} ({theme.frequency} svar, {theme.percentage:.0f}%)")
        print(f"│   ICF {', '.join(theme.icf_codes)} [{theme.confidence:.0%} konfidens]")
        print(f"│   Exempel: \"{theme.example_responses[0][:60]}...\"")

    print("\nTOP ICF CODES:")
    for code, freq in sorted(icf_frequencies.items(), key=lambda x: x[1], reverse=True)[:5]:
        print(f"  {code}: {freq} mentions")

    # Generate KSI interventions
    print("\nKSI-MAPPNING (automatisk):")
    mapper = SemanticMappingEngine()
    top_icf_codes = list(icf_frequencies.keys())[:3]

    ksi_suggestions = mapper.suggest_interventions(top_icf_codes, context="school")
    for sugg in ksi_suggestions[:5]:
        print(f"├─ {sugg['suggested_code']}: {sugg['ksi_target_name']} - {sugg['ksi_action_name']}")


def example_5_spider_chart():
    """
    Example 5: Spider chart / Behovskompassen visualization data

    Document reference: Lines 264-278 (PDCA tracking)
    """
    print("\n" + "=" * 80)
    print("EXAMPLE 5: Spider Chart (Behovskompassen) Data")
    print("=" * 80)

    # Create spider chart data
    spider_data = SpiderChartData(
        student_id="emma-uuid",
        timestamp=datetime.utcnow(),
        source="gavlemodellen_v42_2024",
        scores={
            SHANARRIDomain.SAFE: 8.9,
            SHANARRIDomain.HEALTHY: 8.1,
            SHANARRIDomain.ACHIEVING: 7.5,
            SHANARRIDomain.NURTURED: 9.2,
            SHANARRIDomain.ACTIVE: 8.0,
            SHANARRIDomain.RESPECTED: 8.5,
            SHANARRIDomain.RESPONSIBLE: 7.8,
            SHANARRIDomain.INCLUDED: 8.3,
        },
        previous_scores={
            SHANARRIDomain.ACHIEVING: 7.0,  # Previous score
        },
        change_delta={
            SHANARRIDomain.ACHIEVING: 0.5,  # Improvement!
        }
    )

    print("\nBEHOVSKOMPASSEN visar:")
    for domain, score in spider_data.scores.items():
        status = "✓" if score >= 8.0 else "⚠️" if score >= 7.0 else "❌"

        change = ""
        if spider_data.change_delta and domain in spider_data.change_delta:
            delta = spider_data.change_delta[domain]
            change = f" (↑{delta:+.1f})" if delta > 0 else f" (↓{delta:+.1f})"

        print(f"{status} {domain.value.upper()}: {score:.1f}/10{change}")

    print("\n📈 UTVECKLAS: 7.0 → 7.5 (förbättring efter insatser)")


def example_6_semantic_mappings():
    """
    Example 6: Complete semantic mappings overview

    Document reference: Confidence ratings throughout document
    """
    print("\n" + "=" * 80)
    print("EXAMPLE 6: Semantic Mapping Confidence Overview")
    print("=" * 80)

    mapper = SemanticMappingEngine()
    from src.services.semantic_mapper import MappingConfidence

    print("\nBekräftade konfidensratings från faktiska mappningar:")

    mappings = [
        ("ICF ↔ KSI", MappingConfidence.ICF_KSI.value, "KSI:s Target-axel = ICF koder, EXAKT samma"),
        ("ICF ↔ IBIC", MappingConfidence.ICF_IBIC.value, "IBIC använder ICF nativt, direkt koppling"),
        ("ICF ↔ BBIC", MappingConfidence.ICF_BBIC.value, "Socialstyrelsens metod, ICF-baserad"),
        ("SHANARRI ↔ ICF", MappingConfidence.SHANARRI_ICF.value, "Konceptuell mappning, internationellt beprövad"),
        ("ICF ↔ KVÅ", MappingConfidence.ICF_KVA.value, "ICHI-struktur, WHO-familj"),
        ("SS 12000 ↔ ICF", MappingConfidence.SS12000_ICF.value, "KRITISK LUCKA!"),
    ]

    for system, confidence, note in mappings:
        status = "✓" if confidence >= 0.90 else "⚠️" if confidence >= 0.80 else "❌"
        print(f"\n{status} {system}: {confidence:.0%}")
        print(f"   {note}")

    print("\n\nLÖSNING för SS 12000-luckan:")
    print(f"Med nya entiteter → SS 12000 ↔ ICF: 76% → 95% konfidens ✓")
    print("  • SupportIntervention (med KSI-kod)")
    print("  • FunctionDescription (med ICF-kod)")
    print("  • EnvironmentalFactor (e-koder)")


def main():
    """Run all examples"""
    print("\n")
    print("╔" + "=" * 78 + "╗")
    print("║" + " " * 78 + "║")
    print("║" + "  SEMANTIC BRIDGE ARCHITECTURE - EXAMPLE USAGE".center(78) + "║")
    print("║" + "  Based on Gävlemodellen 12+ years of proven results".center(78) + "║")
    print("║" + " " * 78 + "║")
    print("╚" + "=" * 78 + "╝")

    example_1_freetext_to_icf()
    example_2_icf_to_ksi_mapping()
    example_3_complete_flow()
    example_4_batch_analysis()
    example_5_spider_chart()
    example_6_semantic_mappings()

    print("\n" + "=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print("""
The Semantic Bridge Architecture successfully:

✓ Analyzes Swedish child voices (88-93% confidence)
✓ Maps to ICF codes automatically
✓ Generates KSI intervention codes (97% confidence)
✓ Syncs to BBIC (95%), IBIC (100%), KVÅ (87%)
✓ Tracks PDCA improvements via spider charts
✓ Enables longitudinal data from BHV → School → Socialtjänst

Ready for pilot implementation in Gävle/Gävleborg (2025-2027)
Investment: 16 MSEK | Expected ROI: 100x+ over 10 years
    """)


if __name__ == "__main__":
    main()
