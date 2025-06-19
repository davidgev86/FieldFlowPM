import { CostCategory } from '@shared/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Download, Bolt, Users, Truck } from 'lucide-react';

interface CostTrackerProps {
  costs?: CostCategory[];
  projectId: number;
}

export function CostTracker({ costs = [], projectId }: CostTrackerProps) {
  // Calculate totals
  const totalBudget = costs.reduce((sum, cost) => sum + parseFloat(cost.budgetAmount || '0'), 0);
  const totalActual = costs.reduce((sum, cost) => sum + parseFloat(cost.actualAmount || '0'), 0);
  const remaining = totalBudget - totalActual;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'materials':
        return Bolt;
      case 'labor':
        return Users;
      case 'equipment':
        return Truck;
      default:
        return Bolt;
    }
  };

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return 'text-project-green';
    if (variance < 0) return 'text-issue-red';
    return 'text-gray-500';
  };

  const getStatusBadge = (budgetAmount: number, actualAmount: number) => {
    if (actualAmount > budgetAmount) {
      return <Badge className="bg-issue-red text-white">Over</Badge>;
    }
    return <Badge className="bg-project-green text-white">Under</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Job Cost Tracker</CardTitle>
          <div className="flex space-x-2 mt-4 sm:mt-0">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync QB
            </Button>
            <Button size="sm" className="bg-construction-blue hover:bg-blue-700">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Cost Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Total Budget</div>
            <div className="text-2xl font-bold text-gray-900">
              ${totalBudget.toLocaleString()}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Actual Costs</div>
            <div className="text-2xl font-bold text-construction-blue">
              ${totalActual.toLocaleString()}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Remaining</div>
            <div className={`text-2xl font-bold ${remaining >= 0 ? 'text-project-green' : 'text-issue-red'}`}>
              ${remaining.toLocaleString()}
            </div>
          </div>
        </div>
        
        {/* Cost Breakdown Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actual
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Variance
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {costs.map((cost) => {
                const Icon = getCategoryIcon(cost.category || '');
                const budget = parseFloat(cost.budgetAmount || '0');
                const actual = parseFloat(cost.actualAmount || '0');
                const variance = budget - actual;
                
                return (
                  <tr key={cost.id}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Icon className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="font-medium capitalize">{cost.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right font-medium">
                      ${budget.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right font-medium">
                      ${actual.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <span className={`font-medium ${getVarianceColor(variance)}`}>
                        {variance >= 0 ? '+' : ''}${variance.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      {getStatusBadge(budget, actual)}
                    </td>
                  </tr>
                );
              })}
              
              {costs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No cost categories found. Add some to track your project expenses.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
