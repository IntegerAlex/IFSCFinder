import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import styles from './styles.module.css';

interface PerformanceChartProps {
  data: Array<{
    name: string;
    python: number;
    typescript: number;
  }>;
  metrics?: string[];
}

export default function PerformanceChart({ data, metrics = ['lookups/sec'] }: PerformanceChartProps) {
  return (
    <div className={styles.performanceChart}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="python" fill="#2563eb" name="Python" />
          <Bar dataKey="typescript" fill="#7c3aed" name="TypeScript" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

