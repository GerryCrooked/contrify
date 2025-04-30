import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const LICENSE_FILE = path.join(__dirname, '../../license.json');
const PUBLIC_KEY_PATH = path.join(__dirname, '../../.public.key');

interface License {
  customer: string;
  features: string[];
  expires_at: string;
  signature?: string;
}

function getPublicKey(): string {
  return fs.readFileSync(PUBLIC_KEY_PATH, 'utf-8');
}

function verifySignature(data: any, signature: string): boolean {
  const publicKey = getPublicKey();
  const verify = crypto.createVerify('sha256');
  verify.update(JSON.stringify(data));
  verify.end();

  return verify.verify(publicKey, Buffer.from(signature, 'base64'));
}

function isLicenseValid(): { valid: boolean; license?: License } {
  try {
    const file = fs.readFileSync(LICENSE_FILE, 'utf-8');
    const parsed = JSON.parse(file) as License;

    // Remove signature for verification
    const { signature, ...payload } = parsed;

    if (!signature) {
      return { valid: false };
    }

    if (!verifySignature(payload, signature)) {
      return { valid: false };
    }

    const now = new Date();
    const expiry = new Date(parsed.expires_at);

    if (expiry < now) {
      return { valid: false };
    }

    return { valid: true, license: parsed };
  } catch (e) {
    console.error('License check failed:', e);
    return { valid: false };
  }
}

export function requireFeature(feature: string) {
  return (req: any, res: any, next: () => void) => {
    const { valid, license } = isLicenseValid();

    if (!valid) {
      return res.status(403).json({ error: 'No valid license found' });
    }

    if (!license || !license.features.includes(feature)) {
      return res.status(403).json({
        error: `Feature "${feature}" not enabled in current license`
      });
    }

    next();
  };
}
