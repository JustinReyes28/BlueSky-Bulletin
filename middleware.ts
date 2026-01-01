import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const nonce = crypto.randomUUID();

    const response = NextResponse.next();
    const csp = response.headers.get('Content-Security-Policy')?.replace(/'nonce-{nonce}'/g, `'nonce-${nonce}'`) || '';
    response.headers.set('Content-Security-Policy', csp);

    return response;
}
