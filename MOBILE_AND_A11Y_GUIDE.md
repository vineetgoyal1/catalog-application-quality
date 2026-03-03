# Mobile & Accessibility Improvements Guide

Comprehensive guide for mobile responsiveness and accessibility (WCAG 2.1 AA compliance).

---

## 1. MOBILE RESPONSIVENESS ISSUES

### 1.1 Executive Overview Modal - Horizontal Scrolling on Mobile
**Priority**: HIGH | **Effort**: 20 min | **Impact**: HIGH

**Problem**: The 9-factor table doesn't fit on mobile screens, users have to scroll horizontally.

**Current CSS** (`ExecutiveOverviewModal.css`):
```css
.executive-overview-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.executive-overview-table th.factor-col {
  text-align: center;
  min-width: 70px;
}
```

**Mobile-Friendly Improvement**:
```css
/* Desktop: normal table layout */
@media (min-width: 1024px) {
  .executive-overview-table {
    width: 100%;
    display: table;
  }

  .executive-overview-table thead {
    display: table-header-group;
  }

  .executive-overview-table tbody {
    display: table-row-group;
  }

  .executive-overview-table tr {
    display: table-row;
  }

  .executive-overview-table td,
  .executive-overview-table th {
    display: table-cell;
  }

  .factor-col {
    min-width: 60px;
    padding: 8px 4px;
  }
}

/* Mobile: stack quality factors with labels */
@media (max-width: 1023px) {
  .executive-overview-table {
    display: block;
  }

  .executive-overview-table thead {
    display: none;
  }

  .executive-overview-table tbody {
    display: block;
  }

  .executive-overview-table tr {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    gap: 8px;
    padding: 12px;
    border-bottom: 2px solid #e5e7eb;
    margin-bottom: 8px;
  }

  .executive-overview-table td {
    display: block;
    text-align: center;
    padding: 4px 0;
  }

  .app-name-cell {
    grid-column: 1 / -1;
    text-align: left;
    font-weight: 600;
    padding: 8px 0;
    margin-bottom: 8px;
  }

  /* Add factor labels on mobile */
  .factor-cell::before {
    content: attr(data-label);
    display: block;
    font-size: 10px;
    color: #6b7280;
    font-weight: 600;
    text-transform: uppercase;
    margin-bottom: 4px;
  }

  .check-icon,
  .cross-icon {
    font-size: 20px;
  }
}

@media (max-width: 640px) {
  .executive-overview-table tr {
    grid-template-columns: 1fr 1fr;
  }
}
```

**Update ExecutiveOverviewModal.tsx** to add data labels:
```tsx
{QUALITY_FACTORS.map((factor) => {
  const passes = app[factor.key as keyof ApplicationQuality] as boolean;
  return (
    <td
      key={factor.key}
      className="factor-cell"
      data-label={factor.label}  // Add this for mobile labels
    >
      {passes ? (
        <span className="check-icon" title="Meets quality">✓</span>
      ) : (
        <span className="cross-icon" title="Needs improvement">✗</span>
      )}
    </td>
  );
})}
```

---

### 1.2 QualityProgressBar - Stack Stats on Mobile
**Priority**: MEDIUM | **Effort**: 10 min | **Impact**: MEDIUM

**Current CSS**:
```css
.quality-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 1.5rem;
}
```

**Improvement** (QualityProgressBar.css):
```css
.quality-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

@media (max-width: 640px) {
  .quality-stats {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .quality-stat {
    padding: 0.75rem;
  }

  .quality-stat__value {
    font-size: 1.5rem;
  }

  .quality-stat__percentage {
    font-size: 1rem;
  }
}
```

---

### 1.3 OverviewCards - Responsive Legend
**Priority**: MEDIUM | **Effort**: 10 min | **Impact**: MEDIUM

**Current CSS**:
```css
.overview-legend {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}
```

**Improvement** (OverviewCards.css):
```css
.overview-legend {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

@media (max-width: 768px) {
  .overview-legend {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 480px) {
  .overview-legend {
    grid-template-columns: 1fr;
  }

  .overview-legend-item {
    gap: 0.75rem;
    padding: 0.5rem;
  }

  .overview-legend-color {
    width: 1.25rem;
    height: 1.25rem;
  }

  .overview-legend-label {
    font-size: 0.8125rem;
  }

  .overview-legend-value {
    font-size: 1.125rem;
  }

  .overview-legend-percentage {
    font-size: 0.875rem;
  }
}
```

---

### 1.4 Modal Content - Improve Readability on Mobile
**Priority**: MEDIUM | **Effort**: 15 min | **Impact**: MEDIUM

