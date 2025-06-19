import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList } from 'lucide-react';

interface DailyLogListProps {
  projectId?: number;
}

export function DailyLogList({ projectId }: DailyLogListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ClipboardList className="h-5 w-5" />
          <span>Daily Logs</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">Daily logs would be displayed here.</p>
      </CardContent>
    </Card>
  );
}