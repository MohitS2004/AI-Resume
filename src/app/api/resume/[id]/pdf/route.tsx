import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    renderToBuffer,
    Link
} from '@react-pdf/renderer';
import { ResumeSections, BasicInfo } from '@/types';

// PDF Styles
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 10,
        fontFamily: 'Helvetica',
        lineHeight: 1.4,
    },
    header: {
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        paddingBottom: 10,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    contactRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        fontSize: 9,
        color: '#4b5563',
    },
    section: {
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 8,
        borderBottomWidth: 0.5,
        borderBottomColor: '#d1d5db',
        paddingBottom: 3,
    },
    summary: {
        fontSize: 10,
        color: '#374151',
        lineHeight: 1.5,
    },
    experienceItem: {
        marginBottom: 10,
    },
    experienceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 3,
    },
    jobTitle: {
        fontWeight: 'bold',
        fontSize: 11,
    },
    company: {
        color: '#4b5563',
        fontSize: 10,
    },
    date: {
        fontSize: 9,
        color: '#6b7280',
    },
    bullet: {
        flexDirection: 'row',
        marginBottom: 2,
        paddingLeft: 5,
    },
    bulletPoint: {
        width: 10,
        fontSize: 10,
    },
    bulletText: {
        flex: 1,
        fontSize: 10,
        color: '#374151',
    },
    projectItem: {
        marginBottom: 8,
    },
    projectName: {
        fontWeight: 'bold',
        fontSize: 11,
    },
    projectLink: {
        fontWeight: 'bold',
        fontSize: 11,
        color: '#2563eb',
        textDecoration: 'none',
    },
    projectDesc: {
        fontSize: 9,
        color: '#4b5563',
        marginBottom: 2,
    },
    techStack: {
        fontSize: 8,
        color: '#6b7280',
        marginBottom: 3,
    },
    educationItem: {
        marginBottom: 6,
    },
    school: {
        fontWeight: 'bold',
        fontSize: 11,
    },
    degree: {
        color: '#4b5563',
        fontSize: 10,
    },
    gpa: {
        fontSize: 9,
        color: '#6b7280',
    },
    coursework: {
        fontSize: 9,
        color: '#4b5563',
        marginTop: 2,
        lineHeight: 1.3,
    },
    skillCategory: {
        flexDirection: 'row',
        marginBottom: 3,
    },
    skillCategoryName: {
        fontWeight: 'bold',
        width: 100,
        fontSize: 10,
    },
    skillList: {
        flex: 1,
        fontSize: 10,
        color: '#374151',
    },
});

// PDF Document Component
function ResumePDF({ sections, basicInfo }: { sections: ResumeSections; basicInfo?: BasicInfo }) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                {basicInfo && (
                    <View style={styles.header}>
                        <Text style={styles.name}>{basicInfo.fullName || 'Your Name'}</Text>
                        <View style={styles.contactRow}>
                            {basicInfo.email && <Text>{basicInfo.email}</Text>}
                            {basicInfo.phone && <Text>{basicInfo.phone}</Text>}
                            {basicInfo.location && <Text>{basicInfo.location}</Text>}
                            {basicInfo.linkedin && <Text>{basicInfo.linkedin}</Text>}
                            {basicInfo.github && <Text>{basicInfo.github}</Text>}
                            {basicInfo.portfolio && <Text>{basicInfo.portfolio}</Text>}
                        </View>
                    </View>
                )}

                {/* Summary */}
                {sections.summary?.content && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Professional Summary</Text>
                        <Text style={styles.summary}>{sections.summary.content}</Text>
                    </View>
                )}

                {/* Experience */}
                {sections.experiences?.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Experience</Text>
                        {sections.experiences.map((exp) => (
                            <View key={exp.id} style={styles.experienceItem}>
                                <View style={styles.experienceHeader}>
                                    <View>
                                        <Text style={styles.jobTitle}>{exp.title}</Text>
                                        <Text style={styles.company}>{exp.company} • {exp.location}</Text>
                                    </View>
                                    <Text style={styles.date}>{exp.startDate} - {exp.endDate}</Text>
                                </View>
                                {exp.bullets.map((bullet, i) => (
                                    <View key={i} style={styles.bullet}>
                                        <Text style={styles.bulletPoint}>•</Text>
                                        <Text style={styles.bulletText}>{bullet}</Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                )}

                {/* Projects */}
                {sections.projects?.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Projects</Text>
                        {sections.projects.map((proj) => (
                            <View key={proj.id} style={styles.projectItem}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                    <Text style={styles.projectName}>{proj.name}</Text>
                                    {proj.link && (
                                        <Link src={proj.link.startsWith('http') ? proj.link : `https://${proj.link}`} style={styles.projectLink}>
                                            (Live Link)
                                        </Link>
                                    )}
                                    <Text style={styles.techStack}>{proj.technologies.join(', ')}</Text>
                                </View>
                                {proj.bullets.map((bullet, i) => (
                                    <View key={i} style={styles.bullet}>
                                        <Text style={styles.bulletPoint}>•</Text>
                                        <Text style={styles.bulletText}>{bullet}</Text>
                                    </View>
                                ))}
                            </View>
                        ))}
                    </View>
                )}

                {/* Education */}
                {sections.education?.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Education</Text>
                        {sections.education.map((edu) => (
                            <View key={edu.id} style={styles.educationItem}>
                                <View style={styles.experienceHeader}>
                                    <View>
                                        <Text style={styles.school}>{edu.school}</Text>
                                        <Text style={styles.degree}>{edu.degree} in {edu.field}</Text>
                                        {edu.gpa && <Text style={styles.gpa}>GPA: {edu.gpa}</Text>}
                                    </View>
                                    <Text style={styles.date}>{edu.startDate} - {edu.endDate}</Text>
                                </View>
                                {edu.coursework && (
                                    <Text style={styles.coursework}>Relevant Coursework: {edu.coursework}</Text>
                                )}
                            </View>
                        ))}
                    </View>
                )}

                {/* Skills */}
                {sections.skills?.categories?.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Skills</Text>
                        {sections.skills.categories.map((cat) => (
                            <View key={cat.name} style={styles.skillCategory}>
                                <Text style={styles.skillCategoryName}>{cat.name}:</Text>
                                <Text style={styles.skillList}>{cat.skills.join(', ')}</Text>
                            </View>
                        ))}
                    </View>
                )}
            </Page>
        </Document>
    );
}

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const supabase = createServerSupabaseClient();

        // Get resume job
        const { data: job, error: jobError } = await supabase
            .from('resume_jobs')
            .select('*')
            .eq('id', id)
            .single();

        if (jobError || !job) {
            return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
        }

        // Get profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', job.user_id)
            .single();

        const sections = job.final_resume || job.sections;
        const basicInfo = profile?.basic_info;

        if (!sections) {
            return NextResponse.json({ error: 'No resume content' }, { status: 400 });
        }

        // Generate PDF buffer
        const pdfBuffer = await renderToBuffer(
            <ResumePDF sections={sections} basicInfo={basicInfo} />
        );

        // Return PDF - Convert Buffer to Uint8Array for NextResponse
        return new NextResponse(new Uint8Array(pdfBuffer), {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="resume-${id}.pdf"`,
            },
        });
    } catch (error) {
        console.error('PDF generation failed:', error);
        return NextResponse.json(
            { error: 'Failed to generate PDF' },
            { status: 500 }
        );
    }
}
