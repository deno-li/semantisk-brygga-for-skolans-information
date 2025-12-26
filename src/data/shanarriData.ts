import { ShanarriIndicator, BBICTriangleArea } from '../types/types';

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

