import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { Plus, Trash2, Edit3 } from 'lucide-react';
import { Plan, Task, Profile, LogEntry } from '../../types';
import { ACTIVITY_CATEGORIES, CATEGORY_MAP } from '../../utils/constants';
import { formatDuration } from '../../utils/calculations';
import { clsx } from 'clsx';

interface DailyBriefingProps {
  isOpen: boolean;
  onClose: () => void;
  profile: Profile;
  date: string;
  plan?: Plan;
  tasks: Task[];
  logEntries: LogEntry[];
  onSavePlan: (targets: Plan['targets']) => void;
  onSaveTasks: (tasks: Omit<Task, 'id'>[]) => void;
}

export function DailyBriefing({
  isOpen,
  onClose,
  profile,
  date,
  plan,
  tasks,
  logEntries,
  onSavePlan,
  onSaveTasks
}: DailyBriefingProps) {
  const [activeTab, setActiveTab] = useState<'plan' | 'tasks'>('plan');
  const [targets, setTargets] = useState<Plan['targets']>({
    'deep-work': 0,
    'shallow-work': 0,
    'scheduled-leisure': 0,
    'scheduled-break': 0,
    'distraction': 0,
    'rabbit-hole': 0
  });
  const [taskList, setTaskList] = useState<Omit<Task, 'id'>[]>([]);
  const [newTaskDescription, setNewTaskDescription] = useState('');

  useEffect(() => {
    if (plan) {
      setTargets(plan.targets);
    }
    
    setTaskList(tasks.map(task => ({
      profileId: task.profileId,
      date: task.date,
      description: task.description,
      priority: task.priority,
      plannedDuration: task.plannedDuration,
      relatedCategory: task.relatedCategory,
      isComplete: task.isComplete,
      createdAt: task.createdAt
    })));
  }, [plan, tasks]);

  const handleTargetChange = (category: string, value: string) => {
    const minutes = parseInt(value) || 0;
    setTargets(prev => ({ ...prev, [category]: minutes }));
  };

  const addTask = () => {
    if (!newTaskDescription.trim()) return;
    
    const newTask: Omit<Task, 'id'> = {
      profileId: profile.id!,
      date,
      description: newTaskDescription.trim(),
      priority: 'medium',
      relatedCategory: 'deep-work',
      isComplete: false,
      createdAt: Date.now()
    };
    
    setTaskList(prev => [...prev, newTask]);
    setNewTaskDescription('');
  };

  const updateTask = (index: number, updates: Partial<Omit<Task, 'id'>>) => {
    setTaskList(prev => prev.map((task, i) => 
      i === index ? { ...task, ...updates } : task
    ));
  };

  const deleteTask = (index: number) => {
    setTaskList(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (activeTab === 'plan') {
      onSavePlan(targets);
    } else {
      onSaveTasks(taskList);
    }
    onClose();
  };

  const getProgressForCategory = (categoryId: string) => {
    const actual = logEntries
      .filter(entry => entry.category === categoryId)
      .reduce((sum, entry) => sum + entry.duration, 0);
    const target = targets[categoryId as keyof Plan['targets']] || 0;
    return { actual, target };
  };

  const getStatusMessage = (categoryId: string, actual: number, target: number) => {
    if (target === 0) return null;
    
    const isNegativeCategory = ['distraction', 'rabbit-hole'].includes(categoryId);
    const diff = actual - target;
    
    if (diff === 0) {
      return { message: 'Perfect! Right on target', color: 'text-emerald-600' };
    } else if (diff > 0) {
      if (isNegativeCategory) {
        return { 
          message: `You've exceeded your ${CATEGORY_MAP[categoryId]?.name} limit by ${formatDuration(diff)}. Try to refocus.`, 
          color: 'text-red-600' 
        };
      } else {
        return { 
          message: `Surpassed target by ${formatDuration(diff)} – excellent!`, 
          color: 'text-emerald-600' 
        };
      }
    } else {
      return { 
        message: `${formatDuration(Math.abs(diff))} remaining to reach target`, 
        color: 'text-amber-600' 
      };
    }
  };

  const completedTasks = taskList.filter(task => task.isComplete).length;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Daily Briefing" size="lg">
      <div className="p-6">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab('plan')}
            className={clsx(
              'flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200',
              activeTab === 'plan'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            Plan
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={clsx(
              'flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200',
              activeTab === 'tasks'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            )}
          >
            Tasks
          </button>
        </div>

        {/* Plan Tab */}
        {activeTab === 'plan' && (
          <div className="space-y-6">
            <div className="grid gap-4">
              {ACTIVITY_CATEGORIES.map(category => {
                const progress = getProgressForCategory(category.id);
                const status = getStatusMessage(category.id, progress.actual, progress.target);
                const hasTarget = targets[category.id as keyof Plan['targets']] > 0;

                return (
                  <div
                    key={category.id}
                    className={clsx(
                      'p-4 rounded-lg border transition-all duration-200',
                      hasTarget ? 'border-gray-200 bg-gray-50' : 'border-gray-100'
                    )}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className={clsx(
                          'w-3 h-3 rounded-full',
                          `bg-${category.color}-500`
                        )} />
                        <h3 className="font-medium text-gray-900">{category.name}</h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          min="0"
                          placeholder="0"
                          value={targets[category.id as keyof Plan['targets']] || ''}
                          onChange={(e) => handleTargetChange(category.id, e.target.value)}
                          className="w-20 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <span className="text-sm text-gray-500">min</span>
                      </div>
                    </div>

                    {hasTarget && (
                      <div className="space-y-2">
                        <ProgressBar
                          value={progress.actual}
                          max={progress.target}
                          color={category.color as any}
                          size="sm"
                          showValue
                        />
                        {status && (
                          <p className={clsx('text-sm', status.color)}>
                            {status.message}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            {/* Add Task */}
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Add a new task..."
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Button onClick={addTask} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Task Progress */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <ProgressBar
                value={completedTasks}
                max={taskList.length}
                label={`Tasks: ${completedTasks} / ${taskList.length} completed`}
                color="emerald"
                showValue
              />
            </div>

            {/* Task List */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {taskList.map((task, index) => (
                <div
                  key={index}
                  className={clsx(
                    'flex items-center space-x-3 p-3 rounded-lg border transition-all duration-200',
                    task.isComplete 
                      ? 'bg-emerald-50 border-emerald-200' 
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  )}
                >
                  <input
                    type="checkbox"
                    checked={task.isComplete}
                    onChange={(e) => updateTask(index, { isComplete: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  
                  <input
                    type="text"
                    value={task.description}
                    onChange={(e) => updateTask(index, { description: e.target.value })}
                    className={clsx(
                      'flex-1 bg-transparent border-none focus:outline-none',
                      task.isComplete && 'line-through text-gray-500'
                    )}
                  />
                  
                  <select
                    value={task.priority}
                    onChange={(e) => updateTask(index, { priority: e.target.value as Task['priority'] })}
                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  
                  <button
                    onClick={() => deleteTask(index)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <Button variant="ghost" onClick={onClose}>
            Skip for Today
          </Button>
          <div className="space-x-2">
            <Button variant="secondary" onClick={() => {
              if (activeTab === 'plan') {
                setTargets({
                  'deep-work': 0,
                  'shallow-work': 0,
                  'scheduled-leisure': 0,
                  'scheduled-break': 0,
                  'distraction': 0,
                  'rabbit-hole': 0
                });
              } else {
                setTaskList([]);
              }
            }}>
              Reset {activeTab === 'plan' ? 'Plan' : 'Tasks'}
            </Button>
            <Button onClick={handleSave}>
              Save {activeTab === 'plan' ? 'Plan' : 'Tasks'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}