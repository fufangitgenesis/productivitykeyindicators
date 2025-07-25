import { ActivityCategory } from '../types';

export const ACTIVITY_CATEGORIES: ActivityCategory[] = [
  {
    id: 'deep-work',
    name: 'Deep Work',
    pointsPer30Min: 10,
    color: 'emerald',
    icon: 'brain',
    description: 'High-value tasks requiring deep concentration'
  },
  {
    id: 'shallow-work',
    name: 'Shallow Work',
    pointsPer30Min: 4,
    color: 'blue',
    icon: 'clipboard',
    description: 'Low-demand but necessary tasks (emails, planning)'
  },
  {
    id: 'scheduled-leisure',
    name: 'Scheduled Leisure',
    pointsPer30Min: 2,
    color: 'purple',
    icon: 'gamepad-2',
    description: 'Planned, restorative activities (reading, gaming)'
  },
  {
    id: 'scheduled-break',
    name: 'Scheduled Break',
    pointsPer30Min: 2,
    color: 'green',
    icon: 'coffee',
    description: 'Essential short breaks for recovery (lunch, walks)'
  },
  {
    id: 'distraction',
    name: 'Distraction',
    pointsPer30Min: -5,
    color: 'yellow',
    icon: 'smartphone',
    description: 'Unplanned, low-value diversions (social media)'
  },
  {
    id: 'rabbit-hole',
    name: 'Rabbit Hole',
    pointsPer30Min: -10,
    color: 'red',
    icon: 'spiral',
    description: 'Deep, time-consuming distractions with negative impact'
  }
];

export const CATEGORY_MAP = ACTIVITY_CATEGORIES.reduce((acc, cat) => {
  acc[cat.id] = cat;
  return acc;
}, {} as Record<string, ActivityCategory>);

export const COMPOSITE_WEIGHTS = {
  completionRate: 0.30,
  focusRatio: 0.25,
  distractionRatio: 0.20,
  throughput: 0.15,
  restBalance: 0.10
};