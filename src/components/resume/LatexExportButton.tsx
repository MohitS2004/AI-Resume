'use client';

import { Button } from '@/components/ui/button';
import { FileCode, Copy, Check } from 'lucide-react';
import { generateLatex } from '@/lib/latex-converter';
import { ResumeSections, Profile } from '@/types';
import { useState, useEffect } from 'react';

interface LatexExportButtonProps {
    sections: ResumeSections;
    profile: Profile['basicInfo'] | null; // basicInfo is what we need
}

export function LatexExportButton({ sections, profile }: LatexExportButtonProps) {
    const [copied, setCopied] = useState(false);
    const [latexCode, setLatexCode] = useState('');

    useEffect(() => {
        const code = generateLatex(sections, { basicInfo: profile } as any);
        setLatexCode(code);
    }, [sections, profile]);

    const handleCopy = () => {
        navigator.clipboard.writeText(latexCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([latexCode], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'resume.tex';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    return (
        <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleDownload} title="Download .tex file for Overleaf">
                <FileCode className="w-4 h-4 mr-2" />
                Download .tex
            </Button>
            <Button variant="outline" size="icon" onClick={handleCopy} title="Copy LaTeX code">
                {copied ? (
                    <Check className="w-4 h-4" />
                ) : (
                    <Copy className="w-4 h-4" />
                )}
            </Button>
        </div>
    );
}
