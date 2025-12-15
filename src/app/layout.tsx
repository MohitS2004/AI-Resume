import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'AI Resume Builder',
    description: 'Generate ATS-optimized resumes tailored to any job description',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className={inter.className}>
                <div className="min-h-screen bg-background">
                    <Sidebar />
                    <main className="lg:ml-64 min-h-screen">
                        <div className="p-6 lg:p-8">
                            {children}
                        </div>
                    </main>
                </div>
            </body>
        </html>
    );
}
