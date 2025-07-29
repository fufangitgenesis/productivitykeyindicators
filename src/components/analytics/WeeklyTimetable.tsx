import React, { useState, useEffect } from 'react';
import { format, startOfWeek, addDays, addHours, isSameDay, parseISO } from 'date-fns';
import { LogEntry } from '../../types';
import { CATEGORY_MAP } from '../../utils/constants';
import { formatTime, formatDuration } from '../../utils/calculations';
import { Clock, Calendar } from 'lucide-react';
import { clsx } from 'clsx';

interface WeeklyTimetableProps {
  logEntries: LogEntry[];
  selectedWeek: Date;
  onWeekChange: (date: Date) => void;
}

interface TimeBlock {
  entry: LogEntry;
  startHour: number;
  duration: number;
  date: string;
}

export function WeeklyTimetable({ logEntries, selectedWeek, onWeekChange }: WeeklyTimetableProps) {
  const [hoveredBlock, setHoveredBlock] = useState<string | null>(null);
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);

  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 }); // Monday
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from({ length: 24 }, (_, i) => i);

  useEffect(() => {
    // Process log entries into time blocks
    const blocks: TimeBlock[] = [];
    
logEntries.forEach(entry => {
      // Ensure the entry has a date before processing
      if (!entry.date) return;

      // Parse start time to get hour
      const [startHour, startMinute] = entry.startTime.split(':').map(Number);
      const startHourDecimal = startHour + startMinute / 60;
      
      blocks.push({
        entry,
        startHour: startHourDecimal,
        duration: entry.duration,
        date: entry.date // Use the reliable 'date' property
      });
    });
    
    setTimeBlocks(blocks);
  }, [logEntries]);

  const getBlocksForDayAndHour = (day: Date, hour: number) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    return timeBlocks.filter(block => {
      const blockDate = block.date;
      const blockStartHour = Math.floor(block.startHour);
      const blockEndHour = Math.ceil(block.startHour + block.duration / 60);
      
      return blockDate === dayStr && hour >= blockStartHour && hour < blockEndHour;
    });
  };

  const getBlockPosition = (block: TimeBlock, hour: number) => {
    const blockStartHour = block.startHour;
    const blockDurationHours = block.duration / 60;
    
    // Calculate position within the hour slot
    const startOffset = (blockStartHour - Math.floor(blockStartHour)) * 100;
    const height = Math.min(blockDurationHours * 100, 100 - startOffset);
    
    return {
      top: `${startOffset}%`,
      height: `${height}%`
    };
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = addDays(weekStart, direction === 'next' ? 7 : -7);
    onWeekChange(newWeek);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Weekly Timetable</h2>
            <p className="text-sm text-gray-600">
              {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateWeek('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Previous week"
          >
            ←
          </button>
          <button
            onClick={() => onWeekChange(new Date())}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => navigateWeek('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Next week"
          >
            →
          </button>
        </div>
      </div>

      {/* Timetable Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Day Headers */}
          <div className="grid grid-cols-8 gap-px bg-gray-200 rounded-t-lg overflow-hidden">
            <div className="bg-gray-50 p-3 text-center font-medium text-gray-700">
              Time
            </div>
            {weekDays.map(day => (
              <div
                key={day.toISOString()}
                className={clsx(
                  'bg-gray-50 p-3 text-center font-medium',
                  isSameDay(day, new Date()) ? 'text-blue-700 bg-blue-50' : 'text-gray-700'
                )}
              >
                <div className="text-sm">{format(day, 'EEE')}</div>
                <div className="text-lg">{format(day, 'd')}</div>
              </div>
            ))}
          </div>

          {/* Time Slots */}
          <div className="bg-gray-200">
            {hours.map(hour => (
              <div key={hour} className="grid grid-cols-8 gap-px">
                {/* Hour Label */}
                <div className="bg-white p-2 text-center text-sm text-gray-600 border-r">
                  {format(addHours(new Date().setHours(hour, 0, 0, 0), 0), 'HH:mm')}
                </div>
                
                {/* Day Columns */}
                {weekDays.map(day => {
                  const blocks = getBlocksForDayAndHour(day, hour);
                  
                  return (
                    <div
                      key={`${day.toISOString()}-${hour}`}
                      className="bg-white h-16 relative border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      {blocks.map((block, index) => {
                        const category = CATEGORY_MAP[block.entry.category];
                        const position = getBlockPosition(block, hour);
                        
                        return (
                          <div
                            key={`${block.entry.id}-${index}`}
                            className={clsx(
                              'absolute left-1 right-1 rounded text-xs p-1 cursor-pointer transition-all duration-200',
                              `bg-${category?.color}-100 border-l-2 border-${category?.color}-500`,
                              'hover:shadow-md hover:z-10'
                            )}
                            style={position}
                            onMouseEnter={() => setHoveredBlock(block.entry.id)}
                            onMouseLeave={() => setHoveredBlock(null)}
                            role="button"
                            tabIndex={0}
                            aria-label={`${block.entry.description} - ${formatDuration(block.entry.duration)}`}
                          >
                            <div className="font-medium text-gray-900 truncate">
                              {block.entry.description}
                            </div>
                            <div className={`text-${category?.color}-700 text-xs`}>
                              {formatDuration(block.entry.duration)}
                            </div>
                            
                            {/* Hover Tooltip */}
                            {hoveredBlock === block.entry.id && (
                              <div className="absolute z-20 bottom-full left-0 mb-2 p-3 bg-gray-900 text-white text-sm rounded-lg shadow-lg min-w-48">
                                <div className="font-medium">{block.entry.description}</div>
                                <div className="text-gray-300 mt-1">
                                  {formatTime(block.entry.startTime)} - {formatTime(block.entry.endTime)}
                                </div>
                                <div className="text-gray-300">
                                  Duration: {formatDuration(block.entry.duration)}
                                </div>
                                <div className="text-gray-300">
                                  Category: {category?.name}
                                </div>
                                <div className="text-gray-300">
                                  Points: {block.entry.points >= 0 ? '+' : ''}{block.entry.points} XP
                                </div>
                                {/* Arrow */}
                                <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4">
        {Object.values(CATEGORY_MAP).map(category => (
          <div key={category.id} className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded border-l-2 bg-${category.color}-100 border-${category.color}-500`} />
            <span className="text-sm text-gray-700">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}