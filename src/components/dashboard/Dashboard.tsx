import React from 'react';
import { Profile, Plan, Task, LogEntry, CompositeMetrics } from '../../types';
import { ProgressBar } from '../ui/ProgressBar';
import { formatDuration, calculateDailyXP } from '../../utils/calculations';
import { ACTIVITY_CATEGORIES, CATEGORY_MAP } from '../../utils/constants';
import { 
  TrendingUp, 
  Target, 
  Zap, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  BarChart3,
  Award
} from 'lucide-react';
import { clsx } from 'clsx';

interface DashboardProps {
  profile: Profile;
  plan?: Plan;
  tasks: Task[];
  logEntries: LogEntry[];
  metrics: CompositeMetrics;
}

export function Dashboard({ profile, plan, tasks, logEntries, metrics }: DashboardProps) {
  const dailyXP = calculateDailyXP(logEntries);
  const totalLoggedTime = logEntries.reduce((sum, entry) => sum + entry.duration, 0);
  const completedTasks = tasks.filter(task => task.isComplete);
  const highPriorityTasks = tasks.filter(task => task.priority === 'high');
  const completedHighPriorityTasks = highPriorityTasks.filter(task => task.isComplete);

  const getCategoryTime = (categoryId: string) => {
    return logEntries
      .filter(entry => entry.category === categoryId)
      .reduce((sum, entry) => sum + entry.duration, 0);
  };

  const getCategoryProgress = (categoryId: string) => {
    const actual = getCategoryTime(categoryId);
    const target = plan?.targets[categoryId as keyof Plan['targets']] || 0;
    return { actual, target, percentage: target > 0 ? (actual / target) * 100 : 0 };
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 font-medium">Composite Score</p>
              <p className="text-3xl font-bold text-blue-900">{metrics.compositeScore}</p>
              <p className="text-sm text-blue-600">out of 100</p>
            </div>
            <div className="p-3 bg-blue-200 rounded-full">
              <Target className="w-6 h-6 text-blue-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-2xl border border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-600 font-medium">Daily XP</p>
              <p className="text-3xl font-bold text-emerald-900">{dailyXP}</p>
              <p className="text-sm text-emerald-600">points earned</p>
            </div>
            <div className="p-3 bg-emerald-200 rounded-full">
              <Zap className="w-6 h-6 text-emerald-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-2xl border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-600 font-medium">Time Logged</p>
              <p className="text-3xl font-bold text-amber-900">{formatDuration(totalLoggedTime)}</p>
              <p className="text-sm text-amber-600">today</p>
            </div>
            <div className="p-3 bg-amber-200 rounded-full">
              <Clock className="w-6 h-6 text-amber-700" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 font-medium">Tasks Done</p>
              <p className="text-3xl font-bold text-purple-900">
                {completedTasks.length} / {tasks.length}
              </p>
              <p className="text-sm text-purple-600">completed</p>
            </div>
            <div className="p-3 bg-purple-200 rounded-full">
              <CheckCircle className="w-6 h-6 text-purple-700" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Progress */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2 mb-6">
            <BarChart3 className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Activity Progress</h2>
          </div>
          
          <div className="space-y-4">
            {ACTIVITY_CATEGORIES.map(category => {
              const progress = getCategoryProgress(category.id);
              if (progress.target === 0) return null;

              return (
                <div key={category.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full bg-${category.color}-500`} />
                      <span className="font-medium text-gray-900">{category.name}</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {formatDuration(progress.actual)} / {formatDuration(progress.target)}
                    </span>
                  </div>
                  <ProgressBar
                    value={progress.actual}
                    max={progress.target}
                    color={category.color as any}
                    size="sm"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Composite Score Breakdown */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2 mb-6">
            <Award className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Score Breakdown</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="font-medium text-blue-900">Completion Rate</span>
              <span className="text-blue-700 font-semibold">
                {Math.round(metrics.completionRate * 100)}%
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
              <span className="font-medium text-emerald-900">Focus Ratio</span>
              <span className="text-emerald-700 font-semibold">
                {Math.round(metrics.focusRatio * 100)}%
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
              <span className="font-medium text-amber-900">Distraction Control</span>
              <span className="text-amber-700 font-semibold">
                {Math.round(metrics.distractionRatio * 100)}%
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <span className="font-medium text-purple-900">Throughput</span>
              <span className="text-purple-700 font-semibold">
                {Math.round(metrics.throughput * 100)}%
              </span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="font-medium text-green-900">Rest Balance</span>
              <span className="text-green-700 font-semibold">
                {Math.round(metrics.restBalance * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & High Priority Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {logEntries.slice(-5).reverse().map((entry, index) => {
              const category = CATEGORY_MAP[entry.category];
              return (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full bg-${category?.color}-500`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{entry.description}</p>
                    <p className="text-sm text-gray-500">
                      {formatDuration(entry.duration)} • {category?.name}
                    </p>
                  </div>
                  <div className={clsx(
                    'px-2 py-1 rounded text-xs font-medium',
                    entry.points >= 0 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-red-100 text-red-700'
                  )}>
                    {entry.points >= 0 ? '+' : ''}{entry.points} XP
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* High Priority Tasks */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">High Priority Tasks</h2>
            <div className="flex items-center space-x-1">
              <span className="text-sm text-gray-500">
                {completedHighPriorityTasks.length} / {highPriorityTasks.length}
              </span>
              {highPriorityTasks.length > 0 && completedHighPriorityTasks.length === highPriorityTasks.length && (
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            {highPriorityTasks.length === 0 ? (
              <p className="text-gray-500 italic">No high priority tasks for today</p>
            ) : (
              highPriorityTasks.map((task, index) => (
                <div
                  key={task.id}
                  className={clsx(
                    'flex items-center space-x-3 p-3 rounded-lg border',
                    task.isComplete 
                      ? 'bg-emerald-50 border-emerald-200' 
                      : 'bg-white border-gray-200'
                  )}
                >
                  <div className={clsx(
                    'w-2 h-2 rounded-full',
                    task.isComplete ? 'bg-emerald-500' : 'bg-red-500'
                  )} />
                  <span className={clsx(
                    'flex-1 text-sm',
                    task.isComplete ? 'line-through text-gray-500' : 'text-gray-900'
                  )}>
                    {task.description}
                  </span>
                  {task.isComplete && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}