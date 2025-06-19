import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CloudUpload, Download, Eye, File, Image } from 'lucide-react';

interface FileUploadProps {
  projectId: number;
  onFileUploaded?: (file: any) => void;
}

export function FileUpload({ projectId, onFileUploaded }: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Mock recent files data for demonstration
  const recentFiles = [
    {
      id: 1,
      name: 'Kitchen_Permit_Application.pdf',
      originalName: 'Kitchen Permit Application.pdf',
      fileSize: '2.4 MB',
      mimeType: 'application/pdf',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      id: 2,
      name: 'Progress_Photos_Mar22.jpg',
      originalName: 'Progress Photos Mar22.jpg',
      fileSize: '5.1 MB',
      mimeType: 'image/jpeg',
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    },
    {
      id: 3,
      name: 'Contract_Amendment.docx',
      originalName: 'Contract Amendment.docx',
      fileSize: '1.2 MB',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    }
  ];

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFileUpload(files);
  }, []);

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;

    setUploading(true);
    
    try {
      // Here you would implement actual file upload to your backend
      // For now, we'll simulate the upload process
      for (const file of files) {
        console.log('Uploading file:', file.name);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate upload delay
        
        if (onFileUploaded) {
          onFileUploaded({
            name: file.name,
            originalName: file.name,
            fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
            mimeType: file.type,
            projectId
          });
        }
      }
    } catch (error) {
      console.error('File upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) {
      return <Image className="h-5 w-5 text-blue-500" />;
    }
    return <File className="h-5 w-5 text-red-500" />;
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
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Project Documents</CardTitle>
          <label htmlFor="file-upload">
            <Button 
              className="bg-construction-blue hover:bg-blue-700 cursor-pointer"
              disabled={uploading}
            >
              <CloudUpload className="h-4 w-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload'}
            </Button>
            <input
              id="file-upload"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
            />
          </label>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* File Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center mb-6 transition-colors cursor-pointer ${
            dragOver 
              ? 'border-construction-blue bg-blue-50' 
              : 'border-gray-300 hover:border-construction-blue'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <CloudUpload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">
            {dragOver ? 'Drop files here' : 'Drop files here or click to upload'}
          </p>
          <p className="text-xs text-gray-500">
            Supports: PDF, DOC, JPG, PNG (max 10MB)
          </p>
        </div>
        
        {/* Recent Files */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-gray-700">Recent Files</h4>
          
          {recentFiles.map((file) => (
            <div key={file.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
              <div className="flex-shrink-0">
                {getFileIcon(file.mimeType)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.originalName}
                </p>
                <p className="text-xs text-gray-500">
                  {formatTimeAgo(file.createdAt)} • {file.fileSize}
                </p>
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
          
          {recentFiles.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <File className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No documents uploaded yet.</p>
              <p className="text-sm mt-1">Upload your first document to get started.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
