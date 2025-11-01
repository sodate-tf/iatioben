'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Tag, Home, Settings } from 'lucide-react';

interface SidebarProps {
  onClose?: () => void;
}

const navItems = [
  { href: '/adminHome', label: 'Dashboard', icon: Home },
  { href: '/adminHome/artigos', label: 'Artigos', icon: FileText },
  { href: '/adminHome/categories', label: 'Categorias', icon: Tag },
  { href: '/adminHome/configuracoes', label: 'Configurações', icon: Settings },
];

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const pathname = usePathname();

  return (
    <nav className="h-full flex flex-col bg-card border-r border-border">
      {/* LOGO / TOPO */}
      <div className="flex items-center justify-center h-16 border-b border-border">
        <Link
          href="/adminHome"
          onClick={onClose}
          className="text-xl font-bold text-primary hover:text-primary/90 transition-colors"
        >
          IA Tio Ben
        </Link>
      </div>

      {/* LINKS */}
      <ul className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active =
            pathname === href || pathname.startsWith(`${href}/`);

          return (
            <li key={href}>
              <Link
                href={href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200
                  ${
                    active
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* RODAPÉ */}
      <div className="p-4 border-t border-border text-xs text-muted-foreground text-center">
        © {new Date().getFullYear()} IA Tio Ben
      </div>
    </nav>
  );
};

export default Sidebar;
