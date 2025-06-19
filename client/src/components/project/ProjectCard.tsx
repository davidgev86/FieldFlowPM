import { Link } from 'wouter';
import { Project } from '@shared/schema';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Eye, Edit, MoreVertical, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'in-progress':
        return 'bg-project-green text-white';
      case 'delayed':
        return 'bg-alert-orange text-white';
      case 'completed':
        return 'bg-project-green text-white';
      case 'on-hold':
        return 'bg-gray-500 text-white';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  const getBorderColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'in-progress':
        return 'border-l-construction-blue';
      case 'delayed':
        return 'border-l-safety-orange';
      case 'completed':
        return 'border-l-project-green';
      default:
        return 'border-l-gray-300';
    }
  };

  // Calculate progress percentages (mock calculation for demo)
  const budgetUsed = parseFloat(project.budgetTotal || '0') * 0.74;
  const budgetProgress = (budgetUsed / parseFloat(project.budgetTotal || '1')) * 100;

  const startDate = project.startDate ? new Date(project.startDate) : new Date();
  const dueDate = project.dueDate ? new Date(project.dueDate) : new Date();
  const now = new Date();
  const totalDays = Math.max(1, Math.ceil((dueDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
  const elapsedDays = Math.max(0, Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
  const timeProgress = Math.min(100, (elapsedDays / totalDays) * 100);

  return (
    <Card className="overflow-hidden">
      <CardContent className={`p-4 border-l-4 ${getBorderColor(project.status)}`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-gray-900">{project.name}</h4>
            <p className="text-sm text-gray-600 mt-1">{project.address}</p>
            <div className="flex items-center space-x-4 mt-2">
              <Badge className={getStatusColor(project.status)}>
                {project.status}
              </Badge>
              {project.startDate && (
                <span className="text-sm text-gray-500">
                  Started {format(new Date(project.startDate), 'MMM d')}
                </span>
              )}
              {project.dueDate && (
                <span className="text-sm text-gray-500">
                  Due {format(new Date(project.dueDate), 'MMM d')}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-6">
            {/* Budget Progress */}
            <div className="text-center">
              <p className="text-sm text-gray-600">Budget</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm font-medium">
                  ${budgetUsed.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500">/</span>
                <span className="text-sm text-gray-500">
                  ${parseFloat(project.budgetTotal || '0').toLocaleString()}
                </span>
              </div>
              <Progress value={budgetProgress} className="w-24 h-2 mt-1" />
            </div>
            
            {/* Timeline Progress */}
            <div className="text-center">
              <p className="text-sm text-gray-600">Timeline</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm font-medium">{elapsedDays} days</span>
                <span className="text-sm text-gray-500">/</span>
                <span className="text-sm text-gray-500">{totalDays} days</span>
              </div>
              <Progress value={timeProgress} className="w-24 h-2 mt-1" />
            </div>
            
            {/* Actions */}
            <div className="flex space-x-2">
              <Link href={`/projects/${project.id}`}>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="ghost" size="sm">
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Last updated 2 hours ago</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
