import { useAuth } from '@/hooks/use-auth';
import { useProjects } from '@/hooks/use-projects';

export default function SimpleDashboard() {
  const { user } = useAuth();
  const { data: projects, isLoading, error } = useProjects();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">FieldFlowPM Dashboard</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Welcome, {user?.firstName}!</h2>
        <p className="text-gray-600">You are logged in as: {user?.username} ({user?.role})</p>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Projects Status:</h3>
        {isLoading && <p>Loading projects...</p>}
        {error && <p className="text-red-600">Error: {error.message}</p>}
        {projects && (
          <div>
            <p className="mb-2">Found {projects.length} projects:</p>
            <ul className="space-y-2">
              {projects.map((project: any) => (
                <li key={project.id} className="border p-4 rounded">
                  <h4 className="font-medium">{project.name}</h4>
                  <p className="text-sm text-gray-600">{project.description}</p>
                  <p className="text-sm">Status: {project.status}</p>
                  <p className="text-sm">Budget: ${project.budgetTotal}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}