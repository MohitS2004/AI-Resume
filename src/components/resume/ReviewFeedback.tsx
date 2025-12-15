import { ReviewFeedback as ReviewFeedbackType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    CheckCircle,
    AlertTriangle,
    XCircle,
    Target,
    ThumbsUp,
    ThumbsDown,
    Lightbulb
} from 'lucide-react';

interface ReviewFeedbackProps {
    feedback: ReviewFeedbackType | null;
}

export function ReviewFeedback({ feedback }: ReviewFeedbackProps) {
    if (!feedback) {
        return (
            <Card className="glass border-0">
                <CardContent className="p-6 text-center text-muted-foreground">
                    No feedback available
                </CardContent>
            </Card>
        );
    }

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-400';
        if (score >= 60) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getScoreBg = (score: number) => {
        if (score >= 80) return 'bg-green-500/20';
        if (score >= 60) return 'bg-yellow-500/20';
        return 'bg-red-500/20';
    };

    return (
        <div className="space-y-4 sticky top-6">
            {/* Scores */}
            <Card className="glass border-0">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="w-5 h-5 text-primary" />
                        Resume Scores
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className={`rounded-xl p-4 ${getScoreBg(feedback.atsScore)}`}>
                            <p className="text-xs text-muted-foreground uppercase">ATS Score</p>
                            <p className={`text-3xl font-bold ${getScoreColor(feedback.atsScore)}`}>
                                {feedback.atsScore}%
                            </p>
                        </div>
                        <div className={`rounded-xl p-4 ${getScoreBg(feedback.overallScore)}`}>
                            <p className="text-xs text-muted-foreground uppercase">Overall</p>
                            <p className={`text-3xl font-bold ${getScoreColor(feedback.overallScore)}`}>
                                {feedback.overallScore}%
                            </p>
                        </div>
                    </div>

                    {/* Keyword Coverage */}
                    <div className="pt-2 border-t border-border">
                        <p className="text-sm text-muted-foreground mb-2">Keyword Coverage</p>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary rounded-full transition-all"
                                    style={{ width: `${feedback.keywordCoverage.percentage}%` }}
                                />
                            </div>
                            <span className="text-sm font-medium">{feedback.keywordCoverage.percentage}%</span>
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex justify-center pt-2">
                        {feedback.readyForSubmission ? (
                            <Badge variant="success" className="text-sm px-4 py-1">
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Ready for Submission
                            </Badge>
                        ) : (
                            <Badge variant="warning" className="text-sm px-4 py-1">
                                <AlertTriangle className="w-4 h-4 mr-1" />
                                Needs Improvement
                            </Badge>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Critical Issues */}
            {feedback.criticalIssues.length > 0 && (
                <Card className="glass border-0 border-l-4 border-l-red-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2 text-red-400">
                            <XCircle className="w-4 h-4" />
                            Critical Issues
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {feedback.criticalIssues.map((issue, i) => (
                                <li key={i} className="text-sm text-muted-foreground flex gap-2">
                                    <span className="text-red-400">•</span>
                                    {issue}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            )}

            {/* HR Perspective */}
            <Card className="glass border-0">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base">HR Perspective</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {feedback.hrPerspective.strengths.length > 0 && (
                        <div>
                            <p className="text-xs text-green-400 font-medium flex items-center gap-1 mb-1">
                                <ThumbsUp className="w-3 h-3" />
                                Strengths
                            </p>
                            <ul className="text-sm text-muted-foreground">
                                {feedback.hrPerspective.strengths.slice(0, 3).map((s, i) => (
                                    <li key={i} className="flex gap-2">
                                        <span className="text-green-400">+</span>
                                        {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {feedback.hrPerspective.weaknesses.length > 0 && (
                        <div>
                            <p className="text-xs text-yellow-400 font-medium flex items-center gap-1 mb-1">
                                <ThumbsDown className="w-3 h-3" />
                                Areas to Improve
                            </p>
                            <ul className="text-sm text-muted-foreground">
                                {feedback.hrPerspective.weaknesses.slice(0, 3).map((w, i) => (
                                    <li key={i} className="flex gap-2">
                                        <span className="text-yellow-400">-</span>
                                        {w}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Manager Perspective */}
            <Card className="glass border-0">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base">Manager Perspective</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {feedback.managerPerspective.missingSkills.length > 0 && (
                        <div>
                            <p className="text-xs text-yellow-400 font-medium mb-1">Missing Skills</p>
                            <div className="flex flex-wrap gap-1">
                                {feedback.managerPerspective.missingSkills.map((skill, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                    {feedback.managerPerspective.suggestions.length > 0 && (
                        <div>
                            <p className="text-xs text-primary font-medium flex items-center gap-1 mb-1">
                                <Lightbulb className="w-3 h-3" />
                                Suggestions
                            </p>
                            <ul className="text-sm text-muted-foreground">
                                {feedback.managerPerspective.suggestions.slice(0, 3).map((s, i) => (
                                    <li key={i} className="flex gap-2">
                                        <span className="text-primary">→</span>
                                        {s}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Keywords */}
            <Card className="glass border-0">
                <CardHeader className="pb-2">
                    <CardTitle className="text-base">Keywords</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {feedback.keywordCoverage.found.length > 0 && (
                        <div>
                            <p className="text-xs text-green-400 font-medium mb-1">Found ({feedback.keywordCoverage.found.length})</p>
                            <div className="flex flex-wrap gap-1">
                                {feedback.keywordCoverage.found.slice(0, 10).map((kw, i) => (
                                    <Badge key={i} variant="success" className="text-xs">
                                        {kw}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                    {feedback.keywordCoverage.missing.length > 0 && (
                        <div>
                            <p className="text-xs text-red-400 font-medium mb-1">Missing ({feedback.keywordCoverage.missing.length})</p>
                            <div className="flex flex-wrap gap-1">
                                {feedback.keywordCoverage.missing.slice(0, 10).map((kw, i) => (
                                    <Badge key={i} variant="destructive" className="text-xs">
                                        {kw}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
