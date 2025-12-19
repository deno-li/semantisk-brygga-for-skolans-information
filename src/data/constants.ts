
import {
  ShanarriIndicator, ChildProfile, TimelineEvent, QualityPhase, TrendData, JournalData, NewsItem, DocumentSection,
  RiskFactor, ProtectiveFactor, LongitudinalDataPoint, QualityIndicator, Transition, ActorProfile, EnhancedChildProfile,
  MyWorldTriangleAssessment, MyWorldAspect, ResilienceMatrix, AdversityFactor, VulnerabilityFactor,
  ProtectiveEnvironmentFactor, AnnualQualityWheel, QualityWheelPhase, QualityActivity, GavleModelPillar, LegalRequirement,
  BBICTriangleArea
} from '../types/types';

export const CHILD_PROFILE: ChildProfile = {
  name: "Erik Andersson",
  ssn: "20100315-1234",
  age: 15,
  school: "Stigslundsskolan",
  grade: "Åk 9",
  sipActive: true,
  sipGoal: {
    child: "Målet är att jag ska bli bättre på att läsa och känna mig lugn i skolan.",
    professional: "Erik ska uppnå åldersadekvat läsförmåga och känna trygghet i sin skolsituation senast juni 2026."
  }
};

// MAPPINGS EXPLANATION:
// ICF: International Classification of Functioning (d = activities, b = body functions, e = environment)
// KSI: Kommunernas Socialtjänsts Informationssystem (Reporting codes)
// KVÅ: Klassifikation av vårdåtgärder (Healthcare procedures)
// BBIC: Barns Behov i Centrum (Social work framework domains)

export const SHANARRI_DATA: ShanarriIndicator[] = [
  {
    id: 'safe',
    name: 'TRYGG',
    nameEn: 'Safe',
    color: '#005595',
    status: 5,
    target: 4,
    // ICF Kapitel & Komponenter + Detaljkoder från tabellen
    icf: 'e3 Stöd och relationer, e5 Tjänster, system, policyer, b152 Känslomässiga funktioner | e310 Närmaste familj, e320 Vänner, e325 Bekanta, kamrater, e355 Hälso- och sjukvårdspersonal, e360 Annan yrkeskunnig person, e575 Samhälleliga sociala stödtjänster, b1528C Känsla av otrygghet',
    // KSI Kapitel (Aktionskategorier) + Aktiviteter (Detaljkoder)
    ksi: 'SS Mellanmänskliga interaktioner, ST Utbildning/arbete, SMI Se till sin egen säkerhet | SS1.AA Bedömning relationer, SSK Förälder-barnrelation, SMI.AA Bedömning säkerhet, SMI.PN Råd om säkerhet',
    bbic: 'Säkerhet, Familj och miljö, Familjebakgrund',
    bbicCategory: 'family-environment',
    bbicArea: 'Nuvarande familjesituation',
    ibic: 'Känsla av otrygghet, Omgivningsfaktorer, Stöd och relationer',
    kva: 'GD001 (Stödsamtal)',
    snomed: '371609003 (Känsla av trygghet)',
    source: 'Trygghetsenkät',
    notes: 'Att du känner dig lugn och trygg i skolan och hemma, utan bråk eller rädsla. Konfidens: 92%'
  },
  {
    id: 'healthy',
    name: 'MÅ BRA',
    nameEn: 'Healthy',
    color: '#378056',
    status: 4,
    target: 4,
    // ICF från tabellen
    icf: 'd5 Personlig vård, b1-b8 Kroppsfunktioner, d570 Sköta sin hälsa | d510 Tvätta sig, d520 Kroppsvård, d540 Klä sig, d550 Äta, d560 Dricka, d570 Sköta sin hälsa, b130 Energi och drift, b134 Sömn, b152 Känslomässiga funktioner',
    ksi: 'SM Personlig vård, SMH Sköta sin egen hälsa | SM1.AA Bedömning personlig vård, SMH.AA Bedömning sköta hälsa, SMH.PN Råd om hälsa, SMH.PU Stödjande samtal hälsa',
    bbic: 'Hälsa, Känslor och beteende',
    bbicCategory: 'child-development',
    bbicArea: 'Hälsa',
    ibic: 'Personlig vård, Sköta sin egen hälsa, Kroppsfunktioner',
    kva: 'AU120 (Hälsobesök EMI)',
    snomed: '271919001 (God hälsa)',
    source: 'Hälsosamtal EMI',
    notes: 'Att din kropp mår bra, att du äter, sover och rör på dig så att du orkar med skolan. Konfidens: 95%'
  },
  {
    id: 'achieving',
    name: 'UTVECKLAS',
    nameEn: 'Achieving',
    color: '#C12143',
    status: 4,
    target: 4,
    // ICF från tabellen
    icf: 'd1 Lärande och tillämpa kunskap, d8 Utbildning, d160-d179 Tillämpa kunskap | d110-d159 Grundläggande lärande, d160 Fokusera uppmärksamhet, d163 Tänkande, d166 Läsning, d170 Skrivning, d172 Räkning, d175 Lösa problem, d177 Fatta beslut, d810-d839 Utbildning',
    ksi: 'SA-SC Lärande och tillämpa kunskap, ST Utbildning, arbete | SA1.AA Bedömning lärande, SA1.AT Inhämtning från professionell, SCA Fokusera uppmärksamhet, SCJ Lösa problem, ST1 Utbildning',
    bbic: 'Utbildning, Känslor och beteende',
    bbicCategory: 'child-development',
    bbicArea: 'Utbildning',
    ibic: 'Lärande och tillämpa kunskap, Utbildning',
    kva: 'DU011 (Logopedutredning)',
    icd: 'F81.0 (Specifik lässvårighet)',
    snomed: '224497003 (Skolprestation)',
    source: 'Åtgärdsprogram',
    notes: 'Att du lär dig nya saker, utvecklas och klarar skolans mål. Konfidens: 89%'
  },
  {
    id: 'nurtured',
    name: 'OMVÅRDAD',
    nameEn: 'Nurtured',
    color: '#B00020',
    status: 5,
    target: 4,
    // ICF från tabellen
    icf: 'e3 Stöd och relationer, d760 Familjerelationer, d6608A Vård av familjemedlem, bis4 barn | e310 Närmaste familj, e315 Utvidgad familj, d760 Familjerelationer, d7600 Förälder-barnrelation, d6608A Vårdnadshavare bistå barnet',
    ksi: 'SP Stöd åt andra, SPE Vårdnadshavare bistå barn, SPE.PN Råd föräldraskap | SPE.AA Bedömning vårdnadshavare, SPE.PH Färdighetsträning föräldraskap, SPE.PN Råd föräldraskap, SSK.PU Stödjande samtal förälder-barn',
    bbic: 'Föräldrarnas förmåga, Grundläggande omsorg, Känslomässig tillgänglighet',
    bbicCategory: 'parenting',
    bbicArea: 'Grundläggande omsorg',
    ibic: 'Att bistå andra, Familjerelationer, Stöd från närstående',
    kva: 'XS005 (Social utredning)',
    snomed: '105455006 (Omsorgsstatus)',
    source: 'Hembesök',
    notes: 'Att du har vuxna som bryr sig om dig, ger dig mat, kärlek och ett tryggt hem. Konfidens: 94%'
  },
  {
    id: 'active',
    name: 'AKTIV',
    nameEn: 'Active',
    color: '#E87C00',
    status: 5,
    target: 4,
    // ICF från tabellen
    icf: 'd9 Samhällsgemenskap, d920 Rekreation och fritid, d4 Rörlighet | d920 Rekreation och fritid, d9200 Lek, d9201 Sport, d9202 Konst och kultur, d9203 Hantverk, d9205 Umgås, d450 Gå, d455 Röra sig omkring',
    ksi: 'SX Samhällsgemenskap, SXA Lek, SXD Rekreation och fritid, SH-SK Rörlighet | SX1.AA Bedömning samhällsgemenskap, SXA.PH Färdighetsträning lek, SXD.PN Råd fritid, SH1 Rörlighet',
    bbic: 'Sociala relationer, Fritid',
    bbicCategory: 'family-environment',
    bbicArea: 'Social tillhörighet och integration',
    ibic: 'Samhällsgemenskap, socialt och medborgerligt liv, Rekreation och fritid',
    kva: 'QV001 (Råd om fys. aktivitet)',
    snomed: '256235009 (Fritidsaktivitet)',
    source: 'Samtal',
    notes: 'Att du gör roliga saker på fritiden, som sport, lek eller hobbyer. Konfidens: 88%'
  },
  {
    id: 'respected',
    name: 'RESPEKTERAS',
    nameEn: 'Respected',
    color: '#6D8F13',
    status: 4,
    target: 4,
    // ICF från tabellen
    icf: 'd7 Mellanmänskliga interaktioner, e4 Attityder, d177 Fatta beslut | d710 Grundläggande mellanmänskliga interaktioner, d720 Sammansatta interaktioner, d740 Formella relationer, e410 Närmaste familjens attityder, e420 Vänners attityder, e425 Bekanta, kamraters attityder',
    ksi: 'SR-SS Mellanmänskliga interaktioner, SCL Fatta beslut | SR1.AA Bedömning interaktioner, SR1.PU Stödjande samtal interaktioner, SCL.PH Färdighetsträning beslut',
    bbic: 'Sociala relationer, Känslor och beteende, Identitet och självbild',
    bbicCategory: 'parenting',
    bbicArea: 'Känslomässig tillgänglighet',
    ibic: 'Mellanmänskliga interaktioner, Attityder i omgivningen',
    kva: 'GD005 (Stödsamtal)',
    snomed: '125678000 (Självkänsla)',
    source: 'Samtal',
    notes: 'Att vi vuxna lyssnar på vad du tycker och tänker, och tar det på allvar. Konfidens: 86%'
  },
  {
    id: 'responsible',
    name: 'ANSVARSTAGAN DE',
    nameEn: 'Responsible',
    color: '#00838F',
    status: 4,
    target: 4,
    // ICF från tabellen
    icf: 'd250 Hantera sitt beteende, d7 Mellanmänskliga interaktioner, d8 Utbildning, arbete | d250 Hantera sitt beteende, d2500 Acceptera nytt, d2501 Agera på krav, d2502 Svara på kritik, d2503 Agera förutsägbart, d2504 Anpassa aktivitetsnivå',
    ksi: 'SD Allmänna uppgifter och krav, SDA Genomföra daglig rutin, SDB Hantera stress | SD1.AA Bedömning allmänna uppgifter, SDA.PH Färdighetsträning rutin, SDB.PU Stödjande samtal stress, SDC.PN Råd om ansvar',
    bbic: 'Känslor och beteende, Sociala relationer',
    bbicCategory: 'child-development',
    bbicArea: 'Känslor och beteende',
    ibic: 'Allmänna uppgifter och krav, Handläggning av stress, Handläggning av ansvar',
    kva: '-',
    snomed: '288600008 (Förmåga att ta ansvar)',
    source: 'Lärarbedömning',
    notes: 'Att du lär dig ta ansvar för dina läxor, tider och hur du är mot andra. Konfidens: 84%'
  },
  {
    id: 'included',
    name: 'DELAKTIG',
    nameEn: 'Included',
    color: '#6A2A5B',
    status: 5,
    target: 4,
    // ICF från tabellen
    icf: 'd9 Samhällsgemenskap, d7 Mellanmänskliga relationer, e5 Tjänster och system | d910 Samhällsgemenskap, d750 Informella sociala relationer, d7500 Informella relationer med vänner, d7504 Informella relationer med kamrater, e585 Utbildningstjänster, e590 Arbets- och anställningstjänster',
    ksi: 'SX Samhällsgemenskap, SS Mellanmänskliga relationer, ST Utbildning | SX1.AA Bedömning samhällsgemenskap, SS2.AA Bedömning sociala relationer, SSC Vänskap, SSE Kamratskap',
    bbic: 'Sociala relationer, Familj och miljö, Socialt nätverk',
    bbicCategory: 'child-development',
    bbicArea: 'Sociala relationer',
    ibic: 'Samhällsgemenskap, Sociala relationer, Informella relationer',
    kva: 'UX001 (Upprätta nätverkskarta)',
    snomed: '86603000 (Social delaktighet)',
    source: 'Trygghetsenkät',
    notes: 'Att du har kompisar, känner dig välkommen och får vara med i gemenskapen. Konfidens: 90%'
  }
];

