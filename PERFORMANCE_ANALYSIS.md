# Performance Analysis Report

Generated: 2026-01-07

## Executive Summary

This analysis identified **10+ performance anti-patterns** across the codebase, including N+1 query patterns, missing React optimizations, and inefficient algorithms.

---

## 🔴 HIGH SEVERITY ISSUES

### 1. N+1 Search Pattern - No Debouncing
**File:** `src/components/Header.tsx:101-146`

```typescript
const handleSearch = (query: string) => {
  // Runs on EVERY keystroke with nested loops
  DOCUMENTS_DATA.forEach(section => {
    section.items.forEach(doc => {
      if (doc.title.toLowerCase().includes(lowerQuery)) { ... }
    });
  });
  Object.entries(JOURNAL_DATA).forEach(([domain, data]) => {
    Object.entries(data).forEach(([category, content]) => { ... });
  });
  SHANARRI_DATA.forEach(...);
  NEWS_FEED_DATA.forEach(...);
}
```

**Problem:** Search executes on every keystroke with nested loops across 4 data sources without debouncing.

**Impact:**
- UI lag on every keypress
- Excessive computation especially on slower devices
- Poor user experience during typing

**Recommended Fix:**
```typescript
import { useMemo, useState, useCallback } from 'react';
import { debounce } from 'lodash-es'; // or custom implementation

// Pre-index data at module level
const searchIndex = buildSearchIndex(DOCUMENTS_DATA, JOURNAL_DATA, SHANARRI_DATA, NEWS_FEED_DATA);

// In component:
const debouncedSearch = useMemo(
  () => debounce((query: string) => {
    const results = searchIndex.search(query);
    setSearchResults(results.slice(0, 8));
  }, 300),
  []
);

const handleSearch = useCallback((query: string) => {
  setSearchQuery(query);
  if (query.length < 2) {
    setSearchResults([]);
    return;
  }
  debouncedSearch(query);
}, [debouncedSearch]);
```

---

### 2. API Client Instantiation Per Request
**File:** `src/components/AIAnalysis.tsx:120`

```typescript
// Inside handleAnalyze function - runs on every click
const apiClient = new SemanticBridgeAPI();
const result = await apiClient.analyzeICFObservation({...});
```

**Problem:** New API client instance created for each analysis request.

**Impact:**
- Memory churn from repeated object creation
- Potential connection/initialization overhead
- Cannot leverage connection pooling or caching

**Recommended Fix:**
```typescript
// Module-level singleton
const apiClient = new SemanticBridgeAPI();

// Or use React context for testability
const APIContext = createContext<SemanticBridgeAPI | null>(null);

export const APIProvider = ({ children }) => {
  const client = useMemo(() => new SemanticBridgeAPI(), []);
  return <APIContext.Provider value={client}>{children}</APIContext.Provider>;
};
```

---

## 🟠 MEDIUM SEVERITY ISSUES

### 3. Nested Component Definition Causing Re-renders
**File:** `src/components/WelfareWheel.tsx:25-119`

```typescript
export default function WelfareWheel({ ... }) {
  // WheelChart defined INSIDE parent - recreated every render
  const WheelChart = () => {
    return (
      <svg>
        {filteredData.map((dim, i) => {
          // 16+ trigonometric calculations per item
          const startRad = (startAngle * Math.PI) / 180;
          const x1 = cx + Math.cos(startRad) * innerR;
          const y1 = cy + Math.sin(startRad) * innerR;
          // ... more expensive calculations
        })}
      </svg>
    );
  };
}
```

**Problem:**
- `WheelChart` is defined inside parent component, recreated on every render
- Expensive trigonometric calculations run on every render even when data unchanged
- Inline style objects create new references

**Recommended Fix:**
```typescript
// Extract and memoize
const WheelChart = React.memo(({ filteredData, selectedIndicator, setSelectedIndicator, isChild }) => {
  const wheelSegments = useMemo(() => {
    return filteredData.map((dim, i) => {
      const n = filteredData.length;
      const startAngle = (i * 360) / n - 90;
      const endAngle = ((i + 1) * 360) / n - 90;
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;
      // ... calculate all values
      return { dim, path, statusX, statusY, labelX, labelY, ... };
    });
  }, [filteredData]);

  const transformStyle = useMemo(() => ({
    transformOrigin: `${cx}px ${cy}px`
  }), [cx, cy]);

  return <svg>...</svg>;
});
```

---

### 4. Missing React.memo for Presentational Components

**Affected Files:**
- `src/components/Dashboard.tsx`
- `src/components/Header.tsx`
- `src/components/Navigation.tsx`
- `src/components/Overview.tsx`
- `src/components/BBICTriangle.tsx`
- `src/components/LevelIndicator.tsx`
- And ~28 more components

**Current State:** Only 12 out of ~40 components use `React.memo`

**Problem:** Presentational components re-render when parents update even if props unchanged.

**Recommended Fix:**
```typescript
// Before
export default function LevelIndicator({ level, label }) {
  return <div>...</div>;
}

// After
export default React.memo(function LevelIndicator({ level, label }) {
  return <div>...</div>;
});
```

---

