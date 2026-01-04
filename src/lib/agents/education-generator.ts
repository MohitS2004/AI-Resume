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
      "coursework": "string - relevant coursework, comma-separated. MUST be included.",
      "highlights": ["array of relevant achievements or honors"]
    }
  ]
}

Guidelines:
- Only include GPA if it's 3.0 or higher
- **ALWAYS** generate Relevant Coursework. This is CRITICAL for ATS optimization.
- If the candidate provided coursework, use it and enhance it with keywords.
- If NO coursework provided, **INFER relevant courses** based on the degree and job title (e.g. for CS degree & Web Dev job: "Web Development, Data Structures, Algorithms, Database Systems").
- Coursework must be a comma-separated string.
- Include honors, awards, or relevant extracurriculars in highlights
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
- Coursework: ${edu.coursework || 'None provided - generate relevant coursework based on degree and JD keywords'}
- Existing Highlights: ${edu.highlights.join(', ') || 'None'}
`).join('\n')}

TARGET JOB REQUIREMENTS:
- Required Skills: ${jdAnalysis.requiredSkills.join(', ')}
- Education Requirements: ${jdAnalysis.educationRequirements.join(', ')}
- Keywords: ${jdAnalysis.keywords.join(', ')}

IMPORTANT: You MUST include a 'coursework' field for EVERY education entry.
If the input says "None provided", you must GENERATE standard relevant coursework for that degree that matches the Job Description keywords.
This is essential for ATS optimization. Do not leave it empty.
Format the education to highlight relevant aspects for this position.`;

  const result = await generateWithGemini<{ education: GeneratedEducation[] }>(
    SYSTEM_PROMPT,
    userMessage
  );
  return result.education;
}