// BBIC Triangle - Barns Behov i Centrum (från Socialstyrelsen)
export const BBIC_TRIANGLE: BBICTriangleArea[] = [
  {
    id: 'child-development',
    category: 'child-development',
    title: 'Barnets utveckling',
    color: '#4CAF50',
    subAreas: [
      {
        id: 'health',
        title: 'Hälsa',
        description: 'Barnets fysiska och psykiska hälsa, tillväxt och utveckling',
        linkedShanarri: ['healthy']
      },
      {
        id: 'education',
        title: 'Utbildning',
        description: 'Barnets lärande, skolgång och kognitiva utveckling',
        linkedShanarri: ['achieving']
      },
      {
        id: 'emotions-behavior',
        title: 'Känslor och beteende',
        description: 'Barnets känslomässiga mognad, beteende och självreglering',
        linkedShanarri: ['responsible']
      },
      {
        id: 'social-relations',
        title: 'Sociala relationer',
        description: 'Barnets förmåga att skapa och behålla relationer',
        linkedShanarri: ['included', 'respected']
      }
    ]
  },
  {
    id: 'parenting',
    category: 'parenting',
    title: 'Föräldrarnas förmåga',
    color: '#2196F3',
    subAreas: [
      {
        id: 'basic-care',
        title: 'Grundläggande omsorg',
        description: 'Föräldrarnas förmåga att tillgodose barnets grundläggande behov',
        linkedShanarri: ['nurtured']
      },
      {
        id: 'stimulation-guidance',
        title: 'Stimulans och vägledning',
        description: 'Föräldrarnas förmåga att stimulera barnets utveckling och ge vägledning',
        linkedShanarri: ['achieving']
      },
      {
        id: 'emotional-availability',
        title: 'Känslomässig tillgänglighet',
        description: 'Föräldrarnas förmåga att vara känslomässigt närvarande och responsiva',
        linkedShanarri: ['respected', 'nurtured']
      },
      {
        id: 'safety',
        title: 'Säkerhet',
        description: 'Föräldrarnas förmåga att skydda barnet och tillhandahålla en säker miljö',
        linkedShanarri: ['safe']
      }
    ]
  },
  {
    id: 'family-environment',
    category: 'family-environment',
    title: 'Familj och miljö',
    color: '#FF9800',
    subAreas: [
      {
        id: 'family-situation',
        title: 'Nuvarande familjesituation',
        description: 'Familjens sammansättning, relationer och funktion',
        linkedShanarri: ['safe']
      },
      {
        id: 'family-history',
        title: 'Familjehistorik och bakgrund',
        description: 'Familjens historia och betydelsefulla händelser',
        linkedShanarri: []
      },
      {
        id: 'housing-work',
        title: 'Boende och arbete/ekonomi',
        description: 'Familjens boendesituation och ekonomiska förutsättningar',
        linkedShanarri: []
      },
      {
        id: 'social-integration',
        title: 'Social tillhörighet och integration',
        description: 'Familjens sociala nätverk och samhällsdeltagande',
        linkedShanarri: ['included', 'active']
      }
    ]
  }
];

export const TIMELINE_DATA: TimelineEvent[] = [
  { date: '2025-11-28', title: 'Uppföljning extra anpassningar', description: 'God progress i matematik, fortsatt behov i svenska.', type: 'school', color: 'bg-[#005595]' },
  { date: '2025-10-15', title: 'Hälsosamtal EMI åk 4', description: 'God hälsa, normal BMI. Inga anmärkningar syn/hörsel.', type: 'health', color: 'bg-[#378056]' },
  { date: '2025-09-01', title: 'SIP upprättad', description: 'Samordnad plan mellan skola, hem och BUP.', type: 'social', color: 'bg-[#6A2A5B]' },
];

