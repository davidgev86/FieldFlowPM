import { useAuth } from '@/hooks/use-auth';
import { useProjects, useProjectCosts, useProjectChangeOrders, useProjectDailyLogs } from '@/hooks/use-projects';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectSchedule } from '@/components/project/ProjectSchedule';
import { useApproveChangeOrder } from '@/hooks/use-projects';
import { useToast } from '@/hooks/use-toast';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  DollarSign, 
  FileText, 
  Camera, 
  Download,
  AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';

export default function ClientPortal() {
  const { user } = useAuth();
  const { data: projects, isLoading } = useProjects();
  const { toast } = useToast();
  const approveChangeOrder = useApproveChangeOrder();

  // For client users, show only their projects
  const clientProjects = projects?.filter((p: any) => 
    user?.role === 'client' ? p.clientId === user.id : true
  ) || [];

  const activeProject = clientProjects.find((p: any) => p.status === 'active') || clientProjects[0];

  const { data: costs } = useProjectCosts(activeProject?.id || 0);
  const { data: changeOrders } = useProjectChangeOrders(activeProject?.id || 0);
  const { data: dailyLogs } = useProjectDailyLogs(activeProject?.id || 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!activeProject) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12 text-gray-500">
            <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">No Active Projects</p>
            <p>You don't have any active projects at the moment.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleApproveChangeOrder = async (orderId: number) => {
    try {
      await approveChangeOrder.mutateAsync(orderId);
      toast({
        title: "Change Order Approved",
        description: "The change order has been approved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve change order. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Calculate project progress (mock calculation)
  const overallProgress = 74;
  const budgetUsed = parseFloat(activeProject.budgetTotal || '0') * 0.74;
  const budgetRemaining = parseFloat(activeProject.budgetTotal || '0') - budgetUsed;

  // Get pending change orders
  const pendingChangeOrders = changeOrders?.filter((co: any) => co.status === 'pending') || [];

  // Get recent updates from daily logs
  const recentUpdates = dailyLogs?.slice(0, 3) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">{activeProject.name}</h1>
        <p className="text-gray-600 mt-1">Project Portal</p>
        <Badge 
          className={`mt-2 ${
            activeProject.status === 'active' 
              ? 'bg-project-green text-white' 
              : 'bg-gray-500 text-white'
          }`}
        >
          {activeProject.status}
        </Badge>
      </div>

      {/* Pending Approvals Alert */}
      {pendingChangeOrders.length > 0 && (
        <Card className="border-alert-orange bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Clock className="h-6 w-6 text-alert-orange" />
              <h3 className="text-lg font-semibold text-alert-orange">
                Pending Your Approval ({pendingChangeOrders.length})
              </h3>
            </div>
            
            <div className="space-y-4">
              {pendingChangeOrders.map((order: any) => (
                <div key={order.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0 p-4 bg-white rounded-lg border">
                  <div>
                    <h4 className="font-medium">{order.title}</h4>
                    <p className="text-sm text-gray-600">{order.description}</p>
                    <p className="text-sm font-semibold text-construction-blue">
                      +${parseFloat(order.amount).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    className="bg-construction-blue hover:bg-blue-700"
                    onClick={() => handleApproveChangeOrder(order.id)}
                    disabled={approveChangeOrder.isPending}
                  >
                    {approveChangeOrder.isPending ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      'Review & Approve'
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Portal Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Project Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-project-green" />
                  <span>Project Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Overall Completion</span>
                    <span className="text-sm font-bold">{overallProgress}%</span>
                  </div>
                  <Progress value={overallProgress} className="w-full" />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Started</div>
                      <div className="font-medium">
                        {activeProject.startDate 
                          ? format(new Date(activeProject.startDate), 'MMM d, yyyy')
                          : 'N/A'
                        }
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Due Date</div>
                      <div className="font-medium">
                        {activeProject.dueDate 
                          ? format(new Date(activeProject.dueDate), 'MMM d, yyyy')
                          : 'N/A'
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-construction-blue" />
                  <span>Recent Updates</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentUpdates.length > 0 ? (
                    recentUpdates.map((log: any, index) => (
                      <div key={log.id} className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          index === 0 ? 'bg-construction-blue' : 'bg-project-green'
                        }`} />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{log.notes.substring(0, 50)}...</p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(log.createdAt), 'MMM d, h:mm a')}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No recent updates available.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Budget Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-project-green" />
                <span>Budget Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    ${parseFloat(activeProject.budgetTotal || '0').toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Total Budget</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-construction-blue">
                    ${budgetUsed.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Amount Used</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-project-green">
                    ${budgetRemaining.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Remaining</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <ProjectSchedule projectId={activeProject.id} />
        </TabsContent>

        <TabsContent value="photos">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Camera className="h-5 w-5 text-construction-blue" />
                <span>Project Photos</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <Camera className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium mb-2">No photos available</p>
                <p>Progress photos will appear here as they are uploaded.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-construction-blue" />
                <span>Project Documents</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Mock documents */}
                <div className="flex items-center space-x-4 p-3 border rounded-lg">
                  <FileText className="h-5 w-5 text-red-500" />
                  <div className="flex-1">
                    <p className="font-medium">Contract Agreement</p>
                    <p className="text-sm text-gray-500">Uploaded 5 days ago • 2.1 MB</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                
                <div className="flex items-center space-x-4 p-3 border rounded-lg">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <div className="flex-1">
                    <p className="font-medium">Building Permits</p>
                    <p className="text-sm text-gray-500">Uploaded 3 days ago • 1.5 MB</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-construction-blue" />
                <span>Billing Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Contract Summary */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">Contract Summary</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Original Contract:</span>
                      <span className="ml-2 font-medium">
                        ${parseFloat(activeProject.budgetTotal || '0').toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Change Orders:</span>
                      <span className="ml-2 font-medium">+$3,200</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Total Contract:</span>
                      <span className="ml-2 font-medium">
                        ${(parseFloat(activeProject.budgetTotal || '0') + 3200).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Amount Paid:</span>
                      <span className="ml-2 font-medium">${budgetUsed.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Schedule */}
                <div>
                  <h4 className="font-semibold mb-4">Payment Schedule</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Initial Deposit</p>
                        <p className="text-sm text-gray-500">Paid on contract signing</p>
                      </div>
                      <Badge className="bg-project-green text-white">Paid</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Progress Payment #1</p>
                        <p className="text-sm text-gray-500">50% completion milestone</p>
                      </div>
                      <Badge className="bg-project-green text-white">Paid</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Final Payment</p>
                        <p className="text-sm text-gray-500">Due on project completion</p>
                      </div>
                      <Badge className="bg-alert-orange text-white">Pending</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
