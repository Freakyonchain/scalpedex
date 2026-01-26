'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Scan, 
  LayoutGrid, 
  TrendingUp, 
  Bell, 
  User 
} from 'lucide-react';

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

function NavItem({ href, icon, label, isActive }: NavItemProps) {
  return (
    <Link href={href} className="relative group">
      <motion.div
        className={`
          flex flex-col items-center justify-center gap-1 py-2 px-3
          transition-colors duration-200
          ${isActive 
            ? 'text-white' 
            : 'text-zinc-500 hover:text-zinc-300'
          }
        `}
        whileTap={{ scale: 0.9 }}
      >
        {/* Active indicator */}
        {isActive && (
          <motion.div
            layoutId="nav-indicator"
            className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}
        
        <div className="relative">
          {icon}
          {isActive && (
            <div className="absolute inset-0 blur-lg bg-primary/30 -z-10" />
          )}
        </div>
        
        <span className={`
          text-[10px] font-medium uppercase tracking-wider
          ${isActive ? 'text-zinc-200' : 'text-zinc-600'}
        `}>
          {label}
        </span>
      </motion.div>
    </Link>
  );
}

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/collection', icon: <LayoutGrid size={20} strokeWidth={1.5} />, label: 'Collection' },
    { href: '/market', icon: <TrendingUp size={20} strokeWidth={1.5} />, label: 'Market' },
    { href: '/alerts', icon: <Bell size={20} strokeWidth={1.5} />, label: 'Alertes' },
    { href: '/profile', icon: <User size={20} strokeWidth={1.5} />, label: 'Profil' },
  ];

  // Split nav items for left and right of center button
  const leftItems = navItems.slice(0, 2);
  const rightItems = navItems.slice(2);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      {/* Glass Background */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-2xl border-t border-white/5" />
      
      {/* HUD Corner Decorations */}
      <div className="absolute top-0 left-4 w-8 h-[1px] bg-gradient-to-r from-primary/50 to-transparent" />
      <div className="absolute top-0 right-4 w-8 h-[1px] bg-gradient-to-l from-primary/50 to-transparent" />
      
      {/* Navigation Content */}
      <div className="relative max-w-lg mx-auto h-20 flex items-center justify-between px-4">
        
        {/* Left Nav Items */}
        <div className="flex items-center gap-2">
          {leftItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={pathname === item.href}
            />
          ))}
        </div>

        {/* Center Scan Button - The Hero */}
        <Link href="/scan" className="relative -mt-8">
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Pulse Rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute w-[72px] h-[72px] rounded-full border-2 border-profit/30 animate-ping" 
                   style={{ animationDuration: '2s' }} />
              <div className="absolute w-[72px] h-[72px] rounded-full border border-profit/20 animate-ping" 
                   style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
            </div>
            
            {/* Outer Glow Ring */}
            <div className="absolute -inset-2 rounded-full bg-gradient-to-b from-profit/20 to-profit/5 blur-xl opacity-80" />
            
            {/* Button Border Ring */}
            <div className="absolute -inset-1 rounded-full bg-gradient-to-b from-profit/30 to-profit/10" />
            
            {/* Main Button */}
            <div className={`
              relative w-16 h-16 rounded-full
              bg-gradient-to-br from-profit to-profit-dark
              flex items-center justify-center
              shadow-btn-profit
              transition-all duration-300
              ${pathname === '/scan' 
                ? 'ring-2 ring-profit ring-offset-2 ring-offset-black' 
                : ''
              }
            `}>
              {/* Inner Glow */}
              <div className="absolute inset-2 rounded-full bg-gradient-to-t from-transparent to-white/20" />
              
              {/* Icon */}
              <Scan 
                size={28} 
                strokeWidth={2} 
                className="relative z-10 text-black" 
              />
            </div>
            
            {/* Label Below */}
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <span className="text-[9px] font-bold uppercase tracking-widest text-profit">
                SCAN
              </span>
            </div>
          </motion.div>
        </Link>

        {/* Right Nav Items */}
        <div className="flex items-center gap-2">
          {rightItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={pathname === item.href}
            />
          ))}
        </div>
      </div>
      
      {/* Status Bar at Bottom */}
      <div className="relative h-1 bg-black/50">
        <motion.div 
          className="h-full bg-gradient-to-r from-transparent via-primary/50 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
    </nav>
  );
}