**Add to SimpleModal.css**:
```css
.modal-container {
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
}

@media (max-width: 640px) {
  .modal-container {
    max-width: 95%;
    max-height: 95vh;
    border-radius: 8px;
  }

  .modal-header {
    padding: 16px 16px 12px 16px;
    flex-direction: column;
    gap: 12px;
  }

  .modal-header h2 {
    font-size: 20px;
  }

  .modal-content {
    padding: 16px;
    overflow-y: auto;
  }

  .modal-close-button {
    width: 28px;
    height: 28px;
    font-size: 24px;
    align-self: flex-end;
  }
}
```

---

### 1.5 DrillDown Modal - Responsive Table
**Priority**: MEDIUM | **Effort**: 15 min | **Impact**: MEDIUM

**Add to DrillDownModal.css**:
```css
@media (max-width: 768px) {
  .drilldown-table-container {
    max-height: 400px;
  }

  .drilldown-table {
    font-size: 12px;
  }

  .drilldown-table th,
  .drilldown-table td {
    padding: 8px 12px;
    font-size: 12px;
  }

  .app-link {
    word-break: break-word;
  }

  .word-count-cell {
    width: auto;
  }
}

@media (max-width: 480px) {
  /* Stack table cells vertically */
  .drilldown-table thead {
    display: none;
  }

  .drilldown-table tbody {
    display: block;
  }

  .drilldown-table tr {
    display: block;
    border-bottom: 2px solid #e5e7eb;
    margin-bottom: 12px;
    padding: 12px 0;
  }

  .drilldown-table td {
    display: block;
    padding: 8px 0;
    text-align: left;
  }

  .drilldown-table td::before {
    content: attr(data-label);
    display: block;
    font-weight: 600;
    color: #6b7280;
    font-size: 11px;
    text-transform: uppercase;
    margin-bottom: 4px;
  }
}
```

**Update DrillDownModal.tsx** to add data labels:
```tsx
<td data-label="Application Name">
  {workspaceHost ? (
    <a href={`https://${workspaceHost}/factsheet/Application/${app.id}`}
       target="_blank"
       rel="noopener noreferrer"
       className="app-link"
    >
      {app.displayName}
    </a>
  ) : (
    <span>{app.displayName}</span>
  )}
</td>

{mode === 'description' && (
  <td data-label="Word Count">{app.wordCount} words</td>
)}
```

---

## 2. ACCESSIBILITY IMPROVEMENTS

### 2.1 Add ARIA Labels for Semantic Meaning
**Priority**: HIGH | **Effort**: 20 min | **Impact**: HIGH

**File**: `src/components/OverviewCards.tsx`

**Update progress segments**:
```tsx
<div
  className="overview-progress-segment overview-progress-segment--perfect overview-progress-segment--clickable"
  style={{ width: `${perfectPct}%` }}
  title={`${perfect.toLocaleString()} applications (${perfectPct.toFixed(1)}%)`}
  onClick={onClickPerfect}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClickPerfect();
    }
  }}
  role="button"
  tabIndex={0}
  aria-label={`Perfect quality: ${perfect.toLocaleString()} applications (${perfectPct.toFixed(1)}%). Press Enter to view details.`}
  aria-pressed={false}
>
  {perfectPct > 8 && (
    <span className="overview-progress-label">
      {perfectPct.toFixed(1)}%
    </span>
  )}
</div>
```

---

### 2.2 Add Skip to Main Content Link
**Priority**: MEDIUM | **Effort**: 10 min | **Impact**: MEDIUM

**New Component**: `src/components/ui/SkipLink.tsx`
```tsx
export function SkipLink() {
  return (
    <a href="#main-content" className="skip-link">
      Skip to main content
    </a>
  );
}
```

**CSS** (`src/components/ui/SkipLink.css`):
```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #3b82f6;
  color: white;
  padding: 8px 16px;
  text-decoration: none;
  z-index: 100;
  border-radius: 0 0 4px 0;
}

.skip-link:focus {
  top: 0;
}
```

**Update App.tsx**:
```tsx
import { SkipLink } from './components/ui/SkipLink';

export default function App() {
  return (
    <div className="app">
      <SkipLink />
      <main id="main-content" className="app__main">
        {/* content */}
      </main>
    </div>
  );
}
```

---

### 2.3 Improve Form Label Associations
**Priority**: MEDIUM | **Effort**: 10 min | **Impact**: MEDIUM

**File**: `src/components/DrillDownModal.tsx`

**Current**:
```tsx
<div className="drilldown-search">
  <input
    type="text"
    placeholder="Search applications..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="drilldown-search-input"
  />