export const QUALITY_CYCLE: QualityPhase[] = [
  {
    id: 'plan',
    title: 'Planering',
    period: 'Augusti - September',
    activities: ['Revidera plan mot kränkande behandling', 'Planera värdegrundsarbete'],
    status: 'completed',
    description: 'Verksamheten sätter mål för läsåret baserat på föregående års analys.'
  },
  {
    id: 'map',
    title: 'Kartläggning',
    period: 'Oktober - November',
    activities: ['Gävlemodellenkät (v.42)', 'Trygghetsvandring', 'Hälsosamtal'],
    status: 'completed',
    description: 'Datainsamling via enkäter och samtal för att fånga elevernas upplevelse.'
  },
  {
    id: 'analyze',
    title: 'Analys & Åtgärd',
    period: 'December - Mars',
    activities: ['Resultatdialog i klasser', 'Insatser på gruppnivå', 'Individuella anpassningar'],
    status: 'active',
    description: 'Vi analyserar resultaten tillsammans med eleverna och sätter in åtgärder.'
  },
  {
    id: 'evaluate',
    title: 'Uppföljning',
    period: 'April - Juni',
    activities: ['Utvärdering av insatser', 'Ny nulägesanalys', 'Bokslut'],
    status: 'upcoming',
    description: 'Har åtgärderna gett effekt? Vad tar vi med oss till nästa läsår?'
  }
];

export const SAFETY_TREND_DATA: TrendData[] = [
  { year: 'HT-23', score: 3.2, schoolAvg: 3.5 },
  { year: 'VT-24', score: 3.4, schoolAvg: 3.6 },
  { year: 'HT-24', score: 3.8, schoolAvg: 3.7 },
  { year: 'VT-25', score: 4.1, schoolAvg: 3.8 },
];

export const JOURNAL_DATA: JournalData = {
  "Skola": {
    unit: "Elevhälsoteamet, Stigslundsskolan",
    contact: "Lisa Svensson (Mentor)",
    lastUpdated: "2025-11-28",
    Delaktighet: "God kamratkontakt på raster men drar sig undan vid grupparbeten i klassrummet. Deltar aktivt i praktisk-estetiska ämnen (Bild/Slöjd).",
    Funktion: "God begåvningsprofil men nedsatt arbetsminne och processhastighet (enl. WISC-V). Läsförmåga motsvarar ca åk 2-nivå. Koncentrationssvårigheter vid självständigt arbete.",
    Insats: "Åtgärdsprogram reviderat 2025-08-20. Extra anpassningar: Inlästa läromedel (Legimus), Bildstöd i klassrummet. Speciallärare 2x40 min/vecka.",
    Kontext: "Klass 4A. Fysisk lärmiljö bedöms som god men ljudnivån i korridorer upplevs stressande. Eleven placerad i mindre grupp vid matematik."
  },
  "Socialtjänst": {
    unit: "Mottagningsenheten Barn & Unga",
    contact: "Karin Larsson (Socialsekreterare)",
    lastUpdated: "2025-11-15",
    Delaktighet: "Barnet deltar i samtal med barnsekreterare. Har uttryckt önskan om mer tid med fritidsaktiviteter.",
    Funktion: "Behov av förutsägbarhet och struktur för att hantera vardagssituationer. Känslomässig omognad noterad vid pressade situationer i hemmiljön.",
    Insats: "Bistånd enligt SoL 4:1: Kontaktfamilj varannan helg för att stärka socialt nätverk och ge miljöombyte. Uppföljning planerad 2026-05.",
    Kontext: "Aktuell inom BoU sedan 2024. Sammanbor med mor och syskon växelvis. Stabilt boende men behov av avlastning i vardagen."
  },
  "Hälso- och sjukvård": {
    unit: "Barn- och ungdomspsykiatrin (BUP) / Elevhälsan",
    contact: "Dr. Anders Läkare",
    lastUpdated: "2025-10-12",
    Delaktighet: "Barnet kan adekvat beskriva sin mående-skala. Följsamhet till insatt behandling är god.",
    Funktion: "Diagnos F90.0 (ADHD). God fysisk hälsa. Syn och hörsel ua. Regelbunden medicinuppföljning.",
    Insats: "Centralstimulerande behandling insatt HT-24. Psykoedukation till föräldrar och skola genomförd. Nästa läkarkontroll 2026-02.",
    Kontext: "Ordinarie BVC-program följt. Nu aktuell via Elevhälsan och BUP Gävleborg. Audit ifylld UA."
  },
  "Omsorg": {
    unit: "LSS-handläggning, Gävle Kommun",
    contact: "Bo Handläggare",
    lastUpdated: "2025-09-30",
    Delaktighet: "Deltar i 'Fritid för alla'-verksamhet på onsdagar. Trivs bra i gruppen.",
    Funktion: "Behov av stöd vid övergångar och nya moment. Svårigheter med tidsuppfattning.",
    Insats: "Ledsagarservice vid fritidsaktiviteter (SoL). Ansökan om korttidsvistelse är under handläggning.",
    Kontext: "LSS-utredning påbörjad men ej slutförd. Insatser ges tills vidare via Socialtjänstlagen (SoL)."
  },
  "Barn och vårdnadshavare": {
    unit: "Vårdnadshavare",
    contact: "Anna Andersson",
    lastUpdated: "2025-11-25",
    Delaktighet: "Vårdnadshavare aktiva i föräldramöten och SIP. Önskar tätare återkoppling från skolan gällande läsningen.",
    Funktion: "Erik säger: 'Jag vill lära mig läsa som de andra, men bokstäverna hoppar'.",
    Insats: "Eget initiativ: Läxhjälp via Röda Korset tisdagar.",
    Kontext: "Hemmiljön präglas av omsorg men hög stressnivå kring morgonrutiner."
  }
};

export const NEWS_FEED_DATA: NewsItem[] = [
  {
    id: '1',
    title: 'Ny digital tjänst för ungdomsmottagningen',
    snippet: 'Nu kan du boka tid och chatta med ungdomsmottagningen direkt i mobilen via 1177.',
    date: '2025-11-20',
    source: 'Region Gävleborg'
  },
  {
    id: '2',
    title: 'Öppet hus på Stigslundsskolan',
    snippet: 'Välkomna på öppet hus för att se hur vi arbetar med trygghet och studiero.',
    date: '2025-11-15',
    source: 'Gävle Kommun'
  },
  {
    id: '3',
    title: 'Fritidsbanken utökar öppettiderna',
    snippet: 'Låna sport- och fritidsutrustning gratis. Nu öppet även söndagar.',
    date: '2025-11-10',
    source: 'Fritidsbanken'
  }
];

export const DOCUMENTS_DATA: DocumentSection[] = [
  {
    category: 'Aktuella Planer',
    items: [
      { 
        title: 'Samordnad Individuell Plan (SIP)', 
        date: '2025-09-01', 
        type: 'PDF', 
        author: 'Stigslundsskolan / Region Gävleborg',
        status: 'Signerad'
      },
      { 
        title: 'Åtgärdsprogram', 
        date: '2025-08-20', 
        type: 'PDF', 
        author: 'Stigslundsskolan',
        status: 'Aktivt'
      }
    ]
  },
  {
    category: 'Utredningar & Bedömningar',
    items: [
      { 
        title: 'Pedagogisk Kartläggning', 
        date: '2025-05-15', 
        type: 'PDF', 
        author: 'Stigslundsskolan',
        status: 'Arkiverad'
      },
      { 
        title: 'SHANARRI Välfärdsbedömning', 
        date: '2025-10-14', 
        type: 'Digital', 
        author: 'Gävlemodellen',
        status: 'Senaste'
      }
    ]
  },
  {
    category: 'Referensmaterial & Metodstöd',
    items: [
      { 
        title: 'Gävlemodellen - Processbeskrivning & Strategi', 
        date: '2024-04-25', 
        type: 'Google Doc', 
        author: 'Utbildning Gävle',
        link: 'https://docs.google.com/document/d/1PjGahX2GJWdd0mKtcE9FzGoi8kSQCMFG1T7AlWego2Q/edit?tab=t.0',
        status: 'Externt'
      }
    ]
  }
];

