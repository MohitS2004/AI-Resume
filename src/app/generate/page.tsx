'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ResumeJob } from '@/types';
import {
    Sparkles,
    Loader2,
    CheckCircle,
    XCircle,
    ArrowRight,
    FileText,
    Search,
    Cpu,
    MessageSquare,
    ClipboardCheck
} from 'lucide-react';
import Link from 'next/link';

const steps = [
    { id: 'analyzing_jd', label: 'Analyzing JD', icon: Search },
    { id: 'generating', label: 'Generating', icon: Cpu },
    { id: 'reviewing', label: 'Reviewing', icon: MessageSquare },
    { id: 'complete', label: 'Complete', icon: ClipboardCheck },
];

function GeneratePageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [jobDescription, setJobDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [jobId, setJobId] = useState<string | null>(() => searchParams?.get('jobId') || null);
    const [job, setJob] = useState<ResumeJob | null>(null);

    // Poll for job status
    useEffect(() => {
        if (!jobId) return;

        const fetchStatus = async () => {
            try {
                const res = await fetch(`/api/generate/status/${jobId}`);
                const { data } = await res.json();
                setJob(data);

                if (data.status === 'complete' || data.status === 'failed') {
                    return true; // Stop polling
                }
            } catch (error) {
                console.error('Failed to fetch status:', error);
            }
            return false;
        };

        // Initial fetch
        fetchStatus();

        const interval = setInterval(async () => {
            const done = await fetchStatus();
            if (done) {
                clearInterval(interval);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [jobId]);

    const handleGenerate = async () => {
        if (jobDescription.trim().length < 50) {
            alert('Please enter a more detailed job description (at least 50 characters)');
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jobDescription }),
            });

            const { data, error } = await res.json();

            if (error) {
                throw new Error(error);
            }

            setJobId(data.jobId);
            router.push(`/generate?jobId=${data.jobId}`);
        } catch (error) {
            console.error('Failed to start generation:', error);
            alert('Failed to start generation. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getCurrentStepIndex = () => {
        if (!job) return -1;
        return steps.findIndex((s) => s.id === job.status);
    };

    // Show input form if no job
    if (!jobId) {
        return (
            <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold">Generate Resume</h1>
                    <p className="text-muted-foreground mt-1">
                        Paste a job description to get a tailored, ATS-optimized resume
                    </p>
                </div>

                <Card className="glass border-0">
                    <CardHeader>
                        <CardTitle className="text-lg">Job Description</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            placeholder="Paste the full job description here...

Include:
• Job title and company
• Required skills and qualifications
• Responsibilities
• Nice-to-have skills"
                            value={jobDescription}
                            onChange={(e) => setJobDescription(e.target.value)}
                            className="min-h-[300px]"
                        />
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">
                                {jobDescription.length} characters
                            </span>
                            <Button onClick={handleGenerate} disabled={loading || jobDescription.length < 50}>
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Starting...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Generate Resume
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Show progress
    return (
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold">
                    {job?.status === 'complete' ? 'Resume Ready!' :
                        job?.status === 'failed' ? 'Generation Failed' :
                            'Generating Resume...'}
                </h1>
                <p className="text-muted-foreground mt-1">
                    {job?.jdAnalysis?.jobTitle && job?.jdAnalysis?.company
                        ? `${job.jdAnalysis.jobTitle} at ${job.jdAnalysis.company}`
                        : 'Processing your request'}
                </p>
            </div>

            {/* Progress Card */}
            <Card className="glass border-0">
                <CardContent className="pt-6 space-y-6">
                    {/* Progress Bar */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{job?.currentStep || 'Initializing...'}</span>
                            <span className="font-medium">{job?.progress || 0}%</span>
                        </div>
                        <Progress value={job?.progress || 0} />
                    </div>

                    {/* Steps */}
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => {
                            const currentIndex = getCurrentStepIndex();
                            const isComplete = index < currentIndex || job?.status === 'complete';
                            const isActive = index === currentIndex && job?.status !== 'complete' && job?.status !== 'failed';
                            const isFailed = job?.status === 'failed' && index === currentIndex;

                            return (
                                <div key={step.id} className="flex flex-col items-center gap-2">
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isComplete
                                                ? 'bg-green-500/20 text-green-400'
                                                : isActive
                                                    ? 'bg-primary/20 text-primary animate-pulse'
                                                    : isFailed
                                                        ? 'bg-red-500/20 text-red-400'
                                                        : 'bg-secondary text-muted-foreground'
                                            }`}
                                    >
                                        {isComplete ? (
                                            <CheckCircle className="w-6 h-6" />
                                        ) : isFailed ? (
                                            <XCircle className="w-6 h-6" />
                                        ) : (
                                            <step.icon className="w-6 h-6" />
                                        )}
                                    </div>
                                    <span className="text-xs text-muted-foreground">{step.label}</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* JD Analysis Preview */}
                    {job?.jdAnalysis && (
                        <div className="pt-4 border-t border-border space-y-3">
                            <h3 className="font-medium">Job Analysis</h3>
                            <div className="flex flex-wrap gap-2">
                                {job.jdAnalysis.requiredSkills.slice(0, 8).map((skill) => (
                                    <Badge key={skill} variant="default">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {job?.status === 'failed' && job.errorMessage && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                            <p className="font-medium">Error</p>
                            <p className="text-sm mt-1">{job.errorMessage}</p>
                        </div>
                    )}

                    {/* Complete Actions */}
                    {job?.status === 'complete' && (
                        <div className="pt-4 border-t border-border flex flex-col sm:flex-row gap-4">
                            <Link href={`/resume/${job.id}`} className="flex-1">
                                <Button className="w-full">
                                    <FileText className="w-4 h-4 mr-2" />
                                    View Resume
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setJobId(null);
                                    setJob(null);
                                    setJobDescription('');
                                    router.push('/generate');
                                }}
                            >
                                Generate Another
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Review Feedback Preview */}
            {job?.reviewFeedback && (
                <Card className="glass border-0">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <MessageSquare className="w-5 h-5" />
                            Quick Review
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">ATS Score</p>
                                <p className="text-2xl font-bold text-primary">{job.reviewFeedback.atsScore}%</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Keyword Coverage</p>
                                <p className="text-2xl font-bold text-primary">
                                    {job.reviewFeedback.keywordCoverage.percentage}%
                                </p>
                            </div>
                        </div>
                        {job.reviewFeedback.criticalIssues.length > 0 && (
                            <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                                <p className="text-sm font-medium text-yellow-400">Critical Issues</p>
                                <ul className="text-sm text-muted-foreground mt-1 list-disc list-inside">
                                    {job.reviewFeedback.criticalIssues.map((issue, i) => (
                                        <li key={i}>{issue}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

export default function GeneratePage() {
    return <GeneratePageContent />;
}
