import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

interface APICardProps {
  name: string;
  signature: string;
  description?: string;
  parameters?: Array<{
    name: string;
    type: string;
    description?: string;
    optional?: boolean;
  }>;
  returns?: string;
  example?: string;
}

export default function APICard({
  name,
  signature,
  description,
  parameters = [],
  returns,
  example,
}: APICardProps) {
  return (
    <div className={styles.apiCard}>
      <h3 className={styles.apiCardTitle}>{name}</h3>
      {description && <p className={styles.apiCardDescription}>{description}</p>}
      <div className={styles.apiCardSignature}>
        <code>{signature}</code>
      </div>
      {parameters.length > 0 && (
        <div className={styles.apiCardSection}>
          <h4>Parameters</h4>
          <table className={styles.apiCardTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {parameters.map((param) => (
                <tr key={param.name}>
                  <td>
                    <code>{param.name}</code>
                    {param.optional && <span className={styles.optional}>optional</span>}
                  </td>
                  <td>
                    <code>{param.type}</code>
                  </td>
                  <td>{param.description || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {returns && (
        <div className={styles.apiCardSection}>
          <h4>Returns</h4>
          <code>{returns}</code>
        </div>
      )}
      {example && (
        <div className={styles.apiCardSection}>
          <h4>Example</h4>
          <pre className={styles.apiCardExample}>
            <code>{example}</code>
          </pre>
        </div>
      )}
    </div>
  );
}

