import { useState } from 'react';
import { useProjects } from '@/hooks/use-projects';
import { useAuth } from '@/hooks/use-auth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProjectCard } from '@/components/project/ProjectCard';
import { Plus, Search, Filter, Hammer } from 'lucide-react';

export default function Projects() {
  const { user } = useAuth();
  const { data: projects, isLoading, error } = useProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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
            Error loading projects: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Filter projects based on search and status
  const filteredProjects = projects?.filter((project: any) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const statusOptions = [
    { value: 'all', label: 'All Projects' },
    { value: 'active', label: 'Active' },
    { value: 'planning', label: 'Planning' },
    { value: 'on-hold', label: 'On Hold' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">
            Manage all your construction projects
          </p>
        </div>
        {user?.role !== 'client' && (
          <Button className="bg-construction-blue hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Projects List */}
      {filteredProjects.length > 0 ? (
        <div className="space-y-4">
          {filteredProjects.map((project: any) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12 text-gray-500">
              <Hammer className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              {searchTerm || statusFilter !== 'all' ? (
                <div>
                  <p className="text-lg font-medium mb-2">No projects found</p>
                  <p>Try adjusting your search terms or filters.</p>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-medium mb-2">No projects yet</p>
                  {user?.role !== 'client' ? (
                    <p>Create your first project to get started managing construction work.</p>
                  ) : (
                    <p>No projects have been assigned to you yet.</p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Project Statistics */}
      {filteredProjects.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-construction-blue">
                  {filteredProjects.length}
                </div>
                <div className="text-sm text-gray-600">Total Projects</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-project-green">
                  {filteredProjects.filter((p: any) => p.status === 'active').length}
                </div>
                <div className="text-sm text-gray-600">Active</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-alert-orange">
                  {filteredProjects.filter((p: any) => p.status === 'on-hold').length}
                </div>
                <div className="text-sm text-gray-600">On Hold</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">
                  {filteredProjects.filter((p: any) => p.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
