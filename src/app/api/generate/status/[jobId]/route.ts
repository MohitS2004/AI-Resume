import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET(
    request: Request,
    { params }: { params: { jobId: string } }
) {
    try {
        const { jobId } = params;
        const supabase = createServerSupabaseClient();

        const { data, error } = await supabase
            .from('resume_jobs')
            .select('*')
            .eq('id', jobId)
            .single();

        if (error) {
            throw error;
        }

        if (!data) {
            return NextResponse.json(
                { success: false, error: 'Job not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: {
                id: data.id,
                userId: data.user_id,
                jobDescription: data.job_description,
                jdAnalysis: data.jd_analysis,
                status: data.status,
                currentStep: data.current_step,
                progress: data.progress,
                sections: data.sections,
                reviewFeedback: data.review_feedback,
                finalResume: data.final_resume,
                errorMessage: data.error_message,
                createdAt: data.created_at,
                updatedAt: data.updated_at,
            },
        });
    } catch (error) {
        console.error('Failed to fetch job status:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch job status' },
            { status: 500 }
        );
    }
}
