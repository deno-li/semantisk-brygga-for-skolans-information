
import { ShanarriIndicator, ChildProfile, TimelineEvent, QualityPhase, TrendData, JournalData, NewsItem, DocumentSection } from './types';

export const CHILD_PROFILE: ChildProfile = {
  name: "Erik Andersson",
  ssn: "20100315-1234",
  age: 15,
  school: "Stigslundsskolan",
  grade: "Åk 9",
  sipActive: true
};

// MAPPINGS EXPLANATION:
// ICF: International Classification of Functioning (d = activities, b = body functions, e = environment)
// KSI: Kommunernas Socialtjänsts Informationssystem (Reporting codes)
// KVÅ: Klassifikation av vårdåtgärder (Healthcare procedures)
// BBIC: Barns Behov i Centrum (Social work framework domains)

export const SHANARRI_DATA: ShanarriIndicator[] = [
  { 
    id: 'safe', 
    name: 'TRYGGHET', 
    nameEn: 'Safe', 
    color: '#005595', 
    status: 4, 
    target: 4, 
    // ICF d7: Interaktioner. e3: Stöd och relationer.
    icf: 'd710 (Grundläggande interaktion), e310 (Närstående)', 
    // KSI: 000 (Ej insats) eller specifika insatser. Här mappat mot utredningskod.
    ksi: 'Utredning enl. SoL 11:1', 
    bbic: 'Trygghet & Säkerhet (Familj & Miljö)',
    ibic: 'Känsla av trygghet',
    // KVÅ: GD001 = Stödsamtal, UX001 = Nätverkskarta
    kva: 'GD001 (Stödsamtal)',
    snomed: '371609003 (Känsla av trygghet)',
    source: 'Trygghetsenkät', 
    notes: 'Trivs i skolan, har kompisar.' 
  },
  { 
    id: 'nurtured', 
    name: 'OMSORG', 
    nameEn: 'Nurtured', 
    color: '#B00020', 
    status: 4, 
    target: 4, 
    // ICF e310: Familj, e315: Utvidgad familj/omsorgsgivare
    icf: 'e310 (Närstående), d760 (Familjerelationer)', 
    // KSI: Insatskod för familjebehandling eller kontaktperson (ex 421)
    ksi: 'Insats öppna former (4.1)', 
    bbic: 'Föräldrarnas förmåga (Grundläggande omsorg)',
    ibic: 'Personlig omvårdnad',
    // KVÅ: XS005 = Social utredning inom hälso- och sjukvård
    kva: 'XS005 (Social utredning)',
    snomed: '105455006 (Omsorgsstatus)',
    source: 'Hembesök', 
    notes: 'Stabil familjesituation.' 
  },
  { 
    id: 'healthy', 
    name: 'MÅ BRA', 
    nameEn: 'Healthy', 
    color: '#378056', 
    status: 4, 
    target: 4, 
    // ICF b-koder: Kroppsfunktioner. b152: Emotionella funktioner.
    icf: 'b152 (Emotionella funktioner), b530 (Vikt/Nutr)', 
    ksi: 'Ej tillämplig (Hälso- och sjukvård)', 
    bbic: 'Hälsa (Barnets behov)',
    ibic: 'Fysiskt välbefinnande',
    // KVÅ: AU120 = Hälsobesök (skolsköterska), GB001 = Psykiatrisk bedömning
    kva: 'AU120 (Hälsobesök EMI)',
    snomed: '271919001 (God hälsa)',
    source: 'Hälsosamtal EMI', 
    notes: 'God hälsa, normal BMI.' 
  },
  { 
    id: 'active', 
    name: 'FRITID', 
    nameEn: 'Active', 
    color: '#E87C00', 
    status: 4, 
    target: 4, 
    // ICF d920: Rekreation och fritid
    icf: 'd920 (Rekreation), d450 (Gå/Röra sig)', 
    ksi: 'Bistånd kontaktperson (SoL 4:1)', 
    bbic: 'Fritid (Barnets behov)',
    ibic: 'Rekreation och fritid',
    // KVÅ: QV001 = Rådgivning fysisk aktivitet
    kva: 'QV001 (Råd om fys. aktivitet)',
    snomed: '256235009 (Fritidsaktivitet)',
    source: 'Samtal', 
    notes: 'Spelar fotboll 2 ggr/vecka.' 
  },
  { 
    id: 'included', 
    name: 'TILLHÖRIGHET', 
    nameEn: 'Included', 
    color: '#6A2A5B', 
    status: 3, 
    target: 4, 
    // ICF d750: Informella sociala relationer
    icf: 'd750 (Informella relationer)', 
    ksi: 'Gemensamma resurser', 
    bbic: 'Sociala relationer (Barnets behov)',
    ibic: 'Socialt liv',
    kva: 'UX001 (Upprätta nätverkskarta)',
    snomed: '86603000 (Social delaktighet)',
    source: 'Trygghetsenkät', 
    notes: 'Har några nära kompisar, men ibland ensam.' 
  },
  { 
    id: 'responsible', 
    name: 'ANSVAR', 
    nameEn: 'Responsible', 
    color: '#00838F', 
    status: 4, 
    target: 4, 
    // ICF d2: Allmänna uppgifter och krav. d240: Hantera stress.
    icf: 'd240 (Hantera stress), d230 (Genomföra daglig rutin)', 
    ksi: 'Daglig verksamhet (LSS) - Ej aktuell', 
    bbic: 'Beteende & Känslor (Barnets behov)',
    ibic: 'Personligt ansvar',
    kva: '-',
    snomed: '288600008 (Förmåga att ta ansvar)',
    source: 'Lärarbedömning', 
    notes: 'Tar ansvar för uppgifter.' 
  },
  { 
    id: 'respected', 
    name: 'RESPEKTERAS', 
    nameEn: 'Respected', 
    color: '#6D8F13', 
    status: 4, 
    target: 4, 
    // ICF d7104: Respekt och värme i relationer
    icf: 'd710 (Interaktioner), d940 (Mänskliga rättigheter)', 
    ksi: '-', 
    bbic: 'Identitet (Barnets behov)',
    ibic: 'Inflytande och självbestämmande',
    kva: 'GD005 (Stödsamtal)',
    snomed: '125678000 (Självkänsla)',
    source: 'Samtal', 
    notes: 'Känner sig lyssnad på av mentor.' 
  },
  { 
    id: 'achieving', 
    name: 'UTVECKLAS', 
    nameEn: 'Achieving', 
    color: '#C12143', 
    status: 2, 
    target: 4, 
    // ICF d1: Lärande och kunskap. d166: Läsa. d160: Uppmärksamhet.
    icf: 'd166 (Läsa), d160 (Uppmärksamhet)', 
    ksi: 'Stöd i skolan (Skollagen)', 
    bbic: 'Utbildning & Arbete (Barnets behov)',
    ibic: 'Lärande och tillämpning av kunskap',
    // KVÅ: DU011 = Logopedutredning, DU002 = Testning psykolog
    kva: 'DU011 (Logopedutredning)',
    icd: 'F81.0 (Specifik lässvårighet)',
    snomed: '224497003 (Skolprestation)',
    source: 'Åtgärdsprogram', 
    notes: 'Behöver stöd i läsning/svenska.' 
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
    Kontext: "Ordinarie BVC-program följt. Nu aktuell via Skolhälsovården (EMI) och BUP Gävleborg. Audit ifylld UA."
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
