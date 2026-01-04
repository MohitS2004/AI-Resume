'use client';

import { Education } from '@/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, GraduationCap } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface EducationFormProps {
    value: Education[];
    onChange: (value: Education[]) => void;
}

const emptyEducation: Omit<Education, 'id'> = {
    school: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    gpa: '',
    coursework: '',
    highlights: [],
};

export function EducationForm({ value, onChange }: EducationFormProps) {
    const addEducation = () => {
        onChange([...value, { ...emptyEducation, id: uuidv4() }]);
    };

    const removeEducation = (id: string) => {
        onChange(value.filter((edu) => edu.id !== id));
    };

    const updateEducation = (id: string, field: keyof Education, val: string | string[]) => {
        onChange(
            value.map((edu) =>
                edu.id === id ? { ...edu, [field]: val } : edu
            )
        );
    };

    return (
        <div className="space-y-6 pt-2">
            <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-sm">
                    Add your educational background.
                </p>
                <Button onClick={addEducation} variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Education
                </Button>
            </div>

            {value.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-border rounded-xl">
                    <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No education added yet</p>
                    <Button onClick={addEducation} variant="ghost" className="mt-4">
                        <Plus className="w-4 h-4 mr-2" />
                        Add your first education
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {value.map((edu, index) => (
                        <Card key={edu.id} className="bg-secondary/30">
                            <CardContent className="p-6 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-medium">Education {index + 1}</h3>
                                    <Button
                                        onClick={() => removeEducation(edu.id)}
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>School/University</Label>
                                        <Input
                                            placeholder="Stanford University"
                                            value={edu.school}
                                            onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Degree</Label>
                                        <Input
                                            placeholder="Bachelor of Science"
                                            value={edu.degree}
                                            onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Field of Study</Label>
                                        <Input
                                            placeholder="Computer Science"
                                            value={edu.field}
                                            onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>GPA (optional)</Label>
                                        <Input
                                            placeholder="3.8/4.0"
                                            value={edu.gpa || ''}
                                            onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Start Date</Label>
                                        <Input
                                            placeholder="Sep 2018"
                                            value={edu.startDate}
                                            onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>End Date</Label>
                                        <Input
                                            placeholder="May 2022"
                                            value={edu.endDate}
                                            onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Relevant Coursework (optional)</Label>
                                    <Textarea
                                        placeholder="Data Structures, Algorithms, Machine Learning, Database Systems, Cloud Computing"
                                        value={edu.coursework || ''}
                                        onChange={(e) => updateEducation(edu.id, 'coursework', e.target.value)}
                                        className="min-h-[60px]"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Comma-separated list. Use to incorporate keywords not covered in experience/projects. Max 2 lines in PDF.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label>Highlights (coursework, honors, activities)</Label>
                                    <Textarea
                                        placeholder="Relevant coursework, Dean's List, clubs, etc. (one per line)"
                                        value={edu.highlights.join('\n')}
                                        onChange={(e) => updateEducation(edu.id, 'highlights', e.target.value.split('\n').filter(Boolean))}
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
