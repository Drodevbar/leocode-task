import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jsonwebtoken from 'jsonwebtoken';
import { TokenExpiredError } from 'jsonwebtoken';
import { UserModel } from 'src/model/user.model';
import { TokenStatusEnum } from '../enum/token-status.enum';
import { TokenPayloadModel } from '../model/token-payload.model';

export interface TokenDetails {
  status: TokenStatusEnum;
  payload?: TokenPayloadModel;
}

@Injectable()
export class TokenService {
  private readonly jwtSecret: string;

  constructor(
    @Inject('jwt') private jwt: typeof jsonwebtoken,
    private configService: ConfigService,
  ) {
    this.jwtSecret = this.configService.get<string>('JWT_SECRET');
  }

  getTokenForUser(user: UserModel, expiresInSeconds = 300) {
    return this.jwt.sign({ email: user.email }, this.jwtSecret, {
      expiresIn: expiresInSeconds,
    });
  }

  getTokenDetails(token: string): TokenDetails {
    try {
      const payload = this.jwt.verify(token, this.jwtSecret);

      return {
        status: TokenStatusEnum.VALID,
        payload: <TokenPayloadModel>payload,
      };
    } catch (err) {
      return err instanceof TokenExpiredError
        ? { status: TokenStatusEnum.EXPIRED }
        : { status: TokenStatusEnum.INVALID };
    }
  }
}
