import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { SourceDistributionItem } from '../../types/dashboard';

interface SourceChartProps {
  data: SourceDistributionItem[];
}

export const SourceChart: React.FC<SourceChartProps> = ({ data }) => {
  const total = useMemo(() => {
    return data.reduce((sum, item) => sum + (item.count || 0), 0);
  }, [data]);

  // Sort by count descending so top sources are first
  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => b.count - a.count).slice(0, 6);
  }, [data]);

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold text-gray-900 dark:text-gray-100">
            Top Application Channels
          </CardTitle>
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            {total} Total
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Most effective discovery sources & platforms
        </p>
      </CardHeader>

      <CardContent className="h-64 sm:h-72 w-full pt-2">
        {sortedData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-gray-400">
            No source data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={sortedData}
              margin={{ top: 5, right: 25, left: 10, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={false}
                stroke="#9ca3af"
                strokeOpacity={0.15}
              />
              <XAxis
                type="number"
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#9ca3af' }}
              />
              <YAxis
                type="category"
                dataKey="source"
                tickLine={false}
                axisLine={false}
                width={100}
                tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 500 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0];
                    const pct = total > 0 ? Math.round(((Number(item.value) || 0) / total) * 100) : 0;
                    return (
                      <div className="rounded-xl border border-gray-100 bg-white p-2.5 shadow-xl dark:border-gray-800 dark:bg-gray-900 text-xs">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">
                          {item.payload.source}:
                        </span>{' '}
                        <span className="font-black text-indigo-600 dark:text-indigo-400">
                          {item.value} ({pct}%)
                        </span>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" fill="#6366f1" radius={[0, 6, 6, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};


