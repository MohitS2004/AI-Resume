'use client';

import { Experience } from '@/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Briefcase } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface ExperienceFormProps {
    value: Experience[];
    onChange: (value: Experience[]) => void;
}

const emptyExperience: Omit<Experience, 'id'> = {
    company: '',
    title: '',
    location: '',
    startDate: '',
    endDate: '',
    current: false,
    documentation: '',
    bullets: [],
};

export function ExperienceForm({ value, onChange }: ExperienceFormProps) {
    const addExperience = () => {
        onChange([...value, { ...emptyExperience, id: uuidv4() }]);
    };

    const removeExperience = (id: string) => {
        onChange(value.filter((exp) => exp.id !== id));
    };

    const updateExperience = (id: string, field: keyof Experience, val: string | string[] | boolean) => {
        onChange(
            value.map((exp) =>
                exp.id === id ? { ...exp, [field]: val } : exp
            )
        );
    };

    return (
        <div className="space-y-6 pt-2">
            <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-sm">
                    Add your work experience. Include detailed documentation for better AI results.
                </p>
                <Button onClick={addExperience} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Experience
                </Button>
            </div>

            {value.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-border rounded-xl">
                    <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No experience added yet</p>
                    <Button onClick={addExperience} variant="ghost" className="mt-4">
                        <Plus className="w-4 h-4 mr-2" />
                        Add your first experience
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {value.map((exp, index) => (
                        <Card key={exp.id} className="bg-secondary/30">
                            <CardContent className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-medium">Experience {index + 1}</h3>
                                    <Button
                                        onClick={() => removeExperience(exp.id)}
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Company</Label>
                                        <Input
                                            placeholder="Google"
                                            value={exp.company}
                                            onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Job Title</Label>
                                        <Input
                                            placeholder="Software Engineer"
                                            value={exp.title}
                                            onChange={(e) => updateExperience(exp.id, 'title', e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Location</Label>
                                        <Input
                                            placeholder="San Francisco, CA"
                                            value={exp.location}
                                            onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                                        />
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="space-y-2 flex-1">
                                            <Label>Start Date</Label>
                                            <Input
                                                placeholder="Jan 2022"
                                                value={exp.startDate}
                                                onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2 flex-1">
                                            <Label>End Date</Label>
                                            <Input
                                                placeholder="Present"
                                                value={exp.current ? 'Present' : exp.endDate}
                                                onChange={(e) => {
                                                    if (e.target.value.toLowerCase() === 'present') {
                                                        updateExperience(exp.id, 'current', true);
                                                        updateExperience(exp.id, 'endDate', '');
                                                    } else {
                                                        updateExperience(exp.id, 'current', false);
                                                        updateExperience(exp.id, 'endDate', e.target.value);
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>
                                        Documentation / Details{' '}
                                        <span className="text-muted-foreground font-normal">
                                            (The more detail, the better the AI output)
                                        </span>
                                    </Label>
                                    <Textarea
                                        placeholder="Describe your responsibilities, projects, achievements, technologies used, team size, impact, metrics, etc. The AI will use this to generate tailored bullet points."
                                        value={exp.documentation}
                                        onChange={(e) => updateExperience(exp.id, 'documentation', e.target.value)}
                                        className="min-h-[150px]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Manual Bullet Points (optional)</Label>
                                    <Textarea
                                        placeholder="Add any specific bullet points you want to include (one per line)"
                                        value={exp.bullets.join('\n')}
                                        onChange={(e) => updateExperience(exp.id, 'bullets', e.target.value.split('\n').filter(Boolean))}
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
