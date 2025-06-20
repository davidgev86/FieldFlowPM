import { useAuth } from '@/hooks/use-auth';
import { useProjects } from '@/hooks/use-projects';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, DollarSign, Users, AlertTriangle } from 'lucide-react';

export default function FinalDashboard() {
  const { user } = useAuth();
  const { data: projects, isLoading, error } = useProjects();

  const activeProjects = projects?.filter(p => p.status === 'active') || [];
  const totalBudget = projects?.reduce((sum, p) => sum + parseFloat(p.budgetTotal || '0'), 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">FieldFlowPM Dashboard</h1>
          <p className="text-xl text-gray-600">Welcome back, {user?.firstName || 'User'}!</p>
          <p className="text-sm text-gray-500 mt-1">Logged in as: {user?.username} ({user?.role})</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Projects</p>
                  <p className="text-3xl font-bold text-blue-600">{activeProjects.length}</p>
                </div>
                <CalendarDays className="h-12 w-12 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Budget</p>
                  <p className="text-3xl font-bold text-green-600">${totalBudget.toLocaleString()}</p>
                </div>
                <DollarSign className="h-12 w-12 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Team Members</p>
                  <p className="text-3xl font-bold text-purple-600">5</p>
                </div>
                <Users className="h-12 w-12 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Items</p>
                  <p className="text-3xl font-bold text-orange-600">3</p>
                </div>
                <AlertTriangle className="h-12 w-12 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Section */}
        <Card className="bg-white shadow-lg">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Projects</h2>
            
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading projects...</span>
              </div>
            )}
            
            {error && (
              <div className="text-center py-12">
                <p className="text-red-600">Error loading projects: {error.message}</p>
              </div>
            )}
            
            {projects && projects.length > 0 ? (
              <div className="grid gap-6">
                {projects.map((project) => (
                  <Card key={project.id} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.name}</h3>
                          <p className="text-gray-600 mb-3">{project.description}</p>
                          <p className="text-sm text-gray-500">📍 {project.address}</p>
                        </div>
                        <Badge 
                          variant={project.status === 'active' ? 'default' : 'secondary'}
                          className={project.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {project.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                        <div>
                          <p className="text-sm text-gray-500">Budget</p>
                          <p className="font-semibold text-lg">${parseFloat(project.budgetTotal || '0').toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Start Date</p>
                          <p className="font-semibold">{new Date(project.startDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Due Date</p>
                          <p className="font-semibold">{new Date(project.dueDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              !isLoading && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No projects found.</p>
                  <p className="text-sm text-gray-400 mt-2">Start by creating your first construction project.</p>
                </div>
              )
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors cursor-pointer">
                <CalendarDays className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm font-medium">Schedule View</p>
              </div>
              <div className="text-center p-4 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors cursor-pointer">
                <DollarSign className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm font-medium">Budget Tracker</p>
              </div>
              <div className="text-center p-4 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors cursor-pointer">
                <Users className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm font-medium">Team Management</p>
              </div>
              <div className="text-center p-4 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors cursor-pointer">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm font-medium">Change Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}