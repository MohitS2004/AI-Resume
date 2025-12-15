import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase';
import {
    Sparkles,
    User,
    FileText,
    ArrowRight,
    TrendingUp,
    Clock,
    CheckCircle
} from 'lucide-react';

async function getStats() {
    try {
        const supabase = createServerSupabaseClient();

        const [profileRes, jobsRes] = await Promise.all([
            supabase.from('profiles').select('*').eq('user_id', 'default_user').single(),
            supabase.from('resume_jobs').select('*').eq('user_id', 'default_user').order('created_at', { ascending: false }).limit(5),
        ]);

        const profile = profileRes.data;
        const jobs = jobsRes.data || [];

        const hasProfile = profile && profile.basic_info?.fullName;
        const completedJobs = jobs.filter((j: { status: string }) => j.status === 'complete').length;
        const recentJobs = jobs.slice(0, 3);

        return {
            hasProfile,
            profile,
            completedJobs,
            totalJobs: jobs.length,
            recentJobs,
        };
    } catch (error) {
        console.error('Failed to fetch stats:', error);
        return {
            hasProfile: false,
            profile: null,
            completedJobs: 0,
            totalJobs: 0,
            recentJobs: [],
        };
    }
}

export default async function DashboardPage() {
    const stats = await getStats();

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl lg:text-4xl font-bold">
                    Welcome to <span className="gradient-text">AI Resume Builder</span>
                </h1>
                <p className="text-muted-foreground text-lg">
                    Create ATS-optimized resumes tailored to any job description
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass rounded-2xl p-6 space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-400" />
                        </div>
                        <span className="text-muted-foreground">Profile Status</span>
                    </div>
                    <p className="text-2xl font-semibold">
                        {stats.hasProfile ? (
                            <span className="text-green-400">Complete</span>
                        ) : (
                            <span className="text-yellow-400">Incomplete</span>
                        )}
                    </p>
                </div>

                <div className="glass rounded-2xl p-6 space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-purple-400" />
                        </div>
                        <span className="text-muted-foreground">Resumes Generated</span>
                    </div>
                    <p className="text-2xl font-semibold">{stats.completedJobs}</p>
                </div>

                <div className="glass rounded-2xl p-6 space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-emerald-400" />
                        </div>
                        <span className="text-muted-foreground">Total Jobs</span>
                    </div>
                    <p className="text-2xl font-semibold">{stats.totalJobs}</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Get Started Card */}
                <Link href={stats.hasProfile ? '/generate' : '/profile'}>
                    <div className="glass rounded-2xl p-8 hover:border-primary/30 transition-all duration-300 group cursor-pointer h-full">
                        <div className="flex items-start justify-between">
                            <div className="space-y-4">
                                <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center">
                                    <Sparkles className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold mb-2">
                                        {stats.hasProfile ? 'Generate Resume' : 'Complete Your Profile'}
                                    </h2>
                                    <p className="text-muted-foreground">
                                        {stats.hasProfile
                                            ? 'Paste a job description and get a tailored resume in minutes'
                                            : 'Add your experience, projects, and skills to get started'
                                        }
                                    </p>
                                </div>
                            </div>
                            <ArrowRight className="w-6 h-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </div>
                    </div>
                </Link>

                {/* Recent Resumes */}
                <div className="glass rounded-2xl p-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Resumes</h3>
                    {stats.recentJobs.length > 0 ? (
                        <div className="space-y-3">
                            {stats.recentJobs.map((job: { id: string; status: string; created_at: string; jd_analysis?: { jobTitle?: string; company?: string } }) => (
                                <Link
                                    key={job.id}
                                    href={job.status === 'complete' ? `/resume/${job.id}` : `/generate?jobId=${job.id}`}
                                >
                                    <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-colors">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${job.status === 'complete'
                                            ? 'bg-green-500/20'
                                            : job.status === 'failed'
                                                ? 'bg-red-500/20'
                                                : 'bg-yellow-500/20'
                                            }`}>
                                            {job.status === 'complete' ? (
                                                <CheckCircle className="w-5 h-5 text-green-400" />
                                            ) : (
                                                <Clock className="w-5 h-5 text-yellow-400" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">
                                                {job.jd_analysis?.jobTitle || 'Resume'}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {job.jd_analysis?.company || new Date(job.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-center py-8">
                            No resumes generated yet. Start by completing your profile!
                        </p>
                    )}
                </div>
            </div>

            {/* How it works */}
            <div className="glass rounded-2xl p-8">
                <h2 className="text-xl font-semibold mb-6">How it works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            step: '1',
                            title: 'Add Your Profile',
                            description: 'Enter your experience, projects, education, and skills',
                        },
                        {
                            step: '2',
                            title: 'Paste Job Description',
                            description: 'Copy and paste any job listing you want to apply for',
                        },
                        {
                            step: '3',
                            title: 'Get Tailored Resume',
                            description: 'AI generates an ATS-optimized resume with review feedback',
                        },
                    ].map((item) => (
                        <div key={item.step} className="flex gap-4">
                            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold">{item.step}</span>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-1">{item.title}</h3>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