export const THEME = {
  primaryRed: '#B00020', // Official 1177 Brand Red
  actionBlue: '#005595', // Official Inera Action Blue
  bgGray: '#F3F3F3',     // Official Inera Background
  textDark: '#1F1F1F',   // Standard Text
  successGreen: '#378056',
  warningYellow: '#FFC800',
};

// ==========================================
// LIVSLOPPSPERSPEKTIV - MOCKDATA
// ==========================================

// Risk- och skyddsfaktorer för Erik (15 år, grundskola)
export const RISK_FACTORS: RiskFactor[] = [
  {
    id: 'rf-001',
    category: 'individual',
    severity: 'medium',
    name: 'Läs- och skrivsvårigheter',
    description: 'Specifik lässvårighet (dyslexi) som påverkar skolprestationer och självkänsla',
    identifiedDate: '2023-05-15',
    identifiedBy: 'elementary-school',
    relatedDimensions: ['achieving'],
    icfCodes: ['d166', 'd145', 'd160'],
    mitigationActions: [
      'Åtgärdsprogram upprättat',
      'Speciallärare 2x40 min/vecka',
      'Inlästa läromedel (Legimus)',
      'Bildstöd i klassrummet'
    ],
    status: 'monitoring'
  },
  {
    id: 'rf-002',
    category: 'individual',
    severity: 'low',
    name: 'Koncentrationssvårigheter',
    description: 'ADHD-diagnos med behov av strukturerat stöd',
    identifiedDate: '2024-03-10',
    identifiedBy: 'bup',
    relatedDimensions: ['achieving', 'responsible'],
    icfCodes: ['b140', 'd160', 'd220'],
    mitigationActions: [
      'Medicinsk behandling (centralstimulerande)',
      'Psykoedukation till föräldrar och skola',
      'Anpassad studiemiljö (mindre grupp)'
    ],
    status: 'monitoring'
  },
  {
    id: 'rf-003',
    category: 'environment',
    severity: 'low',
    name: 'Begränsad kamratkrets',
    description: 'Har några nära vänner men känner sig ibland ensam, särskilt vid grupparbeten',
    identifiedDate: '2024-10-14',
    identifiedBy: 'elementary-school',
    relatedDimensions: ['included', 'safe'],
    icfCodes: ['d750', 'd9205'],
    mitigationActions: [
      'Strukturerade sociala aktiviteter i skolan',
      'Fritidsaktiviteter (fotboll 2 ggr/vecka)',
      'Kontaktfamilj varannan helg'
    ],
    status: 'monitoring'
  },
  {
    id: 'rf-004',
    category: 'family',
    severity: 'low',
    name: 'Föräldrastress',
    description: 'Hög stressnivå kring morgonrutiner i hemmiljön',
    identifiedDate: '2024-09-01',
    identifiedBy: 'social-services',
    relatedDimensions: ['nurtured', 'safe'],
    icfCodes: ['e310', 'e355'],
    mitigationActions: [
      'Kontaktfamilj för avlastning',
      'Stödsamtal med socialsekreterare',
      'Strukturstöd för morgonrutiner'
    ],
    status: 'monitoring'
  }
];

export const PROTECTIVE_FACTORS: ProtectiveFactor[] = [
  {
    id: 'pf-001',
    category: 'family',
    strength: 'strong',
    name: 'Stabil familjesituation',
    description: 'Omsorgsfulla föräldrar som är engagerade i barnets skolgång och välbefinnande',
    identifiedDate: '2023-09-01',
    identifiedBy: 'elementary-school',
    relatedDimensions: ['nurtured', 'safe'],
    icfCodes: ['e310', 'd760']
  },
  {
    id: 'pf-002',
    category: 'individual',
    strength: 'strong',
    name: 'God fysisk hälsa',
    description: 'Normal BMI, inga hälsoproblem, aktiv på fritiden',
    identifiedDate: '2024-10-15',
    identifiedBy: 'healthcare',
    relatedDimensions: ['healthy', 'active'],
    icfCodes: ['b530', 'b152']
  },
  {
    id: 'pf-003',
    category: 'environment',
    strength: 'moderate',
    name: 'Meningsfulla fritidsaktiviteter',
    description: 'Spelar fotboll 2 ggr/vecka, deltar i Fritid för alla onsdagar',
    identifiedDate: '2024-09-01',
    identifiedBy: 'elementary-school',
    relatedDimensions: ['active', 'included'],
    icfCodes: ['d920', 'd9201']
  },
  {
    id: 'pf-004',
    category: 'individual',
    strength: 'strong',
    name: 'Ansvarskänsla',
    description: 'Tar ansvar för sina uppgifter, följsam till behandling',
    identifiedDate: '2024-10-01',
    identifiedBy: 'elementary-school',
    relatedDimensions: ['responsible', 'respected'],
    icfCodes: ['d230', 'd240']
  },
  {
    id: 'pf-005',
    category: 'environment',
    strength: 'strong',
    name: 'Positivt mentorskap',
    description: 'Känner sig lyssnad på av sin mentor (Lisa Svensson)',
    identifiedDate: '2024-09-01',
    identifiedBy: 'elementary-school',
    relatedDimensions: ['respected', 'safe'],
    icfCodes: ['e330', 'd710']
  },
  {
    id: 'pf-006',
    category: 'environment',
    strength: 'moderate',
    name: 'Tvärsektoriell samverkan (SIP)',
    description: 'Samordnad individuell plan mellan skola, hem och BUP',
    identifiedDate: '2024-09-01',
    identifiedBy: 'social-services',
    relatedDimensions: ['nurtured', 'achieving'],
    icfCodes: ['e355', 'e580']
  }
];

