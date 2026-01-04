'use client';

import { useState, useEffect } from 'react';
import { ResumeSections, Profile } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RotateCcw, Play, Loader2 } from 'lucide-react';
import { generateLatex } from '@/lib/latex-converter';
import { Download } from 'lucide-react';

interface ResumeEditorProps {
    jobId: string;
    initialSections: ResumeSections;
    profile: Profile['basicInfo'] | null;
}

export function ResumeEditor({ jobId, initialSections, profile }: ResumeEditorProps) {
    const [sections] = useState<ResumeSections>(initialSections); // Keep sections for Reset functionality
    // Safe initialization
    const [latexCode, setLatexCode] = useState(() => {
        try {
            return generateLatex(initialSections, { basicInfo: profile } as any);
        } catch (e) {
            console.error('Failed to generate initial LaTeX:', e);
            return '% Error generating initial LaTeX. Please check console.';
        }
    });

    const [pdfUrl, setPdfUrl] = useState<string>('');
    const [isCompiling, setIsCompiling] = useState(false);
    const [compileError, setCompileError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Initial Compile
    useEffect(() => {
        if (mounted) {
            compilePdf(latexCode);
        }
        // Cleanup URL on unmount
        return () => {
            if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        };
    }, [mounted]); // Run once on mount after hydration

    const compilePdf = async (code: string) => {
        if (!code) return;
        setIsCompiling(true);
        setCompileError(null);
        try {
            const res = await fetch('/api/compile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ latex: code }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.details || 'Compilation failed');
            }

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);

            setPdfUrl(prev => {
                if (prev) URL.revokeObjectURL(prev);
                return url;
            });
        } catch (error: any) {
            console.error('Preview error:', error);
            setCompileError(error.message || 'Failed to compile resume');
        } finally {
            setIsCompiling(false);
        }
    };

    // Debounce effect
    useEffect(() => {
        const timer = setTimeout(() => {
            compilePdf(latexCode);
        }, 1500);

        return () => clearTimeout(timer);
    }, [latexCode]);

    const handleRecompile = () => {
        compilePdf(latexCode);
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col gap-4">
            <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
                {/* Left: LaTeX Code */}
                <div className="flex-1 flex flex-col min-h-0 bg-slate-950 border-r border-slate-800 rounded-lg overflow-hidden">
                    <div className="p-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                        <span className="text-xs font-mono text-slate-400 pl-2">main.tex</span>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="h-6 text-green-400 hover:text-green-300 hover:bg-slate-800" onClick={handleRecompile} disabled={isCompiling}>
                                {isCompiling ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Play className="w-3 h-3 mr-1" />}
                                {isCompiling ? 'Compiling...' : 'Recompile'}
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 text-slate-400 hover:text-white hover:bg-slate-800" onClick={() => {
                                const code = generateLatex(sections, { basicInfo: profile } as any);
                                setLatexCode(code);
                            }}>
                                <RotateCcw className="w-3 h-3 mr-1" /> Reset
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 text-slate-400 hover:text-white hover:bg-slate-800" onClick={() => {
                                const blob = new Blob([latexCode], { type: 'text/plain' });
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = 'resume.tex';
                                document.body.appendChild(a);
                                a.click();
                                window.URL.revokeObjectURL(url);
                                document.body.removeChild(a);
                            }}>
                                <Download className="w-3 h-3 mr-1" /> Download
                            </Button>
                        </div>
                    </div>
                    <Textarea
                        value={latexCode}
                        onChange={(e) => setLatexCode(e.target.value)}
                        className="flex-1 font-mono text-xs leading-relaxed bg-slate-950 text-slate-50 border-none focus-visible:ring-0 resize-none p-4 rounded-none"
                        placeholder="% LaTeX code..."
                        spellCheck={false}
                    />
                </div>

                {/* Right: PDF Preview */}
                <div className="flex-1 bg-gray-200 flex flex-col relative border-l rounded-lg overflow-hidden border">
                    {pdfUrl ? (
                        <iframe
                            src={pdfUrl}
                            className="w-full h-full bg-white"
                            title="LaTeX PDF Preview"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground p-8 text-center">
                            {isCompiling ? (
                                <div className="flex flex-col items-center gap-2">
                                    <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                                    <p>Compiling...</p>
                                </div>
                            ) : compileError ? (
                                <div className="text-destructive max-w-md overflow-auto max-h-[80vh]">
                                    <h3 className="font-semibold mb-2">Compilation Failed</h3>
                                    <pre className="text-xs text-left bg-red-50 p-4 rounded border border-red-200 whitespace-pre-wrap font-mono">
                                        {compileError}
                                    </pre>
                                </div>
                            ) : (
                                <p>Generating Preview...</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
