import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { TokenDetails, TokenService } from '../service/token.service';
import { TokenStatusEnum } from '../enum/token-status.enum';
import { RequestWithEmailModel } from '../model/request-with-email.model';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private tokenService: TokenService) {}

  use(req: RequestWithEmailModel, res: Response, next: NextFunction) {
    const token = req.headers.authorization ?? '';

    if (!token.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid token provided');
    }

    const jwt = token.split(' ')[1];
    const tokenDetails: TokenDetails = this.tokenService.getTokenDetails(jwt);

    if (tokenDetails.status !== TokenStatusEnum.VALID) {
      throw new UnauthorizedException(`${tokenDetails.status} token provided`);
    }

    req.userEmail = tokenDetails.payload.email;

    next();
  }
}