// Longitudinell data - Erik från BVC till nuvarande ålder
export const LONGITUDINAL_DATA: LongitudinalDataPoint[] = [
  {
    date: '2015-09-01',
    phase: 'early-childhood',
    age: 5,
    dimensions: {
      'safe': { value: 4, source: 'bvc', notes: 'Trygg anknytning' },
      'healthy': { value: 4, source: 'bvc', notes: 'God hälsa' },
      'nurtured': { value: 5, source: 'bvc', notes: 'Omsorgsfull familj' },
      'active': { value: 4, source: 'bvc', notes: 'Lekfull och motoriskt aktiv' },
      'included': { value: 4, source: 'preschool', notes: 'Deltar i lekaktiviteter' },
      'responsible': { value: 3, source: 'preschool', notes: 'Åldersadekvat' },
      'respected': { value: 4, source: 'preschool', notes: 'Respekteras av kamrater' },
      'achieving': { value: 4, source: 'preschool', notes: 'Nyfiken och lär sig snabbt' }
    },
    riskFactors: [],
    protectiveFactors: ['pf-001', 'pf-002'],
    supportLevel: 'universal',
    sector: 'bvc'
  },
  {
    date: '2017-10-01',
    phase: 'elementary-school',
    age: 7,
    dimensions: {
      'safe': { value: 4, source: 'elementary-school', notes: 'Trivs i skolan' },
      'healthy': { value: 4, source: 'healthcare', notes: 'God hälsa' },
      'nurtured': { value: 4, source: 'elementary-school', notes: 'Föräldrar engagerade' },
      'active': { value: 4, source: 'elementary-school', notes: 'Deltar i idrott' },
      'included': { value: 4, source: 'elementary-school', notes: 'Har kompisar' },
      'responsible': { value: 4, source: 'elementary-school', notes: 'Ansvarsfull' },
      'respected': { value: 4, source: 'elementary-school', notes: 'Positiv självbild' },
      'achieving': { value: 3, source: 'elementary-school', notes: 'Vissa läsutmaningar börjar synas' }
    },
    riskFactors: [],
    protectiveFactors: ['pf-001', 'pf-002', 'pf-003', 'pf-005'],
    supportLevel: 'universal',
    sector: 'elementary-school'
  },
  {
    date: '2020-05-01',
    phase: 'elementary-school',
    age: 10,
    dimensions: {
      'safe': { value: 4, source: 'elementary-school', notes: 'Trygg i skolan' },
      'healthy': { value: 4, source: 'student-health', notes: 'God hälsa' },
      'nurtured': { value: 4, source: 'elementary-school', notes: 'Stabil familj' },
      'active': { value: 4, source: 'elementary-school', notes: 'Fotboll 2 ggr/vecka' },
      'included': { value: 3, source: 'elementary-school', notes: 'Begränsat kamratkrets' },
      'responsible': { value: 4, source: 'elementary-school', notes: 'Ansvarsfull' },
      'respected': { value: 4, source: 'elementary-school', notes: 'Respekteras' },
      'achieving': { value: 2, source: 'elementary-school', notes: 'Läs- och skrivsvårigheter tydliga' }
    },
    riskFactors: ['rf-001'],
    protectiveFactors: ['pf-001', 'pf-002', 'pf-003', 'pf-004', 'pf-005'],
    supportLevel: 'early-attention',
    sector: 'elementary-school'
  },
  {
    date: '2023-09-01',
    phase: 'elementary-school',
    age: 13,
    dimensions: {
      'safe': { value: 4, source: 'elementary-school', notes: 'Trygg i skolan' },
      'healthy': { value: 4, source: 'student-health', notes: 'God fysisk hälsa' },
      'nurtured': { value: 4, source: 'social-services', notes: 'Stabil men viss föräldrastress' },
      'active': { value: 4, source: 'elementary-school', notes: 'Aktiv fritid' },
      'included': { value: 3, source: 'elementary-school', notes: 'Ibland ensam' },
      'responsible': { value: 4, source: 'elementary-school', notes: 'Tar ansvar' },
      'respected': { value: 4, source: 'elementary-school', notes: 'Känner sig lyssnad på' },
      'achieving': { value: 2, source: 'elementary-school', notes: 'Fortsatta läsutmaningar' }
    },
    riskFactors: ['rf-001', 'rf-003'],
    protectiveFactors: ['pf-001', 'pf-002', 'pf-003', 'pf-004', 'pf-005'],
    supportLevel: 'early-attention',
    sector: 'elementary-school'
  },
  {
    date: '2024-10-01',
    phase: 'elementary-school',
    age: 14,
    dimensions: {
      'safe': { value: 4, source: 'elementary-school', notes: 'Trivs i skolan, har kompisar' },
      'healthy': { value: 4, source: 'student-health', notes: 'God hälsa, normal BMI' },
      'nurtured': { value: 4, source: 'social-services', notes: 'Kontaktfamilj ger avlastning' },
      'active': { value: 4, source: 'elementary-school', notes: 'Fotboll 2 ggr/vecka' },
      'included': { value: 3, source: 'elementary-school', notes: 'Har några nära kompisar' },
      'responsible': { value: 4, source: 'elementary-school', notes: 'Tar ansvar för uppgifter' },
      'respected': { value: 4, source: 'elementary-school', notes: 'Lyssnad på av mentor' },
      'achieving': { value: 2, source: 'elementary-school', notes: 'Behöver stöd i läsning/svenska' }
    },
    riskFactors: ['rf-001', 'rf-002', 'rf-003', 'rf-004'],
    protectiveFactors: ['pf-001', 'pf-002', 'pf-003', 'pf-004', 'pf-005', 'pf-006'],
    supportLevel: 'enhanced-support',
    sector: 'elementary-school'
  },
  {
    date: '2025-11-01',
    phase: 'elementary-school',
    age: 15,
    dimensions: {
      'safe': { value: 4, source: 'elementary-school' },
      'healthy': { value: 4, source: 'student-health' },
      'nurtured': { value: 4, source: 'social-services' },
      'active': { value: 4, source: 'elementary-school' },
      'included': { value: 3, source: 'elementary-school' },
      'responsible': { value: 4, source: 'elementary-school' },
      'respected': { value: 4, source: 'elementary-school' },
      'achieving': { value: 2, source: 'elementary-school', notes: 'God progress med stöd' }
    },
    riskFactors: ['rf-001', 'rf-002', 'rf-003', 'rf-004'],
    protectiveFactors: ['pf-001', 'pf-002', 'pf-003', 'pf-004', 'pf-005', 'pf-006'],
    supportLevel: 'enhanced-support',
    sector: 'elementary-school'
  }
];

// Övergångar i Eriks liv
export const TRANSITIONS: Transition[] = [
  {
    id: 'trans-001',
    fromPhase: 'early-childhood',
    toPhase: 'preschool',
    fromSector: 'bvc',
    toSector: 'preschool',
    plannedDate: '2015-08-01',
    completedDate: '2015-09-01',
    status: 'completed',
    transitionMeeting: {
      date: '2015-06-15',
      participants: ['BVC-sköterska', 'Förskollärare', 'Föräldrar']
    },
    informationShared: true,
    followUpDate: '2015-12-01'
  },
  {
    id: 'trans-002',
    fromPhase: 'preschool',
    toPhase: 'elementary-school',
    fromSector: 'preschool',
    toSector: 'elementary-school',
    plannedDate: '2017-08-01',
    completedDate: '2017-08-15',
    status: 'completed',
    transitionMeeting: {
      date: '2017-05-20',
      participants: ['Förskollärare', 'Klasslärare åk 1', 'Föräldrar', 'Erik']
    },
    informationShared: true,
    followUpDate: '2017-11-01'
  },
  {
    id: 'trans-003',
    fromPhase: 'elementary-school',
    toPhase: 'high-school',
    fromSector: 'elementary-school',
    toSector: 'high-school',
    plannedDate: '2026-08-01',
    status: 'planned',
    transitionMeeting: {
      date: '2026-03-15',
      participants: ['Mentor grundskola', 'Studie- och yrkesvägledare', 'Föräldrar', 'Erik']
    },
    informationShared: false
  }
];

// Kvalitetsindikatorer - Gävlemodellen
export const QUALITY_INDICATORS: QualityIndicator[] = [
  {
    id: 'qi-001',
    type: 'process',
    name: 'Andel barn med uppdaterat välbefinnandehjul',
    description: 'Andel barn som har sitt välbefinnandehjul uppdaterat senaste 6 månader',
    target: 95,
    current: 87,
    unit: '%',
    trend: 'improving',
    lastUpdated: '2025-11-01',
    relatedPhases: ['early-childhood', 'preschool', 'elementary-school'],
    gavleModelPillar: 'mapping'
  },
  {
    id: 'qi-002',
    type: 'process',
    name: 'Tid från identifierad risk till insatt åtgärd',
    description: 'Genomsnittlig tid i dagar från att en riskfaktor identifieras till åtgärd sätts in',
    target: 14,
    current: 18,
    unit: 'dagar',
    trend: 'improving',
    lastUpdated: '2025-11-01',
    relatedPhases: ['preschool', 'elementary-school', 'high-school'],
    gavleModelPillar: 'collaboration'
  },
  {
    id: 'qi-003',
    type: 'result',
    name: 'Andel barn som övergår till lägre stödnivå',
    description: 'Andel barn som går från nivå 3-4 till nivå 1-2 stöd under läsåret',
    target: 30,
    current: 24,
    unit: '%',
    trend: 'stable',
    lastUpdated: '2025-11-01',
    relatedPhases: ['elementary-school', 'high-school'],
    gavleModelPillar: 'followup'
  },
  {
    id: 'qi-004',
    type: 'result',
    name: 'Skolnärvaro',
    description: 'Genomsnittlig skolnärvaro för barn med stödnivå 2-3',
    target: 90,
    current: 88,
    unit: '%',
    trend: 'improving',
    lastUpdated: '2025-11-01',
    relatedPhases: ['elementary-school', 'high-school'],
    gavleModelPillar: 'followup'
  },
  {
    id: 'qi-005',
    type: 'long-term',
    name: 'Gymnasieexamen',
    description: 'Andel ungdomar som fullföljer gymnasieutbildning inom 4 år',
    target: 85,
    current: 79,
    unit: '%',
    trend: 'improving',
    lastUpdated: '2025-11-01',
    relatedPhases: ['high-school', 'young-adult'],
    gavleModelPillar: 'development'
  },
  {
    id: 'qi-006',
    type: 'process',
    name: 'Samverkansmöten vid nivå 3-4',
    description: 'Genomsnittligt antal samverkansmöten per barn och år vid nivå 3-4 stöd',
    target: 3,
    current: 2.5,
    unit: 'antal',
    trend: 'stable',
    lastUpdated: '2025-11-01',
    relatedPhases: ['elementary-school', 'high-school'],
    gavleModelPillar: 'collaboration'
  }
];

