import { createServerSupabaseClient } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { ResumeEditor } from '@/components/resume/ResumeEditor';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
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
        <div className="max-w-[1600px] mx-auto space-y-4 animate-fade-in p-4 lg:p-6">
            <div className="flex items-center gap-4 mb-2">
                <Link href="/generate">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-xl font-bold">
                        {job.jdAnalysis?.jobTitle || 'Resume Editor'}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {job.jdAnalysis?.company || 'Editing Mode'}
                    </p>
                </div>
            </div>

            <ResumeEditor
                jobId={job.id}
                initialSections={job.finalResume || job.sections as any}
                profile={profile ? profile.basicInfo : null}
            />
        </div>
    );
}
