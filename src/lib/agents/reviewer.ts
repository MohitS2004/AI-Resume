import { generateWithGemini } from '../gemini';
import { ResumeSections, JDAnalysis, ReviewFeedback } from '@/types';

const SYSTEM_PROMPT = `You are a dual-perspective resume reviewer combining:
1. HR Recruiter perspective - focusing on formatting, clarity, and initial screening
2. Hiring Manager perspective - focusing on technical accuracy and job fit

Your task is to provide comprehensive feedback and scoring.

You must respond with a valid JSON object:
{
  "atsScore": number (0-100, how well it will pass ATS systems),
  "overallScore": number (0-100, overall quality),
  "hrPerspective": {
    "strengths": ["what HR would like about this resume"],
    "weaknesses": ["issues HR would flag"],
    "suggestions": ["specific improvements for HR screening"]
  },
  "managerPerspective": {
    "technicalAccuracy": ["notes on technical claims"],
    "missingSkills": ["required skills not demonstrated"],
    "suggestions": ["technical improvements needed"]
  },
  "criticalIssues": ["issues that MUST be fixed before submission"],
  "keywordCoverage": {
    "found": ["job keywords found in resume"],
    "missing": ["job keywords NOT found"],
    "percentage": number (0-100)
  },
  "readyForSubmission": boolean (true if no critical issues)
}

Scoring Guidelines:
- ATS Score: Based on keyword matching, formatting, and parsability
- Overall Score: Combination of relevance, impact, and professionalism
- Critical Issues: Only flag serious problems (missing key skills, red flags)`;

export async function reviewResume(
    sections: ResumeSections,
    jdAnalysis: JDAnalysis
): Promise<ReviewFeedback> {
    const resumeText = formatResumeForReview(sections);

    const userMessage = `Review this resume for a ${jdAnalysis.jobTitle} position${jdAnalysis.company ? ` at ${jdAnalysis.company}` : ''}.

RESUME CONTENT:
${resumeText}

JOB REQUIREMENTS:
- Required Skills: ${jdAnalysis.requiredSkills.join(', ')}
- Preferred Skills: ${jdAnalysis.preferredSkills.join(', ')}
- Keywords: ${jdAnalysis.keywords.join(', ')}
- Key Responsibilities: ${jdAnalysis.keyResponsibilities.join(', ')}

Provide a thorough review from both HR and Hiring Manager perspectives.`;

    return generateWithGemini<ReviewFeedback>(SYSTEM_PROMPT, userMessage);
}

function formatResumeForReview(sections: ResumeSections): string {
    let text = '';

    // Summary
    text += `SUMMARY:\n${sections.summary.content}\n\n`;

    // Experience
    text += 'EXPERIENCE:\n';
    for (const exp of sections.experiences) {
        text += `${exp.title} at ${exp.company} (${exp.startDate} - ${exp.endDate})\n`;
        for (const bullet of exp.bullets) {
            text += `• ${bullet}\n`;
        }
        text += '\n';
    }

    // Projects
    text += 'PROJECTS:\n';
    for (const proj of sections.projects) {
        text += `${proj.name}: ${proj.description}\n`;
        text += `Technologies: ${proj.technologies.join(', ')}\n`;
        for (const bullet of proj.bullets) {
            text += `• ${bullet}\n`;
        }
        text += '\n';
    }

    // Education
    text += 'EDUCATION:\n';
    for (const edu of sections.education) {
        text += `${edu.degree} in ${edu.field} - ${edu.school} (${edu.startDate} - ${edu.endDate})\n`;
        if (edu.gpa) text += `GPA: ${edu.gpa}\n`;
        if (edu.highlights.length > 0) {
            text += `Highlights: ${edu.highlights.join(', ')}\n`;
        }
        text += '\n';
    }

    // Skills
    text += 'SKILLS:\n';
    for (const category of sections.skills.categories) {
        text += `${category.name}: ${category.skills.join(', ')}\n`;
    }

    return text;
}
