import app from '../server';

// Export handler for Vercel Serverless Functions
export default function handler(req: any, res: any) {
  try {
    return app(req, res);
  } catch (err: any) {
    console.error('[Vercel Serverless Handler Error]:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Serverless invocation error', message: err?.message || String(err) });
    }
  }
}

