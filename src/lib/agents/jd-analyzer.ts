import { generateWithGemini } from '../gemini';
import { JDAnalysis } from '@/types';

const SYSTEM_PROMPT = `You are an expert job description analyzer. Your task is to extract key information from job descriptions to help create ATS-optimized resumes.

IMPORTANT: Extract EXACT phrases and keywords as they appear in the job description. These exact matches are crucial for ATS systems.

You must respond with a valid JSON object in the following format:
{
  "jobTitle": "string - the exact job title",
  "company": "string - company name if mentioned, otherwise empty string",
  "requiredSkills": ["array of must-have technical skills and technologies"],
  "preferredSkills": ["array of nice-to-have skills"],
  "keywords": ["array of important non-skill keywords like 'distributed systems', 'agile', etc."],
  "experienceLevel": "one of: 'entry', 'mid', 'senior', 'lead'",
  "keyResponsibilities": ["array of main responsibilities"],
  "educationRequirements": ["array of education requirements"]
}

Guidelines:
- For experienceLevel: entry (0-2 years), mid (2-5 years), senior (5-10 years), lead (10+ years)
- Include both spelled out and abbreviated forms of skills (e.g., "JavaScript", "JS")
- Extract company culture keywords if present (e.g., "fast-paced", "collaborative")
- Identify any certifications or specific tools mentioned`;

export async function analyzeJobDescription(jobDescription: string): Promise<JDAnalysis> {
    const userMessage = `Analyze the following job description and extract all relevant information:

${jobDescription}`;

    return generateWithGemini<JDAnalysis>(SYSTEM_PROMPT, userMessage);
}
