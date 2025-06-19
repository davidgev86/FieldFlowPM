import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authManager } from '@/lib/auth';
import { Project, InsertProject, ProjectTask, CostCategory, ChangeOrder, DailyLog } from '@shared/schema';

const apiRequest = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authManager.getAuthHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
};

export function useProjects() {
  return useQuery({
    queryKey: ['/api/projects'],
    queryFn: () => apiRequest('/api/projects'),
  });
}

export function useProject(id: number) {
  return useQuery({
    queryKey: ['/api/projects', id],
    queryFn: () => apiRequest(`/api/projects/${id}`),
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (project: InsertProject) => 
      apiRequest('/api/projects', {
        method: 'POST',
        body: JSON.stringify(project),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...project }: { id: number } & Partial<InsertProject>) =>
      apiRequest(`/api/projects/${id}`, {
        method: 'PUT',
        body: JSON.stringify(project),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      queryClient.invalidateQueries({ queryKey: ['/api/projects', variables.id] });
    },
  });
}

export function useProjectTasks(projectId: number) {
  return useQuery({
    queryKey: ['/api/projects', projectId, 'tasks'],
    queryFn: () => apiRequest(`/api/projects/${projectId}/tasks`),
    enabled: !!projectId,
  });
}

export function useProjectCosts(projectId: number) {
  return useQuery({
    queryKey: ['/api/projects', projectId, 'costs'],
    queryFn: () => apiRequest(`/api/projects/${projectId}/costs`),
    enabled: !!projectId,
  });
}

export function useProjectChangeOrders(projectId: number) {
  return useQuery({
    queryKey: ['/api/projects', projectId, 'change-orders'],
    queryFn: () => apiRequest(`/api/projects/${projectId}/change-orders`),
    enabled: !!projectId,
  });
}

export function useProjectDailyLogs(projectId: number) {
  return useQuery({
    queryKey: ['/api/projects', projectId, 'daily-logs'],
    queryFn: () => apiRequest(`/api/projects/${projectId}/daily-logs`),
    enabled: !!projectId,
  });
}

export function useCreateDailyLog() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, ...log }: { projectId: number } & Omit<DailyLog, 'id' | 'createdAt' | 'createdBy'>) =>
      apiRequest(`/api/projects/${projectId}/daily-logs`, {
        method: 'POST',
        body: JSON.stringify(log),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', variables.projectId, 'daily-logs'] });
    },
  });
}

export function useCreateChangeOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ projectId, ...order }: { projectId: number } & Omit<ChangeOrder, 'id' | 'createdAt' | 'createdBy' | 'approvedBy' | 'approvedAt' | 'signedAt'>) =>
      apiRequest(`/api/projects/${projectId}/change-orders`, {
        method: 'POST',
        body: JSON.stringify(order),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', variables.projectId, 'change-orders'] });
    },
  });
}

export function useApproveChangeOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (orderId: number) =>
      apiRequest(`/api/change-orders/${orderId}/approve`, {
        method: 'PUT',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
    },
  });
}
