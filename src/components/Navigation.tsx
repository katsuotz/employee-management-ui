'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { authService } from '@/services/authService';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { 
  Users, 
  LogOut,
  Home,
  Upload,
} from 'lucide-react';
import { NotificationBell } from '@/components/NotificationBell';

export default function Navigation() {
  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  const user = authService.getUser();

  return (
    <nav className="border-b bg-background">
      <div className="flex h-16 items-center px-4">
        <div className="mr-8 flex items-center space-x-2">
          <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">EM</span>
          </div>
          <span className="font-bold text-xl">Employee Management</span>
        </div>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
                <NavigationMenuLink asChild className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                    <Link href="/dashboard" passHref>
                        <Home className="mr-2 h-4 w-4" />
                        Dashboard
                    </Link>
                </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
                <NavigationMenuLink asChild className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                    <Link href="/employees" passHref>
                        <Users className="mr-2 h-4 w-4" />
                        Employees
                    </Link>
                </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
                <NavigationMenuLink asChild className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                    <Link href="/import" passHref>
                        <Upload className="mr-2 h-4 w-4" />
                        Import
                    </Link>
                </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="ml-auto flex items-center space-x-4">
          <NotificationBell />
          
          <div className="hidden md:flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Welcome,</span>
            <span className="text-sm font-medium">{user?.name || 'User'}</span>
          </div>
          
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
