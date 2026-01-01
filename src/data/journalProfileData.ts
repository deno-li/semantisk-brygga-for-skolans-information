/**
 * Profile-specific journal data for each child
 * Each profile has domain-specific journal entries
 */

import { JournalData } from '../types/types';

// Erik's journal data (default/existing)
export const ERIK_JOURNAL_DATA: JournalData = {
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

// Lisa's journal data (12 år, åk 6, stödprofil - social oro)
export const LISA_JOURNAL_DATA: JournalData = {
  "Skola": {
    unit: "Elevhälsoteamet, Vallbacksskolan",
    contact: "Maria Eriksson (Mentor)",
    lastUpdated: "2025-12-01",
    Delaktighet: "Lisa deltar i klassaktiviteter men undviker grupparbeten. Har en nära väninna som hon umgås med på raster. Behöver stöd för att delta i större sociala sammanhang.",
    Funktion: "God kognitiv förmåga. Inga inlärningssvårigheter identifierade. Social oro som påverkar koncentrationen, särskilt vid muntliga presentationer.",
    Insats: "Extra anpassningar: Möjlighet till skriftliga redovisningar istället för muntliga. Tillgång till lugnt rum vid behov. Social färdighetsträning i liten grupp 1 gång/vecka.",
    Kontext: "Klass 6B. Lisa trivs bra med sin mentor men upplever grupparbeten som stressande. Frånvaron har ökat något under hösten."
  },
  "Socialtjänst": {
    unit: "Familjeenheten",
    contact: "Ej aktuell",
    lastUpdated: "-",
    Delaktighet: "Familjen ej aktuell hos socialtjänsten.",
    Funktion: "-",
    Insats: "-",
    Kontext: "-"
  },
  "Hälso- och sjukvård": {
    unit: "Elevhälsan, Vallbacksskolan",
    contact: "Sara Nilsson (Skolkurator)",
    lastUpdated: "2025-11-20",
    Delaktighet: "Lisa deltar aktivt i kuratorssamtal. Kan sätta ord på sina känslor och upplevelser.",
    Funktion: "Sömnsvårigheter kopplat till oro. Ingen somatisk ohälsa identifierad.",
    Insats: "Stödsamtal varannan vecka med skolkurator. Avslappningsövningar och sömnhygien genomgått.",
    Kontext: "Uppföljning pågår inom elevhälsan. Eventuell remiss till BUP övervägs om oron inte minskar."
  },
  "Omsorg": {
    unit: "Ej aktuellt",
    contact: "-",
    lastUpdated: "-",
    Delaktighet: "-",
    Funktion: "-",
    Insats: "-",
    Kontext: "-"
  },
  "Barn och vårdnadshavare": {
    unit: "Vårdnadshavare",
    contact: "Eva Johansson (Mamma)",
    lastUpdated: "2025-11-28",
    Delaktighet: "Föräldrarna är engagerade och deltar aktivt i skolans arbete. Öppna för dialog.",
    Funktion: "Lisa säger: 'Jag vill vara som alla andra men jag blir så nervös när alla tittar på mig'.",
    Insats: "Hemmet arbetar med rutiner för sömn. Föräldrar får stöd via familjerådgivning.",
    Kontext: "Stabil hemmiljö. Föräldrar separerade men har fungerande samarbete kring Lisa."
  }
};

// Elsa's journal data (10 år, åk 4, stödprofil - dyslexi)
export const ELSA_JOURNAL_DATA: JournalData = {
  "Skola": {
    unit: "Elevhälsoteamet, Centralskolan",
    contact: "Karin Björk (Mentor)",
    lastUpdated: "2025-11-25",
    Delaktighet: "Elsa är social och omtyckt i klassen. Deltar aktivt när material är anpassat. Hjälper gärna andra elever.",
    Funktion: "Dyslexi diagnostiserad. Svårigheter med avkodning och stavning. God muntlig förmåga och kreativitet. Stark i matematik när uppgifterna läses upp.",
    Insats: "Åtgärdsprogram aktivt. Talsyntes och inlästa läromedel (Legimus). Speciallärare 3x30 min/vecka. Bildstöd i alla ämnen.",
    Kontext: "Klass 4C. Elsa trivs i skolan när hon får rätt hjälpmedel. Viss frustration när hon jämför sig med klasskamrater i läsning."
  },
  "Socialtjänst": {
    unit: "Ej aktuell",
    contact: "-",
    lastUpdated: "-",
    Delaktighet: "-",
    Funktion: "-",
    Insats: "-",
    Kontext: "-"
  },
  "Hälso- och sjukvård": {
    unit: "Logopedmottagningen / Elevhälsan",
    contact: "Emma Strand (Logoped)",
    lastUpdated: "2025-10-15",
    Delaktighet: "Elsa samarbetar bra vid logopedkontakt. Motiverad att lära sig strategier.",
    Funktion: "Dyslexi F81.0. God hörsel och syn. Inga andra funktionsnedsättningar.",
    Insats: "Strukturerad läsinlärning pågår. Uppföljning med logoped 1 gång/månad.",
    Kontext: "Utredning genomförd våren 2025. Regelbunden uppföljning inom elevhälsan."
  },
  "Omsorg": {
    unit: "Ej aktuellt",
    contact: "-",
    lastUpdated: "-",
    Delaktighet: "-",
    Funktion: "-",
    Insats: "-",
    Kontext: "-"
  },
  "Barn och vårdnadshavare": {
    unit: "Vårdnadshavare",
    contact: "Anna och Peter Bergström",
    lastUpdated: "2025-11-22",
    Delaktighet: "Föräldrarna mycket engagerade. Läser högt hemma varje kväll. Deltar i alla möten.",
    Funktion: "Elsa säger: 'Jag förstår allt, jag ser bara bokstäverna annorlunda'.",
    Insats: "Föräldrarna använder ljudböcker hemma. Har gått kurs i dyslexistöd.",
    Kontext: "Mycket stöttande hemmiljö. Elsa har en äldre bror utan liknande svårigheter."
  }
};

// Omar's journal data (11 år, åk 5, universell med tidig uppmärksamhet - språksvårigheter)
export const OMAR_JOURNAL_DATA: JournalData = {
  "Skola": {
    unit: "Elevhälsoteamet, Nygårdsskolan",
    contact: "Anders Holm (Mentor)",
    lastUpdated: "2025-12-01",
    Delaktighet: "Omar är social och har flera kompisar. Deltar i fotboll på rasterna. Motiverad och ambitiös trots språkliga utmaningar.",
    Funktion: "God kognitiv förmåga. Språksvårigheter i svenska som påverkar läsförståelse och skriftliga arbeten. Stark i matematik och naturvetenskapliga ämnen.",
    Insats: "Svenska som andraspråk 3x/vecka. Studiehandledning på arabiska. Bildstöd i klassrummet.",
    Kontext: "Klass 5A. Omar kom till Sverige för 2 år sedan. Utvecklas snabbt men behöver fortsatt språkstöd."
  },
  "Socialtjänst": {
    unit: "Ej aktuell",
    contact: "-",
    lastUpdated: "-",
    Delaktighet: "-",
    Funktion: "-",
    Insats: "-",
    Kontext: "-"
  },
  "Hälso- och sjukvård": {
    unit: "Elevhälsan",
    contact: "Linda Persson (Skolsköterska)",
    lastUpdated: "2025-09-15",
    Delaktighet: "Omar genomgår regelbundna hälsosamtal. Inga problem identifierade.",
    Funktion: "God fysisk och psykisk hälsa. Inga funktionsnedsättningar.",
    Insats: "Ordinarie elevhälsoinsatser. Årligt hälsobesök genomfört.",
    Kontext: "Inga aktuella hälsoproblem."
  },
  "Omsorg": {
    unit: "Ej aktuellt",
    contact: "-",
    lastUpdated: "-",
    Delaktighet: "-",
    Funktion: "-",
    Insats: "-",
    Kontext: "-"
  },
  "Barn och vårdnadshavare": {
    unit: "Vårdnadshavare",
    contact: "Fatima och Ahmed Hassan",
    lastUpdated: "2025-11-18",
    Delaktighet: "Föräldrarna engagerade men har själva begränsad svenska. Tolk vid möten.",
    Funktion: "Omar säger: 'Jag vill bli ingenjör. Jag behöver lära mig svenska snabbt'.",
    Insats: "Familjen deltar i SFI. Omar får läxhjälp på arabiska hemma.",
    Kontext: "Stabil och kärleksfull hemmiljö. Familjen från Syrien, etablerad i Sverige sedan 2023."
  }
};

// Sofia's journal data (16 år, TE 1, samordningsprofil - psykisk ohälsa, hög frånvaro)
export const SOFIA_JOURNAL_DATA: JournalData = {
  "Skola": {
    unit: "Elevhälsoteamet, Polhemsskolan",
    contact: "Anna Johansson (Studievägledare)",
    lastUpdated: "2025-12-05",
    Delaktighet: "Sofia deltar i samtal men har hög frånvaro (45%). Uttrycker vilja att klara gymnasiet men orkar inte alltid komma till skolan.",
    Funktion: "Hög kognitiv förmåga. Psykisk ohälsa (depression, ångest) påverkar skolgång markant. Stor risk att inte nå kunskapsmål.",
    Insats: "Anpassad studiegång. Flexibel studietakt. Tillgång till återhämtningsrum. Regelbundna samtal med kurator. Åtgärdsprogram aktivt.",
    Kontext: "Teknikprogrammet år 1. Sofia har potential men psykisk ohälsa och familjesituation påverkar närvaron kraftigt."
  },
  "Socialtjänst": {
    unit: "Barn- och ungdomsenheten",
    contact: "Maria Andersson (Socialsekreterare)",
    lastUpdated: "2025-12-05",
    Delaktighet: "Sofia deltar i samtal och har viss insyn i sin planering. Uttrycker att hon vill bo kvar hos mormor.",
    Funktion: "Behov av trygghet och stabilitet. Svår familjesituation har påverkat psykisk hälsa.",
    Insats: "Placering hos mormor enligt SoL. Kontaktperson. Ekonomiskt bistånd till mormor. SIP pågår.",
    Kontext: "Aktuell sedan 2022 p.g.a. brister i hemmet. Sofia bor hos mormor sedan ett år tillbaka."
  },
  "Hälso- och sjukvård": {
    unit: "Barn- och ungdomspsykiatrin (BUP)",
    contact: "Dr. Erik Svensson (Barnpsykiater)",
    lastUpdated: "2025-12-01",
    Delaktighet: "Sofia engagerad i sin behandling. Kommer regelbundet till sina tider.",
    Funktion: "Depression (F32.1) och generaliserat ångestsyndrom (F41.1). Medicinering insatt och visar viss effekt.",
    Insats: "Psykoterapi (KBT) 1 gång/vecka. SSRI-medicinering. Krisplan upprättad.",
    Kontext: "BUP-kontakt sedan mars 2023. Sofia har gjort framsteg men är fortfarande i behov av intensivt stöd."
  },
  "Omsorg": {
    unit: "Ej aktuellt",
    contact: "-",
    lastUpdated: "-",
    Delaktighet: "-",
    Funktion: "-",
    Insats: "-",
    Kontext: "-"
  },
  "Barn och vårdnadshavare": {
    unit: "Mormor (familjehemmet)",
    contact: "Birgitta Lindgren (Mormor)",
    lastUpdated: "2025-11-30",
    Delaktighet: "Sofia har god kontakt med sin mormor. Mormor deltar aktivt i alla möten och stöttar.",
    Funktion: "Sofia säger: 'Hos mormor känner jag mig trygg. Jag vill bli frisk och klara skolan'.",
    Insats: "Mormor får stöd av kontaktfamilj för avlastning. Kontinuerlig kontakt med socialtjänst och skola.",
    Kontext: "Mormor är 67 år. Stabil boendesituation. Biologisk mamma har sporadisk kontakt."
  }
};

// Function to get journal data by profile ID
export function getJournalDataByProfile(profileId: string): JournalData {
  switch (profileId) {
    case 'lisa':
      return LISA_JOURNAL_DATA;
    case 'elsa':
      return ELSA_JOURNAL_DATA;
    case 'omar':
      return OMAR_JOURNAL_DATA;
    case 'sofia':
      return SOFIA_JOURNAL_DATA;
    case 'erik':
    default:
      return ERIK_JOURNAL_DATA;
  }
}
