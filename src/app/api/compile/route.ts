import { NextRequest, NextResponse } from 'next/server';
import pako from 'pako';

// Helper function to create a tar archive (simple USTAR format)
function createTarArchive(filename: string, content: string): Uint8Array {
    const filenameBytes = new TextEncoder().encode(filename);
    const contentBytes = new TextEncoder().encode(content);
    const fileSize = contentBytes.length;

    // TAR header is 512 bytes
    const header = new Uint8Array(512);

    // Filename (offset 0, 100 bytes)
    header.set(filenameBytes.slice(0, 100), 0);

    // File mode (offset 100, 8 bytes) - "0000644\0"
    const mode = new TextEncoder().encode('0000644\0');
    header.set(mode, 100);

    // Owner UID (offset 108, 8 bytes) - "0000000\0"
    const uid = new TextEncoder().encode('0000000\0');
    header.set(uid, 108);

    // Group GID (offset 116, 8 bytes) - "0000000\0"
    const gid = new TextEncoder().encode('0000000\0');
    header.set(gid, 116);

    // File size in octal (offset 124, 12 bytes)
    const sizeOctal = fileSize.toString(8).padStart(11, '0') + '\0';
    header.set(new TextEncoder().encode(sizeOctal), 124);

    // Modification time in octal (offset 136, 12 bytes) - current timestamp
    const mtime = Math.floor(Date.now() / 1000).toString(8).padStart(11, '0') + '\0';
    header.set(new TextEncoder().encode(mtime), 136);

    // Checksum placeholder (offset 148, 8 bytes) - fill with spaces initially
    header.set(new TextEncoder().encode('        '), 148);

    // Type flag (offset 156, 1 byte) - '0' for regular file
    header[156] = '0'.charCodeAt(0);

    // USTAR indicator (offset 257, 6 bytes)
    header.set(new TextEncoder().encode('ustar\0'), 257);

    // USTAR version (offset 263, 2 bytes)
    header.set(new TextEncoder().encode('00'), 263);

    // Calculate checksum
    let checksum = 0;
    for (let i = 0; i < 512; i++) {
        checksum += header[i];
    }
    const checksumOctal = checksum.toString(8).padStart(6, '0') + '\0 ';
    header.set(new TextEncoder().encode(checksumOctal), 148);

    // Calculate total size (header + content + padding)
    const contentPadding = (512 - (fileSize % 512)) % 512;
    const totalSize = 512 + fileSize + contentPadding + 1024; // +1024 for end-of-archive marker

    const tar = new Uint8Array(totalSize);
    tar.set(header, 0);
    tar.set(contentBytes, 512);
    // Rest is already zeros (padding and end marker)

    return tar;
}

export async function POST(req: NextRequest) {
    try {
        const { latex } = await req.json();

        if (!latex) {
            return NextResponse.json({ error: 'No LaTeX code provided' }, { status: 400 });
        }

        console.log('--> Starting LaTeX Compilation (TAR.GZ to /data)...');

        // Add timeout (30s)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        try {
            // Create TAR archive with main.tex
            const tarData = createTarArchive('main.tex', latex);

            // Compress with gzip
            const gzipData = pako.gzip(tarData);

            // Create blob and FormData
            const formData = new FormData();
            const blob = new Blob([gzipData], { type: 'application/gzip' });
            formData.append('file', blob, 'archive.tar.gz');

            const response = await fetch('https://latexonline.cc/data?target=main.tex&force=true', {
                method: 'POST',
                body: formData,
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('LaTeX compilation failed:', errorText);
                return NextResponse.json({ error: 'Compilation failed', details: errorText }, { status: 500 });
            }

            const pdfBuffer = await response.arrayBuffer();
            console.log('--> LaTeX Compilation SUCCESS! Sending PDF...');

            return new NextResponse(pdfBuffer, {
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'inline; filename="resume.pdf"',
                },
            });
        } catch (error: any) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                return NextResponse.json({ error: 'Compilation timed out' }, { status: 504 });
            }
            throw error;
        }

    } catch (error) {
        console.error('Proxy error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
