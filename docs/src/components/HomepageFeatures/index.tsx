import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: React.ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Lightning Fast',
    Svg: require('@site/static/img/lightning.svg').default,
    description: (
      <>
        <strong>136K+ lookups/second</strong> with sub-millisecond query times.
        Optimized SQLite with WAL mode and prepared statements for maximum
        throughput.
      </>
    ),
  },
  {
    title: 'Cross-Platform',
    Svg: require('@site/static/img/cross-platform.svg').default,
    description: (
      <>
        Consistent APIs across <strong>Python, TypeScript, Go, and Rust</strong>.
        Same interface, same performance—choose your language.
      </>
    ),
  },
  {
    title: 'Zero Dependencies',
    Svg: require('@site/static/img/zero-deps.svg').default,
    description: (
      <>
        Complete <strong>42MB SQLite database</strong> bundled with all Indian
        banks. No external APIs, no network calls—works completely offline.
      </>
    ),
  },
  {
    title: 'Production Ready',
    Svg: require('@site/static/img/production.svg').default,
    description: (
      <>
        Built-in <strong>LRU caching</strong>, comprehensive error handling, and
        extensive test coverage. Trusted for banking automation and fintech.
      </>
    ),
  },
  {
    title: 'Type Safe',
    Svg: require('@site/static/img/typesafe.svg').default,
    description: (
      <>
        Full <strong>TypeScript support</strong> with complete type definitions.
        Catch errors at compile time, ship with confidence.
      </>
    ),
  },
  {
    title: 'Open Source',
    Svg: require('@site/static/img/opensource.svg').default,
    description: (
      <>
        <strong>LGPL-2.1 licensed</strong> for commercial and open-source use.
        Community-driven with transparent development and roadmap.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

