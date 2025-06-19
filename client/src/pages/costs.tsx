import { useState } from 'react';
import { useProjects, useProjectCosts } from '@/hooks/use-projects';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent } from '@/components/ui/card';
import { CostTracker } from '@/components/project/CostTracker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DollarSign } from 'lucide-react';

export default function Costs() {
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  
  const { data: costs, isLoading: costsLoading } = useProjectCosts(
    selectedProjectId ? parseInt(selectedProjectId) : 0
  );

  const isLoading = projectsLoading || costsLoading;

  if (projectsLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const activeProjects = projects?.filter((p: any) => p.status !== 'completed') || [];

  // Set default project if not selected
  if (!selectedProjectId && activeProjects.length > 0) {
    setSelectedProjectId(activeProjects[0].id.toString());
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Costs</h1>
          <p className="text-gray-600 mt-1">
            Track project budgets and actual expenses
          </p>
        </div>
        
        {/* Project Selector */}
        {activeProjects.length > 0 && (
          <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              {activeProjects.map((project: any) => (
                <SelectItem key={project.id} value={project.id.toString()}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Cost Tracking Content */}
      {activeProjects.length > 0 ? (
        <div className="space-y-6">
          {isLoading ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner size="lg" />
                </div>
              </CardContent>
            </Card>
          ) : (
            <CostTracker 
              costs={costs} 
              projectId={selectedProjectId ? parseInt(selectedProjectId) : 0} 
            />
          )}

          {/* Overall Cost Summary */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Cost Summary Across All Projects</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-construction-blue mb-2">
                    $425K
                  </div>
                  <div className="text-sm text-gray-600">Total Budget</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-project-green mb-2">
                    $387K
                  </div>
                  <div className="text-sm text-gray-600">Actual Costs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-alert-orange mb-2">
                    $38K
                  </div>
                  <div className="text-sm text-gray-600">Remaining</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600 mb-2">
                    91%
                  </div>
                  <div className="text-sm text-gray-600">Budget Used</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* QuickBooks Integration Status */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900">QuickBooks Integration</h3>
                  <p className="text-sm text-blue-700">
                    Connect your QuickBooks account to automatically sync expenses and invoice data.
                  </p>
                </div>
                <div className="text-sm text-blue-600 font-medium">
                  Not Connected
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12 text-gray-500">
              <DollarSign className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">No projects found</p>
              <p>Create projects to start tracking costs and budgets.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
