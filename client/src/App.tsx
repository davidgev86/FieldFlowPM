import { Switch, Route, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AppLayout } from "@/components/layout/AppLayout";

// Pages
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import SimpleDashboard from "@/pages/simple-dashboard";
import Projects from "@/pages/projects";
import Schedule from "@/pages/schedule";
import Costs from "@/pages/costs";
import ChangeOrders from "@/pages/change-orders";
import Documents from "@/pages/documents";
import DailyLog from "@/pages/daily-log";
import Contacts from "@/pages/contacts";
import ClientPortal from "@/pages/client-portal";
import NotFound from "@/pages/not-found";

function AuthenticatedRoutes() {
  return (
    <Switch>
      <Route path="/" exact>
        <Redirect to="/dashboard" />
      </Route>
      <Route path="/dashboard" component={SimpleDashboard} />
      <Route path="/projects">
        <AppLayout><Projects /></AppLayout>
      </Route>
      <Route path="/schedule">
        <AppLayout><Schedule /></AppLayout>
      </Route>
      <Route path="/costs">
        <AppLayout><Costs /></AppLayout>
      </Route>
      <Route path="/change-orders">
        <AppLayout><ChangeOrders /></AppLayout>
      </Route>
      <Route path="/documents">
        <AppLayout><Documents /></AppLayout>
      </Route>
      <Route path="/daily-log">
        <AppLayout><DailyLog /></AppLayout>
      </Route>
      <Route path="/contacts">
        <AppLayout><Contacts /></AppLayout>
      </Route>
      <Route path="/client-portal">
        <AppLayout><ClientPortal /></AppLayout>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-sm text-gray-600">Loading FieldFlowPM...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/login">
        {isAuthenticated ? <Redirect to="/dashboard" /> : <Login />}
      </Route>
      
      <Route path="/">
        {isAuthenticated ? <AuthenticatedRoutes /> : <Redirect to="/login" />}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
