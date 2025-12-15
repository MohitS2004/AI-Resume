import { generateWithGemini } from '../gemini';
import { Education, JDAnalysis, GeneratedEducation } from '@/types';

const SYSTEM_PROMPT = `You are an expert resume writer specializing in education sections.

Your task is to format education entries that are relevant to the target position.

You must respond with a valid JSON object:
{
  "education": [
    {
      "id": "string - education ID",
      "school": "string - school name",
      "degree": "string - degree type",
      "field": "string - field of study",
      "startDate": "string - start date",
      "endDate": "string - end date or expected date",
      "gpa": "string or null - only include if 3.0 or higher",
      "highlights": ["array of relevant achievements, coursework, or honors"]
    }
  ]
}

Guidelines:
- Only include GPA if it's 3.0 or higher
- Add relevant coursework that matches the job requirements
- Include honors, awards, or relevant extracurriculars
- For recent graduates, include more details
- For experienced professionals, keep education concise
- Highlight any thesis or capstone projects related to the job`;

export async function generateEducation(
    education: Education[],
    jdAnalysis: JDAnalysis
): Promise<GeneratedEducation[]> {
    const userMessage = `Format education entries for a ${jdAnalysis.experienceLevel} level ${jdAnalysis.jobTitle} position.

EDUCATION ENTRIES:
${education.map((edu) => `
- ID: ${edu.id}
- School: ${edu.school}
- Degree: ${edu.degree} in ${edu.field}
- Duration: ${edu.startDate} - ${edu.endDate}
- GPA: ${edu.gpa || 'Not provided'}
- Existing Highlights: ${edu.highlights.join(', ') || 'None'}
`).join('\n')}

TARGET JOB REQUIREMENTS:
- Required Skills: ${jdAnalysis.requiredSkills.join(', ')}
- Education Requirements: ${jdAnalysis.educationRequirements.join(', ')}
- Keywords: ${jdAnalysis.keywords.join(', ')}

Format the education to highlight relevant aspects for this position.`;

    const result = await generateWithGemini<{ education: GeneratedEducation[] }>(
        SYSTEM_PROMPT,
        userMessage
    );
    return result.education;
}
