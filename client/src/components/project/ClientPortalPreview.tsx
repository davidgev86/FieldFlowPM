import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

interface ClientPortalPreviewProps {
  projectId?: number;
}

export function ClientPortalPreview({ projectId }: ClientPortalPreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>Client Portal</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">Client portal preview would go here.</p>
      </CardContent>
    </Card>
  );
}