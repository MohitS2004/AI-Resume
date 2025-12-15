'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    User,
    FileText,
    Sparkles,
    Menu,
    X
} from 'lucide-react';
import { useState } from 'react';

const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Profile', href: '/profile', icon: User },
    { name: 'Generate', href: '/generate', icon: Sparkles },
];

export function Sidebar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg glass"
            >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed left-0 top-0 h-full w-64 bg-card border-r border-border z-40',
                    'transform transition-transform duration-300 ease-in-out',
                    'lg:translate-x-0',
                    mobileOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b border-border">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                                <FileText size={20} className="text-white" />
                            </div>
                            <div>
                                <h1 className="font-bold text-lg gradient-text">AI Resume</h1>
                                <p className="text-xs text-muted-foreground">Builder</p>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={cn(
                                        'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                                        'hover:bg-secondary/50',
                                        isActive && 'bg-primary/10 text-primary border border-primary/20'
                                    )}
                                >
                                    <item.icon
                                        size={20}
                                        className={cn(
                                            'transition-colors',
                                            isActive ? 'text-primary' : 'text-muted-foreground'
                                        )}
                                    />
                                    <span className={cn(
                                        'font-medium',
                                        isActive ? 'text-primary' : 'text-foreground'
                                    )}>
                                        {item.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom section */}
                    <div className="p-4 border-t border-border">
                        <div className="glass rounded-xl p-4">
                            <p className="text-sm font-medium text-foreground">Pro Tip</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Add detailed documentation to your experiences for better AI-generated content.
                            </p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