### 5. Inline Arrow Functions in JSX
**Files:** Multiple components

```typescript
// Examples found:
onClick={() => onNavigate('shanarri')}     // AIAnalysis.tsx
onClick={() => handleDeleteResult(idx)}     // AIAnalysis.tsx
onClick={() => setSelectedIndicator(dim)}   // WelfareWheel.tsx
```

**Problem:** New function created on every render, breaking child memoization.

**Current State:** Only 38 `useCallback` usages across 10 files.

**Recommended Fix:**
```typescript
// Before
<Button onClick={() => onNavigate('shanarri')}>Navigate</Button>

// After
const handleNavigate = useCallback(() => {
  onNavigate('shanarri');
}, [onNavigate]);

<Button onClick={handleNavigate}>Navigate</Button>
```

---

### 6. Repeated String Operations in Loops
**File:** `src/components/Header.tsx:116-140`

```typescript
// toLowerCase() called on every iteration
if (doc.title.toLowerCase().includes(lowerQuery))
if (content.toLowerCase().includes(lowerQuery) ||
    category.toLowerCase().includes(lowerQuery) ||
    domain.toLowerCase().includes(lowerQuery))
```

**Problem:** String normalization happens during each search instead of once at data load.

**Recommended Fix:**
```typescript
// Pre-normalize data at initialization
const normalizedDocuments = DOCUMENTS_DATA.map(section => ({
  ...section,
  items: section.items.map(doc => ({
    ...doc,
    searchTitle: doc.title.toLowerCase()
  }))
}));
```

---

### 7. Massive Component Files

| File | Lines | Concern |
|------|-------|---------|
| `ScenarioGenerator.tsx` | 2,743 | Multiple logical concerns |
| `GamificationSystem.tsx` | 994 | Achievement + leaderboard + progress |
| `N1Screening.tsx` | 922 | Form + validation + results |
| `WellnessWheelDevelopment.tsx` | 896 | Multiple visualization types |

**Problem:**
- Monolithic components cause cascading re-renders
- Any state change re-renders entire component tree
- Harder to optimize individual sections

**Recommended Fix:**
- Split into smaller, focused sub-components
- Each sub-component wrapped with `React.memo`
- Extract business logic to custom hooks

---

### 8. PDF Export Blocks Main Thread
**File:** `src/hooks/usePDFExport.ts:103-107`

```typescript
const canvas = await html2canvas(wheelElement, {
  scale: 2,  // High quality = slow
  useCORS: true,
  backgroundColor: '#ffffff'
});
const imgData = canvas.toDataURL('image/png');
```

**Problem:** Heavy canvas operations run synchronously on main thread.

**Recommended Fix:**
- Use Web Workers for PDF generation
- Show loading indicator during export
- Consider server-side PDF generation for complex documents

---

## 🟡 LOW SEVERITY ISSUES

### 9. Large Icon Bundle Imports

Multiple components import 30-40+ icons from `lucide-react`:
- `ScenarioGenerator.tsx` - 40+ icons
- `Navigation.tsx` - 32+ icons
- `InterventionSimulator.tsx` - 28+ icons

**Recommended Fix:**
- Verify tree-shaking is working in build
- Consider dynamic imports for rarely-used icons
- Create icon wrapper component for common icons

---

## 📊 Metrics Summary

| Optimization Technique | Current State | Recommendation |
|------------------------|---------------|----------------|
| Debounce usage | ❌ None | Add to search inputs |
| React.memo | ⚠️ 12/40 components | Wrap all presentational components |
| useCallback | ⚠️ 38 occurrences | Use for all handler props |
| useMemo | ⚠️ Limited | Memoize expensive computations |
| Code splitting | ❌ Not implemented | Add route-based splitting |
| Search indexing | ❌ Linear search | Build inverted index |

---

## 🔧 Priority Action Items

### Immediate (This Sprint)
1. Add 300ms debounce to Header.tsx search
2. Create singleton API client for AIAnalysis
3. Memoize WelfareWheel calculations

### High Priority (Next Sprint)
4. Add React.memo to all presentational components
5. Replace inline arrow functions with useCallback
6. Pre-normalize search data

### Medium Priority (Backlog)
7. Split large components (ScenarioGenerator, GamificationSystem)
8. Implement route-based code splitting
9. Move PDF generation to Web Worker

### Low Priority (Tech Debt)
10. Optimize icon imports
11. Add performance monitoring
12. Create component performance guidelines

---

## Appendix: Files Requiring Changes

### High Priority Files
- `src/components/Header.tsx` - Search debounce, string optimization
- `src/components/AIAnalysis.tsx` - API singleton, useCallback
- `src/components/WelfareWheel.tsx` - Extract component, useMemo

### Medium Priority Files
- `src/components/Dashboard.tsx` - React.memo, useCallback
- `src/components/Navigation.tsx` - React.memo
- `src/components/Journal.tsx` - useCallback for handlers
- `src/components/Overview.tsx` - React.memo

### Low Priority Files (Large Refactors)
- `src/components/ScenarioGenerator.tsx` - Component splitting
- `src/components/GamificationSystem.tsx` - Component splitting
- `src/components/N1Screening.tsx` - Component splitting
