import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

const REVALIDATE_SECRET = process.env.REVALIDATION_SECRET || 'cryptodrop_revalidate_secret_2026';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('x-revalidate-secret') || req.headers.get('authorization');
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get('secret') || authHeader?.replace('Bearer ', '');

    if (secret !== REVALIDATE_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const slug = body?.record?.slug || body?.slug;

    // Revalidate blog index and specific post
    revalidatePath('/blog');
    revalidatePath('/');
    if (slug) {
      revalidatePath(`/blog/${slug}`);
    }

    return NextResponse.json({
      revalidated: true,
      timestamp: new Date().toISOString(),
      slug: slug || 'all'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
