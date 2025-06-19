import { useState } from 'react';
import { useProjects } from '@/hooks/use-projects';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent } from '@/components/ui/card';
import { ProjectSchedule } from '@/components/project/ProjectSchedule';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Hammer } from 'lucide-react';

export default function Schedule() {
  const { data: projects, isLoading, error } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');

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
            Error loading schedule: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeProjects = projects?.filter((p: any) => p.status === 'active') || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Project Schedule</h1>
          <p className="text-gray-600 mt-1">
            View and manage project timelines and tasks
          </p>
        </div>
        
        {/* Project Selector */}
        <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Select project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Active Projects</SelectItem>
            {activeProjects.map((project: any) => (
              <SelectItem key={project.id} value={project.id.toString()}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Schedule Content */}
      {activeProjects.length > 0 ? (
        <div className="space-y-6">
          {selectedProjectId === 'all' ? (
            // Show all active projects
            activeProjects.map((project: any) => (
              <div key={project.id} className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                  {project.name}
                </h3>
                <ProjectSchedule projectId={project.id} />
              </div>
            ))
          ) : (
            // Show selected project
            <ProjectSchedule projectId={parseInt(selectedProjectId)} />
          )}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12 text-gray-500">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">No active projects</p>
              <p>Create and activate projects to start scheduling tasks.</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Schedule Overview */}
      {activeProjects.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Schedule Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-construction-blue mb-2">
                  {activeProjects.length}
                </div>
                <div className="text-sm text-gray-600">Active Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-project-green mb-2">
                  12
                </div>
                <div className="text-sm text-gray-600">Tasks This Week</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-alert-orange mb-2">
                  3
                </div>
                <div className="text-sm text-gray-600">Upcoming Deadlines</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
