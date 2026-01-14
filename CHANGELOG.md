# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-14

### Added - Initial Public Release

#### Core Features
- **SHANARRI Wellbeing Wheel**: 8 wellbeing dimensions from GIRFEC framework
  - Safe, Healthy, Achieving, Nurtured, Active, Respected, Responsible, Included
  - Three perspectives: Child, Parent/Guardian, Professional
  
- **WHO ICF Integration**: Three-level assessment system
  - N1 Screening (Universal level, 5-10 min)
  - N2 Deep Dive (Targeted level with Performance vs Capacity gap analysis, 30-60 min)
  - N3 Coordinated Planning (Multi-agency coordination)
  - Environmental factors: Barriers and Facilitators
  
- **My World Triangle (GIRFEC)**: Three-dimensional holistic assessment
  - How I grow and develop
  - What I need from others
  - My wider world
  - Integration with BBIC triangle
  
- **Resilience Matrix**: For complex situations (level 3-4 support)
  - Adversity scale (1-10)
  - Vulnerability scale (1-10)
  - Protective Environment scale (1-10)
  
- **Life Course Perspective**: Visualization across 6 life phases
  - MVC/BVC → Preschool → Primary School → Secondary School → Young Adult → Adult & Elderly
  - Longitudinal data, risk and protective factors, transitions
  
- **Child Journey Matrix**:
  - 3-level model: Universal → Support Profile → Coordination
  - 8 wellbeing spokes with semantic mapping
  - Data minimization: Different information shared at each level
  - Automatic escalation triggers
  
- **Demo Profiles**: 4 realistic child profiles
  - Erik A. (15 years, Grade 9) - Universal level
  - Lisa J. (12 years, Grade 6) - Support profile
  - Omar H. (11 years, Grade 5) - Universal with early attention
  - Sofia B. (16 years, TE1) - Coordination profile
  
- **My Voice - Child Survey**: Tool for children to express their experiences
  - Child-friendly language and interface
  - Emotional temperature control
  - Supports child's right to information and participation

#### Technical Features
- **Semantic Integration**: 
  - ICF (WHO International Classification of Functioning, Disability and Health)
  - KSI (Classification of Social Services Interventions)
  - KVÅ (Classification of Care Measures)
  - SNOMED CT integration points
  - SS 12000 (Swedish School Standard)
  
- **AI Analysis**: OpenAI integration for insights and suggestions
- **Trend Analysis**: Charts and visualizations with Recharts
- **PDF Export**: Generate reports with jsPDF and html2canvas
- **Dark Mode**: Full dark mode support
- **Journal System**: DFIK (Documentation, Follow-up, Information, Coordination)
- **Quality Improvement Wheel**: PDCA cycle for Gävle Model's systematic safety work

#### Infrastructure
- **Frontend**: React 19 + TypeScript + Vite
- **Backend**: FastAPI + Python for semantic mapping
- **Deployment**: 
  - GitHub Pages for static demo
  - Vercel support for full-stack deployment
- **CI/CD**: GitHub Actions for automated testing and deployment

#### Documentation
- Comprehensive README with Swedish context
- Security documentation (SECURITY.md)
- Deployment guide (README-DEPLOYMENT.md)
- Detailed Journey Matrix documentation
- MIT License for code, CC BY 4.0 for documentation

#### Standards & Frameworks
- Based on GIRFEC (Getting It Right For Every Child) from Scotland
- Connected Children research project (Linnaeus University)
- Kronobarnsmodellen (Region Kronoberg)
- Gävlemodellen (Gävle Municipality & University of Gävle)
- BBIC & IBIC (Swedish National Board of Health and Welfare)
- WHO ICF classification

### Security
- No real personal data - only mock demonstration data
- No API keys in source code or build process
- Secure deployment via GitHub Pages
- Environment variables properly configured
- No security vulnerabilities in dependencies (npm audit clean)

## [Unreleased]

### Planned Features
- Enhanced accessibility (WCAG compliance)
- Additional semantic mappings
- Integration examples with real systems
- Multi-language support
- Improved mobile responsiveness

---

## Release Notes

### Version 1.0.0 - Initial Public Release

This is the first public release of the Välbefinnandehjul för Sammanhållen Planering (Wellbeing Wheel for Coordinated Planning) prototype.

**Target Audience**: Swedish public sector professionals working with child and youth welfare (schools, social services, healthcare)

**Status**: Prototype for demonstration and concept validation

**Not Production Ready**: This is a prototype demonstrating concepts. It lacks authentication, authorization, data encryption, GDPR compliance mechanisms, and other features required for production use with real personal data.

**Purpose**: To demonstrate semantic integration possibilities and stimulate discussion about coordinated planning in Swedish child welfare.

**License**: 
- Code: MIT License (open for adaptation and reuse)
- Documentation: CC BY 4.0 (share with attribution)

**Contributing**: See CONTRIBUTING.md for guidelines on how to contribute to this project.

**Links**:
- Repository: https://github.com/deno-li/semantisk-brygga-for-skolans-information
- Demo: https://deno-li.github.io/semantisk-brygga-for-skolans-information/
- Issues: https://github.com/deno-li/semantisk-brygga-for-skolans-information/issues

---

For detailed information about the project, see the [README.md](README.md)
