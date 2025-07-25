import React from 'react';
import { Profile } from '../../types';
import { ProgressBar } from '../ui/ProgressBar';
import { calculateXPForLevel } from '../../utils/calculations';
import { Flame, Trophy } from 'lucide-react';

interface HeaderProps {
  profile: Profile;
  streaks?: {
    dailyLog: number;
    deepWork: number;
  };
}

export function Header({ profile, streaks }: HeaderProps) {
  const currentLevelXP = calculateXPForLevel(profile.stats.level);
  const nextLevelXP = calculateXPForLevel(profile.stats.level + 1);
  const progressXP = profile.stats.totalXP - (currentLevelXP - nextLevelXP);

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Productivity Key Indicator
          </h1>
          <p className="text-gray-600 text-sm">Track, analyze, and optimize your daily productivity</p>
        </div>

        <div className="flex items-center space-x-6">
          {/* Streaks */}
          {streaks && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 bg-orange-50 px-3 py-1 rounded-full">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium text-orange-700">{streaks.dailyLog}</span>
              </div>
              <div className="flex items-center space-x-1 bg-emerald-50 px-3 py-1 rounded-full">
                <Trophy className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-medium text-emerald-700">{streaks.deepWork}</span>
              </div>
            </div>
          )}

          {/* Profile Block */}
          <div className="flex items-center space-x-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {profile.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-medium text-gray-900 text-sm">{profile.name}</p>
              <div className="flex items-center space-x-2">
                <p className="text-xs text-gray-600">Level {profile.stats.level}</p>
                <div className="w-20">
                  <ProgressBar
                    value={progressXP}
                    max={nextLevelXP}
                    color="purple"
                    size="sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}