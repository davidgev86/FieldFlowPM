import { Link, useLocation } from 'wouter';
import { Home, Hammer, Calendar, ClipboardList, MoreHorizontal } from 'lucide-react';

export function MobileBottomNav() {
  const [location] = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, current: location === '/dashboard' },
    { name: 'Projects', href: '/projects', icon: Hammer, current: location.startsWith('/projects') },
    { name: 'Schedule', href: '/schedule', icon: Calendar, current: location === '/schedule' },
    { name: 'Log', href: '/daily-log', icon: ClipboardList, current: location === '/daily-log' },
    { name: 'More', href: '/contacts', icon: MoreHorizontal, current: false },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="grid grid-cols-5 h-16">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href}>
              <a className={`flex flex-col items-center justify-center space-y-1 ${
                item.current ? 'text-construction-blue' : 'text-gray-500'
              }`}>
                <Icon className="h-5 w-5" />
                <span className="text-xs">{item.name}</span>
              </a>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