// ==========================================
// MY WORLD TRIANGLE - GIRFEC/BBIC Integration
// ==========================================

export const MY_WORLD_ASSESSMENTS: MyWorldTriangleAssessment[] = [
  {
    dimension: 'how-i-develop',
    aspects: [
      {
        id: 'dev-001',
        name: 'Lärande och utveckling',
        description: 'Kognitiv utveckling, skolprestationer och inlärningsförmåga',
        rating: 3,
        shanarriLinks: ['achieving'],
        bbicCode: 'Utveckling: Utbildning',
        icfCodes: ['d1', 'd166', 'd145'],
        concerns: [
          'Läs- och skrivsvårigheter (dyslexi)',
          'Behöver extra stöd i svenska och engelska'
        ],
        strengths: [
          'Stark motivation att lära sig',
          'Goda matematiska kunskaper',
          'Hjälpsam mot andra i grupp'
        ]
      },
      {
        id: 'dev-002',
        name: 'Sociala relationer och kommunikation',
        description: 'Förmåga att bygga och upprätthålla vänskap och kommunicera',
        rating: 4,
        shanarriLinks: ['included', 'respected'],
        bbicCode: 'Utveckling: Emotionell & beteendemässig',
        icfCodes: ['d710', 'd720', 'd750'],
        concerns: [
          'Blev mobbad i åk 6-7 (nu löst)',
          'Kan ibland bli överstimulerad i stora grupper (ADHD)'
        ],
        strengths: [
          'Har nära vänner',
          'Kan söka stöd från vuxna vid behov',
          'Empatisk och omtänksam'
        ]
      },
      {
        id: 'dev-003',
        name: 'Fysisk hälsa och motorik',
        description: 'Fysisk utveckling, hälsa och välbefinnande',
        rating: 4,
        shanarriLinks: ['healthy', 'active'],
        bbicCode: 'Utveckling: Hälsa',
        icfCodes: ['b530', 'd410', 'd450'],
        concerns: [],
        strengths: [
          'Spelar fotboll 2x/vecka',
          'God fysisk hälsa',
          'Normal motorisk utveckling'
        ]
      }
    ],
    overallRating: 4,
    lastAssessed: '2024-11-15',
    assessedBy: 'elementary-school'
  },
  {
    dimension: 'what-i-need',
    aspects: [
      {
        id: 'need-001',
        name: 'Grundläggande omsorg',
        description: 'Mat, kläder, boende och fysisk omvårdnad',
        rating: 4,
        shanarriLinks: ['nurtured', 'safe'],
        bbicCode: 'Föräldraförmåga: Grundläggande omsorg',
        icfCodes: ['e310', 'e355'],
        concerns: [],
        strengths: [
          'Stabilt hem',
          'God mat och hygien',
          'Ordentliga kläder'
        ]
      },
      {
        id: 'need-002',
        name: 'Emotionell värme och trygghet',
        description: 'Känslomässig anknytning och stöd från vårdnadshavare',
        rating: 3,
        shanarriLinks: ['nurtured', 'safe', 'respected'],
        bbicCode: 'Föräldraförmåga: Emotionell värme',
        icfCodes: ['e310', 'd760'],
        concerns: [
          'Föräldrastress - pappa arbetar mycket',
          'Mamma har tidvis haft ångestproblematik',
          'Erik känner sig ibland mindre uppmärksammad'
        ],
        strengths: [
          'Föräldrar är engagerade i Eriks skolgång',
          'Mamma har sökt egen hjälp för ångest (BUP)',
          'Kontaktfamilj har minskat stressen i familjen'
        ]
      },
      {
        id: 'need-003',
        name: 'Stimulans och vägledning',
        description: 'Stöd för lärande, utveckling och goda beslut',
        rating: 4,
        shanarriLinks: ['achieving', 'responsible'],
        bbicCode: 'Föräldraförmåga: Stimulans',
        icfCodes: ['e310', 'd8'],
        concerns: [],
        strengths: [
          'Föräldrar stöttar läxläsning',
          'Positiva förebilder',
          'Uppmuntrar fotbollsspelande'
        ]
      }
    ],
    overallRating: 4,
    lastAssessed: '2024-10-20',
    assessedBy: 'social-services'
  },
  {
    dimension: 'my-wider-world',
    aspects: [
      {
        id: 'world-001',
        name: 'Skolmiljö',
        description: 'Skolan som arena för lärande och utveckling',
        rating: 4,
        shanarriLinks: ['safe', 'achieving', 'included'],
        bbicCode: 'Familj & Miljö: Utbildning',
        icfCodes: ['e585'],
        concerns: [
          'Tidigare mobbning (åk 6-7) nu åtgärdad'
        ],
        strengths: [
          'Bra relation till mentor',
          'Trivs i klassen nu',
          'Speciallärare ger anpassat stöd'
        ]
      },
      {
        id: 'world-002',
        name: 'Socialt nätverk och fritid',
        description: 'Vänner, fritidsaktiviteter och samhällelig tillhörighet',
        rating: 4,
        shanarriLinks: ['active', 'included', 'responsible'],
        bbicCode: 'Familj & Miljö: Sociala relationer',
        icfCodes: ['e325', 'd920'],
        concerns: [],
        strengths: [
          'Spelar fotboll på IFK Gävle',
          'Nära vänner i klassen och laget',
          'Deltar i fritidsgårdens aktiviteter'
        ]
      },
      {
        id: 'world-003',
        name: 'Boendemiljö och samhälle',
        description: 'Hemområde, grannskap och samhällsresurser',
        rating: 4,
        shanarriLinks: ['safe'],
        bbicCode: 'Familj & Miljö: Bostadsförhållanden',
        icfCodes: ['e210', 'e360'],
        concerns: [],
        strengths: [
          'Bor i lugnt villaområde',
          'Nära till skola och fritidsaktiviteter',
          'Tillgång till bibliotek, simhall, m.m.'
        ]
      }
    ],
    overallRating: 4,
    lastAssessed: '2024-11-01',
    assessedBy: 'student-health'
  }
];

// ==========================================
// RESILIENCE MATRIX - GIRFEC
// ==========================================

export const ADVERSITY_FACTORS: AdversityFactor[] = [
  {
    id: 'adv-001',
    name: 'Tidigare mobbning',
    description: 'Blev mobbad under åk 6-7 med negativ påverkan på självkänsla och skolnärvaro',
    severity: 'medium',
    duration: 'chronic',
    impact: ['Självkänsla', 'Skolnärvaro', 'Social tillhörighet'],
    identifiedDate: '2022-09-01',
    status: 'resolved'
  },
  {
    id: 'adv-002',
    name: 'Föräldrastress',
    description: 'Hög belastning på föräldrarna med påverkan på familjerelationer',
    severity: 'medium',
    duration: 'chronic',
    impact: ['Familjerelationer', 'Emotionell trygghet'],
    identifiedDate: '2023-03-15',
    status: 'monitoring'
  }
];

export const VULNERABILITY_FACTORS: VulnerabilityFactor[] = [
  {
    id: 'vuln-001',
    name: 'ADHD-diagnos',
    description: 'Neuropsykiatrisk funktionsnedsättning som påverkar koncentration och impulsivitet',
    type: 'individual',
    level: 'medium',
    relatedAdversities: ['adv-001'],
    mitigationStrategies: [
      'Medicin (Concerta)',
      'Anpassningar i skolan',
      'Strukturerat stöd i hemmet'
    ]
  },
  {
    id: 'vuln-002',
    name: 'Dyslexi',
    description: 'Specifik läs- och skrivsvårighet',
    type: 'individual',
    level: 'medium',
    relatedAdversities: [],
    mitigationStrategies: [
      'Speciallärare',
      'Inlästa läromedel (Legimus)',
      'Extra tid på prov'
    ]
  },
  {
    id: 'vuln-003',
    name: 'Mammas ångest',
    description: 'Periodisk ångestproblematik hos mamma som kan påverka familjedynamiken',
    type: 'family',
    level: 'low',
    relatedAdversities: ['adv-002'],
    mitigationStrategies: [
      'Mamma i egen behandling',
      'Kontaktfamilj för avlastning',
      'Stöd från partner'
    ]
  }
];

