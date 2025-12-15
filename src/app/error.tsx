'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Page Error:', error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <h2 className="text-2xl font-bold">Something went wrong!</h2>
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg max-w-lg text-red-500 overflow-auto">
                <p className="font-mono text-sm">{error.message}</p>
                {error.digest && <p className="text-xs mt-2 text-muted-foreground">Digest: {error.digest}</p>}
            </div>
            <Button onClick={() => reset()} variant="default">
                Try again
            </Button>
        </div>
    );
}
