import React from 'react';
import { Target, Trophy, Calendar, TrendingUp } from 'lucide-react';

export function Goals() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-full">
            <Target className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Goals & Targets</h1>
            <p className="text-gray-600">Set and track your productivity objectives</p>
          </div>
        </div>
      </div>

      {/* Coming Soon Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-2xl border border-emerald-200">
          <div className="flex items-center space-x-3 mb-4">
            <Trophy className="w-8 h-8 text-emerald-600" />
            <h2 className="text-xl font-semibold text-emerald-900">Weekly Goals</h2>
          </div>
          <p className="text-emerald-700 mb-4">
            Set weekly productivity targets and track your progress over time.
          </p>
          <div className="bg-emerald-200 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium inline-block">
            Coming Soon
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="w-8 h-8 text-purple-600" />
            <h2 className="text-xl font-semibold text-purple-900">Monthly Objectives</h2>
          </div>
          <p className="text-purple-700 mb-4">
            Define long-term objectives and break them down into actionable steps.
          </p>
          <div className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm font-medium inline-block">
            Coming Soon
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-2xl border border-amber-200">
          <div className="flex items-center space-x-3 mb-4">
            <TrendingUp className="w-8 h-8 text-amber-600" />
            <h2 className="text-xl font-semibold text-amber-900">Habit Tracking</h2>
          </div>
          <p className="text-amber-700 mb-4">
            Build and maintain productive habits with visual progress tracking.
          </p>
          <div className="bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-sm font-medium inline-block">
            Coming Soon
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
          <div className="flex items-center space-x-3 mb-4">
            <Target className="w-8 h-8 text-blue-600" />
            <h2 className="text-xl font-semibold text-blue-900">Smart Targets</h2>
          </div>
          <p className="text-blue-700 mb-4">
            AI-powered goal suggestions based on your productivity patterns.
          </p>
          <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm font-medium inline-block">
            Coming Soon
          </div>
        </div>
      </div>

      {/* Placeholder Content */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Goal Management Features</h2>
        <div className="space-y-3 text-gray-600">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Set SMART goals with deadlines and milestones</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <span>Track progress with visual indicators and charts</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>Receive notifications and reminders for goal deadlines</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            <span>Analyze goal completion patterns and success rates</span>
          </div>
        </div>
      </div>
    </div>
  );
}