export const PROTECTIVE_ENVIRONMENT_FACTORS: ProtectiveEnvironmentFactor[] = [
  {
    id: 'prot-env-001',
    name: 'Stödjande skolmiljö',
    description: 'Mentor och speciallärare ger anpassat stöd och uppmuntran',
    type: 'community',
    strength: 'strong',
    sustainabilityRisk: 'low',
    relatedDimensions: ['achieving', 'included', 'respected']
  },
  {
    id: 'prot-env-002',
    name: 'Fotbollslag',
    description: 'Delaktighet i fotbollslag ger tillhörighet, aktivitet och socialt nätverk',
    type: 'community',
    strength: 'strong',
    sustainabilityRisk: 'low',
    relatedDimensions: ['active', 'included', 'responsible']
  },
  {
    id: 'prot-env-003',
    name: 'Engagerade föräldrar',
    description: 'Föräldrar som aktivt stöttar Eriks utveckling trots stress',
    type: 'family',
    strength: 'strong',
    sustainabilityRisk: 'low',
    relatedDimensions: ['nurtured', 'safe', 'achieving']
  },
  {
    id: 'prot-env-004',
    name: 'Kontaktfamilj',
    description: 'Avlastning och extra stöd genom kontaktfamilj',
    type: 'community',
    strength: 'moderate',
    sustainabilityRisk: 'medium',
    relatedDimensions: ['nurtured', 'active', 'included']
  }
];

export const RESILIENCE_MATRIX: ResilienceMatrix = {
  adversity: ADVERSITY_FACTORS,
  vulnerability: VULNERABILITY_FACTORS,
  protectiveEnvironment: PROTECTIVE_ENVIRONMENT_FACTORS,
  resilienceScore: 7.5,
  lastUpdated: '2024-11-20'
};

// ==========================================
// ÅRSHJUL - SYSTEMATISKT KVALITETSARBETE
// ==========================================

export const ANNUAL_QUALITY_WHEEL_2024: AnnualQualityWheel = {
  year: 2024,
  phases: [
    {
      id: 'phase-q1-2024',
      phase: 'mapping',
      period: 'Januari - Mars 2024',
      startDate: '2024-01-01',
      endDate: '2024-03-31',
      status: 'completed',
      activities: [
        {
          id: 'act-001',
          name: 'Kartlägga barn i behov av stöd nivå 2-4',
          description: 'Systematisk genomgång av alla barn i grundskolan för att identifiera stödnivåer',
          dueDate: '2024-02-28',
          completedDate: '2024-02-25',
          status: 'completed',
          responsiblePerson: 'Elevhälsochef',
          gavlePillar: 'mapping',
          legalFramework: ['SkolL', 'SoL'],
          deliverables: ['Kartläggningsrapport Q1', 'Översikt stödnivåer per skola']
        },
        {
          id: 'act-002',
          name: 'Identifiera risk- och skyddsfaktorer',
          description: 'Dokumentera risk- och skyddsfaktorer enligt GIRFEC-modellen',
          dueDate: '2024-03-15',
          completedDate: '2024-03-10',
          status: 'completed',
          gavlePillar: 'mapping',
          legalFramework: ['Barnkonventionen'],
          deliverables: ['RSF-databas uppdaterad']
        }
      ],
      milestones: [
        {
          id: 'milestone-001',
          name: 'Kartläggning slutförd',
          date: '2024-03-31',
          achieved: true,
          achievedDate: '2024-03-25',
          criteria: ['100% av barn kartlagda', 'RSF dokumenterade'],
          indicators: ['qi-001']
        }
      ],
      progress: 100,
      responsibleSector: 'elementary-school',
      participants: ['elementary-school', 'student-health', 'social-services']
    },
    {
      id: 'phase-q2-2024',
      phase: 'analysis',
      period: 'April - Juni 2024',
      startDate: '2024-04-01',
      endDate: '2024-06-30',
      status: 'completed',
      activities: [
        {
          id: 'act-003',
          name: 'Analys av kartläggningsdata',
          description: 'Tematisk analys av identifierade behov och gap i stödinsatser',
          dueDate: '2024-05-15',
          completedDate: '2024-05-12',
          status: 'completed',
          gavlePillar: 'followup',
          legalFramework: ['SoL', 'HSL'],
          deliverables: ['Analysrapport Q2', 'Rekommendationer för insatser']
        },
        {
          id: 'act-004',
          name: 'Planering av samverkansinsatser',
          description: 'Utveckla samverkansplaner för barn med nivå 3-4 stöd',
          dueDate: '2024-06-20',
          completedDate: '2024-06-18',
          status: 'completed',
          gavlePillar: 'collaboration',
          legalFramework: ['SoL'],
          deliverables: ['Samverkansplaner för 15 barn']
        }
      ],
      milestones: [
        {
          id: 'milestone-002',
          name: 'Analysrapport färdig',
          date: '2024-06-30',
          achieved: true,
          achievedDate: '2024-06-28',
          criteria: ['Tematisk analys klar', 'Insatsplaner upprättade'],
          indicators: ['qi-002', 'qi-003']
        }
      ],
      progress: 100,
      responsibleSector: 'social-services',
      participants: ['elementary-school', 'student-health', 'social-services', 'bup']
    },
    {
      id: 'phase-q3-2024',
      phase: 'implementation',
      period: 'Juli - September 2024',
      startDate: '2024-07-01',
      endDate: '2024-09-30',
      status: 'completed',
      activities: [
        {
          id: 'act-005',
          name: 'Implementera SIP för barn på nivå 4',
          description: 'Samordnad individuell plan enligt socialtjänstlagen',
          dueDate: '2024-08-31',
          completedDate: '2024-08-28',
          status: 'completed',
          gavlePillar: 'collaboration',
          legalFramework: ['SoL', 'HSL'],
          deliverables: ['SIP för 8 barn']
        },
        {
          id: 'act-006',
          name: 'Starta förebyggande gruppinsatser',
          description: 'Strukturerade gruppinsatser för barn på nivå 2-3',
          dueDate: '2024-09-15',
          completedDate: '2024-09-10',
          status: 'completed',
          gavlePillar: 'development',
          legalFramework: ['SkolL'],
          deliverables: ['3 gruppverksamheter startade']
        }
      ],
      milestones: [
        {
          id: 'milestone-003',
          name: 'Insatser implementerade',
          date: '2024-09-30',
          achieved: true,
          achievedDate: '2024-09-28',
          criteria: ['SIP upprättade', 'Gruppinsatser igång'],
          indicators: ['qi-004', 'qi-005']
        }
      ],
      progress: 100,
      responsibleSector: 'social-services',
      participants: ['elementary-school', 'student-health', 'social-services', 'bup', 'youth-center']
    },
    {
      id: 'phase-q4-2024',
      phase: 'follow-up',
      period: 'Oktober - December 2024',
      startDate: '2024-10-01',
      endDate: '2024-12-31',
      status: 'in-progress',
      activities: [
        {
          id: 'act-007',
          name: 'Uppföljning av insatser',
          description: 'Utvärdering av effekter av införda insatser',
          dueDate: '2024-11-30',
          completedDate: '2024-11-28',
          status: 'completed',
          gavlePillar: 'followup',
          legalFramework: ['SoL', 'HSL', 'SkolL'],
          deliverables: ['Uppföljningsrapport Q4']
        },
        {
          id: 'act-008',
          name: 'Systematiskt kvalitetsarbete - årlig rapport',
          description: 'Sammanställning enligt SoL och HSL krav på kvalitetsarbete',
          dueDate: '2024-12-20',
          status: 'in-progress',
          gavlePillar: 'followup',
          legalFramework: ['SoL', 'HSL'],
          deliverables: ['Kvalitetsrapport 2024']
        }
      ],
      milestones: [
        {
          id: 'milestone-004',
          name: 'Kvalitetsrapport färdig',
          date: '2024-12-31',
          achieved: false,
          criteria: ['Uppföljning klar', 'Rapport skriven'],
          indicators: ['qi-001', 'qi-002', 'qi-003', 'qi-004', 'qi-005', 'qi-006']
        }
      ],
      progress: 75,
      responsibleSector: 'social-services',
      participants: ['elementary-school', 'student-health', 'social-services', 'bup', 'healthcare']
    }
  ],
  gavleModelPillars: [
    {
      pillar: 'mapping',
      name: 'Kartläggning',
      description: 'Systematisk kartläggning av barn och ungas behov',
      activities: ['act-001', 'act-002'],
      indicators: ['qi-001'],
      progress: 100,
      status: 'on-track'
    },
    {
      pillar: 'collaboration',
      name: 'Samverkan',
      description: 'Tvärsektoriell samverkan kring barn och unga',
      activities: ['act-004', 'act-005'],
      indicators: ['qi-003', 'qi-004'],
      progress: 100,
      status: 'on-track'
    },
    {
      pillar: 'followup',
      name: 'Uppföljning',
      description: 'Systematisk uppföljning av insatser och effekter',
      activities: ['act-003', 'act-007', 'act-008'],
      indicators: ['qi-002', 'qi-005', 'qi-006'],
      progress: 85,
      status: 'on-track'
    },
    {
      pillar: 'development',
      name: 'Utveckling',
      description: 'Evidensbaserad utveckling av metoder och insatser',
      activities: ['act-006'],
      indicators: ['qi-006'],
      progress: 100,
      status: 'on-track'
    }
  ],
  legalRequirements: [
    {
      id: 'legal-001',
      framework: 'SoL',
      requirement: 'Systematiskt kvalitetsarbete enligt SoL',
      description: 'Kommunen ska systematiskt och fortlöpande utveckla och säkra kvaliteten i socialtjänstens verksamhet',
      frequency: 'annual',
      relatedActivities: ['act-001', 'act-003', 'act-008'],
      complianceStatus: 'compliant',
      lastAssessment: '2024-11-15',
      responsibleSector: 'social-services'
    },
    {
      id: 'legal-002',
      framework: 'HSL',
      requirement: 'Systematiskt kvalitetsarbete enligt HSL',
      description: 'Vårdgivaren ska säkerställa att hälso- och sjukvården är av god kvalitet och bedrivs i enlighet med vetenskap och beprövad erfarenhet',
      frequency: 'annual',
      relatedActivities: ['act-007', 'act-008'],
      complianceStatus: 'compliant',
      lastAssessment: '2024-11-01',
      responsibleSector: 'healthcare'
    },
    {
      id: 'legal-003',
      framework: 'SkolL',
      requirement: 'Elevhälsa enligt skollagen',
      description: 'Elevhälsan ska omfatta medicinska, psykologiska, psykosociala och specialpedagogiska insatser',
      frequency: 'ongoing',
      relatedActivities: ['act-001', 'act-006'],
      complianceStatus: 'compliant',
      lastAssessment: '2024-10-15',
      responsibleSector: 'student-health'
    },
    {
      id: 'legal-004',
      framework: 'Barnkonventionen',
      requirement: 'Barnets bästa i främsta rummet (Artikel 3)',
      description: 'Vid alla åtgärder som rör barn ska barnets bästa komma i främsta rummet',
      frequency: 'ongoing',
      relatedActivities: ['act-001', 'act-002', 'act-003', 'act-004', 'act-005', 'act-006', 'act-007'],
      complianceStatus: 'compliant',
      lastAssessment: '2024-11-20',
      responsibleSector: 'social-services'
    }
  ],
  overallProgress: 90,
  responsibleSectors: ['social-services', 'elementary-school', 'student-health', 'healthcare']
};

