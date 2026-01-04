import { createServerSupabaseClient } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = createServerSupabaseClient();
        const body = await request.json();
        const { sections } = body;

        if (!sections) {
            return NextResponse.json(
                { error: 'Sections data is required' },
                { status: 400 }
            );
        }

        // Update the resume_jobs table with new sections
        // We update both 'sections' (current state) and 'final_resume' (output)
        // to keep them in sync for manual edits.
        const { error } = await supabase
            .from('resume_jobs')
            .update({
                sections: sections,
                final_resume: sections,
                updated_at: new Date().toISOString(),
            })
            .eq('id', params.id);

        if (error) {
            console.error('Error updating resume:', error);
            return NextResponse.json(
                { error: 'Failed to update resume' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error in PUT /api/resume/[id]:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
