'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface TabsContextValue {
    value: string;
    onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

function useTabs() {
    const context = React.useContext(TabsContext);
    if (!context) {
        throw new Error('Tabs components must be used within a Tabs provider');
    }
    return context;
}

interface TabsProps {
    value: string;
    onValueChange: (value: string) => void;
    children: React.ReactNode;
    className?: string;
}

const Tabs = ({ value, onValueChange, children, className }: TabsProps) => {
    return (
        <TabsContext.Provider value={{ value, onValueChange }}>
            <div className={cn('w-full', className)}>{children}</div>
        </TabsContext.Provider>
    );
};

const TabsList = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            'inline-flex items-center justify-center rounded-xl bg-secondary/50 p-1 gap-1',
            className
        )}
        {...props}
    />
));
TabsList.displayName = 'TabsList';

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    value: string;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
    ({ className, value, ...props }, ref) => {
        const { value: selectedValue, onValueChange } = useTabs();
        const isSelected = selectedValue === value;

        return (
            <button
                ref={ref}
                type="button"
                onClick={() => onValueChange(value)}
                className={cn(
                    'inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium',
                    'ring-offset-background transition-all duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    'disabled:pointer-events-none disabled:opacity-50',
                    isSelected
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50',
                    className
                )}
                {...props}
            />
        );
    }
);
TabsTrigger.displayName = 'TabsTrigger';

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
    ({ className, value, ...props }, ref) => {
        const { value: selectedValue } = useTabs();

        if (selectedValue !== value) {
            return null;
        }

        return (
            <div
                ref={ref}
                className={cn('mt-4 animate-fade-in', className)}
                {...props}
            />
        );
    }
);
TabsContent.displayName = 'TabsContent';

export { Tabs, TabsList, TabsTrigger, TabsContent };
