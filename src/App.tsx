import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useDatabase } from './hooks/useDatabase';
import { db } from './utils/database';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/dashboard/Dashboard';
import { ActivityLog } from './components/logging/ActivityLog';
import { DailyBriefing } from './components/modals/DailyBriefing';
import { Goals } from './components/Goals';
import { Analytics } from './components/Analytics';
import { Profile, Plan, Task, Log, LogEntry, Streak } from './types';
import { calculateCompositeScore, calculatePoints } from './utils/calculations';

function App() {
  const { isInitialized, currentProfile } = useDatabase();
  const [currentView, setCurrentView] = useState('dashboard');
  const [showDailyBriefing, setShowDailyBriefing] = useState(false);
  
  // Current date data
  const today = format(new Date(), 'yyyy-MM-dd');
  const [plan, setPlan] = useState<Plan | undefined>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [streaks, setStreaks] = useState<{dailyLog: number; deepWork: number}>({
    dailyLog: 0,
    deepWork: 0
  });

  // Load today's data
  useEffect(() => {
    if (!currentProfile) return;

    const loadTodayData = async () => {
      try {
        // Load plan
        const planData = await db.get<Plan>('plans', [currentProfile.id, today]);
        setPlan(planData);

        // Load tasks
        const taskData = await db.getByIndex<Task>('tasks', 'profileDate', [currentProfile.id, today]);
        setTasks(taskData);

        // Load log
        const logData = await db.get<Log>('logs', [currentProfile.id, today]);
        setLogEntries(logData?.entries || []);

        // Load streaks
        const dailyLogStreak = await db.get<Streak>('streaks', [currentProfile.id, 'dailyLog']);
        const deepWorkStreak = await db.get<Streak>('streaks', [currentProfile.id, 'deepWork']);
        setStreaks({
          dailyLog: dailyLogStreak?.currentCount || 0,
          deepWork: deepWorkStreak?.currentCount || 0
        });

        // Show daily briefing if no plan exists
        if (!planData) {
          setShowDailyBriefing(true);
        }
      } catch (error) {
        console.error('Error loading today data:', error);
      }
    };

    loadTodayData();
  }, [currentProfile, today]);

  const handleSavePlan = async (targets: Plan['targets']) => {
    if (!currentProfile) return;

    try {
      const planData: Plan = {
        id: [currentProfile.id, today],
        profileId: currentProfile.id,
        date: today,
        targets
      };

      await db.put('plans', planData);
      setPlan(planData);
    } catch (error) {
      console.error('Error saving plan:', error);
    }
  };

  const handleSaveTasks = async (newTasks: Omit<Task, 'id'>[]) => {
    if (!currentProfile) return;

    try {
      // Delete existing tasks for today
      const existingTasks = await db.getByIndex<Task>('tasks', 'profileDate', [currentProfile.id, today]);
      for (const task of existingTasks) {
        await db.delete('tasks', task.id);
      }

      // Add new tasks
      const savedTasks = [];
      for (const task of newTasks) {
        const saved = await db.add<Task>('tasks', task);
        savedTasks.push(saved);
      }

      setTasks(savedTasks);
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  const handleAddLogEntry = async (entryData: Omit<LogEntry, 'id' | 'points'>) => {
    if (!currentProfile) return;

    try {
      const points = calculatePoints(entryData.duration, entryData.category);
      const entry: LogEntry = {
        ...entryData,
        id: Date.now().toString(),
        points
      };

      const existingLog = await db.get<Log>('logs', [currentProfile.id, today]);
      const updatedEntries = existingLog ? [...existingLog.entries, entry] : [entry];

      const logData: Log = {
        id: [currentProfile.id, today],
        profileId: currentProfile.id,
        date: today,
        entries: updatedEntries
      };

      await db.put('logs', logData);
      setLogEntries(updatedEntries);

      // Update daily log streak
      await updateStreak('dailyLog');
      
      // Update XP
      await updateProfileXP(points);
    } catch (error) {
      console.error('Error adding log entry:', error);
    }
  };

  const handleDeleteLogEntry = async (entryId: string) => {
    if (!currentProfile) return;

    try {
      const updatedEntries = logEntries.filter(entry => entry.id !== entryId);
      
      const logData: Log = {
        id: [currentProfile.id, today],
        profileId: currentProfile.id,
        date: today,
        entries: updatedEntries
      };

      await db.put('logs', logData);
      setLogEntries(updatedEntries);
    } catch (error) {
      console.error('Error deleting log entry:', error);
    }
  };

  const updateStreak = async (streakType: 'dailyLog' | 'deepWork') => {
    if (!currentProfile) return;

    try {
      const existingStreak = await db.get<Streak>('streaks', [currentProfile.id, streakType]);
      
      const streakData: Streak = {
        id: [currentProfile.id, streakType],
        profileId: currentProfile.id,
        streakType,
        currentCount: existingStreak ? existingStreak.currentCount + 1 : 1,
        longestCount: existingStreak ? Math.max(existingStreak.longestCount, existingStreak.currentCount + 1) : 1,
        lastLogDate: today
      };

      await db.put('streaks', streakData);
      
      setStreaks(prev => ({
        ...prev,
        [streakType]: streakData.currentCount
      }));
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  const updateProfileXP = async (xpToAdd: number) => {
    if (!currentProfile) return;

    try {
      const updatedProfile: Profile = {
        ...currentProfile,
        stats: {
          ...currentProfile.stats,
          totalXP: currentProfile.stats.totalXP + xpToAdd
        }
      };

      await db.put('profiles', updatedProfile);
    } catch (error) {
      console.error('Error updating XP:', error);
    }
  };

  if (!isInitialized || !currentProfile) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <p className="text-gray-600">Loading PKI...</p>
        </div>
      </div>
    );
  }

  const metrics = calculateCompositeScore(tasks, logEntries, plan);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <div className="ml-16 flex flex-col">
        <Header profile={currentProfile} streaks={streaks} />
        
        <main className="flex-1">
          {currentView === 'dashboard' && (
            <Dashboard
              profile={currentProfile}
              plan={plan}
              tasks={tasks}
              logEntries={logEntries}
              metrics={metrics}
            />
          )}
          
          {currentView === 'log' && (
            <ActivityLog
              profile={currentProfile}
              logEntries={logEntries}
              onAddEntry={handleAddLogEntry}
              onDeleteEntry={handleDeleteLogEntry}
            />
          )}

          {currentView === 'plan' && (
            <div className="p-6">
              <button
                onClick={() => setShowDailyBriefing(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Open Daily Briefing
              </button>
            </div>
          )}

          {currentView === 'goals' && (
            <div className="p-6">
              <Goals />
            </div>
          )}

          {currentView === 'analytics' && (
            <div className="p-6">
              <Analytics />
            </div>
          )}
        </main>
      </div>

      <DailyBriefing
        isOpen={showDailyBriefing}
        onClose={() => setShowDailyBriefing(false)}
        profile={currentProfile}
        date={today}
        plan={plan}
        tasks={tasks}
        logEntries={logEntries}
        onSavePlan={handleSavePlan}
        onSaveTasks={handleSaveTasks}
      />
    </div>
  );
}

export default App;