import React from 'react';
import { BarChart3, PieChart, LineChart, Activity, Calendar, Clock } from 'lucide-react';

export function Analytics() {
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
            <p className="text-gray-600">Deep dive into your productivity patterns and trends</p>
          </div>
        </div>
      </div>

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
            Coming Soon
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
            Coming Soon
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
            Coming Soon
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl border border-red-200">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="w-8 h-8 text-red-600" />
            <h2 className="text-xl font-semibold text-red-900">Weekly Reports</h2>
          </div>
          <p className="text-red-700 mb-4">
            Comprehensive weekly summaries with insights and recommendations.
          </p>
          <div className="bg-red-200 text-red-800 px-3 py-1 rounded-full text-sm font-medium inline-block">
            Coming Soon
          </div>
        </div>
      </div>

      {/* Analytics Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Planned Analytics Features</h2>
          <div className="space-y-3 text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Daily, weekly, and monthly productivity trends</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>Activity category breakdowns and time allocation</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Composite score history and performance patterns</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <span>Peak productivity hours and optimal work patterns</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>Distraction analysis and focus improvement suggestions</span>
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
    </div>
  );
}