import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'getting-started/installation',
      label: 'Installation',
    },
    {
      type: 'doc',
      id: 'getting-started/quick-start',
      label: 'Quick Start',
    },
    {
      type: 'doc',
      id: 'getting-started/examples',
      label: 'Examples',
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        {
          type: 'doc',
          id: 'api/overview',
          label: 'Overview',
        },
        {
          type: 'category',
          label: 'Python',
          items: [
            'api/python/lookup',
            'api/python/search',
            'api/python/helpers',
          ],
        },
        {
          type: 'category',
          label: 'TypeScript',
          items: [
            'api/typescript/lookup',
            'api/typescript/search',
            'api/typescript/helpers',
          ],
        },
        {
          type: 'doc',
          id: 'api/contracts',
          label: 'API Contracts',
        },
      ],
    },
    {
      type: 'category',
      label: 'Architecture',
      items: [
        'architecture/overview',
        'architecture/database-schema',
        'architecture/caching',
        'architecture/performance',
        'architecture/cross-platform',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/contributing',
        'guides/development',
        'guides/testing',
        'guides/release-process',
      ],
    },
    {
      type: 'category',
      label: 'Reference',
      items: [
        'reference/data-format',
        'reference/error-handling',
        'reference/best-practices',
      ],
    },
  ],
};

export default sidebars;

