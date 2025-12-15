import { generateWithGemini } from '../gemini';
import { Profile, JDAnalysis, GeneratedSummary } from '@/types';

const SYSTEM_PROMPT = `You are an expert resume writer specializing in creating compelling professional summaries that pass ATS systems.

Your task is to create a 2-3 sentence professional summary that:
1. Does NOT use first person (no "I", "my", "me")
2. Starts with a strong professional descriptor (e.g., "Results-driven Software Engineer...")
3. Matches the seniority level of the job
4. Naturally incorporates relevant keywords from the job description
5. Highlights the most relevant experience and skills

You must respond with a valid JSON object:
{
  "content": "string - the complete professional summary"
}

Guidelines:
- Keep it concise: 2-3 sentences max
- Include years of experience if significant
- Mention key technologies that match the JD
- Focus on impact and achievements
- Use industry-appropriate language`;

export async function generateSummary(
    profile: Profile,
    jdAnalysis: JDAnalysis
): Promise<GeneratedSummary> {
    const userMessage = `Create a professional summary for this candidate applying to a ${jdAnalysis.experienceLevel} level ${jdAnalysis.jobTitle} position${jdAnalysis.company ? ` at ${jdAnalysis.company}` : ''}.

CANDIDATE PROFILE:
- Name: ${profile.basicInfo.fullName}
- Total Experience: ${profile.experiences.length} positions
- Key Skills: ${profile.skills.slice(0, 10).join(', ')}
- Recent Role: ${profile.experiences[0]?.title || 'N/A'} at ${profile.experiences[0]?.company || 'N/A'}
- Education: ${profile.education[0]?.degree || 'N/A'} in ${profile.education[0]?.field || 'N/A'} from ${profile.education[0]?.school || 'N/A'}

JOB REQUIREMENTS:
- Required Skills: ${jdAnalysis.requiredSkills.join(', ')}
- Keywords: ${jdAnalysis.keywords.join(', ')}
- Key Responsibilities: ${jdAnalysis.keyResponsibilities.join(', ')}

Create a summary that positions this candidate as an ideal match for the role.`;

    return generateWithGemini<GeneratedSummary>(SYSTEM_PROMPT, userMessage);
}
