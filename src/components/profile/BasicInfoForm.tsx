'use client';

import { BasicInfo } from '@/types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, Linkedin, Github, MapPin } from 'lucide-react';

interface BasicInfoFormProps {
    value: BasicInfo;
    onChange: (value: BasicInfo) => void;
}

export function BasicInfoForm({ value, onChange }: BasicInfoFormProps) {
    const updateField = (field: keyof BasicInfo, val: string) => {
        onChange({ ...value, [field]: val });
    };

    return (
        <div className="space-y-6 pt-2">
            <p className="text-muted-foreground text-sm">
                This information will appear at the top of your resume.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="fullName" className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        Full Name
                    </Label>
                    <Input
                        id="fullName"
                        placeholder="John Doe"
                        value={value.fullName}
                        onChange={(e) => updateField('fullName', e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        Email
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={value.email}
                        onChange={(e) => updateField('email', e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        Phone
                    </Label>
                    <Input
                        id="phone"
                        placeholder="+1 (555) 123-4567"
                        value={value.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="location" className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        Location
                    </Label>
                    <Input
                        id="location"
                        placeholder="San Francisco, CA"
                        value={value.location}
                        onChange={(e) => updateField('location', e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="linkedin" className="flex items-center gap-2">
                        <Linkedin className="w-4 h-4 text-muted-foreground" />
                        LinkedIn URL
                    </Label>
                    <Input
                        id="linkedin"
                        placeholder="linkedin.com/in/johndoe"
                        value={value.linkedin}
                        onChange={(e) => updateField('linkedin', e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="github" className="flex items-center gap-2">
                        <Github className="w-4 h-4 text-muted-foreground" />
                        GitHub URL
                    </Label>
                    <Input
                        id="github"
                        placeholder="github.com/johndoe"
                        value={value.github}
                        onChange={(e) => updateField('github', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}
