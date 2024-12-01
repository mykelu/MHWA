import { generateSecret, generateToken, verifyToken } from 'node-2fa';

export interface TOTPConfig {
  secret: string;
  uri: string;
  qr: string;
}

export function generateTOTPSecret(email: string): TOTPConfig {
  const { secret, uri, qr } = generateSecret({
    name: 'MindWell',
    account: email,
  });

  return {
    secret: secret!,
    uri: uri!,
    qr: qr!,
  };
}

export function generateTOTPToken(secret: string): string | null {
  const token = generateToken(secret);
  return token?.token || null;
}

export function verifyTOTPToken(token: string, secret: string): boolean {
  const result = verifyToken(secret, token);
  return result?.delta === 0;
}