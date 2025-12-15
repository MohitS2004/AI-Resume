'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Lightbulb } from 'lucide-react';

interface SkillsFormProps {
    value: string[];
    onChange: (value: string[]) => void;
}

const suggestedSkills = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'Go', 'Rust',
    'React', 'Vue.js', 'Angular', 'Next.js', 'Node.js',
    'PostgreSQL', 'MongoDB', 'Redis', 'MySQL',
    'AWS', 'GCP', 'Azure', 'Docker', 'Kubernetes',
    'Git', 'CI/CD', 'REST APIs', 'GraphQL',
    'Agile', 'Scrum', 'Leadership', 'Communication',
];

export function SkillsForm({ value, onChange }: SkillsFormProps) {
    const [input, setInput] = useState('');

    const addSkill = (skill: string) => {
        const trimmed = skill.trim();
        if (trimmed && !value.includes(trimmed)) {
            onChange([...value, trimmed]);
        }
        setInput('');
    };

    const removeSkill = (skill: string) => {
        onChange(value.filter((s) => s !== skill));
    };

    const unusedSuggestions = suggestedSkills.filter((s) => !value.includes(s));

    return (
        <div className="space-y-6 pt-2">
            <p className="text-muted-foreground text-sm">
                Add your technical and soft skills. These will be organized and prioritized based on the job description.
            </p>

            <div className="space-y-2">
                <Label>Add Skills</Label>
                <div className="flex gap-2">
                    <Input
                        placeholder="Type a skill and press Enter..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                addSkill(input);
                            }
                        }}
                    />
                    <Button onClick={() => addSkill(input)} variant="outline">
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                    </Button>
                </div>
            </div>

            {value.length > 0 && (
                <div className="space-y-2">
                    <Label>Your Skills ({value.length})</Label>
                    <div className="flex flex-wrap gap-2">
                        {value.map((skill) => (
                            <Badge key={skill} variant="default" className="pr-1 text-sm py-1">
                                {skill}
                                <button
                                    onClick={() => removeSkill(skill)}
                                    className="ml-2 hover:text-destructive-foreground"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {unusedSuggestions.length > 0 && (
                <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-yellow-400" />
                        Quick Add
                    </Label>
                    <div className="flex flex-wrap gap-2">
                        {unusedSuggestions.slice(0, 15).map((skill) => (
                            <button
                                key={skill}
                                onClick={() => addSkill(skill)}
                                className="inline-flex items-center rounded-full border border-border px-3 py-1 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                            >
                                <Plus className="w-3 h-3 mr-1" />
                                {skill}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
