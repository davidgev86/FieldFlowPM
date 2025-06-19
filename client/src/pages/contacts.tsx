import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Search, Phone, Mail, MapPin, Users, Building, Truck, UserCheck } from 'lucide-react';

const contactSchema = z.object({
  type: z.string(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  company: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contacts() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      type: 'client',
      firstName: '',
      lastName: '',
      company: '',
      email: '',
      phone: '',
      address: '',
      notes: '',
    },
  });

  // Mock contacts data for demonstration
  const mockContacts = [
    {
      id: 1,
      type: 'client',
      firstName: 'Maria',
      lastName: 'Johnson',
      company: '',
      email: 'maria@email.com',
      phone: '(555) 234-5678',
      address: '1234 Oak Street, Springfield',
      notes: 'Kitchen remodel project. Prefers morning appointments.',
      createdAt: new Date(),
    },
    {
      id: 2,
      type: 'subcontractor',
      firstName: 'Mike',
      lastName: 'Thompson',
      company: 'Thompson Plumbing',
      email: 'mike@thompsonplumbing.com',
      phone: '(555) 345-6789',
      address: '567 Pine Avenue, Springfield',
      notes: 'Reliable plumber. Available weekdays only.',
      createdAt: new Date(),
    },
    {
      id: 3,
      type: 'vendor',
      firstName: 'Sarah',
      lastName: 'Williams',
      company: 'Williams Building Supply',
      email: 'sarah@williamssupply.com',
      phone: '(555) 456-7890',
      address: '890 Industrial Blvd, Springfield',
      notes: 'Great prices on lumber. Delivery available.',
      createdAt: new Date(),
    },
    {
      id: 4,
      type: 'lead',
      firstName: 'John',
      lastName: 'Davis',
      company: '',
      email: 'john.davis@email.com',
      phone: '(555) 567-8901',
      address: '234 Elm Street, Springfield',
      notes: 'Interested in bathroom renovation. Follow up next week.',
      createdAt: new Date(),
    },
  ];

  const contactTypes = [
    { value: 'all', label: 'All Contacts', icon: Users },
    { value: 'client', label: 'Clients', icon: UserCheck },
    { value: 'subcontractor', label: 'Subcontractors', icon: Building },
    { value: 'vendor', label: 'Vendors', icon: Truck },
    { value: 'lead', label: 'Leads', icon: Users },
  ];

  // Filter contacts
  const filteredContacts = mockContacts.filter((contact) => {
    const matchesSearch = 
      contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || contact.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      client: 'bg-blue-100 text-blue-800',
      subcontractor: 'bg-green-100 text-green-800',
      vendor: 'bg-purple-100 text-purple-800',
      lead: 'bg-yellow-100 text-yellow-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getTypeIcon = (type: string) => {
    const IconComponent = contactTypes.find(ct => ct.value === type)?.icon || Users;
    return <IconComponent className="h-4 w-4" />;
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Here you would call your API to create the contact
      console.log('Creating contact:', data);
      
      // Reset form and close dialog
      form.reset();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Failed to create contact:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="text-gray-600 mt-1">
            Manage clients, subcontractors, vendors, and leads
          </p>
        </div>
        
        {user?.role !== 'client' && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-construction-blue hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Contact</DialogTitle>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {contactTypes.slice(1).map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input type="tel" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes</FormLabel>
                        <FormControl>
                          <Textarea rows={3} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-construction-blue hover:bg-blue-700"
                    >
                      Add Contact
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {contactTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Contacts List */}
      {filteredContacts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map((contact) => (
            <Card key={contact.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-construction-blue text-white">
                      {getInitials(contact.firstName, contact.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {contact.firstName} {contact.lastName}
                      </h3>
                      <Badge className={getTypeColor(contact.type)}>
                        {getTypeIcon(contact.type)}
                        <span className="ml-1 capitalize">{contact.type}</span>
                      </Badge>
                    </div>
                    
                    {contact.company && (
                      <p className="text-sm text-gray-600 mb-2 truncate">
                        {contact.company}
                      </p>
                    )}
                    
                    <div className="space-y-1">
                      {contact.email && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{contact.email}</span>
                        </div>
                      )}
                      
                      {contact.phone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span>{contact.phone}</span>
                        </div>
                      )}
                      
                      {contact.address && (
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{contact.address}</span>
                        </div>
                      )}
                    </div>
                    
                    {contact.notes && (
                      <p className="text-sm text-gray-500 mt-3 line-clamp-2">
                        {contact.notes}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12 text-gray-500">
              <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              {searchTerm || typeFilter !== 'all' ? (
                <div>
                  <p className="text-lg font-medium mb-2">No contacts found</p>
                  <p>Try adjusting your search terms or filters.</p>
                </div>
              ) : (
                <div>
                  <p className="text-lg font-medium mb-2">No contacts yet</p>
                  <p>Add your first contact to get started.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contact Statistics */}
      {filteredContacts.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Contact Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-construction-blue">
                  {mockContacts.filter(c => c.type === 'client').length}
                </div>
                <div className="text-sm text-gray-600">Clients</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-project-green">
                  {mockContacts.filter(c => c.type === 'subcontractor').length}
                </div>
                <div className="text-sm text-gray-600">Subcontractors</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-alert-orange">
                  {mockContacts.filter(c => c.type === 'vendor').length}
                </div>
                <div className="text-sm text-gray-600">Vendors</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">
                  {mockContacts.filter(c => c.type === 'lead').length}
                </div>
                <div className="text-sm text-gray-600">Leads</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
