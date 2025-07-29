import React, { useState, useEffect } from 'react';
import { format, subWeeks, startOfWeek, endOfWeek, eachWeekOfInterval } from 'date-fns';
import { LogEntry, Task, Plan } from '../../types';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { CATEGORY_MAP } from '../../utils/constants';
import { formatDuration, calculateCompositeScore } from '../../utils/calculations';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Download, 
  Calendar,
  Clock,
  Target,
  Zap,
  Brain,
  AlertTriangle,
  CheckCircle,
  Filter
} from 'lucide-react';
import { clsx } from 'clsx';

interface WeeklyReportsProps {
  logEntries: LogEntry[];
  tasks: Task[];
  plans: Plan[];
}

interface WeeklyData {
  week: Date;
  totalHours: number;
  productivityScore: number;
  focusRatio: number;
  completionRate: number;
  topActivities: { category: string; hours: number }[];
  insights: string[];
}

interface ChartData {
  week: string;
  totalHours: number;
  productivityScore: number;
  focusRatio: number;
  completionRate: number;
}

export function WeeklyReports({ logEntries, tasks, plans }: WeeklyReportsProps) {
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState({
    totalHours: true,
    productivityScore: true,
    focusRatio: false,
    completionRate: true
  });
  const [timeRange, setTimeRange] = useState(8); // weeks
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    generateWeeklyReports();
  }, [logEntries, tasks, plans, timeRange]);

  const generateWeeklyReports = () => {
    setIsLoading(true);
    
    const endDate = new Date();
    const startDate = subWeeks(endDate, timeRange);
    
    const weeks = eachWeekOfInterval(
      { start: startDate, end: endDate },
      { weekStartsOn: 1 }
    );

    const weeklyAnalytics: WeeklyData[] = weeks.map(week => {
      const weekStart = startOfWeek(week, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(week, { weekStartsOn: 1 });
      
      // Filter data for this week
      const weekEntries = logEntries.filter(entry => {
        const entryDate = new Date(entry.startTime);
        return entryDate >= weekStart && entryDate <= weekEnd;
      });
      
      const weekTasks = tasks.filter(task => {
        const taskDate = new Date(task.date);
        return taskDate >= weekStart && taskDate <= weekEnd;
      });
      
      const weekPlans = plans.filter(plan => {
        const planDate = new Date(plan.date);
        return planDate >= weekStart && planDate <= weekEnd;
      });

      // Calculate metrics
      const totalHours = weekEntries.reduce((sum, entry) => sum + entry.duration, 0) / 60;
      
      // Calculate composite metrics for the week
      const weekMetrics = calculateCompositeScore(weekTasks, weekEntries, weekPlans[0]);
      
      // Calculate focus ratio
      const deepWorkTime = weekEntries
        .filter(entry => entry.category === 'deep-work')
        .reduce((sum, entry) => sum + entry.duration, 0);
      const totalTime = weekEntries.reduce((sum, entry) => sum + entry.duration, 0);
      const focusRatio = totalTime > 0 ? (deepWorkTime / totalTime) * 100 : 0;

      // Calculate completion rate
      const completedTasks = weekTasks.filter(task => task.isComplete).length;
      const completionRate = weekTasks.length > 0 ? (completedTasks / weekTasks.length) * 100 : 0;

      // Top activities
      const activityHours: Record<string, number> = {};
      weekEntries.forEach(entry => {
        activityHours[entry.category] = (activityHours[entry.category] || 0) + entry.duration / 60;
      });
      
      const topActivities = Object.entries(activityHours)
        .map(([category, hours]) => ({ category, hours }))
        .sort((a, b) => b.hours - a.hours)
        .slice(0, 3);

      // Generate insights
      const insights = generateInsights(weekEntries, weekTasks, totalHours, focusRatio);

      return {
        week: weekStart,
        totalHours,
        productivityScore: weekMetrics.compositeScore,
        focusRatio,
        completionRate,
        topActivities,
        insights
      };
    });

    setWeeklyData(weeklyAnalytics);
    
    // Prepare chart data
    const chartDataFormatted: ChartData[] = weeklyAnalytics.map(data => ({
      week: format(data.week, 'MMM d'),
      totalHours: Math.round(data.totalHours * 10) / 10,
      productivityScore: data.productivityScore,
      focusRatio: Math.round(data.focusRatio),
      completionRate: Math.round(data.completionRate)
    }));

    setChartData(chartDataFormatted);
    setIsLoading(false);
  };

  const generateInsights = (entries: LogEntry[], tasks: Task[], totalHours: number, focusRatio: number): string[] => {
    const insights: string[] = [];
    
    // Activity pattern insights
    const hourlyActivity: Record<number, number> = {};
    entries.forEach(entry => {
      const hour = parseInt(entry.startTime.split(':')[0]);
      hourlyActivity[hour] = (hourlyActivity[hour] || 0) + entry.duration;
    });
    
    const peakHour = Object.entries(hourlyActivity)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (peakHour) {
      insights.push(`Peak productivity: ${peakHour[0]}:00 - ${parseInt(peakHour[0]) + 1}:00`);
    }

    // Focus insights
    if (focusRatio > 60) {
      insights.push('Excellent focus ratio this week!');
    } else if (focusRatio < 30) {
      insights.push('Consider scheduling more deep work sessions');
    }

    // Volume insights
    if (totalHours > 40) {
      insights.push('High activity week - ensure adequate rest');
    } else if (totalHours < 20) {
      insights.push('Light activity week - opportunity to increase engagement');
    }

    return insights;
  };

  const exportReport = () => {
    const csvContent = [
      ['Week', 'Total Hours', 'Productivity Score', 'Focus Ratio', 'Completion Rate'],
      ...chartData.map(row => [
        row.week,
        row.totalHours,
        row.productivityScore,
        row.focusRatio,
        row.completionRate
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weekly-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getMetricTrend = (metric: keyof ChartData, weeks: number = 2) => {
    if (chartData.length < weeks) return 'stable';
    
    const recent = chartData.slice(-weeks);
    const first = recent[0][metric] as number;
    const last = recent[recent.length - 1][metric] as number;
    
    const change = ((last - first) / first) * 100;
    
    if (change > 5) return 'up';
    if (change < -5) return 'down';
    return 'stable';
  };

  const renderMiniChart = (data: ChartData[], metric: keyof ChartData, color: string) => {
    const values = data.map(d => d[metric] as number);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;

    return (
      <div className="flex items-end space-x-1 h-12">
        {values.map((value, index) => {
          const height = ((value - min) / range) * 100;
          return (
            <div
              key={index}
              className={`w-2 bg-${color}-500 rounded-t`}
              style={{ height: `${Math.max(height, 5)}%` }}
            />
          );
        })}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const latestWeek = weeklyData[weeklyData.length - 1];

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Weekly Reports</h2>
              <p className="text-sm text-gray-600">
                Analytics for the last {timeRange} weeks
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value={4}>4 weeks</option>
              <option value={8}>8 weeks</option>
              <option value={12}>12 weeks</option>
              <option value={24}>24 weeks</option>
            </select>
            
            <Button onClick={exportReport} variant="secondary" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Metric Toggles */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(selectedMetrics).map(([metric, enabled]) => (
            <button
              key={metric}
              onClick={() => setSelectedMetrics(prev => ({ ...prev, [metric]: !enabled }))}
              className={clsx(
                'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                enabled
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {metric.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-blue-200 rounded-lg">
              <Clock className="w-4 h-4 text-blue-700" />
            </div>
            {getMetricTrend('totalHours') === 'up' ? (
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            ) : getMetricTrend('totalHours') === 'down' ? (
              <TrendingDown className="w-4 h-4 text-red-600" />
            ) : null}
          </div>
          <div className="mb-2">
            <p className="text-2xl font-bold text-blue-900">
              {latestWeek ? Math.round(latestWeek.totalHours * 10) / 10 : 0}h
            </p>
            <p className="text-sm text-blue-600">Total Hours</p>
          </div>
          {renderMiniChart(chartData, 'totalHours', 'blue')}
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-emerald-200 rounded-lg">
              <Target className="w-4 h-4 text-emerald-700" />
            </div>
            {getMetricTrend('productivityScore') === 'up' ? (
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            ) : getMetricTrend('productivityScore') === 'down' ? (
              <TrendingDown className="w-4 h-4 text-red-600" />
            ) : null}
          </div>
          <div className="mb-2">
            <p className="text-2xl font-bold text-emerald-900">
              {latestWeek ? latestWeek.productivityScore : 0}
            </p>
            <p className="text-sm text-emerald-600">Productivity Score</p>
          </div>
          {renderMiniChart(chartData, 'productivityScore', 'emerald')}
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-purple-200 rounded-lg">
              <Brain className="w-4 h-4 text-purple-700" />
            </div>
            {getMetricTrend('focusRatio') === 'up' ? (
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            ) : getMetricTrend('focusRatio') === 'down' ? (
              <TrendingDown className="w-4 h-4 text-red-600" />
            ) : null}
          </div>
          <div className="mb-2">
            <p className="text-2xl font-bold text-purple-900">
              {latestWeek ? Math.round(latestWeek.focusRatio) : 0}%
            </p>
            <p className="text-sm text-purple-600">Focus Ratio</p>
          </div>
          {renderMiniChart(chartData, 'focusRatio', 'purple')}
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-xl border border-amber-200">
          <div className="flex items-center justify-between mb-2">
            <div className="p-2 bg-amber-200 rounded-lg">
              <CheckCircle className="w-4 h-4 text-amber-700" />
            </div>
            {getMetricTrend('completionRate') === 'up' ? (
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            ) : getMetricTrend('completionRate') === 'down' ? (
              <TrendingDown className="w-4 h-4 text-red-600" />
            ) : null}
          </div>
          <div className="mb-2">
            <p className="text-2xl font-bold text-amber-900">
              {latestWeek ? Math.round(latestWeek.completionRate) : 0}%
            </p>
            <p className="text-sm text-amber-600">Completion Rate</p>
          </div>
          {renderMiniChart(chartData, 'completionRate', 'amber')}
        </div>
      </div>

      {/* Insights and Recommendations */}
      {latestWeek && latestWeek.insights.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <Zap className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-semibold text-gray-900">Weekly Insights</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {latestWeek.insights.map((insight, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-amber-50 rounded-lg">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-amber-800">{insight}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Activities */}
      {latestWeek && latestWeek.topActivities.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Activities This Week</h3>
          
          <div className="space-y-3">
            {latestWeek.topActivities.map((activity, index) => {
              const category = CATEGORY_MAP[activity.category];
              const percentage = (activity.hours / latestWeek.totalHours) * 100;
              
              return (
                <div key={activity.category} className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 w-32">
                    <div className={`w-3 h-3 rounded-full bg-${category?.color}-500`} />
                    <span className="text-sm font-medium text-gray-900">
                      {category?.name}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <ProgressBar
                      value={percentage}
                      max={100}
                      color={category?.color as any}
                      size="sm"
                    />
                  </div>
                  
                  <div className="text-sm text-gray-600 w-16 text-right">
                    {Math.round(activity.hours * 10) / 10}h
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}