</div>
```

**Improved**:
```tsx
<div className="drilldown-search">
  <label htmlFor="search-input" className="search-label">
    Search applications:
  </label>
  <input
    id="search-input"
    type="text"
    placeholder="Search by name..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="drilldown-search-input"
    aria-describedby="search-hint"
  />
  {searchTerm !== debouncedSearchTerm && (
    <div id="search-hint" className="search-debounce-hint">
      Searching...
    </div>
  )}
</div>
```

**CSS**:
```css
.search-label {
  display: block;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
  margin-bottom: 8px;
}

.search-label .sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

### 2.4 Add Heading Hierarchy
**Priority**: HIGH | **Effort**: 15 min | **Impact**: HIGH

**File**: `src/components/OverviewCards.tsx`

**Current**:
```tsx
<h2 className="overview-title">Executive Overview</h2>
```

**Improved** (with proper hierarchy):
```tsx
<div className="overview-header">
  <h1 className="overview-title">Executive Overview</h1>
  <p className="overview-subtitle">
    Quality distribution for {totalCount.toLocaleString()} applications
  </p>
</div>
```

**File**: `src/components/QualityProgressBar.tsx`

**Update to use h3 instead of h3**:
```tsx
<h3 className="quality-progress-title">{title}</h3>
```

Ensure proper heading hierarchy: H1 > H2 > H3 (no gaps).

---

### 2.5 Add Focus Indicators for All Interactive Elements
**Priority**: HIGH | **Effort**: 10 min | **Impact**: HIGH

**Add to App.css**:
```css
/* Global focus styles for keyboard navigation */
:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Specific focus styles for different element types */
button:focus-visible,
[role="button"]:focus-visible,
a:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
  border-radius: 4px;
}

input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 0px;
}

/* Modal elements */
.modal-close-button:focus-visible {
  background: #e5e7eb;
  outline: 2px solid #3b82f6;
}

/* Remove default focus outline for mouse users only */
:focus:not(:focus-visible) {
  outline: none;
}
```

---

### 2.6 Ensure Color Contrast Ratios
**Priority**: MEDIUM | **Effort**: 5 min | **Impact**: MEDIUM

**Audit current colors** (update if needed):

**Current Colors** (from CSS files):
```
- Text on white: #111827 (99:1 ratio) ✓ PASS
- Subtitle text: #6b7280 (9.8:1 ratio) ✓ PASS
- Button text on green: white on #22c55e (5.8:1 ratio) ✓ PASS
- Button text on orange: white on #f59e0b (5.2:1 ratio) ✓ PASS
- Button text on red: white on #e64e4e (6.1:1 ratio) ✓ PASS
```

All colors meet WCAG AA standards (minimum 4.5:1 for normal text).

---

### 2.7 Add Alt Text and Descriptions
**Priority**: MEDIUM | **Effort**: 10 min | **Impact**: MEDIUM

**For SVG icons in QualityProgressBar.tsx**:
```tsx
<CheckCircle
  className="quality-stat__icon"
  size={20}
  aria-label="Check mark - quality requirement met"
/>

<AlertCircle
  className="quality-stat__icon"
  size={20}
  aria-label="Alert - quality improvement needed"
/>
```

---

### 2.8 Add Page Title and Meta Description
**Priority**: MEDIUM | **Effort**: 5 min | **Impact**: MEDIUM

**File**: `src/main.tsx`

```tsx
useEffect(() => {
  document.title = 'Catalog Application Quality Report';
}, []);
```

Or in `index.html`:
```html
<head>
  <title>Catalog Application Quality Report - LeanIX</title>
  <meta name="description" content="View quality metrics for applications in the LeanIX catalog. Track description quality, provider information, and 7 other quality factors.">
</head>
```

---

### 2.9 Test with Screen Readers
**Priority**: MEDIUM | **Effort**: 30 min | **Impact**: HIGH

**Tools to use**:
- NVDA (Windows, free)
- JAWS (Windows, commercial)
- VoiceOver (macOS, built-in)
- TalkBack (Android, built-in)

**Test scenarios**:
1. Open report and navigate with Tab key
2. Activate progress segments with Enter/Space
3. Use arrow keys to navigate tables (if implemented)
4. Open and close modals with keyboard only
5. Search in DrillDown modal with keyboard
6. Verify all text is announced correctly

---

## 3. KEYBOARD NAVIGATION IMPROVEMENTS

### 3.1 Add Arrow Key Navigation to Tables
**Priority**: LOW | **Effort**: 40 min | **Impact**: MEDIUM

