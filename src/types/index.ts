// Profile Types
export interface BasicInfo {
    fullName: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    location: string;
}

export interface Education {
    id: string;
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string;
    highlights: string[];
}

export interface Experience {
    id: string;
    company: string;
    title: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    documentation: string; // Raw details for AI to work with
    bullets: string[]; // Manual bullets if any
}

export interface Project {
    id: string;
    name: string;
    description: string;
    technologies: string[];
    link?: string;
    documentation: string; // Detailed documentation for AI
    highlights: string[];
}

export interface Profile {
    id: string;
    userId: string;
    basicInfo: BasicInfo;
    education: Education[];
    experiences: Experience[];
    projects: Project[];
    skills: string[];
    createdAt: string;
    updatedAt: string;
}

// Job Description Analysis
export interface JDAnalysis {
    jobTitle: string;
    company: string;
    requiredSkills: string[];
    preferredSkills: string[];
    keywords: string[];
    experienceLevel: 'entry' | 'mid' | 'senior' | 'lead';
    keyResponsibilities: string[];
    educationRequirements: string[];
}

// Resume Sections
export interface GeneratedSummary {
    content: string;
}

export interface GeneratedExperience {
    id: string;
    company: string;
    title: string;
    location: string;
    startDate: string;
    endDate: string;
    bullets: string[];
}

export interface GeneratedProject {
    id: string;
    name: string;
    description: string;
    technologies: string[];
    link?: string;
    bullets: string[];
}

export interface GeneratedEducation {
    id: string;
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string;
    highlights: string[];
}

export interface GeneratedSkills {
    categories: {
        name: string;
        skills: string[];
    }[];
}

export interface ResumeSections {
    summary: GeneratedSummary;
    experiences: GeneratedExperience[];
    projects: GeneratedProject[];
    education: GeneratedEducation[];
    skills: GeneratedSkills;
}

// Review Feedback
export interface ReviewFeedback {
    atsScore: number;
    overallScore: number;
    hrPerspective: {
        strengths: string[];
        weaknesses: string[];
        suggestions: string[];
    };
    managerPerspective: {
        technicalAccuracy: string[];
        missingSkills: string[];
        suggestions: string[];
    };
    criticalIssues: string[];
    keywordCoverage: {
        found: string[];
        missing: string[];
        percentage: number;
    };
    readyForSubmission: boolean;
}

// Resume Job (Generation tracking)
export type JobStatus =
    | 'pending'
    | 'analyzing_jd'
    | 'generating'
    | 'reviewing'
    | 'revising'
    | 'complete'
    | 'failed';

export interface ResumeJob {
    id: string;
    userId: string;
    jobDescription: string;
    jdAnalysis: JDAnalysis | null;
    status: JobStatus;
    currentStep: string;
    progress: number;
    sections: ResumeSections | null;
    reviewFeedback: ReviewFeedback | null;
    finalResume: ResumeSections | null;
    errorMessage: string | null;
    createdAt: string;
    updatedAt: string;
}

// API Response Types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}
