import { Task, LogEntry, Plan, CompositeMetrics } from '../types';
import { CATEGORY_MAP, COMPOSITE_WEIGHTS } from './constants';

export function calculatePoints(duration: number, category: string): number {
  const categoryData = CATEGORY_MAP[category];
  if (!categoryData) return 0;
  
  return Math.round((duration / 30) * categoryData.pointsPer30Min);
}

export function calculateXPForLevel(level: number): number {
  return Math.round(300 * Math.pow(1.15, level - 1));
}

export function calculateLevelFromXP(totalXP: number): number {
  let level = 1;
  let requiredXP = 0;
  
  while (requiredXP <= totalXP) {
    requiredXP += calculateXPForLevel(level);
    if (requiredXP <= totalXP) level++;
  }
  
  return level;
}

export function calculateCompositeScore(
  tasks: Task[],
  entries: LogEntry[],
  plan?: Plan
): CompositeMetrics {
  const highPriorityTasks = tasks.filter(t => t.priority === 'high');
  const completedHighPriorityTasks = highPriorityTasks.filter(t => t.isComplete);
  
  const totalLoggedTime = entries.reduce((sum, entry) => sum + entry.duration, 0);
  const deepWorkTime = entries
    .filter(e => e.category === 'deep-work')
    .reduce((sum, entry) => sum + entry.duration, 0);
  const distractionTime = entries
    .filter(e => ['distraction', 'rabbit-hole'].includes(e.category))
    .reduce((sum, entry) => sum + entry.duration, 0);
  const restTime = entries
    .filter(e => ['scheduled-leisure', 'scheduled-break'].includes(e.category))
    .reduce((sum, entry) => sum + entry.duration, 0);
  
  const completedTasks = tasks.filter(t => t.isComplete).length;

  // Calculate metrics (0-1)
  const completionRate = highPriorityTasks.length > 0 
    ? completedHighPriorityTasks.length / highPriorityTasks.length 
    : 1;
    
  const focusRatio = totalLoggedTime > 0 ? deepWorkTime / totalLoggedTime : 0;
  
  const distractionRatio = totalLoggedTime > 0 
    ? Math.max(0, 1 - (distractionTime / totalLoggedTime))
    : 1;
    
  const throughput = Math.min(completedTasks / 10, 1);
  
  let restBalance = 1;
  if (plan) {
    const plannedRest = (plan.targets['scheduled-leisure'] || 0) + (plan.targets['scheduled-break'] || 0);
    if (plannedRest > 0) {
      restBalance = Math.max(0, 1 - Math.abs((restTime / plannedRest) - 1));
    }
  }

  const compositeScore = Math.round((
    completionRate * COMPOSITE_WEIGHTS.completionRate +
    focusRatio * COMPOSITE_WEIGHTS.focusRatio +
    distractionRatio * COMPOSITE_WEIGHTS.distractionRatio +
    throughput * COMPOSITE_WEIGHTS.throughput +
    restBalance * COMPOSITE_WEIGHTS.restBalance
  ) * 100);

  return {
    completionRate,
    focusRatio,
    distractionRatio,
    throughput,
    restBalance,
    compositeScore
  };
}

export function calculateDailyXP(entries: LogEntry[]): number {
  return entries.reduce((sum, entry) => sum + entry.points, 0);
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function formatTime(timeString: string): string {
  return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}