import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ChartProps {
  data: any[];
  type: 'line' | 'area' | 'bar' | 'pie';
  title?: string;
  description?: string;
  dataKey?: string;
  dataKeys?: string[];
  xAxisKey?: string;
  colors?: string[];
  className?: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  animate?: boolean;
  animationDuration?: number;
}

const DEFAULT_COLORS = [
  'hsl(174, 72%, 40%)',
  'hsl(215, 50%, 40%)',
  'hsl(38, 92%, 50%)',
  'hsl(0, 72%, 51%)',
  'hsl(142, 71%, 45%)',
  'hsl(199, 89%, 48%)',
];

export function AnimatedChart({
  data,
  type,
  title,
  description,
  dataKey = 'value',
  dataKeys,
  xAxisKey = 'name',
  colors = DEFAULT_COLORS,
  className,
  height = 300,
  showGrid = true,
  showLegend = true,
  animate = true,
  animationDuration = 2500,
}: ChartProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Get keys to render - use dataKeys if provided, otherwise auto-detect from data
  const keysToRender = dataKeys || Object.keys(data[0] || {}).filter((key) => key !== xAxisKey);

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />}
            <XAxis dataKey={xAxisKey} className="text-xs fill-muted-foreground" />
            <YAxis className="text-xs fill-muted-foreground" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            {showLegend && <Legend />}
            {keysToRender.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ fill: colors[index % colors.length], strokeWidth: 2 }}
                animationDuration={animate ? animationDuration : 0}
                animationBegin={animate ? index * 300 : 0}
              />
            ))}
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />}
            <XAxis dataKey={xAxisKey} className="text-xs fill-muted-foreground" />
            <YAxis className="text-xs fill-muted-foreground" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            {showLegend && <Legend />}
            {keysToRender.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                fill={colors[index % colors.length]}
                fillOpacity={0.3}
                animationDuration={animate ? animationDuration : 0}
                animationBegin={animate ? index * 300 : 0}
              />
            ))}
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart data={data}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />}
            <XAxis dataKey={xAxisKey} className="text-xs fill-muted-foreground" />
            <YAxis className="text-xs fill-muted-foreground" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            {showLegend && <Legend />}
            {keysToRender.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[index % colors.length]}
                radius={[4, 4, 0, 0]}
                animationDuration={animate ? animationDuration : 0}
                animationBegin={animate ? index * 300 : 0}
              />
            ))}
          </BarChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              dataKey={dataKeys?.[0] || dataKey}
              nameKey={xAxisKey}
              animationDuration={animate ? 3000 : 0}
              animationBegin={0}
              animationEasing="ease-out"
              startAngle={90}
              endAngle={-270}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            {showLegend && <Legend />}
          </PieChart>
        );

      default:
        return null;
    }
  };

  const chartContent = (
    <div
      className={cn(
        'transition-all duration-700',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
      )}
      style={{ height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );

  if (title) {
    return (
      <Card className={cn('animate-scale-in', className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
        <CardContent>
          {chartContent}
        </CardContent>
      </Card>
    );
  }

  return <div className={className}>{chartContent}</div>;
}