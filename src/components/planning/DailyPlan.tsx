import React from 'react';
import { Profile, Plan, Task, LogEntry } from '../../types';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { ACTIVITY_CATEGORIES, CATEGORY_MAP } from '../../utils/constants';
import { formatDuration } from '../../utils/calculations';
import { 
  Calendar, 
  Target, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Plus,
  Edit3
} from 'lucide-react';
import { clsx } from 'clsx';

interface DailyPlanProps {
  profile: Profile;
  plan?: Plan;
  tasks: Task[];
  logEntries: LogEntry[];
  onOpenBriefing: () => void;
}

export function DailyPlan({ profile, plan, tasks, logEntries, onOpenBriefing }: DailyPlanProps) {
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

  const getStatusMessage = (categoryId: string, actual: number, target: number) => {
    if (target === 0) return null;
    
    const isNegativeCategory = ['distraction', 'rabbit-hole'].includes(categoryId);
    const diff = actual - target;
    
    if (diff === 0) {
      return { message: 'Perfect! Right on target', color: 'text-emerald-600', icon: CheckCircle };
    } else if (diff > 0) {
      if (isNegativeCategory) {
        return { 
          message: `Exceeded limit by ${formatDuration(diff)}`, 
          color: 'text-red-600',
          icon: AlertCircle
        };
      } else {
        return { 
          message: `Surpassed by ${formatDuration(diff)}`, 
          color: 'text-emerald-600',
          icon: CheckCircle
        };
      }
    } else {
      return { 
        message: `${formatDuration(Math.abs(diff))} remaining`, 
        color: 'text-amber-600',
        icon: Clock
      };
    }
  };

  const completedTasks = tasks.filter(task => task.isComplete);
  const highPriorityTasks = tasks.filter(task => task.priority === 'high');
  const mediumPriorityTasks = tasks.filter(task => task.priority === 'medium');
  const lowPriorityTasks = tasks.filter(task => task.priority === 'low');

  const tasksByPriority = [
    { priority: 'high', tasks: highPriorityTasks, color: 'red', label: 'High Priority' },
    { priority: 'medium', tasks: mediumPriorityTasks, color: 'amber', label: 'Medium Priority' },
    { priority: 'low', tasks: lowPriorityTasks, color: 'blue', label: 'Low Priority' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Daily Plan</h1>
              <p className="text-gray-600">Track your progress against today's targets and tasks</p>
            </div>
          </div>
          <Button onClick={onOpenBriefing} className="flex items-center space-x-2">
            <Edit3 className="w-4 h-4" />
            <span>Open Daily Briefing</span>
          </Button>
        </div>
      </div>

      {/* Activity Targets */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center space-x-2 mb-6">
          <Target className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-semibold text-gray-900">Activity Targets</h2>
        </div>

        {!plan ? (
          <div className="text-center py-8">
            <div className="p-4 bg-gray-50 rounded-lg inline-block">
              <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 mb-2">No daily plan configured</p>
              <Button onClick={onOpenBriefing} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Create Plan
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {ACTIVITY_CATEGORIES.map(category => {
              const progress = getCategoryProgress(category.id);
              const hasTarget = plan.targets[category.id as keyof Plan['targets']] > 0;
              
              if (!hasTarget) return null;

              const status = getStatusMessage(category.id, progress.actual, progress.target);
              const StatusIcon = status?.icon;

              return (
                <div
                  key={category.id}
                  className="p-4 rounded-lg border border-gray-200 bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={clsx(
                        'w-3 h-3 rounded-full',
                        `bg-${category.color}-500`
                      )} />
                      <h3 className="font-medium text-gray-900">{category.name}</h3>
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDuration(progress.actual)} / {formatDuration(progress.target)}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <ProgressBar
                      value={progress.actual}
                      max={progress.target}
                      color={category.color as any}
                      size="sm"
                    />
                    {status && (
                      <div className="flex items-center space-x-2">
                        {StatusIcon && <StatusIcon className={clsx('w-4 h-4', status.color)} />}
                        <p className={clsx('text-sm', status.color)}>
                          {status.message}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Tasks Overview */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Tasks</h2>
          </div>
          <div className="text-sm text-gray-600">
            {completedTasks.length} of {tasks.length} completed
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="text-center py-8">
            <div className="p-4 bg-gray-50 rounded-lg inline-block">
              <CheckCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600 mb-2">No tasks configured for today</p>
              <Button onClick={onOpenBriefing} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Tasks
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Overall Progress */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <ProgressBar
                value={completedTasks.length}
                max={tasks.length}
                label="Overall Progress"
                color="emerald"
                showValue
              />
            </div>

            {/* Tasks by Priority */}
            {tasksByPriority.map(({ priority, tasks: priorityTasks, color, label }) => {
              if (priorityTasks.length === 0) return null;

              const completedInPriority = priorityTasks.filter(task => task.isComplete).length;

              return (
                <div key={priority} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 flex items-center space-x-2">
                      <div className={clsx('w-3 h-3 rounded-full', `bg-${color}-500`)} />
                      <span>{label}</span>
                    </h3>
                    <span className="text-sm text-gray-600">
                      {completedInPriority} / {priorityTasks.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {priorityTasks.map((task, index) => (
                      <div
                        key={task.id || index}
                        className={clsx(
                          'flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200',
                          task.isComplete 
                            ? 'bg-emerald-50 border-emerald-200' 
                            : 'bg-white border-gray-200'
                        )}
                      >
                        <div className={clsx(
                          'w-2 h-2 rounded-full',
                          task.isComplete ? 'bg-emerald-500' : `bg-${color}-500`
                        )} />
                        
                        <div className="flex-1 min-w-0">
                          <p className={clsx(
                            'text-sm font-medium',
                            task.isComplete ? 'line-through text-gray-500' : 'text-gray-900'
                          )}>
                            {task.description}
                          </p>
                          {task.plannedDuration && (
                            <p className="text-xs text-gray-500">
                              Planned: {formatDuration(task.plannedDuration)}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          {task.relatedCategory && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {CATEGORY_MAP[task.relatedCategory]?.name || task.relatedCategory}
                            </span>
                          )}
                          {task.isComplete && (
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}