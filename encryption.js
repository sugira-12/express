const crypto = require('crypto');
const readline = require('readline');

// Secret key for AES-256 (32 bytes)
const SECRET_KEY = crypto.randomBytes(32);
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

// Command-line interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter "e" to encrypt or "d" to decrypt: ', (mode) => {
  if (mode === 'e') {
    rl.question('Enter text to encrypt: ', (text) => {
      const encrypted = encrypt(text);
      console.log(`Encrypted text: ${encrypted}`);
      rl.close();
    });
  } else if (mode === 'd') {
    rl.question('Enter text to decrypt: ', (text) => {
      try {
        const decrypted = decrypt(text);
        console.log(`Decrypted text: ${decrypted}`);
      } catch (err) {
        console.log('Error: Invalid encrypted text');
      }
      rl.close();
    });
  } else {
    console.log('Invalid option. Use "e" to encrypt or "d" to decrypt.');
    rl.close();
  }
});
