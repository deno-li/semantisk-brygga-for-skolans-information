import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import RiskProtectionBalance from '../RiskProtectionBalance';
import { EnvironmentalFactor } from '@/types/icf-types';

describe('RiskProtectionBalance', () => {
  const mockBarrier: EnvironmentalFactor = {
    code: 'e250',
    domain: 'Ljud (fysisk miljö)',
    type: 'barrier',
    level: 2 as const,
    description: 'Hög ljudnivå i klassrummet',
    relatedSpokes: ['larande', 'trygg'],
    identifiedDate: '2025-11-15',
    identifiedBy: 'elementary-school',
    context: 'school',
    status: 'active',
  };

  const mockFacilitator: EnvironmentalFactor = {
    code: 'e1301',
    domain: 'Läromedel för utbildning',
    type: 'facilitator',
    level: 3 as const,
    description: 'Inlästa böcker och digitala läromedel',
    relatedSpokes: ['larande'],
    identifiedDate: '2025-11-15',
    identifiedBy: 'elementary-school',
    context: 'school',
    status: 'active',
  };

  it('renders title', () => {
    render(<RiskProtectionBalance environmentalFactors={[]} />);
    expect(screen.getByText(/Risk\/Skydd-balans/i)).toBeInTheDocument();
  });

  it('displays protection-dominates interpretation when facilitators are stronger', () => {
    // Use level 4 facilitator to ensure balance >= 2 (4 - 2 = 2)
    const strongFacilitator: EnvironmentalFactor = {
      ...mockFacilitator,
      level: 4 as const,
    };
    render(<RiskProtectionBalance environmentalFactors={[mockBarrier, strongFacilitator]} />);
    // Check that it shows positive balance (protection > risk)
    // Balance should be +2 (4 - 2)
    const elements = screen.getAllByText(/\+2/i);
    expect(elements.length).toBeGreaterThan(0);
  });

  it('shows balance score correctly', () => {
    render(<RiskProtectionBalance environmentalFactors={[mockBarrier, mockFacilitator]} />);
    // Protection (3) - Risk (2) = Balance (1)
    const elements = screen.getAllByText(/\+1/i);
    expect(elements.length).toBeGreaterThan(0);
  });

  it('renders barriers section', () => {
    render(<RiskProtectionBalance environmentalFactors={[mockBarrier]} />);
    expect(screen.getByText(/Ljud \(fysisk miljö\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Hög ljudnivå i klassrummet/i)).toBeInTheDocument();
  });

  it('renders facilitators section', () => {
    render(<RiskProtectionBalance environmentalFactors={[mockFacilitator]} />);
    expect(screen.getByText(/Läromedel för utbildning/i)).toBeInTheDocument();
    expect(screen.getByText(/Inlästa böcker och digitala läromedel/i)).toBeInTheDocument();
  });

  it('calculates risk score from barriers', () => {
    const barrier1 = { ...mockBarrier, level: 2 as const };
    const barrier2 = { ...mockBarrier, code: 'e251', level: 1 as const };
    render(<RiskProtectionBalance environmentalFactors={[barrier1, barrier2]} />);
    // Risk score should be 3 (2 + 1) - check in the total summary
    expect(screen.getAllByText(/Risk: 3/i).length).toBeGreaterThan(0);
  });

  it('calculates protection score from facilitators', () => {
    const facilitator1 = { ...mockFacilitator, level: 3 as const };
    const facilitator2 = { ...mockFacilitator, code: 'e125', level: 2 as const };
    render(<RiskProtectionBalance environmentalFactors={[facilitator1, facilitator2]} />);
    // Protection score should be 5 (3 + 2) - check that it exists
    expect(screen.getAllByText(/Skydd: 5/i).length).toBeGreaterThan(0);
  });

  it('shows empty state when no environmental factors', () => {
    render(<RiskProtectionBalance environmentalFactors={[]} />);
    expect(screen.getByText(/Inga environmental factors/i)).toBeInTheDocument();
  });

  it('filters by spoke when selectedSpoke is provided', () => {
    const learningFactor: EnvironmentalFactor = { ...mockFacilitator, relatedSpokes: ['larande'] };
    const healthFactor: EnvironmentalFactor = { ...mockFacilitator, code: 'e999', relatedSpokes: ['halsa'] };

    render(
      <RiskProtectionBalance
        environmentalFactors={[learningFactor, healthFactor]}
        selectedSpoke="larande"
      />
    );

    // Should show learning factor
    expect(screen.getByText(/Läromedel för utbildning/i)).toBeInTheDocument();
    // Should not show health factor (since it's filtered out)
    expect(screen.queryByText(/e999/i)).not.toBeInTheDocument();
  });
});
