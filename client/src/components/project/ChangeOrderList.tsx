import { ChangeOrder } from '@shared/schema';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useApproveChangeOrder } from '@/hooks/use-projects';
import { useToast } from '@/hooks/use-toast';
import { Plus, Eye, FileSignature } from 'lucide-react';
import { format } from 'date-fns';

interface ChangeOrderListProps {
  changeOrders?: ChangeOrder[];
  projectId: number;
}

export function ChangeOrderList({ changeOrders = [], projectId }: ChangeOrderListProps) {
  const approveChangeOrder = useApproveChangeOrder();
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-alert-orange text-white';
      case 'approved':
        return 'bg-project-green text-white';
      case 'rejected':
        return 'bg-issue-red text-white';
      case 'signed':
        return 'bg-construction-blue text-white';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  const handleApprove = async (orderId: number) => {
    try {
      await approveChangeOrder.mutateAsync(orderId);
      toast({
        title: "Change Order Approved",
        description: "The change order has been approved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve change order. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Change Orders</CardTitle>
          <Button className="bg-construction-blue hover:bg-blue-700 mt-4 sm:mt-0">
            <Plus className="h-4 w-4 mr-2" />
            New Change Order
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {changeOrders.map((order) => (
            <div key={order.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h4 className="font-semibold">{order.title}</h4>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{order.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span>
                      Created {format(new Date(order.createdAt), 'MMM d, yyyy')}
                    </span>
                    <span>•</span>
                    <span>Project ID: {order.projectId}</span>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-construction-blue">
                      +${parseFloat(order.amount).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">Amount</div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    {order.status === 'pending' && (
                      <Button
                        size="sm"
                        className="bg-construction-blue hover:bg-blue-700"
                        onClick={() => handleApprove(order.id)}
                        disabled={approveChangeOrder.isPending}
                      >
                        <FileSignature className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    )}
                    {order.status === 'approved' && (
                      <Button variant="outline" size="sm" disabled>
                        Signed
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {changeOrders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No change orders found.</p>
              <p className="text-sm mt-1">Create your first change order to get started.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
