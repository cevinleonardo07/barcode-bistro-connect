
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { Receipt, Utensils, Clock, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto flex-1">
        {children}
      </main>
      
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between">
            <Link 
              to="/" 
              className={cn(
                "flex flex-col items-center py-3 px-4 text-sm text-muted-foreground transition-colors",
                isActive("/") && "text-primary font-medium"
              )}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span className="mt-1">Dashboard</span>
            </Link>
            
            <Link 
              to="/order-history" 
              className={cn(
                "flex flex-col items-center py-3 px-4 text-sm text-muted-foreground transition-colors",
                isActive("/order-history") && "text-primary font-medium"
              )}
            >
              <Receipt className="h-5 w-5" />
              <span className="mt-1">Orders</span>
            </Link>
            
            <Link 
              to="/kitchen-history" 
              className={cn(
                "flex flex-col items-center py-3 px-4 text-sm text-muted-foreground transition-colors",
                isActive("/kitchen-history") && "text-primary font-medium"
              )}
            >
              <Utensils className="h-5 w-5" />
              <span className="mt-1">Kitchen</span>
            </Link>
            
            <Link 
              to="/cashier" 
              className={cn(
                "flex flex-col items-center py-3 px-4 text-sm text-muted-foreground transition-colors",
                isActive("/cashier") && "text-primary font-medium"
              )}
            >
              <Clock className="h-5 w-5" />
              <span className="mt-1">New Order</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
