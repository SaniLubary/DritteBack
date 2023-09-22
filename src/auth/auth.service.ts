import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';

@Injectable()
export class AuthService {
  private domain;

  constructor(private configService: ConfigService) {
    this.domain = configService.get<string>('AUTH0_DOMAIN');
  }

  async verifyToken(token: string): Promise<any> {
    try {
      const jwtHeader = JSON.parse(
        Buffer.from(token.split('.')[0], 'base64').toString(),
      );

      const client = new JwksClient({
        jwksUri: this.domain,
      });

      const key = await client.getSigningKey(jwtHeader.kid);
      const publicKey = key.getPublicKey();
      const payload = jwt.verify(token, publicKey, {
        algorithms: ['RS256'],
      });
      return payload;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}
