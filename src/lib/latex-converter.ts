import { ResumeSections, Profile, GeneratedExperience, GeneratedProject, GeneratedEducation } from '@/types';

function escapeLatex(text: string): string {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/([&%$#_{}])/g, '\\$1')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}')
    .replace(/"/g, "''");
}

function formatDate(dateString: string): string {
  if (!dateString) return '';
  return escapeLatex(dateString);
}

export function generateLatex(sections: ResumeSections, profile?: Profile | null): string {
  const { basicInfo } = profile || {};
  const { summary, experiences, projects, education, skills } = sections;

  let latex = `\\documentclass[11pt,letterpaper]{article}

% =======================
% resume.cls content (adapted into one .tex file)
% =======================
\\usepackage[parfill]{parskip}
\\usepackage{array}
\\usepackage{ifthen}
% \\usepackage{tikz} 
\\pagestyle{empty}

% Simplified bullet command without TikZ
\\newcommand{\\circlebullet}{\\cdot}

% --- Headings commands ---
\\makeatletter
\\def \\name#1{\\def\\@name{#1}}
\\def \\@name {}

\\def \\addressSep {$\\diamond$}

\\let \\@addressone \\relax
\\let \\@addresstwo \\relax
\\let \\@addressthree \\relax

\\def \\address #1{
  \\@ifundefined{@addresstwo}{
    \\def \\@addresstwo {#1}
  }{
  \\@ifundefined{@addressthree}{
  \\def \\@addressthree {#1}
  }{
     \\def \\@addressone {#1}
  }}
}

\\def \\printaddress #1{
  \\begingroup
    \\def \\\\ {\\addressSep\\ }
    \\centerline{#1}
  \\endgroup
  \\par
  \\addressskip
}

\\def \\printname {
  \\begingroup
    \\hfil{\\MakeUppercase{\\namesize\\bf \\@name}}\\hfil
    \\nameskip\\break
  \\endgroup
}

% Print header automatically at document start
\\AtBeginDocument{
  \\printname
  \\@ifundefined{@addressone}{}{\\printaddress{\\@addressone}}
  \\@ifundefined{@addresstwo}{}{\\printaddress{\\@addresstwo}}
  \\@ifundefined{@addressthree}{}{\\printaddress{\\@addressthree}}
}

% --- Section formatting ---
\\newenvironment{rSection}[1]{
  \\sectionskip
  \\textsc{\\large #1}
  \\sectionlineskip
  \\hrule
  \\begin{list}{}{
    \\setlength{\\leftmargin}{1.5em}
  }
  \\item[]
}{
  \\end{list}
}

% --- Work subsection formatting ---
\\newenvironment{rSubsection}[4]{
 {\\bf #1} \\hfill {#2}
 \\ifthenelse{\\equal{#3}{}}{}{
  \\\\
  {\\em #3} \\hfill {\\em #4}
  }\\smallskip
  \\begin{list}{$\\cdot$}{\\leftmargin=0em}
   \\itemsep -0.5em \\vspace{-0.5em}
  }{
  \\end{list}
  \\vspace{0.5em}
}

% spacing defaults
\\def\\namesize{\\huge}
\\def\\addressskip{\\smallskip}
\\def\\sectionlineskip{\\medskip}
\\def\\nameskip{\\bigskip}
\\def\\sectionskip{\\medskip}
\\makeatother

% =======================
% your main.tex packages/config
% =======================
\\usepackage{enumitem}
\\usepackage{xcolor}
\\usepackage{amssymb}
\\usepackage{tabularx}
\\usepackage{setspace}
\\renewcommand{\\normalsize}{\\fontsize{10.5pt}{13pt}\\selectfont}
\\usepackage[left=0.5 in,top=0.5in,right=0.5 in,bottom=0.5in]{geometry}
\\newgeometry{top=0.4in, bottom=0.4in, left=0.2in, right=0.2in}
\\usepackage{multicol}
% \\usepackage{microtype} % Potentially problematic
% \\usepackage{fontawesome5} % Removed
\\usepackage[none]{hyphenat}
\\sloppy
\\definecolor{customblue}{RGB}{0, 102, 204}
\\usepackage{booktabs}
\\usepackage{makecell}
% \\usepackage{charter} % Font might be missing on some systems
\\renewcommand{\\nameskip}{\\smallskip}

% Load hyperref BEFORE fancyhdr to avoid conflicts
\\usepackage[hidelinks]{hyperref}
\\hypersetup{
    colorlinks=true,
    linkcolor=blue,
    urlcolor=blue,
    citecolor=blue
}

\\vspace*{-16mm}
\\usepackage{fancyhdr}

\\setlength\\headheight{43pt}
\\setlength{\\headsep}{0.12in}
\\thispagestyle{empty}
\\pagestyle{fancy}
\\fancyhf{}
\\fancyhead[R]{\\em Resume}

% =======================
% Header content
% =======================
\\name{${escapeLatex(basicInfo?.fullName || 'Your Name')}}
\\fancyhead[L]{\\em ${escapeLatex(basicInfo?.fullName || 'Your Name')}}

\\address{${(() => {
      const parts = [];
      if (basicInfo?.email) {
        parts.push(`\\href{mailto:${basicInfo.email}}{${escapeLatex(basicInfo.email)}}`);
      }
      if (basicInfo?.phone) {
        parts.push(escapeLatex(basicInfo.phone));
      }
      if (basicInfo?.location) {
        parts.push(escapeLatex(basicInfo.location));
      }
      if (basicInfo?.linkedin) {
        parts.push(`\\href{${basicInfo.linkedin}}{LinkedIn}`);
      }
      if (basicInfo?.github) {
        parts.push(`\\href{${basicInfo.github}}{GitHub}`);
      }
      if (basicInfo?.portfolio) {
        parts.push(`\\href{${basicInfo.portfolio}}{Portfolio}`);
      }
      return parts.join(' \\,•\\, ');
    })()}}

\\begin{document}

% ---------- EDUCATION ----------
\\vspace{-3mm}
\\begin{rSection}{\\textbf{\\textcolor{customblue}{EDUCATION}}}
`;

  education.forEach((edu: GeneratedEducation) => {
    latex += `
    {\\bf ${escapeLatex(edu.school)}} \\hfill {${escapeLatex(edu.startDate)} -- ${escapeLatex(edu.endDate)}}\\\\
    \\textit{${escapeLatex(edu.degree)} in ${escapeLatex(edu.field)}}\\
`;
    if (edu.gpa) {
      latex += `    \\textbf{GPA:} ${escapeLatex(edu.gpa)}\\\\ \n`;
    }
    if (edu.coursework) {
      latex += `    \\textbf{Relevant Coursework:} ${escapeLatex(edu.coursework)}\\\\ \n`;
    }
  });

  latex += `
\\end{rSection}

% ---------- TECHNICAL SKILLS ----------
\\vspace{-3mm}
\\begin{rSection}{\\textbf{\\textcolor{customblue}{TECHNICAL SKILLS}}}
\\begin{itemize}[noitemsep, nolistsep]
`;

  skills.categories.forEach((cat) => {
    latex += `  \\item \\textbf{${escapeLatex(cat.name)}:} ${escapeLatex(cat.skills.join(', '))}\n`;
  });

  latex += `
\\end{itemize}
\\end{rSection}

% ---------- PROJECTS ----------
\\vspace{-3mm}
\\begin{rSection}{\\textbf{\\textcolor{customblue}{PROJECTS}}}
`;

  projects.forEach((proj: GeneratedProject) => {
    latex += `
\\textbf{${escapeLatex(proj.name)}}${proj.link ? ` \\href{${proj.link}}{(Live Link)}` : ''}
\\hfill \\textbf{${escapeLatex(proj.technologies?.join(', ') || '')}}
\\vspace{-2mm}
\\begin{itemize}[noitemsep, nolistsep]
`;
    proj.bullets.forEach(bullet => {
      latex += `  \\item ${escapeLatex(bullet)}\n`;
    });
    latex += `\\end{itemize}\n`;
  });

  latex += `
\\end{rSection}

% ---------- PROFESSIONAL EXPERIENCE ----------
\\vspace{-3mm}
\\begin{rSection}{\\textbf{\\textcolor{customblue}{PROFESSIONAL EXPERIENCE}}}
`;

  experiences.forEach((exp: GeneratedExperience) => {
    latex += `
\\textbf{${escapeLatex(exp.title)}} \\hfill \\textbf{${escapeLatex(exp.startDate)} -- ${escapeLatex(exp.endDate)}}\\\\
\\textit{${escapeLatex(exp.company)} \\hfill ${escapeLatex(exp.location)}}\\\\
\\vspace{-7mm}
\\begin{itemize}[noitemsep, nolistsep]
`;
    exp.bullets.forEach(bullet => {
      latex += `  \\item ${escapeLatex(bullet)}\n`;
    });
    latex += `\\end{itemize}\n`;
  });

  latex += `
\\end{rSection}

% ---------- SUMMARY ----------
\\vspace{-3mm}
\\begin{rSection}{\\textbf{\\textcolor{customblue}{SUMMARY}}}
\\begin{itemize}[noitemsep, nolistsep]
    \\item ${escapeLatex(summary.content)}
\\end{itemize}
\\end{rSection}

\\end{document}
`;

  return latex;
}
