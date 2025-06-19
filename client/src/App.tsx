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
  const [location, setLocation] = useLocation();
  
  // Handle root path redirect
  if (location === "/") {
    setLocation("/dashboard");
    return null;
  }

  return (
    <AppLayout>
      <Switch>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/projects" component={Projects} />
        <Route path="/schedule" component={Schedule} />
        <Route path="/costs" component={Costs} />
        <Route path="/change-orders" component={ChangeOrders} />
        <Route path="/documents" component={Documents} />
        <Route path="/daily-log" component={DailyLog} />
        <Route path="/contacts" component={Contacts} />
        <Route path="/client-portal" component={ClientPortal} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading FieldFlowPM...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/login" component={Login} />
        <Route>
          <Redirect to="/login" />
        </Route>
      </Switch>
    );
  }

  // If authenticated and on login page, redirect to dashboard
  if (isAuthenticated && location === '/login') {
    return <Redirect to="/dashboard" />;
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
