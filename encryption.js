const crypto = require('crypto');

// Fixed secret key (32 bytes for AES-256)
const SECRET_KEY = crypto.createHash('sha256').update('my-secret-password').digest();
const IV_LENGTH = 16;

// Function to encrypt text
function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', SECRET_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
}

// Function to decrypt text
function decrypt(encryptedText) {
  const [ivHex, encrypted] = encryptedText.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', SECRET_KEY, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// Texts to encrypt
const texts = [
  "Hello World",
  "Mutoni",
  "Node.js is awesome!"
];

// Encrypt all texts
const encryptedTexts = texts.map(t => encrypt(t));

// Decrypt all texts
const decryptedTexts = encryptedTexts.map(t => decrypt(t));

// Output results
console.log("===== ENCRYPTED TEXTS =====");
encryptedTexts.forEach((t, i) => console.log(`${i + 1}: ${t}`));

console.log("\n===== DECRYPTED TEXTS =====");
decryptedTexts.forEach((t, i) => console.log(`${i + 1}: ${t}`));
