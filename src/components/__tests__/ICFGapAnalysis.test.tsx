import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import ICFGapAnalysis from '../ICFGapAnalysis';
import { ICFAssessment } from '@/types/icf-types';

describe('ICFGapAnalysis', () => {
  const mockAssessment: ICFAssessment = {
    code: 'd140',
    domain: 'Lära sig läsa',
    performance: { value: 2 as const, description: 'Måttliga svårigheter' },
    capacity: { value: 3 as const, description: 'Stora svårigheter' },
    gap: -1,
    gapInterpretation: 'facilitators-work',
    assessedDate: '2025-11-15',
    assessedBy: 'elementary-school',
    timeSpan: 'Senaste 4 veckor',
    context: 'school',
    source: 'observation',
  };

  it('renders ICF code and domain', () => {
    render(<ICFGapAnalysis assessments={[mockAssessment]} />);
    expect(screen.getByText(/d140/i)).toBeInTheDocument();
    expect(screen.getByText(/Lära sig läsa/i)).toBeInTheDocument();
  });

  it('displays performance and capacity correctly', () => {
    render(<ICFGapAnalysis assessments={[mockAssessment]} />);
    expect(screen.getByText(/Måttliga svårigheter/i)).toBeInTheDocument();
    expect(screen.getByText(/Stora svårigheter/i)).toBeInTheDocument();
  });

  it('shows positive gap interpretation when facilitators work', () => {
    render(<ICFGapAnalysis assessments={[mockAssessment]} />);
    const elements = screen.getAllByText(/FUNGERAR/i);
    expect(elements.length).toBeGreaterThan(0);
  });

  it('displays gap value', () => {
    render(<ICFGapAnalysis assessments={[mockAssessment]} />);
    const elements = screen.getAllByText(/GAP: -1/i);
    expect(elements.length).toBeGreaterThan(0);
  });

  it('shows empty state when no assessments provided', () => {
    render(<ICFGapAnalysis assessments={[]} />);
    expect(screen.getByText(/Ingen gap-analys tillgänglig/i)).toBeInTheDocument();
  });

  it('displays metadata when showMetadata is true', () => {
    render(<ICFGapAnalysis assessments={[mockAssessment]} showMetadata={true} />);
    expect(screen.getByText(/2025-11-15/i)).toBeInTheDocument();
    expect(screen.getByText(/elementary-school/i)).toBeInTheDocument();
    expect(screen.getByText(/school/i)).toBeInTheDocument();
  });

  it('handles barriers-exist interpretation', () => {
    const barrierAssessment: ICFAssessment = {
      ...mockAssessment,
      performance: { value: 3, description: 'Stora svårigheter' },
      capacity: { value: 2, description: 'Måttliga svårigheter' },
      gap: 1,
      gapInterpretation: 'barriers-exist',
    };

    render(<ICFGapAnalysis assessments={[barrierAssessment]} />);
    expect(screen.getByText(/Barriärer/i)).toBeInTheDocument();
  });

  it('renders multiple assessments', () => {
    const assessment2: ICFAssessment = {
      code: 'd160',
      domain: 'Rikta uppmärksamheten',
      performance: { value: 1 as const, description: 'Lätta svårigheter' },
      capacity: { value: 2 as const, description: 'Måttliga svårigheter' },
      gap: -1,
      gapInterpretation: 'facilitators-work',
      assessedDate: '2025-11-15',
      assessedBy: 'elementary-school',
      timeSpan: 'Senaste 4 veckor',
      context: 'school',
      source: 'observation',
    };

    render(<ICFGapAnalysis assessments={[mockAssessment, assessment2]} />);
    expect(screen.getByText(/d140/i)).toBeInTheDocument();
    expect(screen.getByText(/d160/i)).toBeInTheDocument();
    expect(screen.getByText(/Lära sig läsa/i)).toBeInTheDocument();
    expect(screen.getByText(/Rikta uppmärksamheten/i)).toBeInTheDocument();
  });
});
