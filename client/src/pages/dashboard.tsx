import { useProjects } from '@/hooks/use-projects';
import { useAuth } from '@/hooks/use-auth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProjectCard } from '@/components/project/ProjectCard';
import { ProjectSchedule } from '@/components/project/ProjectSchedule';
import { CostTracker } from '@/components/project/CostTracker';
import { ChangeOrderList } from '@/components/project/ChangeOrderList';
import { ClientPortalPreview } from '@/components/project/ClientPortalPreview';
import { DailyLogList } from '@/components/project/DailyLogList';
import { FileUpload } from '@/components/project/FileUpload';
import { Hammer, DollarSign, Clock, AlertTriangle, Plus, Building2, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { data: projects, isLoading, error } = useProjects();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 max-w-7xl">
        <EmptyState
          icon={AlertTriangle}
          title="Unable to load dashboard"
          description={`Error loading dashboard data: ${error.message}`}
          action={{
            label: 'Refresh Page',
            onClick: () => window.location.reload()
          }}
        />
      </div>
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
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <LoadingSpinner className="h-4 w-4" />
                    <span className="text-sm text-gray-500">Loading...</span>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-project-green">
                    {stats.monthlyRevenue}
                  </p>
                )}
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
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <LoadingSpinner className="h-4 w-4" />
                    <span className="text-sm text-gray-500">Loading...</span>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-alert-orange">
                    {stats.pendingApprovals}
                  </p>
                )}
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
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <LoadingSpinner className="h-4 w-4" />
                    <span className="text-sm text-gray-500">Loading...</span>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-issue-red">
                    {stats.overdueTasks}
                  </p>
                )}
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeProjects.map((project: any) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Hammer}
            title="No active projects"
            description={
              user?.role !== 'client'
                ? "Create your first project to get started with FieldFlowPM."
                : "No projects have been assigned to you yet."
            }
            action={
              user?.role !== 'client'
                ? {
                    label: 'Create Project',
                    onClick: () => {
                      // Navigate to project creation
                      console.log('Navigate to project creation');
                    },
                  }
                : undefined
            }
          />
        )}
      </div>

      {/* Recent Activity and Quick Actions */}
      {activeProjects.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ProjectSchedule projectId={activeProjects[0]?.id || 0} />
          </div>
          <div className="space-y-6">
            <QuickActions userRole={user?.role} />
            <RecentActivity />
          </div>
        </div>
      )}

      {/* Detailed Sections */}
      {activeProjects.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          <CostTracker costs={[]} projectId={activeProjects[0]?.id || 0} />
          <ChangeOrderList changeOrders={[]} projectId={activeProjects[0]?.id || 0} />
        </div>
      )}
    </div>
  );
}

// Stats Card Component
function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  className,
}: {
  title: string;
  value: string;
  icon: any;
  trend?: string;
  className?: string;
}) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {trend && (
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                {trend}
              </p>
            )}
          </div>
          <div className={`rounded-full p-2 bg-gray-100 dark:bg-gray-800 ${className}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Dashboard Loading Skeleton
function DashboardSkeleton() {
  return (
    <div className="container mx-auto p-4 space-y-6 max-w-7xl">
      {/* Header Skeleton */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Projects Section Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// Quick Actions Component
function QuickActions({ userRole }: { userRole?: string }) {
  const actions = [
    { label: 'New Project', icon: Plus, available: userRole !== 'client' },
    { label: 'Daily Log', icon: Clock, available: true },
    { label: 'Upload Document', icon: FileUpload, available: userRole !== 'client' },
    { label: 'Add Contact', icon: Plus, available: userRole !== 'client' },
  ].filter(action => action.available);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {actions.map((action, i) => (
          <Button
            key={i}
            variant="ghost"
            className="justify-start h-auto p-3"
            onClick={() => console.log(`Action: ${action.label}`)}
          >
            <action.icon className="mr-3 h-4 w-4" />
            {action.label}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}

// Recent Activity Component
function RecentActivity() {
  const activities = [
    { action: 'Project updated', project: 'Kitchen Remodel', time: '2 hours ago' },
    { action: 'Document uploaded', project: 'Bathroom Renovation', time: '4 hours ago' },
    { action: 'Change order approved', project: 'Office Build-out', time: '1 day ago' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activities.map((activity, i) => (
          <div key={i} className="flex items-start space-x-3 text-sm">
            <div className="h-2 w-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
            <div className="space-y-1 min-w-0 flex-1">
              <p className="font-medium">{activity.action}</p>
              <p className="text-muted-foreground truncate">{activity.project}</p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
