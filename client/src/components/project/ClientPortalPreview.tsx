import { Project } from '@shared/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExternalLink, Clock, CheckCircle, Calendar } from 'lucide-react';

interface ClientPortalPreviewProps {
  project?: Project;
}

export function ClientPortalPreview({ project }: ClientPortalPreviewProps) {
  if (!project) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Client Portal Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Select a project to preview the client portal
          </div>
        </CardContent>
      </Card>
    );
  }

  // Mock progress calculation
  const overallProgress = 74;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Client Portal Preview</CardTitle>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Portal
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 bg-gray-50">
          <div className="text-center mb-6">
            <h4 className="text-xl font-semibold text-gray-900">{project.name}</h4>
            <p className="text-gray-600">Project Portal for Client</p>
          </div>
          
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-semibold mb-3">Project Status</h5>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Overall Progress</span>
                      <span className="text-sm font-medium">{overallProgress}%</span>
                    </div>
                    <Progress value={overallProgress} className="w-full" />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Started: {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}</span>
                      <span>Due: {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-3">Recent Updates</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-construction-blue rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <div className="font-medium">Electrical rough-in completed</div>
                        <div className="text-gray-500">2 hours ago</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-project-green rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <div className="font-medium">Plumbing inspection passed</div>
                        <div className="text-gray-500">1 day ago</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Pending Approvals */}
              <div className="mt-6 p-4 bg-alert-orange bg-opacity-10 border border-alert-orange rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-5 w-5 text-alert-orange" />
                  <span className="font-semibold text-alert-orange">Pending Your Approval</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                  <span className="text-sm">Change Order: Kitchen Island Addition (+$3,200)</span>
                  <Button size="sm" className="bg-construction-blue hover:bg-blue-700">
                    Review & Approve
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="schedule">
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Schedule view would be displayed here</p>
              </div>
            </TabsContent>
            
            <TabsContent value="photos">
              <div className="text-center py-8 text-gray-500">
                <p>Project photos would be displayed here</p>
              </div>
            </TabsContent>
            
            <TabsContent value="documents">
              <div className="text-center py-8 text-gray-500">
                <p>Project documents would be displayed here</p>
              </div>
            </TabsContent>
            
            <TabsContent value="billing">
              <div className="text-center py-8 text-gray-500">
                <p>Billing information would be displayed here</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}
