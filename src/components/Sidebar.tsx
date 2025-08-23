'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon, IconName } from './Icons';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useSidebar } from '@/hooks/use-sidebar';
import { Button } from './ui/button';
import { Menu } from 'lucide-react';

// Navigation items are now defined in a single place
const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: 'LayoutGrid' as IconName },
  { name: 'Analytics', href: '/analytics', icon: 'BarChart2' as IconName },
  { name: 'Settings', href: '/settings', icon: 'Settings' as IconName },
];

// A reusable component for the navigation links
const SidebarNav = () => {
  const pathname = usePathname();
  return (
    <nav className='flex flex-col gap-2'>
      {navItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
              isActive
                ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg'
                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            }`}>
            <Icon name={item.icon} size={20} />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
};

// The new Mobile Sidebar that uses the Sheet component
const MobileSidebar = () => {
  const { isOpen, onClose } = useSidebar();

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side='left' className='p-4 pt-10 bg-sidebar'>
        <SidebarNav />
      </SheetContent>
    </Sheet>
  );
};

// The Desktop Sidebar with theme-aware styling
const DesktopSidebar = () => {
  return (
    <aside className='fixed top-0 left-0 w-64 h-full bg-sidebar/90 backdrop-blur-lg text-sidebar-foreground p-4 hidden md:flex flex-col border-r border-sidebar-border/20'>
      <div className='text-2xl font-bold mb-10 pl-2 tracking-wider'>
        inboXpense
      </div>
      <SidebarNav />
    </aside>
  );
};

// The main Sidebar component that decides which version to render
export const Sidebar = () => {
  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

// A new component for the mobile menu trigger, to be used in the Header
export const MobileMenuTrigger = () => {
  const { onOpen } = useSidebar();
  return (
    <Button variant='ghost' size='icon' className='md:hidden' onClick={onOpen}>
      <Menu className='h-6 w-6' />
      <span className='sr-only'>Open Menu</span>
    </Button>
  );
};
