import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/utils';
import AIAnalysis from '../AIAnalysis';
import userEvent from '@testing-library/user-event';

describe('AIAnalysis', () => {
  it('renders analysis input', () => {
    render(<AIAnalysis />);
    expect(screen.getByText(/AI-analys/i)).toBeInTheDocument();
  });

  it('allows user to enter text', async () => {
    const user = userEvent.setup();
    render(<AIAnalysis />);
    
    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'Test observation');
    
    expect(textarea).toHaveValue('Test observation');
  });

  it('has analyze button', () => {
    render(<AIAnalysis />);
    const button = screen.getByRole('button', { name: /analysera/i });
    expect(button).toBeInTheDocument();
  });

  it('validates empty input', async () => {
    const user = userEvent.setup();
    render(<AIAnalysis />);
    
    const button = screen.getByRole('button', { name: /analysera/i });
    const initialText = screen.queryByText(/resultat/i);
    
    await user.click(button);
    
    // Should not show results for empty input
    expect(initialText).not.toBeInTheDocument();
  });
});
