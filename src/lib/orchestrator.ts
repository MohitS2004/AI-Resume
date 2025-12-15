import { createServerSupabaseClient } from './supabase';
import { Profile, ResumeSections, ResumeJob } from '@/types';
import {
    analyzeJobDescription,
    generateSummary,
    generateAllExperiences,
    generateAllProjects,
    generateEducation,
    organizeSkills,
    reviewResume,
} from './agents';

const supabase = createServerSupabaseClient();

// Delay helper
function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function updateJobStatus(
    jobId: string,
    status: ResumeJob['status'],
    currentStep: string,
    progress: number,
    additionalData?: Partial<ResumeJob>
) {
    console.log(`[${jobId}] Status: ${status} - ${currentStep} (${progress}%)`);

    const updateData: Record<string, unknown> = {
        status,
        current_step: currentStep,
        progress,
        ...additionalData,
    };

    // Convert camelCase to snake_case for Supabase
    if (additionalData?.jdAnalysis) {
        updateData.jd_analysis = additionalData.jdAnalysis;
        delete updateData.jdAnalysis;
    }
    if (additionalData?.sections) {
        updateData.sections = additionalData.sections;
    }
    if (additionalData?.reviewFeedback) {
        updateData.review_feedback = additionalData.reviewFeedback;
        delete updateData.reviewFeedback;
    }
    if (additionalData?.finalResume) {
        updateData.final_resume = additionalData.finalResume;
        delete updateData.finalResume;
    }
    if (additionalData?.errorMessage) {
        updateData.error_message = additionalData.errorMessage;
        delete updateData.errorMessage;
    }

    await supabase.from('resume_jobs').update(updateData).eq('id', jobId);
}

export async function processResumeGeneration(
    jobId: string,
    userId: string,
    jobDescription: string
) {
    console.log(`[${jobId}] Starting resume generation...`);

    try {
        // Step 1: Analyze JD (0-10%)
        await updateJobStatus(jobId, 'analyzing_jd', 'Analyzing job description...', 5);

        console.log(`[${jobId}] Calling JD Analyzer...`);
        const jdAnalysis = await analyzeJobDescription(jobDescription);
        console.log(`[${jobId}] JD Analysis complete:`, jdAnalysis?.jobTitle);

        await updateJobStatus(jobId, 'analyzing_jd', 'Job analysis complete', 10, {
            jdAnalysis,
        });

        // Get user profile
        console.log(`[${jobId}] Fetching user profile...`);
        const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (profileError || !profileData) {
            console.error(`[${jobId}] Profile error:`, profileError);
            throw new Error('Failed to fetch user profile');
        }

        const profile: Profile = {
            id: profileData.id,
            userId: profileData.user_id,
            basicInfo: profileData.basic_info,
            education: profileData.education || [],
            experiences: profileData.experiences || [],
            projects: profileData.projects || [],
            skills: profileData.skills || [],
            createdAt: profileData.created_at,
            updatedAt: profileData.updated_at,
        };

        // Step 2: Generate Sections SEQUENTIALLY (to avoid rate limits on free tier)
        await updateJobStatus(jobId, 'generating', 'Generating professional summary...', 20);

        console.log(`[${jobId}] Generating summary...`);
        const summary = await generateSummary(profile, jdAnalysis);
        console.log(`[${jobId}] Summary generated`);
        await updateJobStatus(jobId, 'generating', 'Summary generated, working on experience...', 30);

        await delay(3000); // Wait 3 seconds between calls

        console.log(`[${jobId}] Generating experiences...`);
        const experiences = await generateAllExperiences(profile.experiences, jdAnalysis);
        console.log(`[${jobId}] Experiences generated`);
        await updateJobStatus(jobId, 'generating', 'Experience generated, working on projects...', 45);

        await delay(3000);

        console.log(`[${jobId}] Generating projects...`);
        const projects = await generateAllProjects(profile.projects, jdAnalysis);
        console.log(`[${jobId}] Projects generated`);
        await updateJobStatus(jobId, 'generating', 'Projects generated, working on education...', 55);

        await delay(3000);

        console.log(`[${jobId}] Generating education...`);
        const education = await generateEducation(profile.education, jdAnalysis);
        console.log(`[${jobId}] Education generated`);
        await updateJobStatus(jobId, 'generating', 'Education generated, organizing skills...', 65);

        await delay(3000);

        console.log(`[${jobId}] Organizing skills...`);
        const skills = await organizeSkills(profile, jdAnalysis);
        console.log(`[${jobId}] Skills organized`);
        await updateJobStatus(jobId, 'generating', 'All sections generated', 70);

        const sections: ResumeSections = {
            summary,
            experiences,
            projects,
            education,
            skills,
        };

        await updateJobStatus(jobId, 'generating', 'All sections generated', 70, {
            sections,
        });

        // Step 3: Review (70-90%)
        await updateJobStatus(jobId, 'reviewing', 'Reviewing resume...', 75);

        await delay(3000);

        console.log(`[${jobId}] Reviewing resume...`);
        const reviewFeedback = await reviewResume(sections, jdAnalysis);
        console.log(`[${jobId}] Review complete`);

        await updateJobStatus(jobId, 'reviewing', 'Review complete', 90, {
            reviewFeedback,
        });

        // Step 4: Finalize (90-100%)
        console.log(`[${jobId}] Generation complete!`);
        await updateJobStatus(
            jobId,
            'complete',
            'Resume generation complete!',
            100,
            {
                finalResume: sections,
            }
        );
    } catch (error) {
        console.error(`[${jobId}] Resume generation failed:`, error);
        await updateJobStatus(jobId, 'failed', 'Generation failed', 0, {
            errorMessage: error instanceof Error ? error.message : 'Unknown error occurred',
        });
    }
}
