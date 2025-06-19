import { useState } from 'react';
import { useProjects, useProjectChangeOrders } from '@/hooks/use-projects';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent } from '@/components/ui/card';
import { ChangeOrderList } from '@/components/project/ChangeOrderList';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText } from 'lucide-react';

export default function ChangeOrders() {
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  
  const { data: changeOrders, isLoading: changeOrdersLoading } = useProjectChangeOrders(
    selectedProjectId !== 'all' ? parseInt(selectedProjectId) : 0
  );

  const isLoading = projectsLoading || changeOrdersLoading;

  if (projectsLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const activeProjects = projects?.filter((p: any) => p.status !== 'completed') || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Change Orders</h1>
          <p className="text-gray-600 mt-1">
            Manage project scope changes and approvals
          </p>
        </div>
        
        {/* Project Selector */}
        {activeProjects.length > 0 && (
          <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue placeholder="Select project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {activeProjects.map((project: any) => (
                <SelectItem key={project.id} value={project.id.toString()}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Change Orders Content */}
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
          ) : selectedProjectId === 'all' ? (
            // Show change orders for all projects
            activeProjects.map((project: any) => (
              <div key={project.id} className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  {project.name}
                </h3>
                <ChangeOrderList projectId={project.id} />
              </div>
            ))
          ) : (
            // Show change orders for selected project
            <ChangeOrderList 
              changeOrders={changeOrders} 
              projectId={parseInt(selectedProjectId)} 
            />
          )}

          {/* Change Order Statistics */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Change Order Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-construction-blue mb-2">
                    8
                  </div>
                  <div className="text-sm text-gray-600">Total Orders</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-alert-orange mb-2">
                    3
                  </div>
                  <div className="text-sm text-gray-600">Pending Approval</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-project-green mb-2">
                    5
                  </div>
                  <div className="text-sm text-gray-600">Approved</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600 mb-2">
                    $18.5K
                  </div>
                  <div className="text-sm text-gray-600">Total Value</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* E-Signature Integration */}
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-purple-900">E-Signature Integration</h3>
                  <p className="text-sm text-purple-700">
                    Connect with DocuSign or similar services to enable digital signatures for change orders.
                  </p>
                </div>
                <div className="text-sm text-purple-600 font-medium">
                  Setup Required
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">No projects found</p>
              <p>Create projects to start managing change orders.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