// Aktörsprofiler - Vilka sektorer som ser vad
export const ACTOR_PROFILES: ActorProfile[] = [
  {
    sector: 'elementary-school',
    name: 'Lisa Svensson',
    organization: 'Stigslundsskolan',
    contact: 'lisa.svensson@gavle.se',
    role: 'Mentor & Klasslärare',
    accessLevel: 'extended',
    canViewDimensions: ['safe', 'healthy', 'achieving', 'active', 'included', 'responsible', 'respected', 'nurtured'],
    canEditDimensions: ['safe', 'achieving', 'active', 'included', 'responsible', 'respected'],
    activePhases: ['elementary-school']
  },
  {
    sector: 'social-services',
    name: 'Karin Larsson',
    organization: 'Gävle Kommun - Socialtjänst',
    contact: 'karin.larsson@gavle.se',
    role: 'Socialsekreterare',
    accessLevel: 'full',
    canViewDimensions: ['safe', 'healthy', 'achieving', 'active', 'included', 'responsible', 'respected', 'nurtured'],
    canEditDimensions: ['safe', 'nurtured', 'included'],
    activePhases: ['early-childhood', 'preschool', 'elementary-school', 'high-school', 'young-adult']
  },
  {
    sector: 'student-health',
    name: 'Emma Karlsson',
    organization: 'Elevhälsan Stigslundsskolan',
    contact: 'emma.karlsson@gavle.se',
    role: 'Skolsköterska',
    accessLevel: 'extended',
    canViewDimensions: ['safe', 'healthy', 'achieving', 'active', 'included', 'responsible', 'respected'],
    canEditDimensions: ['healthy'],
    activePhases: ['elementary-school', 'high-school']
  },
  {
    sector: 'bup',
    name: 'Dr. Anders Läkare',
    organization: 'BUP Gävleborg',
    contact: 'anders.lakare@regiongavleborg.se',
    role: 'Barnläkare',
    accessLevel: 'standard',
    canViewDimensions: ['healthy', 'achieving', 'responsible'],
    canEditDimensions: ['healthy'],
    activePhases: ['early-childhood', 'preschool', 'elementary-school', 'high-school']
  },
  {
    sector: 'bvc',
    name: 'Maria Johansson',
    organization: 'BVC Gävle',
    contact: 'maria.johansson@regiongavleborg.se',
    role: 'BVC-sköterska',
    accessLevel: 'standard',
    canViewDimensions: ['safe', 'healthy', 'nurtured', 'active'],
    canEditDimensions: ['healthy', 'nurtured'],
    activePhases: ['early-childhood']
  }
];

// Utökad barnprofil med livsloppsperspektiv
export const ENHANCED_CHILD_PROFILE: EnhancedChildProfile = {
  ...CHILD_PROFILE,
  currentPhase: 'elementary-school',
  supportLevel: 'enhanced-support',
  primarySector: 'elementary-school',
  secondarySectors: ['student-health', 'social-services', 'bup'],
  riskFactors: RISK_FACTORS,
  protectiveFactors: PROTECTIVE_FACTORS,
  transitions: TRANSITIONS,
  longitudinalData: LONGITUDINAL_DATA,
  activeTriggers: [
    {
      id: 'trigger-001',
      triggeredDate: '2024-09-01',
      fromLevel: 'early-attention',
      toLevel: 'enhanced-support',
      reason: 'Flera riskfaktorer identifierade, behov av samordnad plan och tvärsektoriell samverkan',
      triggerCriteria: [
        'Achieving-dimension på nivå 2 sedan >6 månader',
        'Included-dimension sjunkit från 4 till 3',
        'ADHD-diagnos (ny riskfaktor)',
        'Föräldrastress identifierad'
      ],
      riskFactors: ['rf-001', 'rf-002', 'rf-003', 'rf-004'],
      dimensions: ['achieving', 'included'],
      actionPlan: 'Samordnad plan upprättad med skola, BUP och socialtjänst. Kontaktfamilj insatt för avlastning.',
      responsibleSector: 'social-services',
      status: 'active'
    }
  ],
  myWorldAssessments: MY_WORLD_ASSESSMENTS,
  resilienceMatrix: RESILIENCE_MATRIX
};
