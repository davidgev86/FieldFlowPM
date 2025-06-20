import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import { MobileBottomNav } from './MobileBottomNav';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Menu, 
  Home, 
  Hammer, 
  Calendar, 
  DollarSign, 
  FileText, 
  Folder, 
  ClipboardList, 
  Users,
  X
} from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return null;

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, current: location === '/dashboard' },
    { name: 'Projects', href: '/projects', icon: Hammer, current: location.startsWith('/projects') },
    { name: 'Schedule', href: '/schedule', icon: Calendar, current: location === '/schedule' },
    { name: 'Job Costs', href: '/costs', icon: DollarSign, current: location === '/costs' },
    { name: 'Change Orders', href: '/change-orders', icon: FileText, current: location === '/change-orders' },
    { name: 'Documents', href: '/documents', icon: Folder, current: location === '/documents' },
    { name: 'Daily Log', href: '/daily-log', icon: ClipboardList, current: location === '/daily-log' },
    { name: 'Contacts', href: '/contacts', icon: Users, current: location === '/contacts' },
  ];


  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="bg-construction-blue text-white sticky top-0 z-50 shadow-lg">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden p-2 hover:bg-blue-700 text-white"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold">FieldFlowPM</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="p-2 hover:bg-blue-700 text-white relative"
              >
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 bg-safety-orange text-white h-5 w-5 flex items-center justify-center p-0 text-xs">
                  3
                </Badge>
              </Button>
              
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-300 text-construction-blue text-sm font-medium">
                    {getInitials(user.firstName, user.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium">{user.firstName} {user.lastName}</div>
                  <Badge variant="secondary" className="bg-blue-800 text-white text-xs capitalize">
                    {user.role}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 bg-white shadow-lg min-h-screen">
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.name} href={item.href}>
                  <a
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      item.current
                        ? 'bg-blue-50 text-construction-blue'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </a>
                </Link>
              );
            })}
            
            <div className="pt-4 mt-4 border-t border-gray-200">
              <Button
                variant="ghost"
                onClick={logout}
                className="w-full justify-start text-gray-700 hover:bg-gray-50"
              >
                Logout
              </Button>
            </div>
          </nav>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setSidebarOpen(false)} />
            <aside className="relative bg-white w-64 shadow-lg">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Navigation</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              <nav className="p-4 space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.name} href={item.href}>
                      <a
                        className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                          item.current
                            ? 'bg-blue-50 text-construction-blue'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                        onClick={() => setSidebarOpen(false)}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </a>
                    </Link>
                  );
                })}
                
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      logout();
                      setSidebarOpen(false);
                    }}
                    className="w-full justify-start text-gray-700 hover:bg-gray-50"
                  >
                    Logout
                  </Button>
                </div>
              </nav>
            </aside>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
