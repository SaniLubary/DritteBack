import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';

@Injectable()
export class AuthService {
  private domain;

  constructor(private configService: ConfigService) {
    this.domain = configService.get<string>('AUTH0_DOMAIN');
  }

  async getUser(token: string) {
    if (!token) {
      console.log('No authorization header was specified');
      return false;
    }

    try {
      const user = await this.verifyToken(token);
      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  removeBearerPrefix(token) {
    if (token && token.startsWith('Bearer ')) {
      return token.substring(7);
    }
    return token;
  }

  async verifyToken(token: string): Promise<any> {
    token = this.removeBearerPrefix(token);
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
      console.log('Error in verify token', err);
      throw err;
    }
  }
}
