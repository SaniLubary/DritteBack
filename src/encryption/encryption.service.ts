import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class EncryptionService {
  private readonly key: string;

  constructor() {
    this.key = process.env.ENCRYPTION_KEY;
  }

  encrypt(text: string): string {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(this.key),
      iv,
    );
    let encrypted = cipher.update(text, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  }

  decrypt(text: string): string {
    console.log('decrhypt', text);
    const [ivHex, encryptedHex] = text.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(this.key),
      iv,
    );
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    console.log('decrypted', decrypted);
    return decrypted;
  }
}
