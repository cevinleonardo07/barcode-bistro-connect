
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { 
  Home, 
  ChefHat, 
  Coffee, 
  Users, 
  Clock, 
  Receipt,
  Menu as MenuIcon,
  X
} from 'lucide-react';
import { Separator } from './ui/separator';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <Home className="w-5 h-5" /> },
    { name: 'Cashier', path: '/cashier', icon: <Clock className="w-5 h-5" /> },
    { name: 'Kitchen', path: '/kitchen', icon: <ChefHat className="w-5 h-5" /> },
    { name: 'Menu', path: '/menu', icon: <Coffee className="w-5 h-5" /> },
    { name: 'Tables', path: '/tables', icon: <Users className="w-5 h-5" /> },
    { name: 'Orders', path: '/order-history', icon: <Receipt className="w-5 h-5" /> },
    { name: 'Kitchen History', path: '/kitchen-history', icon: <ChefHat className="w-5 h-5" /> }
  ];

  return (
    <div 
      className={cn(
        "h-screen fixed top-0 left-0 z-50 bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <Link to="/" className="font-semibold text-xl text-primary flex items-center">
            <span>Bistro Connect</span>
          </Link>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground"
        >
          {collapsed ? <MenuIcon className="w-5 h-5" /> : <X className="w-5 h-5" />}
        </Button>
      </div>
      
      <Separator className="bg-sidebar-border" />
      
      <div className="flex-1 py-6 overflow-y-auto">
        <nav className="px-2 space-y-1">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path}
              className={cn(
                "flex items-center py-3 px-3 rounded-md transition-colors",
                isActive(item.path) 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                collapsed ? "justify-center" : "justify-start"
              )}
            >
              {item.icon}
              {!collapsed && <span className="ml-3">{item.name}</span>}
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-sidebar-border">
        <div className={cn(
          "flex items-center",
          collapsed ? "justify-center" : "justify-start"
        )}>
          {collapsed ? (
            <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
              <span className="text-sidebar-accent-foreground">BC</span>
            </div>
          ) : (
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
                <span className="text-sidebar-accent-foreground">BC</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-sidebar-foreground">Bistro Connect</p>
                <p className="text-xs text-sidebar-foreground opacity-75">Restaurant System</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
