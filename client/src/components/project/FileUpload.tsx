import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  projectId?: number;
}

export function FileUpload({ projectId }: FileUploadProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>File Upload</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="outline" className="w-full">
          <Upload className="h-4 w-4 mr-2" />
          Upload Files
        </Button>
      </CardContent>
    </Card>
  );
}