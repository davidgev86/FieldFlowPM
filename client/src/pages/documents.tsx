import { useState } from 'react';
import { useProjects } from '@/hooks/use-projects';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent } from '@/components/ui/card';
import { FileUpload } from '@/components/project/FileUpload';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Folder, Search, Download, Eye, File, Image, Grid, List } from 'lucide-react';

export default function Documents() {
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  if (projectsLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const activeProjects = projects?.filter((p: any) => p.status !== 'completed') || [];

  // Mock documents data for demonstration
  const mockDocuments = [
    {
      id: 1,
      name: 'Kitchen_Permit_Application.pdf',
      originalName: 'Kitchen Permit Application.pdf',
      fileSize: '2.4 MB',
      mimeType: 'application/pdf',
      category: 'permit',
      projectId: 1,
      projectName: 'Kitchen Remodel - Johnson',
      uploadedBy: 'John Doe',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: 2,
      name: 'Progress_Photos_Mar22.jpg',
      originalName: 'Progress Photos Mar22.jpg',
      fileSize: '5.1 MB',
      mimeType: 'image/jpeg',
      category: 'photo',
      projectId: 1,
      projectName: 'Kitchen Remodel - Johnson',
      uploadedBy: 'Mike Worker',
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    },
    {
      id: 3,
      name: 'Contract_Amendment.docx',
      originalName: 'Contract Amendment.docx',
      fileSize: '1.2 MB',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      category: 'contract',
      projectId: 2,
      projectName: 'Bathroom Addition - Smith',
      uploadedBy: 'Sarah Manager',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: 4,
      name: 'Floor_Plans_Updated.dwg',
      originalName: 'Floor Plans Updated.dwg',
      fileSize: '8.7 MB',
      mimeType: 'application/acad',
      category: 'plan',
      projectId: 1,
      projectName: 'Kitchen Remodel - Johnson',
      uploadedBy: 'Architect Office',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'permit', label: 'Permits' },
    { value: 'contract', label: 'Contracts' },
    { value: 'photo', label: 'Photos' },
    { value: 'plan', label: 'Plans' },
    { value: 'other', label: 'Other' },
  ];

  // Filter documents
  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch = doc.originalName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesProject = selectedProjectId === 'all' || doc.projectId.toString() === selectedProjectId;
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    return matchesSearch && matchesProject && matchesCategory;
  });

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <Image className="h-5 w-5 text-blue-500" />;
    }
    return <File className="h-5 w-5 text-red-500" />;
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      permit: 'bg-yellow-100 text-yellow-800',
      contract: 'bg-blue-100 text-blue-800',
      photo: 'bg-green-100 text-green-800',
      plan: 'bg-purple-100 text-purple-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || colors.other;
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <p className="text-gray-600 mt-1">
            Manage project files and documentation
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
              <SelectTrigger>
                <SelectValue placeholder="All Projects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {activeProjects.map((project: any) => (
                  <SelectItem key={project.id} value={project.id.toString()}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="text-sm text-gray-500 flex items-center">
              {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Upload Section */}
      {activeProjects.length > 0 && (
        <FileUpload projectId={selectedProjectId !== 'all' ? parseInt(selectedProjectId) : activeProjects[0].id} />
      )}

      {/* Documents List/Grid */}
      {filteredDocuments.length > 0 ? (
        <Card>
          <CardContent className="p-6">
            {viewMode === 'list' ? (
              <div className="space-y-4">
                {filteredDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg border">
                    <div className="flex-shrink-0">
                      {getFileIcon(doc.mimeType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {doc.originalName}
                        </p>
                        <Badge className={getCategoryBadge(doc.category)}>
                          {doc.category}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span>{doc.projectName}</span>
                        <span>•</span>
                        <span>{doc.uploadedBy}</span>
                        <span>•</span>
                        <span>{formatTimeAgo(doc.createdAt)}</span>
                        <span>•</span>
                        <span>{doc.fileSize}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredDocuments.map((doc) => (
                  <Card key={doc.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex flex-col space-y-3">
                        <div className="flex items-center justify-between">
                          {getFileIcon(doc.mimeType)}
                          <Badge className={getCategoryBadge(doc.category)}>
                            {doc.category}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 truncate" title={doc.originalName}>
                            {doc.originalName}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{doc.fileSize}</p>
                        </div>
                        <div className="text-xs text-gray-500">
                          <p className="truncate">{doc.projectName}</p>
                          <p>{formatTimeAgo(doc.createdAt)}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12 text-gray-500">
              <Folder className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              {searchTerm || categoryFilter !== 'all' || selectedProjectId !== 'all' ? (
                <div>
                  <p className="text-lg font-medium mb-2">No documents found</p>
                  <p>Try adjusting your search terms or filters.</p>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-medium mb-2">No documents uploaded</p>
                  <p>Upload your first document to get started.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Document Statistics */}
      {filteredDocuments.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Document Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-construction-blue">
                  {mockDocuments.length}
                </div>
                <div className="text-sm text-gray-600">Total Documents</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-project-green">
                  {mockDocuments.filter(d => d.category === 'photo').length}
                </div>
                <div className="text-sm text-gray-600">Photos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-alert-orange">
                  {mockDocuments.filter(d => d.category === 'permit').length}
                </div>
                <div className="text-sm text-gray-600">Permits</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">
                  {Math.round(mockDocuments.reduce((sum, d) => sum + parseFloat(d.fileSize), 0) / mockDocuments.length * 10) / 10} MB
                </div>
                <div className="text-sm text-gray-600">Avg. File Size</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
