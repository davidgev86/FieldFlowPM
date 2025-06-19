import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

interface CostTrackerProps {
  projectId: number;
  costs: any[];
}

export function CostTracker({ projectId, costs }: CostTrackerProps) {
  // Mock cost data
  const costData = [
    { category: 'Materials', budgeted: 15000, actual: 14200, variance: -800 },
    { category: 'Labor', budgeted: 8000, actual: 8500, variance: 500 },
    { category: 'Equipment', budgeted: 2000, actual: 1800, variance: -200 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <DollarSign className="h-5 w-5" />
          <span>Cost Tracker</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {costData.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">{item.category}</p>
                <p className="text-sm text-gray-500">
                  ${item.actual.toLocaleString()} / ${item.budgeted.toLocaleString()}
                </p>
              </div>
              <div className={`flex items-center space-x-1 ${
                item.variance < 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {item.variance < 0 ? (
                  <TrendingDown className="h-4 w-4" />
                ) : (
                  <TrendingUp className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">
                  ${Math.abs(item.variance).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}