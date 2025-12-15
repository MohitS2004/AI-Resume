import { generateWithGemini } from '../gemini';
import { Project, JDAnalysis, GeneratedProject } from '@/types';

const SYSTEM_PROMPT = `You are an expert resume writer specializing in showcasing technical projects effectively.

Your task is to create a compelling project entry with:
1. A concise description highlighting the project's purpose and impact
2. 2-4 achievement bullets focusing on technical challenges solved and results

You must respond with a valid JSON object:
{
  "id": "string - the project ID provided",
  "name": "string - project name",
  "description": "string - 1-2 sentence project description",
  "technologies": ["array of technologies used"],
  "link": "string - project link if provided",
  "bullets": ["array of 2-4 achievement bullets"]
}

Guidelines:
- Emphasize technologies that match the job description
- Include metrics where possible (users, performance improvements, etc.)
- Highlight problem-solving and technical decision-making
- Keep description concise but impactful
- Each bullet should showcase a specific achievement or challenge overcome`;

export async function generateProject(
    project: Project,
    jdAnalysis: JDAnalysis
): Promise<GeneratedProject> {
    const userMessage = `Create a compelling project entry for this project to match the ${jdAnalysis.jobTitle} position.

PROJECT DETAILS:
- ID: ${project.id}
- Name: ${project.name}
- Description: ${project.description}
- Technologies: ${project.technologies.join(', ')}
- Link: ${project.link || 'N/A'}

DOCUMENTATION/DETAILS:
${project.documentation || 'No additional documentation provided.'}

EXISTING HIGHLIGHTS:
${project.highlights.length > 0 ? project.highlights.join('\n') : 'No existing highlights.'}

TARGET JOB REQUIREMENTS:
- Required Skills: ${jdAnalysis.requiredSkills.join(', ')}
- Preferred Skills: ${jdAnalysis.preferredSkills.join(', ')}
- Keywords: ${jdAnalysis.keywords.join(', ')}

Create an entry that emphasizes the matching technologies and skills.`;

    return generateWithGemini<GeneratedProject>(SYSTEM_PROMPT, userMessage);
}

export async function generateAllProjects(
    projects: Project[],
    jdAnalysis: JDAnalysis
): Promise<GeneratedProject[]> {
    const results = await Promise.all(
        projects.map((proj) => generateProject(proj, jdAnalysis))
    );
    return results;
}
