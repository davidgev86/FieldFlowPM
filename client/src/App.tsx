import { Switch, Route, Redirect, useLocation } from "wouter";
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
import TestPage from "@/pages/test-page";
import WorkingDashboard from "@/pages/working-dashboard";
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
  console.log('AuthenticatedRoutes rendering');
  
  return (
    <Switch>
        <Route path="/dashboard">
          <WorkingDashboard />
        </Route>
        <Route path="/">
          <Redirect to="/dashboard" />
        </Route>
        <Route>
          <WorkingDashboard />
        </Route>
    </Switch>
  );
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();

  console.log('Router state:', { isAuthenticated, isLoading, location });

  if (isLoading) {
    return (
      <div style={{ padding: '20px', backgroundColor: 'yellow' }}>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/login">
        {isAuthenticated ? <Redirect to="/dashboard" /> : <Login />}
      </Route>
      <Route>
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
