import { DailyLog } from '@shared/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Clock, Camera, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';

interface DailyLogListProps {
  dailyLogs?: DailyLog[];
  projectId: number;
}

export function DailyLogList({ dailyLogs = [], projectId }: DailyLogListProps) {
  const getLogBorderColor = (notes: string) => {
    if (notes.toLowerCase().includes('delay') || notes.toLowerCase().includes('issue')) {
      return 'border-l-safety-orange';
    }
    return 'border-l-construction-blue';
  };

  const hasIssue = (notes: string) => {
    return notes.toLowerCase().includes('delay') || notes.toLowerCase().includes('issue') || notes.toLowerCase().includes('problem');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Daily Log</CardTitle>
          <Button className="bg-construction-blue hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Entry
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {dailyLogs.map((log) => (
            <div key={log.id} className={`border-l-4 pl-4 py-2 ${getLogBorderColor(log.notes)}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-sm">
                  {format(new Date(log.date), 'EEEE, MMM d')}
                </span>
                <span className="text-xs text-gray-500">
                  {format(new Date(log.createdAt), 'h:mm a')}
                </span>
              </div>
              
              <p className="text-sm text-gray-700 mb-2">{log.notes}</p>
              
              {(log.weather || log.temperature) && (
                <div className="text-xs text-gray-500 mb-2">
                  Weather: {log.weather} {log.temperature && `${log.temperature}`}
                </div>
              )}
              
              {log.crew && log.crew.length > 0 && (
                <div className="text-xs text-gray-500 mb-2">
                  Crew: {log.crew.join(', ')}
                </div>
              )}
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                  <span>Project ID: {log.projectId}</span>
                  <span>•</span>
                  <span>Created by User {log.createdBy}</span>
                  {/* Mock photo count */}
                  <span>•</span>
                  <span className="flex items-center">
                    <Camera className="h-3 w-3 mr-1" />
                    3 photos
                  </span>
                </div>
                
                {hasIssue(log.notes) && (
                  <Badge variant="destructive" className="bg-alert-orange">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Issue reported
                  </Badge>
                )}
              </div>
            </div>
          ))}
          
          {dailyLogs.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No daily log entries found.</p>
              <p className="text-sm mt-1">Add your first entry to track daily progress.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
