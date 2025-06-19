import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';

interface ProjectScheduleProps {
  projectId: number;
}

export function ProjectSchedule({ projectId }: ProjectScheduleProps) {
  // This would normally fetch schedule data
  const scheduleItems = [
    { task: 'Foundation', status: 'completed', date: '2024-03-15' },
    { task: 'Framing', status: 'in-progress', date: '2024-03-20' },
    { task: 'Electrical', status: 'pending', date: '2024-03-25' },
    { task: 'Plumbing', status: 'pending', date: '2024-03-30' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Project Schedule</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {scheduleItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">{item.task}</p>
                <p className="text-sm text-gray-500">{item.date}</p>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-medium ${
                item.status === 'completed' ? 'bg-green-100 text-green-800' :
                item.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {item.status}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}