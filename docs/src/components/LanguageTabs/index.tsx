import React, { useState } from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

interface LanguageTabsProps {
  children: React.ReactElement<TabItemProps>[];
  defaultValue?: string;
}

interface TabItemProps {
  value: string;
  label?: string;
  children: React.ReactNode;
}

export function LanguageTabs({ children, defaultValue }: LanguageTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue || children[0]?.props.value || '');

  const tabs = children.map((child) => ({
    value: child.props.value,
    label: child.props.label || child.props.value,
  }));

  const activeContent = children.find(
    (child) => child.props.value === activeTab
  )?.props.children;

  return (
    <div className={styles.languageTabs}>
      <div className={styles.tabList}>
        {tabs.map((tab) => (
          <button
            key={tab.value}
            className={clsx(styles.tab, {
              [styles.tabActive]: activeTab === tab.value,
            })}
            onClick={() => setActiveTab(tab.value)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={styles.tabContent}>{activeContent}</div>
    </div>
  );
}

export function TabItem({ children }: TabItemProps) {
  return <>{children}</>;
}

