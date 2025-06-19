import { useState } from 'react';
import { ProjectTask } from '@shared/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ProjectScheduleProps {
  tasks?: ProjectTask[];
  projectId: number;
}

export function ProjectSchedule({ tasks = [], projectId }: ProjectScheduleProps) {
  const [viewMode, setViewMode] = useState<'week' | 'month' | 'quarter'>('week');

  // Generate week dates for demo
  const generateWeekDates = () => {
    const dates = [];
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push({
        date,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: date.getDate(),
        month: date.getMonth() + 1,
      });
    }
    return dates;
  };

  const weekDates = generateWeekDates();

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      plumbing: 'bg-construction-blue',
      electrical: 'bg-project-green',
      framing: 'bg-safety-orange',
      drywall: 'bg-purple-500',
      painting: 'bg-yellow-500',
      flooring: 'bg-pink-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  const getCategoryLetter = (category: string) => {
    const letters: Record<string, string> = {
      plumbing: 'P',
      electrical: 'E',
      framing: 'F',
      drywall: 'D',
      painting: 'Pa',
      flooring: 'Fl',
    };
    return letters[category] || category.charAt(0).toUpperCase();
  };

  // Mock schedule data for demonstration
  const mockScheduleRows = [
    {
      projectName: 'Kitchen Remodel',
      taskName: 'Plumbing Phase',
      category: 'plumbing',
      schedule: [true, true, false, false, false, false, false],
    },
    {
      projectName: 'Kitchen Remodel',
      taskName: 'Electrical Work',
      category: 'electrical',
      schedule: [false, false, true, false, false, false, false],
    },
    {
      projectName: 'Bathroom Addition',
      taskName: 'Framing',
      category: 'framing',
      schedule: [false, false, true, true, true, false, false],
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Project Schedule</CardTitle>
          <div className="flex space-x-2 mt-4 sm:mt-0">
            <Button
              variant={viewMode === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('week')}
              className={viewMode === 'week' ? 'bg-construction-blue' : ''}
            >
              Week
            </Button>
            <Button
              variant={viewMode === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('month')}
            >
              Month
            </Button>
            <Button
              variant={viewMode === 'quarter' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('quarter')}
            >
              Quarter
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Timeline Header */}
            <div className="flex border-b border-gray-200 pb-2 mb-4">
              <div className="w-48 flex-shrink-0 font-medium text-gray-700">
                Project / Task
              </div>
              <div className="flex-1 grid grid-cols-7 gap-1 text-center text-sm text-gray-600">
                {weekDates.map((day, index) => (
                  <div
                    key={index}
                    className={`py-1 ${
                      day.date.toDateString() === new Date().toDateString()
                        ? 'bg-blue-50 rounded text-construction-blue font-medium'
                        : ''
                    }`}
                  >
                    {day.dayName} {day.month}/{day.dayNum}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Schedule Rows */}
            <div className="space-y-3">
              {mockScheduleRows.map((row, rowIndex) => (
                <div key={rowIndex} className="flex items-center">
                  <div className="w-48 flex-shrink-0">
                    <div className="font-medium text-sm">{row.projectName}</div>
                    <div className="text-xs text-gray-500">{row.taskName}</div>
                  </div>
                  <div className="flex-1 grid grid-cols-7 gap-1 h-8">
                    {row.schedule.map((isActive, dayIndex) => (
                      <div
                        key={dayIndex}
                        className={`rounded h-full flex items-center justify-center ${
                          isActive
                            ? `${getCategoryColor(row.category)} text-white`
                            : ''
                        }`}
                      >
                        {isActive && (
                          <span className="text-xs font-medium">
                            {getCategoryLetter(row.category)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-construction-blue rounded"></div>
                  <span>Plumbing (P)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-project-green rounded"></div>
                  <span>Electrical (E)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-safety-orange rounded"></div>
                  <span>Framing (F)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
