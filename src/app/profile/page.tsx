'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BasicInfoForm } from '@/components/profile/BasicInfoForm';
import { EducationForm } from '@/components/profile/EducationForm';
import { ExperienceForm } from '@/components/profile/ExperienceForm';
import { ProjectsForm } from '@/components/profile/ProjectsForm';
import { SkillsForm } from '@/components/profile/SkillsForm';
import { Profile, BasicInfo, Education, Experience, Project } from '@/types';
import { Save, Loader2, CheckCircle } from 'lucide-react';

const defaultBasicInfo: BasicInfo = {
    fullName: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    location: '',
};

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState('basic');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const [basicInfo, setBasicInfo] = useState<BasicInfo>(defaultBasicInfo);
    const [education, setEducation] = useState<Education[]>([]);
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [skills, setSkills] = useState<string[]>([]);

    useEffect(() => {
        fetchProfile();
    }, []);

    async function fetchProfile() {
        try {
            const res = await fetch('/api/profile');
            const { data } = await res.json();

            if (data) {
                setBasicInfo(data.basicInfo || defaultBasicInfo);
                setEducation(data.education || []);
                setExperiences(data.experiences || []);
                setProjects(data.projects || []);
                setSkills(data.skills || []);
            }
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        } finally {
            setLoading(false);
        }
    }

    async function saveProfile() {
        setSaving(true);
        try {
            const res = await fetch('/api/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    basicInfo,
                    education,
                    experiences,
                    projects,
                    skills,
                }),
            });

            if (res.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (error) {
            console.error('Failed to save profile:', error);
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold">Your Profile</h1>
                    <p className="text-muted-foreground mt-1">
                        Add your experience, projects, and skills
                    </p>
                </div>
                <Button onClick={saveProfile} disabled={saving} className="w-full sm:w-auto">
                    {saving ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : saved ? (
                        <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Saved!
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Profile
                        </>
                    )}
                </Button>
            </div>

            {/* Tabs */}
            <div className="glass rounded-2xl p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="flex-wrap">
                        <TabsTrigger value="basic">Basic Info</TabsTrigger>
                        <TabsTrigger value="education">Education</TabsTrigger>
                        <TabsTrigger value="experience">Experience</TabsTrigger>
                        <TabsTrigger value="projects">Projects</TabsTrigger>
                        <TabsTrigger value="skills">Skills</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basic">
                        <BasicInfoForm value={basicInfo} onChange={setBasicInfo} />
                    </TabsContent>

                    <TabsContent value="education">
                        <EducationForm value={education} onChange={setEducation} />
                    </TabsContent>

                    <TabsContent value="experience">
                        <ExperienceForm value={experiences} onChange={setExperiences} />
                    </TabsContent>

                    <TabsContent value="projects">
                        <ProjectsForm value={projects} onChange={setProjects} />
                    </TabsContent>

                    <TabsContent value="skills">
                        <SkillsForm value={skills} onChange={setSkills} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
