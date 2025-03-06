import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Home, ChefHat, QrCode, Coffee, Users, Menu, Scan } from 'lucide-react';

// This component is no longer used as we've replaced it with a sidebar
// It's kept for reference or if we need to revert changes
const Navbar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <Home className="w-5 h-5 mr-2" /> },
    { name: 'Cashier', path: '/cashier', icon: <Scan className="w-5 h-5 mr-2" /> },
    { name: 'Kitchen', path: '/kitchen', icon: <ChefHat className="w-5 h-5 mr-2" /> },
    { name: 'Menu', path: '/menu', icon: <Coffee className="w-5 h-5 mr-2" /> },
    { name: 'Tables', path: '/tables', icon: <Users className="w-5 h-5 mr-2" /> }
  ];

  // This component is hidden with CSS class hidden
  return (
    <header className="hidden">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="font-semibold text-xl text-primary flex items-center">
            <QrCode className="w-6 h-6 mr-2" />
            <span>Bistro Connect</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex space-x-1">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant={isActive(item.path) ? "default" : "ghost"}
              size="sm"
              asChild
              className={cn(
                "transition-all",
                isActive(item.path) 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Link to={item.path} className="flex items-center">
                {item.icon}
                {item.name}
              </Link>
            </Button>
          ))}
        </nav>
        
        <div className="md:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
