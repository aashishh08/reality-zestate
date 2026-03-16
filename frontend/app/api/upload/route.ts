import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// Force dynamic so Next.js never tries to statically generate this route
export const dynamic = 'force-dynamic';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const file = form.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Only image files are allowed (jpg, png, webp, gif)' }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File too large — max 10 MB' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename: keep only alphanumeric, dash, underscore
    const ext = path.extname(file.name).toLowerCase() || '.jpg';
    const baseName = path.basename(file.name, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 60);
    const filename = `${Date.now()}-${baseName}${ext}`;

    await mkdir(UPLOAD_DIR, { recursive: true });
    await writeFile(path.join(UPLOAD_DIR, filename), buffer);

    return NextResponse.json({ url: `/uploads/${filename}` });
  } catch (err: any) {
    console.error('[upload] error:', err?.message ?? err, '| UPLOAD_DIR:', UPLOAD_DIR);
    return NextResponse.json(
      { error: 'Upload failed', detail: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
