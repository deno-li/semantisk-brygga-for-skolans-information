import { TimelineEvent, QualityPhase, TrendData } from '../types/types';

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

