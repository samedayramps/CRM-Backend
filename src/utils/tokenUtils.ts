import crypto from 'crypto';

export function generateAcceptanceToken(quoteId: string): string {
  const secret = process.env.ACCEPTANCE_TOKEN_SECRET || 'default_secret';
  return crypto.createHmac('sha256', secret).update(quoteId).digest('hex');
}

export function verifyAcceptanceToken(quoteId: string, token: string): boolean {
  const expectedToken = generateAcceptanceToken(quoteId);
  return token === expectedToken;
}