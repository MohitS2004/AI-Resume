import { generateWithGemini } from '../gemini';
import { Experience, JDAnalysis, GeneratedExperience } from '@/types';

const SYSTEM_PROMPT = `You are an expert resume writer specializing in crafting achievement-oriented experience bullet points.

Your task is to create 3-5 bullet points for a work experience entry using the CAR format:
- Challenge: What problem or situation existed?
- Action: What did the candidate do?
- Result: What was the measurable outcome?

You must respond with a valid JSON object:
{
  "id": "string - the experience ID provided",
  "company": "string - company name",
  "title": "string - job title",
  "location": "string - location",
  "startDate": "string - start date",
  "endDate": "string - end date or 'Present'",
  "bullets": ["array of 3-5 achievement bullet points"]
}

Guidelines for bullet points:
- Start each bullet with a strong action verb (Led, Developed, Implemented, Optimized, etc.)
- Include quantifiable metrics whenever possible (%, $, time saved, users impacted)
- Prioritize achievements that match the job description
- Each bullet should be 1-2 lines maximum
- Focus on impact and results, not just responsibilities
- Use keywords from the job description naturally`;

export async function generateExperience(
    experience: Experience,
    jdAnalysis: JDAnalysis
): Promise<GeneratedExperience> {
    const userMessage = `Create achievement-focused bullet points for this work experience to match the ${jdAnalysis.jobTitle} position.

EXPERIENCE DETAILS:
- ID: ${experience.id}
- Company: ${experience.company}
- Title: ${experience.title}
- Location: ${experience.location}
- Duration: ${experience.startDate} - ${experience.current ? 'Present' : experience.endDate}

CANDIDATE'S DOCUMENTATION/NOTES:
${experience.documentation || 'No additional documentation provided.'}

EXISTING BULLETS (enhance these):
${experience.bullets.length > 0 ? experience.bullets.join('\n') : 'No existing bullets.'}

TARGET JOB REQUIREMENTS:
- Required Skills: ${jdAnalysis.requiredSkills.join(', ')}
- Keywords: ${jdAnalysis.keywords.join(', ')}
- Key Responsibilities: ${jdAnalysis.keyResponsibilities.join(', ')}

Create compelling bullet points that highlight achievements relevant to the target role.`;

    return generateWithGemini<GeneratedExperience>(SYSTEM_PROMPT, userMessage);
}

export async function generateAllExperiences(
    experiences: Experience[],
    jdAnalysis: JDAnalysis
): Promise<GeneratedExperience[]> {
    const results = await Promise.all(
        experiences.map((exp) => generateExperience(exp, jdAnalysis))
    );
    return results;
}
