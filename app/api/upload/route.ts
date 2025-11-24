import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    const uploadDir = join(process.cwd(), 'public', 'uploads');

    // Create uploads directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        continue; // Skip non-image files
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 15);
      const extension = file.name.split('.').pop();
      const filename = `${timestamp}-${randomStr}.${extension}`;

      const filepath = join(uploadDir, filename);
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      await writeFile(filepath, buffer);

      // Return the public URL
      const url = `/uploads/${filename}`;
      uploadedUrls.push(url);
    }

    return NextResponse.json({ urls: uploadedUrls });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}

