# Catalog Application Quality Report

A comprehensive LeanIX custom report that analyzes and visualizes application data quality across 9 quality factors.

## Features

- **Multi-Factor Quality Assessment**: Evaluates applications across 9 key quality dimensions
- **4-Factor Description Quality**: Advanced description assessment using word count, functional verbs, target users, and application identity
- **Interactive Drill-Down**: Click any metric to see detailed breakdowns with actionable insights
- **Executive Overview**: Applications tiered by quality (Perfect/Good/Fair/Needs Work)
- **Real-Time Data**: Fetches and analyzes applications from LeanIX workspace
- **TypeScript**: Full type safety throughout the application

## Development

Install dependencies:

```bash
npm install
```

**Important:** Create a `lxr.json` file in the project root with your LeanIX workspace credentials:

```json
{
  "host": "your-workspace.leanix.net",
  "apitoken": "your-api-token"
}
```

Start development server:

```bash
npm run dev
```

The report will run against your LeanIX workspace configured in `lxr.json`.

## Project Structure

```
src/
├── App.tsx           # Main component with data logic and LeanIX configuration
├── BarChart.tsx      # Chart.js visualization component
├── App.css           # Styles
└── main.tsx          # Application entry point
```

## Build

Build for production:

```bash
npm run build
```

Output will be in the `dist/` folder.

## Upload to LeanIX

Upload the report to your LeanIX workspace:

```bash
npm run upload
```

This builds and uploads the report using credentials from `lxr.json`.

## Customization

### Change What Data to Fetch

Edit the `attributes` array in `src/App.tsx`:

```typescript
attributes: ['id', 'displayName', 'businessCriticality'];
```

To use a different field, update the `FIELD_NAME` constant in `src/App.tsx`.

### Modify the Visualization

Edit `src/App.tsx` to change how data is grouped and displayed.

Edit `src/BarChart.tsx` to customize the Chart.js configuration.

### Query Different Fact Sheet Types

Change `fixedFactSheetType` in `src/App.tsx`:

```typescript
fixedFactSheetType: 'BusinessCapability'; // or 'Project', 'ITComponent', etc.
```

## Learn More

- [LeanIX Reporting Documentation](https://dev.leanix.net/docs/reporting)
- [Chart.js Documentation](https://www.chartjs.org/docs/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
