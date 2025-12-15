import { generateWithGemini } from '../gemini';
import { Profile, JDAnalysis, GeneratedSkills } from '@/types';

const SYSTEM_PROMPT = `You are an expert resume writer specializing in skill sections for ATS optimization.

Your task is to organize and prioritize skills based on the job requirements.

You must respond with a valid JSON object:
{
  "categories": [
    {
      "name": "string - category name (e.g., 'Programming Languages', 'Frameworks', 'Tools')",
      "skills": ["array of skills in priority order"]
    }
  ]
}

Guidelines:
- Put exact JD keyword matches FIRST in each category
- Create 2-4 logical categories based on the skills
- Common categories: Programming Languages, Frameworks/Libraries, Databases, Cloud/DevOps, Tools, Soft Skills
- Put most relevant skills first within each category
- Remove or deprioritize skills that are completely irrelevant to the job
- Keep spacing consistent and professional`;

export async function organizeSkills(
    profile: Profile,
    jdAnalysis: JDAnalysis
): Promise<GeneratedSkills> {
    const userMessage = `Organize these skills for a ${jdAnalysis.jobTitle} position.

CANDIDATE'S SKILLS:
${profile.skills.join(', ')}

SKILLS FROM EXPERIENCE:
${profile.experiences.map((exp) => exp.documentation).join(' ').slice(0, 500)}

JOB REQUIREMENTS:
- Required Skills: ${jdAnalysis.requiredSkills.join(', ')}
- Preferred Skills: ${jdAnalysis.preferredSkills.join(', ')}
- Keywords: ${jdAnalysis.keywords.join(', ')}

Organize skills into categories with the most relevant skills first.`;

    return generateWithGemini<GeneratedSkills>(SYSTEM_PROMPT, userMessage);
}
