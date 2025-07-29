import React from 'react';
import { useState, useEffect } from 'react';
import { BarChart3, PieChart, LineChart, Activity, Calendar, Clock } from 'lucide-react';
import { WeeklyTimetable } from './analytics/WeeklyTimetable';
import { WeeklyReports } from './analytics/WeeklyReports';
import { useDatabase } from '../hooks/useDatabase';
import { db } from '../utils/database';
import { LogEntry, Task, Plan } from '../types';
import { format, subWeeks } from 'date-fns';

export function Analytics() {
  const { currentProfile } = useDatabase();
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<'overview' | 'timetable' | 'reports'>('overview');

  useEffect(() => {
    if (!currentProfile) return;
    loadAnalyticsData();
  }, [currentProfile, selectedWeek]);

  const loadAnalyticsData = async () => {
    if (!currentProfile) return;
    
    setIsLoading(true);
    try {
      // Load data for the last 12 weeks for comprehensive analytics
      const startDate = subWeeks(new Date(), 12);
      const endDate = new Date();
      
      // Generate date range
      const dates: string[] = [];
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        dates.push(format(currentDate, 'yyyy-MM-dd'));
        currentDate.setDate(currentDate.getDate() + 1);
      }

      // Load logs for all dates
      const allLogEntries: LogEntry[] = [];
      const allTasks: Task[] = [];
      const allPlans: Plan[] = [];

      for (const date of dates) {
        try {
          // Load log entries
          const logData = await db.get<{ entries: LogEntry[] }>('logs', [currentProfile.id, date]);
          if (logData?.entries) {
            allLogEntries.push(...logData.entries);
          }

          // Load tasks
          const taskData = await db.getByIndex<Task>('tasks', 'profileDate', [currentProfile.id, date]);
          allTasks.push(...taskData);

          // Load plans
          const planData = await db.get<Plan>('plans', [currentProfile.id, date]);
          if (planData) {
            allPlans.push(planData);
          }
        } catch (error) {
          // Continue loading other dates even if one fails
          console.warn(`Failed to load data for ${date}:`, error);
        }
      }

      setLogEntries(allLogEntries);
      setTasks(allTasks);
      setPlans(allPlans);
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-purple-100 rounded-full">
            <BarChart3 className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics & Insights</h1>
            <p className="text-gray-600">
              {isLoading ? 'Loading analytics data...' : 'Deep dive into your productivity patterns and trends'}
            </p>
          </div>
        </div>
        
        {/* View Toggle */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mt-4">
          <button
            onClick={() => setActiveView('overview')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
              activeView === 'overview'
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveView('timetable')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
              activeView === 'timetable'
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Weekly Timetable
          </button>
          <button
            onClick={() => setActiveView('reports')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
              activeView === 'reports'
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Weekly Reports
          </button>
        </div>
      </div>

      {/* Content based on active view */}
      {activeView === 'overview' && (
        <>
          {/* Coming Soon Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
              <div className="flex items-center space-x-3 mb-4">
                <LineChart className="w-8 h-8 text-blue-600" />
                <h2 className="text-xl font-semibold text-blue-900">Productivity Trends</h2>
              </div>
              <p className="text-blue-700 mb-4">
                Visualize your productivity patterns over time with interactive line charts.
              </p>
              <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm font-medium inline-block">
                Available in Weekly Reports
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-2xl border border-emerald-200">
              <div className="flex items-center space-x-3 mb-4">
                <PieChart className="w-8 h-8 text-emerald-600" />
                <h2 className="text-xl font-semibold text-emerald-900">Time Distribution</h2>
              </div>
              <p className="text-emerald-700 mb-4">
                See how you spend your time across different activity categories.
              </p>
              <div className="bg-emerald-200 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium inline-block">
                Available in Weekly Reports
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-2xl border border-amber-200">
              <div className="flex items-center space-x-3 mb-4">
                <Activity className="w-8 h-8 text-amber-600" />
                <h2 className="text-xl font-semibold text-amber-900">Performance Metrics</h2>
              </div>
              <p className="text-amber-700 mb-4">
                Track key performance indicators and composite scores over time.
              </p>
              <div className="bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-sm font-medium inline-block">
                Available in Weekly Reports
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl border border-red-200">
              <div className="flex items-center space-x-3 mb-4">
                <Calendar className="w-8 h-8 text-red-600" />
                <h2 className="text-xl font-semibold text-red-900">Weekly Timetable</h2>
              </div>
              <p className="text-red-700 mb-4">
                Visual grid showing all your logged activities across the week.
              </p>
              <div className="bg-red-200 text-red-800 px-3 py-1 rounded-full text-sm font-medium inline-block">
                Available Now
              </div>
            </div>
          </div>

          {/* Analytics Features */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Analytics Features</h2>
              <div className="space-y-3 text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Weekly timetable with visual time blocks</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span>Comprehensive weekly reports with trend analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Automated insights and pattern recognition</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span>Peak productivity hours identification</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Activity category breakdowns and time allocation</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Insights</h2>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Time Tracking</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Detailed analysis of how you spend your time across different activities and categories.
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <BarChart3 className="w-5 h-5 text-gray-600" />
                    <span className="font-medium text-gray-900">Performance Analytics</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Track your productivity metrics and identify patterns for continuous improvement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeView === 'timetable' && !isLoading && (
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
          <WeeklyTimetable
            logEntries={logEntries}
            selectedWeek={selectedWeek}
            onWeekChange={setSelectedWeek}
          />
        </div>
      )}

      {activeView === 'reports' && !isLoading && (
        <WeeklyReports
          logEntries={logEntries}
          tasks={tasks}
          plans={plans}
        />
      )}
    </div>
  );
}