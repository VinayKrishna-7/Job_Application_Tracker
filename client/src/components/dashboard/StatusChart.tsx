import React, { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { StatusDistributionItem } from '../../types/dashboard';

interface StatusChartProps {
  data: StatusDistributionItem[];
}

const STATUS_COLORS: Record<string, string> = {
  Wishlist: '#818cf8', // Indigo
  Applied: '#38bdf8', // Sky
  Screening: '#f59e0b', // Amber
  Interview: '#a855f7', // Purple
  'Technical Round': '#6366f1', // Indigo deep
  Offer: '#10b981', // Emerald
  Rejected: '#f43f5e', // Rose
  Withdrawn: '#94a3b8', // Slate
};

export const StatusChart: React.FC<StatusChartProps> = ({ data }) => {
  const total = useMemo(() => {
    return data.reduce((sum, item) => sum + (item.count || 0), 0);
  }, [data]);

  return (
    <Card className="h-full flex flex-col justify-between">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold text-gray-900 dark:text-gray-100">
            Pipeline Distribution
          </CardTitle>
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            {total} Total
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Current status of active applications
        </p>
      </CardHeader>

      <CardContent className="h-64 sm:h-72 w-full pt-2 flex flex-col justify-center">
        {data.length === 0 || total === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-gray-400">
            No status data available
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-4 h-full">
            {/* Donut Chart */}
            <div className="h-56 w-full sm:w-1/2 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">

                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={74}
                    paddingAngle={3}
                    dataKey="count"
                    nameKey="status"
                    strokeWidth={0}
                  >
                    {data.map((entry) => (
                      <Cell
                        key={entry.status}
                        fill={STATUS_COLORS[entry.status] || '#6366f1'}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0];
                        const pct = total > 0 ? Math.round(((Number(item.value) || 0) / total) * 100) : 0;
                        return (
                          <div className="rounded-xl border border-gray-100 bg-white p-2.5 shadow-xl dark:border-gray-800 dark:bg-gray-900 text-xs">
                            <span className="font-semibold text-gray-700 dark:text-gray-300">
                              {item.name}:
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
                </PieChart>
              </ResponsiveContainer>
              {/* Centered Total */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-gray-900 dark:text-gray-100">
                  {total}
                </span>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                  Apps
                </span>
              </div>
            </div>

            {/* Breakdown List */}
            <div className="w-full sm:w-1/2 space-y-1.5 max-h-52 overflow-y-auto pr-1">
              {data.map((item) => {
                const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
                const color = STATUS_COLORS[item.status] || '#6366f1';
                return (
                  <div
                    key={item.status}
                    className="flex items-center justify-between text-xs py-1 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <span className="font-medium text-gray-700 dark:text-gray-300 truncate">
                        {item.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-bold text-gray-900 dark:text-gray-100">
                        {item.count}
                      </span>
                      <span className="text-[11px] text-gray-400 w-8 text-right">
                        {pct}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

