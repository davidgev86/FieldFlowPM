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
import TestPage from "@/pages/test-page";
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
    <div style={{ padding: '20px', backgroundColor: 'lightgreen' }}>
      <h1 style={{ color: 'red' }}>AUTHENTICATED ROUTES</h1>
      <Switch>
        <Route path="/dashboard">
          <TestPage />
        </Route>
        <Route path="/">
          <TestPage />
        </Route>
      </Switch>
    </div>
  );
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  console.log('Router state:', { isAuthenticated, isLoading });

  if (isLoading) {
    return (
      <div style={{ padding: '20px', backgroundColor: 'yellow' }}>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return <AuthenticatedRoutes />;
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
