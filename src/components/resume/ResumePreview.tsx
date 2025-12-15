import { ResumeSections, BasicInfo } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Mail,
    Phone,
    MapPin,
    Linkedin,
    Github,
    ExternalLink
} from 'lucide-react';

interface ResumePreviewProps {
    sections: ResumeSections | null;
    basicInfo?: BasicInfo | null;
}

export function ResumePreview({ sections, basicInfo }: ResumePreviewProps) {
    if (!sections) {
        return (
            <Card className="glass border-0">
                <CardContent className="p-8 text-center text-muted-foreground">
                    No resume content available
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-white text-gray-900 shadow-2xl">
            <CardContent className="p-8 space-y-6">
                {/* Header */}
                {basicInfo && (
                    <div className="border-b border-gray-200 pb-6">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {basicInfo.fullName || 'Your Name'}
                        </h1>
                        <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                            {basicInfo.email && (
                                <a href={`mailto:${basicInfo.email}`} className="flex items-center gap-1 hover:text-blue-600">
                                    <Mail className="w-4 h-4" />
                                    {basicInfo.email}
                                </a>
                            )}
                            {basicInfo.phone && (
                                <span className="flex items-center gap-1">
                                    <Phone className="w-4 h-4" />
                                    {basicInfo.phone}
                                </span>
                            )}
                            {basicInfo.location && (
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {basicInfo.location}
                                </span>
                            )}
                            {basicInfo.linkedin && (
                                <a href={basicInfo.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-600">
                                    <Linkedin className="w-4 h-4" />
                                    LinkedIn
                                </a>
                            )}
                            {basicInfo.github && (
                                <a href={basicInfo.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-600">
                                    <Github className="w-4 h-4" />
                                    GitHub
                                </a>
                            )}
                        </div>
                    </div>
                )}

                {/* Summary */}
                {sections.summary?.content && (
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 uppercase tracking-wide mb-2">
                            Professional Summary
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            {sections.summary.content}
                        </p>
                    </div>
                )}

                {/* Experience */}
                {sections.experiences?.length > 0 && (
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 uppercase tracking-wide mb-4">
                            Experience
                        </h2>
                        <div className="space-y-5">
                            {sections.experiences.map((exp) => (
                                <div key={exp.id}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                                            <p className="text-gray-600">{exp.company} • {exp.location}</p>
                                        </div>
                                        <span className="text-sm text-gray-500 whitespace-nowrap">
                                            {exp.startDate} - {exp.endDate}
                                        </span>
                                    </div>
                                    <ul className="mt-2 space-y-1">
                                        {exp.bullets.map((bullet, i) => (
                                            <li key={i} className="text-gray-700 text-sm flex">
                                                <span className="mr-2">•</span>
                                                <span>{bullet}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Projects */}
                {sections.projects?.length > 0 && (
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 uppercase tracking-wide mb-4">
                            Projects
                        </h2>
                        <div className="space-y-4">
                            {sections.projects.map((proj) => (
                                <div key={proj.id}>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-gray-900">{proj.name}</h3>
                                        {proj.link && (
                                            <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}
                                    </div>
                                    <p className="text-gray-600 text-sm">{proj.description}</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {proj.technologies.map((tech) => (
                                            <span key={tech} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                    <ul className="mt-2 space-y-1">
                                        {proj.bullets.map((bullet, i) => (
                                            <li key={i} className="text-gray-700 text-sm flex">
                                                <span className="mr-2">•</span>
                                                <span>{bullet}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Education */}
                {sections.education?.length > 0 && (
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 uppercase tracking-wide mb-4">
                            Education
                        </h2>
                        <div className="space-y-3">
                            {sections.education.map((edu) => (
                                <div key={edu.id}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{edu.school}</h3>
                                            <p className="text-gray-600">{edu.degree} in {edu.field}</p>
                                        </div>
                                        <span className="text-sm text-gray-500 whitespace-nowrap">
                                            {edu.startDate} - {edu.endDate}
                                        </span>
                                    </div>
                                    {edu.gpa && (
                                        <p className="text-sm text-gray-600 mt-1">GPA: {edu.gpa}</p>
                                    )}
                                    {edu.highlights.length > 0 && (
                                        <p className="text-sm text-gray-600 mt-1">
                                            {edu.highlights.join(' • ')}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Skills */}
                {sections.skills?.categories?.length > 0 && (
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 uppercase tracking-wide mb-3">
                            Skills
                        </h2>
                        <div className="space-y-2">
                            {sections.skills.categories.map((category) => (
                                <div key={category.name} className="flex">
                                    <span className="font-medium text-gray-900 w-40 flex-shrink-0">
                                        {category.name}:
                                    </span>
                                    <span className="text-gray-700">
                                        {category.skills.join(', ')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
