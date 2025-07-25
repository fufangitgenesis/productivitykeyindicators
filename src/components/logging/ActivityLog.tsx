import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { LogEntry, Profile } from '../../types';
import { ACTIVITY_CATEGORIES } from '../../utils/constants';
import { calculatePoints, formatTime, formatDuration } from '../../utils/calculations';
import { Plus, Clock, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';

interface ActivityLogProps {
  profile: Profile;
  logEntries: LogEntry[];
  onAddEntry: (entry: Omit<LogEntry, 'id' | 'points'>) => void;
  onDeleteEntry: (entryId: string) => void;
}

export function ActivityLog({ profile, logEntries, onAddEntry, onDeleteEntry }: ActivityLogProps) {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [category, setCategory] = useState('deep-work');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startTime || !endTime || !description.trim()) {
      alert('Please fill in all fields (Start Time, End Time, and Description).');
      return;
    }
    
    // Parse time strings (HH:MM format) into minutes since midnight
    const parseTimeToMinutes = (timeStr: string): number => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };
    
    const startMinutes = parseTimeToMinutes(startTime);
    const endMinutes = parseTimeToMinutes(endTime);
    
    // Calculate duration, handling cases where end time is next day
    let duration: number;
    if (endMinutes >= startMinutes) {
      // Same day
      duration = endMinutes - startMinutes;
    } else {
      // End time is next day (crosses midnight)
      duration = (24 * 60 - startMinutes) + endMinutes;
    }
    
    if (duration <= 0) {
      alert('End time must be after start time.');
      return;
    }
    
    const entry: Omit<LogEntry, 'id' | 'points'> = {
      startTime,
      endTime,
      duration,
      category,
      description: description.trim()
    };
    
    onAddEntry(entry);
    
    // Reset form
    setStartTime('');
    setEndTime('');
    setDescription('');
  };

  const totalXP = logEntries.reduce((sum, entry) => sum + entry.points, 0);
  const totalTime = logEntries.reduce((sum, entry) => sum + entry.duration, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-xl border border-emerald-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-200 rounded-lg">
              <Plus className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <p className="text-emerald-600 font-medium">Total XP</p>
              <p className="text-2xl font-bold text-emerald-900">{totalXP}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-200 rounded-lg">
              <Clock className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <p className="text-blue-600 font-medium">Time Logged</p>
              <p className="text-2xl font-bold text-blue-900">{formatDuration(totalTime)}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-200 rounded-lg">
              <Trash2 className="w-5 h-5 text-purple-700" />
            </div>
            <div>
              <p className="text-purple-600 font-medium">Entries</p>
              <p className="text-2xl font-bold text-purple-900">{logEntries.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Activity Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Log New Activity</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {ACTIVITY_CATEGORIES.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.pointsPer30Min >= 0 ? '+' : ''}{cat.pointsPer30Min} points/30min)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What did you work on?"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Log Activity
          </Button>
        </form>
      </div>

      {/* Activity List */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Today's Activities</h2>
        
        {logEntries.length === 0 ? (
          <p className="text-gray-500 italic text-center py-8">No activities logged yet today</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Time</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Duration</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Description</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">XP</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {logEntries.map((entry, index) => {
                  const categoryData = ACTIVITY_CATEGORIES.find(cat => cat.id === entry.category);
                  return (
                    <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          <div>{formatTime(entry.startTime)}</div>
                          <div className="text-gray-500">to {formatTime(entry.endTime)}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium">
                        {formatDuration(entry.duration)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full bg-${categoryData?.color}-500`} />
                          <span className="text-sm">{categoryData?.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm">{entry.description}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={clsx(
                          'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                          entry.points >= 0 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-red-100 text-red-700'
                        )}>
                          {entry.points >= 0 ? '+' : ''}{entry.points}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => onDeleteEntry(entry.id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}