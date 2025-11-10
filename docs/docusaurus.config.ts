import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'IFSCFinder',
  tagline: 'High-performance IFSC code lookup utilities across multiple languages',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://integeralex.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/IFSCFinder/',

  // GitHub pages deployment config.
  organizationName: 'IntegerAlex',
  projectName: 'IFSCFinder',

  onBrokenLinks: 'throw',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/IntegerAlex/IFSCFinder/tree/main/',
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
          ignorePatterns: ['/tags/**'],
          filename: 'sitemap.xml',
        },
        googleAnalytics: {
          trackingID: 'G-XXXXXXXXXX', // Replace with your GA tracking ID
          anonymizeIP: true,
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/ifscfinder-social-card.jpg',
    navbar: {
      title: 'IFSCFinder',
      logo: {
        alt: 'IFSCFinder Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/IntegerAlex/IFSCFinder',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'light',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/getting-started/installation',
            },
            {
              label: 'API Reference',
              to: '/docs/api/overview',
            },
            {
              label: 'Architecture',
              to: '/docs/architecture/overview',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/IntegerAlex/IFSCFinder',
            },
            {
              label: 'Issues',
              href: 'https://github.com/IntegerAlex/IFSCFinder/issues',
            },
            {
              label: 'Discussions',
              href: 'https://github.com/IntegerAlex/IFSCFinder/discussions',
            },
          ],
        },
        {
          title: 'Packages',
          items: [
            {
              label: 'Python',
              href: 'https://github.com/IntegerAlex/IFSCFinder/tree/main/python',
            },
            {
              label: 'TypeScript',
              href: 'https://github.com/IntegerAlex/IFSCFinder/tree/main/clients/typescript',
            },
          ],
        },
        {
          title: 'Legal',
          items: [
            {
              label: 'License (LGPL-2.1)',
              href: 'https://github.com/IntegerAlex/IFSCFinder/blob/main/LICENSE',
            },
            {
              label: 'Copyright',
              to: '/docs/legal/copyright',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Akshat Kotpalliwar. All rights reserved. Licensed under LGPL-2.1.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.vsDark,
      additionalLanguages: ['python', 'typescript', 'bash', 'json'],
    },
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    algolia: {
      // The application ID provided by Algolia
      appId: 'YOUR_APP_ID',
      // Public API key: it is safe to commit it
      apiKey: 'YOUR_SEARCH_API_KEY',
      indexName: 'ifscfinder',
      // Optional: see doc section below
      contextualSearch: true,
      // Optional: Specify domains where the search should be deployed
      // algoliaOptions: {
      //   facetFilters: ["language:$LANGUAGE", "version:$VERSION"],
      // },
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

