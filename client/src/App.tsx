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
  return (
    <Switch>
      <Route path="/dashboard" component={WorkingDashboard} />
      <Route path="/" exact>
        <Redirect to="/dashboard" />
      </Route>
      <Route component={WorkingDashboard} />
    </Switch>
  );
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading FieldFlowPM...</p>
        </div>
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