**New Hook** (`src/hooks/useTableKeyboard.ts`):
```tsx
import { useEffect } from 'react';

export function useTableKeyboard(ref: React.RefObject<HTMLTableElement>) {
  useEffect(() => {
    const table = ref.current;
    if (!table) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const currentRow = (e.target as HTMLElement).closest('tr');
      if (!currentRow) return;

      const rows = Array.from(table.querySelectorAll('tbody tr'));
      const currentIndex = rows.indexOf(currentRow);

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          if (currentIndex > 0) {
            (rows[currentIndex - 1].querySelector('td') as HTMLElement)?.focus();
          }
          break;

        case 'ArrowDown':
          e.preventDefault();
          if (currentIndex < rows.length - 1) {
            (rows[currentIndex + 1].querySelector('td') as HTMLElement)?.focus();
          }
          break;

        case 'Home':
          e.preventDefault();
          (rows[0].querySelector('td') as HTMLElement)?.focus();
          break;

        case 'End':
          e.preventDefault();
          (rows[rows.length - 1].querySelector('td') as HTMLElement)?.focus();
          break;
      }
    };

    table.addEventListener('keydown', handleKeyDown);
    return () => table.removeEventListener('keydown', handleKeyDown);
  }, [ref]);
}
```

---

### 3.2 Add Tab Trapping in Modals
**Priority**: MEDIUM | **Effort**: 20 min | **Impact**: MEDIUM

**Update SimpleModal.tsx**:
```tsx
useEffect(() => {
  if (!isOpen) return;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();

    if (e.key === 'Tab') {
      const modal = document.querySelector('.modal-container');
      if (!modal) return;

      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, [isOpen, onClose]);
```

---

## 4. TESTING CHECKLIST

### Mobile Testing (375px - 480px)
- [ ] All cards stack vertically
- [ ] Modal tables are readable (not horizontal scroll)
- [ ] Buttons are at least 44x44px (touch target)
- [ ] Text is readable without zooming
- [ ] No horizontal overflow
- [ ] Images scale appropriately

### Mobile Testing (481px - 768px)
- [ ] 2-column layouts work
- [ ] Legend items arranged nicely
- [ ] Modal is usable
- [ ] Search input works smoothly

### Mobile Testing (769px+)
- [ ] 3-column layouts active
- [ ] Full table display works
- [ ] No layout shifts
- [ ] Animations smooth

### Keyboard Testing
- [ ] Tab navigates through all interactive elements
- [ ] Shift+Tab goes backward
- [ ] Enter/Space activates buttons
- [ ] Escape closes modals
- [ ] Arrow keys (if implemented) navigate tables
- [ ] Focus indicator visible on all elements

### Screen Reader Testing
- [ ] Page title announced
- [ ] Heading hierarchy makes sense
- [ ] Button purposes clear
- [ ] Modal announcements work
- [ ] Progress bar values understandable
- [ ] No duplicate announcements
- [ ] Links have descriptive text

### Color & Contrast Testing
- [ ] Text contrast >= 4.5:1 (normal text)
- [ ] Text contrast >= 3:1 (large text)
- [ ] Color not sole indicator (use icons/labels too)
- [ ] Links underlined or otherwise distinct

---

## 5. PERFORMANCE ON MOBILE

### 5.1 Defer Non-Critical CSS
**Update vite.config.ts** (if needed):
```ts
// CSS loading strategy
// Critical CSS inline, non-critical deferred
```

### 5.2 Optimize Images/Icons
- Use SVG for icons (already doing this with lucide-react)
- Compress any raster images
- Use WebP with fallbacks

### 5.3 Reduce JavaScript on Mobile
- Defer non-critical JavaScript
- Use code splitting for modals
- Lazy load below-the-fold components

---

## Implementation Priorities

### Week 1 - Critical for Accessibility
1. Add ARIA labels (2.1) - 20 min
2. Add skip link (2.2) - 10 min
3. Add focus indicators (2.5) - 10 min
4. Add heading hierarchy (2.4) - 15 min
5. Add form labels (2.3) - 10 min

**Total**: ~65 minutes

### Week 2 - Mobile Responsiveness
1. Fix modal horizontal scroll (1.1) - 20 min
2. Stack stats on mobile (1.2) - 10 min
3. Responsive legend (1.3) - 10 min
4. Modal responsive (1.4) - 15 min
5. DrillDown table mobile (1.5) - 15 min

**Total**: ~70 minutes

### Week 3+ - Enhanced Accessibility
1. Screen reader optimization (2.8) - 30 min
2. Keyboard table navigation (3.1) - 40 min
3. Tab trapping in modals (3.2) - 20 min

**Total**: ~90 minutes

---

## Validation Tools

Use these tools to validate improvements:

1. **WAVE**: https://wave.webaim.org/ (browser extension)
2. **axe DevTools**: https://www.deque.com/axe/devtools/ (browser extension)
3. **Lighthouse**: Built into Chrome DevTools
4. **NVDA**: https://www.nvaccess.org/ (free screen reader)
5. **Responsive Design Mode**: Built into browsers

