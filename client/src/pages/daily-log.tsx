import { useState } from 'react';
import { useProjects, useProjectDailyLogs, useCreateDailyLog } from '@/hooks/use-projects';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DailyLogList } from '@/components/project/DailyLogList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Calendar, ClipboardList, Camera } from 'lucide-react';
import { format } from 'date-fns';

const dailyLogSchema = z.object({
  projectId: z.number(),
  date: z.string(),
  weather: z.string().optional(),
  temperature: z.string().optional(),
  crew: z.string().optional(),
  notes: z.string().min(1, 'Notes are required'),
});

type DailyLogFormData = z.infer<typeof dailyLogSchema>;

export default function DailyLog() {
  const { user } = useAuth();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const { data: dailyLogs, isLoading: logsLoading } = useProjectDailyLogs(
    selectedProjectId ? parseInt(selectedProjectId) : 0
  );

  const createDailyLog = useCreateDailyLog();

  const form = useForm<DailyLogFormData>({
    resolver: zodResolver(dailyLogSchema),
    defaultValues: {
      date: format(new Date(), 'yyyy-MM-dd'),
      weather: '',
      temperature: '',
      crew: '',
      notes: '',
    },
  });

  if (projectsLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const activeProjects = projects?.filter((p: any) => p.status !== 'completed') || [];

  // Set default project if not selected
  if (!selectedProjectId && activeProjects.length > 0) {
    setSelectedProjectId(activeProjects[0].id.toString());
    form.setValue('projectId', activeProjects[0].id);
  }

  const onSubmit = async (data: DailyLogFormData) => {
    try {
      const crewArray = data.crew ? data.crew.split(',').map(name => name.trim()).filter(Boolean) : [];
      
      await createDailyLog.mutateAsync({
        projectId: data.projectId,
        date: new Date(data.date),
        weather: data.weather || undefined,
        temperature: data.temperature || undefined,
        crew: crewArray,
        notes: data.notes,
      });

      toast({
        title: "Daily Log Created",
        description: "Your daily log entry has been saved successfully.",
      });

      form.reset({
        date: format(new Date(), 'yyyy-MM-dd'),
        weather: '',
        temperature: '',
        crew: '',
        notes: '',
      });
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create daily log entry. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daily Log</h1>
          <p className="text-gray-600 mt-1">
            Track daily progress and field activities
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Project Selector */}
          {activeProjects.length > 0 && (
            <Select 
              value={selectedProjectId} 
              onValueChange={(value) => {
                setSelectedProjectId(value);
                form.setValue('projectId', parseInt(value));
              }}
            >
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {activeProjects.map((project: any) => (
                  <SelectItem key={project.id} value={project.id.toString()}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Add Entry Dialog */}
          {user?.role !== 'client' && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-construction-blue hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Entry
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Daily Log Entry</DialogTitle>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="weather"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Weather</FormLabel>
                            <FormControl>
                              <Input placeholder="Clear, Cloudy, Rainy..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="temperature"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Temperature</FormLabel>
                            <FormControl>
                              <Input placeholder="72°F" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="crew"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Crew Members</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Mike, Steve, Tom (comma-separated)" 
                              {...field} 
                            />
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
                            <Textarea 
                              placeholder="Describe the work completed, issues encountered, materials used, etc."
                              rows={4}
                              {...field} 
                            />
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
                        disabled={createDailyLog.isPending}
                      >
                        {createDailyLog.isPending ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          'Save Entry'
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Daily Log Content */}
      {activeProjects.length > 0 ? (
        <div className="space-y-6">
          {logsLoading ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner size="lg" />
                </div>
              </CardContent>
            </Card>
          ) : (
            <DailyLogList 
              dailyLogs={dailyLogs} 
              projectId={selectedProjectId ? parseInt(selectedProjectId) : 0} 
            />
          )}

          {/* Photo Upload for Mobile */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Camera className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900">Mobile Photo Capture</h3>
                  <p className="text-sm text-green-700">
                    Use your mobile device to quickly capture and upload progress photos with your daily log entries.
                  </p>
                </div>
                <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-100">
                  Take Photo
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Log Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-construction-blue mb-2">
                    {dailyLogs?.length || 0}
                  </div>
                  <div className="text-sm text-gray-600">Total Entries</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-project-green mb-2">
                    7
                  </div>
                  <div className="text-sm text-gray-600">This Week</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-alert-orange mb-2">
                    2
                  </div>
                  <div className="text-sm text-gray-600">Issues Reported</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600 mb-2">
                    45
                  </div>
                  <div className="text-sm text-gray-600">Photos Uploaded</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12 text-gray-500">
              <ClipboardList className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">No projects found</p>
              <p>Create projects to start logging daily activities.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
