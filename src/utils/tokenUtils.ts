import crypto from 'crypto';

const SECRET_KEY = process.env.TOKEN_SECRET_KEY || 'your-secret-key';
const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export function generateAcceptanceToken(quoteId: string): string {
  const timestamp = Date.now();
  const data = `${quoteId}-${timestamp}`;
  const hash = crypto.createHmac('sha256', SECRET_KEY).update(data).digest('hex');
  return `${timestamp}.${hash}`;
}

export function verifyAcceptanceToken(quoteId: string, token: string): boolean {
  const [timestamp, hash] = token.split('.');
  if (!timestamp || !hash) return false;

  const now = Date.now();
  if (now - parseInt(timestamp) > TOKEN_EXPIRY) return false;

  const data = `${quoteId}-${timestamp}`;
  const expectedHash = crypto.createHmac('sha256', SECRET_KEY).update(data).digest('hex');
  return hash === expectedHash;
}