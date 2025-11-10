import React from 'react';
import Head from '@docusaurus/Head';

export default function CustomHead(): JSX.Element {
  return (
    <Head>
      <meta
        name="keywords"
        content="ifsc, ifscfinder, banking, lookup, sqlite, finance, indian-banks, python, typescript, nodejs"
      />
      <meta
        name="description"
        content="High-performance IFSC code lookup utilities backed by SQLite. Available for Python, TypeScript, Go, and Rust with consistent APIs and sub-millisecond query performance."
      />
      <meta name="author" content="Akshat Kotpalliwar" />
      <meta property="og:type" content="website" />
      <meta
        property="og:title"
        content="IFSCFinder - High-performance IFSC code lookup"
      />
      <meta
        property="og:description"
        content="High-performance IFSC code lookup utilities backed by SQLite. Available for Python, TypeScript, Go, and Rust."
      />
      <meta
        property="og:image"
        content="https://integeralex.github.io/IFSCFinder/img/ifscfinder-social-card.jpg"
      />
      <meta
        property="og:url"
        content="https://integeralex.github.io/IFSCFinder/"
      />
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:title"
        content="IFSCFinder - High-performance IFSC code lookup"
      />
      <meta
        name="twitter:description"
        content="High-performance IFSC code lookup utilities backed by SQLite."
      />
      <meta
        name="twitter:image"
        content="https://integeralex.github.io/IFSCFinder/img/ifscfinder-social-card.jpg"
      />
    </Head>
  );
}

