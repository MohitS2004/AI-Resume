'use client';

import { Project } from '@/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, FolderGit2, X } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';

interface ProjectsFormProps {
    value: Project[];
    onChange: (value: Project[]) => void;
}

const emptyProject: Omit<Project, 'id'> = {
    name: '',
    description: '',
    technologies: [],
    link: '',
    documentation: '',
    highlights: [],
};

export function ProjectsForm({ value, onChange }: ProjectsFormProps) {
    const [techInputs, setTechInputs] = useState<Record<string, string>>({});

    const addProject = () => {
        onChange([...value, { ...emptyProject, id: uuidv4() }]);
    };

    const removeProject = (id: string) => {
        onChange(value.filter((proj) => proj.id !== id));
    };

    const updateProject = (id: string, field: keyof Project, val: string | string[]) => {
        onChange(
            value.map((proj) =>
                proj.id === id ? { ...proj, [field]: val } : proj
            )
        );
    };

    const addTechnology = (projectId: string) => {
        const tech = techInputs[projectId]?.trim();
        if (tech) {
            const project = value.find((p) => p.id === projectId);
            if (project && !project.technologies.includes(tech)) {
                updateProject(projectId, 'technologies', [...project.technologies, tech]);
            }
            setTechInputs({ ...techInputs, [projectId]: '' });
        }
    };

    const removeTechnology = (projectId: string, tech: string) => {
        const project = value.find((p) => p.id === projectId);
        if (project) {
            updateProject(projectId, 'technologies', project.technologies.filter((t) => t !== tech));
        }
    };

    return (
        <div className="space-y-6 pt-2">
            <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-sm">
                    Add your notable projects. Include technical details for better matching.
                </p>
                <Button onClick={addProject} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                </Button>
            </div>

            {value.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-border rounded-xl">
                    <FolderGit2 className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No projects added yet</p>
                    <Button onClick={addProject} variant="ghost" className="mt-4">
                        <Plus className="w-4 h-4 mr-2" />
                        Add your first project
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {value.map((proj, index) => (
                        <Card key={proj.id} className="bg-secondary/30">
                            <CardContent className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-medium">Project {index + 1}</h3>
                                    <Button
                                        onClick={() => removeProject(proj.id)}
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Project Name</Label>
                                        <Input
                                            placeholder="AI Resume Builder"
                                            value={proj.name}
                                            onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Link (optional)</Label>
                                        <Input
                                            placeholder="https://github.com/..."
                                            value={proj.link || ''}
                                            onChange={(e) => updateProject(proj.id, 'link', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Short Description</Label>
                                    <Input
                                        placeholder="A brief description of what the project does"
                                        value={proj.description}
                                        onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Technologies</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Add technology..."
                                            value={techInputs[proj.id] || ''}
                                            onChange={(e) => setTechInputs({ ...techInputs, [proj.id]: e.target.value })}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addTechnology(proj.id);
                                                }
                                            }}
                                        />
                                        <Button onClick={() => addTechnology(proj.id)} variant="outline">
                                            Add
                                        </Button>
                                    </div>
                                    {proj.technologies.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {proj.technologies.map((tech) => (
                                                <Badge key={tech} variant="secondary" className="pr-1">
                                                    {tech}
                                                    <button
                                                        onClick={() => removeTechnology(proj.id, tech)}
                                                        className="ml-1 hover:text-destructive"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>
                                        Documentation / Details{' '}
                                        <span className="text-muted-foreground font-normal">
                                            (Technical challenges, architecture, impact)
                                        </span>
                                    </Label>
                                    <Textarea
                                        placeholder="Describe the technical challenges solved, architecture decisions, scale, impact, metrics, etc. The AI will use this to generate relevant achievements."
                                        value={proj.documentation}
                                        onChange={(e) => updateProject(proj.id, 'documentation', e.target.value)}
                                        className="min-h-[150px]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Key Highlights (optional)</Label>
                                    <Textarea
                                        placeholder="Specific achievements or features to highlight (one per line)"
                                        value={proj.highlights.join('\n')}
                                        onChange={(e) => updateProject(proj.id, 'highlights', e.target.value.split('\n').filter(Boolean))}
                                        className="min-h-[80px]"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
