# Testing Infrastructure

This project uses Vitest for unit/integration tests and Playwright for E2E tests.

## Running Tests

### Unit Tests

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### E2E Tests

```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Debug E2E tests
npm run test:e2e:debug
```

### All Tests

```bash
# Run both unit and E2E tests
npm run test:all
```

## Test Structure

```
src/
├── test/
│   ├── setup.ts              # Test setup and global mocks
│   ├── utils.tsx             # Custom render utilities
│   └── mocks/
│       ├── server.ts         # MSW server setup
│       ├── handlers.ts       # API mock handlers
│       └── data.ts          # Mock data (optional)
├── components/
│   └── __tests__/           # Component tests
├── api/
│   └── __tests__/           # API client tests
└── data/
    └── __tests__/           # Data utility tests

tests/
└── e2e/                     # Playwright E2E tests
```

## What's Tested

### Unit Tests (45 tests)

- **ICFGapAnalysis Component** (9 tests): ICF performance vs capacity visualization
- **RiskProtectionBalance Component** (9 tests): Environmental factors and risk/protection analysis
- **AIAnalysis Component** (4 tests): AI-powered ICF observation analysis
- **semanticBridgeApi** (8 tests): API client for semantic bridge backend
- **icf-core-sets** (16 tests): ICF core set data structures

### E2E Tests (Playwright)

- **ICF Workflow**: Complete ICF observation analysis workflow
- **Navigation**: Navigation between main sections
- **Accessibility**: Keyboard navigation and ARIA labels

## Test Coverage

Current coverage thresholds (will be increased as more tests are added):

- Lines: 35%
- Functions: 40%
- Branches: 30%
- Statements: 35%

**Target coverage**: 70% across all metrics

## Mock Service Worker (MSW)

API mocking is handled by MSW for reliable and fast unit tests:

- `/api/v1/icf/analyze-observation` - ICF observation analysis
- `/health` - Health check endpoint

## Writing New Tests

### Component Tests

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText(/hello/i)).toBeInTheDocument();
  });
});
```

### API Tests

```typescript
import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { server } from '@/test/mocks/server';
import { myApi } from '../myApi';

describe('MyAPI', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('fetches data correctly', async () => {
    const result = await myApi.fetchData();
    expect(result).toBeDefined();
  });
});
```

### E2E Tests

```typescript
import { test, expect } from '@playwright/test';

test('my feature works', async ({ page }) => {
  await page.goto('/');
  await page.click('text=My Button');
  await expect(page.locator('.result')).toBeVisible();
});
```

## CI/CD Integration

Tests run automatically in GitHub Actions:

1. Unit tests with coverage
2. Coverage upload to Codecov
3. Build verification
4. E2E tests with Playwright
5. Playwright report upload

## Future Improvements

- [ ] Increase test coverage to 70%
- [ ] Add more component tests
- [ ] Add tests for remaining API methods
- [ ] Add visual regression tests
- [ ] Add performance benchmarks
- [ ] Add mutation testing

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/)
- [MSW Documentation](https://mswjs.io/)
