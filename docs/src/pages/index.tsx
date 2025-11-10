import clsx from 'clsx';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/getting-started/installation">
            Get Started
          </Link>
          <Link
            className="button button--primary button--lg"
            to="/docs/getting-started/quick-start">
            Quick Start
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <>
      <Head>
        <meta
          name="keywords"
          content="ifsc, ifscfinder, banking, lookup, sqlite, finance, indian-banks, python, typescript, nodejs"
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
      <Layout
        title={`${siteConfig.title} - High-performance IFSC code lookup`}
        description="High-performance IFSC code lookup utilities backed by SQLite. Available for Python, TypeScript, Go, and Rust with consistent APIs and sub-millisecond query performance.">
        <HomepageHeader />
        <main>
          <HomepageFeatures />
        </main>
      </Layout>
    </>
  );
}

