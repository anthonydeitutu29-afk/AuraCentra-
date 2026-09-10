import app from '../server';

// Export handler for Vercel Serverless Functions
export default function handler(req: any, res: any) {
  // 1. Support rewritten URLs from Vercel edge/routing
  const forwarded =
    req.headers['x-forwarded-uri'] ||
    req.headers['x-matched-path'] ||
    req.headers['x-original-url'] ||
    req.headers['x-rewrite-url'];

  if (forwarded && typeof forwarded === 'string' && forwarded.startsWith('/api')) {
    req.url = forwarded;
  } else {
    const matchedWildcard = req.query?.['0'] || req.query?.['1'] || req.query?.path;
    if (matchedWildcard && typeof matchedWildcard === 'string' && (req.url === '/api/index' || req.url === '/api' || req.url === '/')) {
      req.url = '/api/' + matchedWildcard.replace(/^\//, '');
    } else if (req.url === '/api/index' || req.url.startsWith('/api/index?')) {
      req.url = req.url.replace('/api/index', '/api');
    }
  }

  // 2. Return a Promise that resolves only when the response stream completes
  return new Promise((resolve) => {
    if (typeof res.on === 'function') {
      res.on('finish', () => resolve(undefined));
      res.on('close', () => resolve(undefined));
      res.on('error', (err: any) => {
        console.error('[Vercel Serverless Stream Error]:', err);
        resolve(undefined);
      });
    }

    try {
      app(req, res, (err: any) => {
        if (err) {
          console.error('[Express Handler Error]:', err);
        }
        resolve(undefined);
      });
    } catch (err: any) {
      console.error('[Vercel Serverless Invocation Error]:', err);
      if (!res.headersSent && typeof res.status === 'function') {
        res.status(500).json({ error: 'Serverless invocation error', message: err?.message || String(err) });
      }
      resolve(undefined);
    }
  });
}

