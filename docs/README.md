# IFSCFinder Documentation

This directory contains the Docusaurus documentation site for IFSCFinder.

## Getting Started

### Installation

```bash
cd docs
npm install
```

### Development

```bash
npm start
```

This starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

The documentation is automatically deployed to GitHub Pages via GitHub Actions when changes are pushed to the `main` branch.

## Project Structure

```
docs/
├── docusaurus.config.ts    # Docusaurus configuration
├── sidebars.ts             # Navigation sidebar config
├── src/
│   ├── components/         # Custom React components
│   ├── css/                # Custom styles
│   └── pages/              # Custom pages
└── docs/                    # Documentation markdown files
```

## Features

- **Modern UI/UX**: Professional design with dark mode support
- **Search**: Algolia DocSearch integration (configure in docusaurus.config.ts)
- **SEO**: Meta tags, Open Graph, structured data, sitemap
- **Custom Components**: LanguageTabs, APICard, PerformanceChart
- **Responsive**: Mobile-first design
- **Accessibility**: WCAG 2.1 AA compliance

## Customization

### Theme Colors

Edit `src/css/custom.css` to customize colors:

```css
:root {
  --ifsc-primary: #2563eb;
  --ifsc-secondary: #7c3aed;
  --ifsc-accent: #10b981;
}
```

### Navigation

Edit `sidebars.ts` to customize navigation structure.

### Configuration

Edit `docusaurus.config.ts` to customize site configuration.

## License

LGPL-2.1 License

**Copyright (c) 2024 Akshat Kotpalliwar. All rights reserved.**

