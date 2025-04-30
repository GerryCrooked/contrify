const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PRIVATE_KEY_PATH = path.join(__dirname, '../.private.key');

function loadPrivateKey() {
  return fs.readFileSync(PRIVATE_KEY_PATH, 'utf-8');
}

function signLicense(payload) {
  const privateKey = loadPrivateKey();
  const sign = crypto.createSign('sha256');
  sign.update(JSON.stringify(payload));
  sign.end();

  return sign.sign(privateKey, 'base64');
}

function generateSignedLicense(customer, features, expiresAt) {
  const payload = {
    customer,
    features,
    expires_at: expiresAt.toISOString()
  };

  const signature = signLicense(payload);

  return {
    ...payload,
    signature
  };
}

// Example usage
const license = generateSignedLicense("Test Customer", ["workflows", "ocr"], new Date('2025-06-30'));
console.log(JSON.stringify(license, null, 2));
