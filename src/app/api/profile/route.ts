import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

const USER_ID = 'default_user';

export async function GET() {
    try {
        const supabase = createServerSupabaseClient();

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', USER_ID)
            .single();

        if (error && error.code !== 'PGRST116') {
            throw error;
        }

        if (!data) {
            return NextResponse.json({
                success: true,
                data: {
                    basicInfo: {
                        fullName: '',
                        email: '',
                        phone: '',
                        linkedin: '',
                        github: '',
                        location: '',
                    },
                    education: [],
                    experiences: [],
                    projects: [],
                    skills: [],
                },
            });
        }

        return NextResponse.json({
            success: true,
            data: {
                id: data.id,
                userId: data.user_id,
                basicInfo: data.basic_info,
                education: data.education,
                experiences: data.experiences,
                projects: data.projects,
                skills: data.skills,
                createdAt: data.created_at,
                updatedAt: data.updated_at,
            },
        });
    } catch (error) {
        console.error('Failed to fetch profile:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch profile' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { basicInfo, education, experiences, projects, skills } = body;

        const supabase = createServerSupabaseClient();

        const { data, error } = await supabase
            .from('profiles')
            .upsert(
                {
                    user_id: USER_ID,
                    basic_info: basicInfo,
                    education: education,
                    experiences: experiences,
                    projects: projects,
                    skills: skills,
                },
                {
                    onConflict: 'user_id',
                }
            )
            .select()
            .single();

        if (error) {
            throw error;
        }

        return NextResponse.json({
            success: true,
            data: {
                id: data.id,
                userId: data.user_id,
                basicInfo: data.basic_info,
                education: data.education,
                experiences: data.experiences,
                projects: data.projects,
                skills: data.skills,
            },
        });
    } catch (error) {
        console.error('Failed to save profile:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to save profile' },
            { status: 500 }
        );
    }
}
