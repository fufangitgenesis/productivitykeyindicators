export interface Profile {
  id: number;
  name: string;
  createdAt: number;
  settings: {
    theme: 'light' | 'dark';
  };
  stats: {
    totalXP: number;
    level: number;
  };
}

export interface Plan {
  id: [number, string]; // [profileId, dateString]
  profileId: number;
  date: string; // "YYYY-MM-DD"
  targets: {
    'deep-work': number;
    'shallow-work': number;
    'scheduled-leisure': number;
    'scheduled-break': number;
    'distraction': number;
    'rabbit-hole': number;
  };
}

export interface Task {
  id: number;
  profileId: number;
  date: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  plannedDuration?: number;
  relatedCategory: string;
  isComplete: boolean;
  createdAt: number;
}

export interface LogEntry {
  id: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  category: string;
  description: string;
  points: number;
}

export interface Log {
  id: [number, string]; // [profileId, dateString]
  profileId: number;
  date: string;
  entries: LogEntry[];
}

export interface Streak {
  id: [number, string]; // [profileId, streakType]
  profileId: number;
  streakType: 'dailyLog' | 'deepWork';
  currentCount: number;
  longestCount: number;
  lastLogDate: string;
}

export interface ActivityCategory {
  id: string;
  name: string;
  pointsPer30Min: number;
  color: string;
  icon: string;
  description: string;
}

export interface CompositeMetrics {
  completionRate: number;
  focusRatio: number;
  distractionRatio: number;
  throughput: number;
  restBalance: number;
  compositeScore: number;
}