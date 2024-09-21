import crypto from 'crypto';

const SECRET_KEY = process.env.TOKEN_SECRET_KEY || 'your-secret-key';

export function generateAcceptanceToken(quoteId: string): string {
  const data = `${quoteId}-${Date.now()}`;
  return crypto.createHmac('sha256', SECRET_KEY).update(data).digest('hex');
}

export function verifyAcceptanceToken(quoteId: string, token: string): boolean {
  // In a real implementation, you'd want to store tokens with expiration times
  // For simplicity, we're just checking if the token is valid for the quote ID
  const generatedToken = generateAcceptanceToken(quoteId);
  return token === generatedToken;
}