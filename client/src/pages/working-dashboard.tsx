import { useAuth } from '@/hooks/use-auth';
import { useProjects } from '@/hooks/use-projects';

export default function WorkingDashboard() {
  const { user } = useAuth();
  const { data: projects, isLoading, error } = useProjects();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">FieldFlowPM Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.firstName}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <div className="w-6 h-6 bg-blue-600 rounded"></div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Active Projects</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {projects?.filter(p => p.status === 'active').length || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <div className="w-6 h-6 bg-green-600 rounded"></div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Budget</h3>
                <p className="text-2xl font-bold text-gray-900">
                  ${projects?.reduce((sum, p) => sum + parseFloat(p.budgetTotal || '0'), 0).toLocaleString() || '0'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <div className="w-6 h-6 bg-yellow-600 rounded"></div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Pending</h3>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <div className="w-6 h-6 bg-red-600 rounded"></div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Overdue</h3>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
            </div>
          </div>
        </div>

        {/* Projects List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Current Projects</h2>
          </div>
          <div className="p-6">
            {isLoading && (
              <p className="text-gray-500">Loading projects...</p>
            )}
            
            {error && (
              <p className="text-red-600">Error loading projects: {error.message}</p>
            )}
            
            {projects && projects.length > 0 ? (
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900">{project.name}</h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        project.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Budget: ${parseFloat(project.budgetTotal || '0').toLocaleString()}</span>
                      <span>Location: {project.address}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !isLoading && (
                <p className="text-gray-500">No projects found.</p>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}