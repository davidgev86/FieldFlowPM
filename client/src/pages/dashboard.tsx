import { useProjects } from '@/hooks/use-projects';
import { useAuth } from '@/hooks/use-auth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProjectCard } from '@/components/project/ProjectCard';
import { ProjectSchedule } from '@/components/project/ProjectSchedule';
import { CostTracker } from '@/components/project/CostTracker';
import { ChangeOrderList } from '@/components/project/ChangeOrderList';
import { ClientPortalPreview } from '@/components/project/ClientPortalPreview';
import { DailyLogList } from '@/components/project/DailyLogList';
import { FileUpload } from '@/components/project/FileUpload';
import { Hammer, DollarSign, Clock, AlertTriangle, Plus } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { data: projects, isLoading, error } = useProjects();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            Error loading dashboard: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeProjects = projects?.filter((p: any) => p.status === 'active') || [];
  
  // Calculate statistics
  const stats = {
    activeProjects: activeProjects.length,
    monthlyRevenue: '$127K', // This would be calculated from actual data
    pendingApprovals: 3, // This would come from change orders
    overdueTasks: 2, // This would come from task analysis
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Project Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user?.firstName}! Here's your project overview.
          </p>
        </div>
        {user?.role !== 'client' && (
          <Button className="bg-construction-blue hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-construction-blue">
                  {stats.activeProjects}
                </p>
              </div>
              <Hammer className="h-5 w-5 text-construction-blue" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-project-green">
                  {stats.monthlyRevenue}
                </p>
              </div>
              <DollarSign className="h-5 w-5 text-project-green" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-bold text-alert-orange">
                  {stats.pendingApprovals}
                </p>
              </div>
              <Clock className="h-5 w-5 text-alert-orange" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Overdue Tasks</p>
                <p className="text-2xl font-bold text-issue-red">
                  {stats.overdueTasks}
                </p>
              </div>
              <AlertTriangle className="h-5 w-5 text-issue-red" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Projects */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Active Projects</h2>
        
        {activeProjects.length > 0 ? (
          <div className="space-y-4">
            {activeProjects.map((project: any) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8 text-gray-500">
                <Hammer className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No active projects found.</p>
                {user?.role !== 'client' && (
                  <p className="text-sm mt-1">Create your first project to get started.</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Schedule Section */}
      <ProjectSchedule projectId={activeProjects[0]?.id || 0} />

      {/* Cost Tracking and Other Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Log and File Upload */}
        <DailyLogList projectId={activeProjects[0]?.id || 0} />
        <FileUpload projectId={activeProjects[0]?.id || 0} />
      </div>

      {/* Cost and Change Order Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CostTracker costs={[]} projectId={activeProjects[0]?.id || 0} />
        <ChangeOrderList changeOrders={[]} projectId={activeProjects[0]?.id || 0} />
      </div>
    </div>
  );
}
