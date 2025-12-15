import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { processResumeGeneration } from '@/lib/orchestrator';
import { v4 as uuidv4 } from 'uuid';

const USER_ID = 'default_user';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { jobDescription } = body;

        if (!jobDescription || jobDescription.trim().length < 50) {
            return NextResponse.json(
                { success: false, error: 'Job description is too short' },
                { status: 400 }
            );
        }

        const supabase = createServerSupabaseClient();
        const jobId = uuidv4();

        // Create job record
        const { error } = await supabase.from('resume_jobs').insert({
            id: jobId,
            user_id: USER_ID,
            job_description: jobDescription,
            status: 'pending',
            current_step: 'Initializing...',
            progress: 0,
        });

        if (error) {
            throw error;
        }

        // Run inline so it actually completes in dev/serverless environments that kill background work.
        await processResumeGeneration(jobId, USER_ID, jobDescription);

        return NextResponse.json({
            success: true,
            data: { jobId },
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to start generation';
        console.error('Failed to start generation:', message);
        return NextResponse.json(
            { success: false, error: message },
            { status: 500 }
        );
    }
}
