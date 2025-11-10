import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Lightning Fast',
    Svg: require('@site/static/img/lightning.svg').default,
    description: (
      <>
        Sub-millisecond query times with 136K+ lookups/second. Optimized SQLite
        database with WAL mode and prepared statements for maximum performance.
      </>
    ),
  },
  {
    title: 'Cross-Platform',
    Svg: require('@site/static/img/cross-platform.svg').default,
    description: (
      <>
        Available for Python, TypeScript, Go, and Rust with consistent APIs.
        Same interface, same performance, different languages.
      </>
    ),
  },
  {
    title: 'Zero Dependencies',
    Svg: require('@site/static/img/zero-deps.svg').default,
    description: (
      <>
        Bundled 42MB SQLite database covering all Indian banks. No external
        dependencies or API calls required. Works offline.
      </>
    ),
  },
  {
    title: 'Production Ready',
    Svg: require('@site/static/img/production.svg').default,
    description: (
      <>
        Built-in caching, error handling, and comprehensive test coverage.
        Suitable for banking automation, fintech analytics, and microservices.
      </>
    ),
  },
  {
    title: 'Type Safe',
    Svg: require('@site/static/img/typesafe.svg').default,
    description: (
      <>
        Full TypeScript support with comprehensive type definitions. Catch
        errors at compile time, not runtime.
      </>
    ),
  },
  {
    title: 'Open Source',
    Svg: require('@site/static/img/opensource.svg').default,
    description: (
      <>
        LGPL-2.1 licensed for flexible commercial and open-source usage.
        Community-driven development with transparent roadmap.
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

export default function HomepageFeatures(): JSX.Element {
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

