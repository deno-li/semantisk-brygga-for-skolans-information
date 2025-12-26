/**
 * Child-friendly explanations for SHANARRI dimensions
 */

export interface ChildFriendlyText {
  meaning: string;
  action: string;
}

export const childFriendlyTexts: Record<string, ChildFriendlyText> = {
  'safe': {
    meaning: "Att du känner dig lugn och trygg i skolan och hemma, utan bråk eller rädsla.",
    action: "Vi vuxna håller koll på rasterna och ser till att ingen är dum mot dig. Vi pratar direkt om något händer."
  },
  'nurtured': {
    meaning: "Att du har vuxna som bryr sig om dig, ger dig mat, kärlek och ett tryggt hem.",
    action: "Socialtjänsten och skolan pratar med din familj för att se till att allt funkar bra hemma."
  },
  'healthy': {
    meaning: "Att din kropp mår bra, att du äter, sover och rör på dig så att du orkar med skolan.",
    action: "Skolsköterskan kollar din syn och hörsel, och vi ser till att maten i skolan är bra och nyttig."
  },
  'active': {
    meaning: "Att du gör roliga saker på fritiden, som sport, lek eller hobbyer.",
    action: "Vi kan hjälpa dig att hitta en aktivitet du gillar, som fotboll eller musikskola, och se till att du kan ta dig dit."
  },
  'included': {
    meaning: "Att du har kompisar, känner dig välkommen och får vara med i gemenskapen.",
    action: "Lärarna jobbar med gruppövningar så att alla ska känna sig välkomna. Vi hjälper till om det blir ensamt."
  },
  'responsible': {
    meaning: "Att du lär dig ta ansvar för dina läxor, tider och hur du är mot andra.",
    action: "Vi hjälper dig med scheman och påminnelser så det blir lättare att komma ihåg och göra rätt."
  },
  'respected': {
    meaning: "Att vi vuxna lyssnar på vad du tycker och tänker, och tar det på allvar.",
    action: "Din mentor bokar tid för att prata med dig om hur du vill ha det i skolan. Din röst är viktig!"
  },
  'achieving': {
    meaning: "Att du lär dig nya saker, utvecklas och klarar skolans mål.",
    action: "Vi ger dig extra stöd i de ämnen som känns svåra, till exempel med en speciallärare eller inlästa böcker."
  }
};
