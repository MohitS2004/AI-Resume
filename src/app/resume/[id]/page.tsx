import { createServerSupabaseClient } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { ResumePreview } from '@/components/resume/ResumePreview';
import { ReviewFeedback } from '@/components/resume/ReviewFeedback';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import Link from 'next/link';

async function getResumeJob(id: string) {
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
        .from('resume_jobs')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) {
        return null;
    }

    // Get profile for header info
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', data.user_id)
        .single();

    return {
        job: {
            id: data.id,
            userId: data.user_id,
            jobDescription: data.job_description,
            jdAnalysis: data.jd_analysis,
            status: data.status,
            currentStep: data.current_step,
            progress: data.progress,
            sections: data.sections,
            reviewFeedback: data.review_feedback,
            finalResume: data.final_resume || data.sections,
            errorMessage: data.error_message,
            createdAt: data.created_at,
            updatedAt: data.updated_at,
        },
        profile: profile ? {
            basicInfo: profile.basic_info,
        } : null,
    };
}

export default async function ResumePage({ params }: { params: { id: string } }) {
    const result = await getResumeJob(params.id);

    if (!result || result.job.status !== 'complete') {
        notFound();
    }

    const { job, profile } = result;

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/generate">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl lg:text-3xl font-bold">
                            {job.jdAnalysis?.jobTitle || 'Generated Resume'}
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            {job.jdAnalysis?.company || 'Resume Preview'}
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Link href={`/api/resume/${job.id}/pdf`} target="_blank">
                        <Button>
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Resume Preview - Takes 2 columns */}
                <div className="lg:col-span-2">
                    <ResumePreview
                        sections={job.finalResume}
                        basicInfo={profile?.basicInfo}
                    />
                </div>

                {/* Feedback Panel */}
                <div className="lg:col-span-1">
                    <ReviewFeedback feedback={job.reviewFeedback} />
                </div>
            </div>
        </div>
    );
}
