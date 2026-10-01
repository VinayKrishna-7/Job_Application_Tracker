import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { TrendDataPoint } from '../../types/dashboard';

interface TrendChartProps {
  data: TrendDataPoint[];
  period: string;
  onPeriodChange: (period: string) => void;
}

export const TrendChart: React.FC<TrendChartProps> = ({
  data,
  period,
  onPeriodChange,
}) => {
  const periods = [
    { label: '7D', value: '7d' },
    { label: '30D', value: '30d' },
    { label: '90D', value: '90d' },
    { label: '1Y', value: '1y' },
  ];

  const totalInPeriod = useMemo(() => {
    return data.reduce((acc, curr) => acc + (curr.count || 0), 0);
  }, [data]);

  const peakDay = useMemo(() => {
    if (data.length === 0) return 0;
    return Math.max(...data.map((d) => d.count || 0));
  }, [data]);

  const formatTickDate = (tickStr: string) => {
    try {
      const parts = tickStr.split('-');
      if (parts.length === 3) {
        return `${Number(parts[1])}/${Number(parts[2])}`;
      }
      return tickStr;
    } catch {
      return tickStr;
    }
  };

  return (
    <Card className="flex flex-col justify-between">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4">
        <div>
          <CardTitle className="text-base font-bold text-gray-900 dark:text-gray-100">
            Application Activity
          </CardTitle>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Applications submitted over time &bull; {totalInPeriod} total in selected period &bull; Peak: {peakDay}/day
          </p>
        </div>


        {/* Period Selector Tabs */}
        <div className="flex items-center rounded-lg bg-gray-100 p-1 dark:bg-gray-800 self-start sm:self-auto">
          {periods.map((p) => (
            <button
              key={p.value}
              onClick={() => onPeriodChange(p.value)}
              className={`rounded-md px-3 py-1 text-xs font-bold transition-all ${
                period === p.value
                  ? 'bg-white text-indigo-600 shadow-xs dark:bg-gray-900 dark:text-indigo-400'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="h-64 sm:h-72 w-full pt-2">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-gray-400">
            No application activity recorded in this period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="applicationGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#9ca3af"
                strokeOpacity={0.15}
              />
              <XAxis
                dataKey="date"
                tickFormatter={formatTickDate}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                interval="preserveStartEnd"
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: '#9ca3af' }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-xl dark:border-gray-800 dark:bg-gray-900 text-xs">
                        <p className="font-semibold text-gray-500 dark:text-gray-400">
                          {payload[0].payload.date}
                        </p>
                        <p className="text-sm font-black text-indigo-600 dark:text-indigo-400 mt-1">
                          {payload[0].value} application{payload[0].value === 1 ? '' : 's'}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="#6366f1"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#applicationGradient)"
                activeDot={{ r: 5, stroke: '#6366f1', strokeWidth: 2, fill: '#ffffff' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

