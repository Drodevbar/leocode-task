import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { TokenDetails, TokenService } from '../../../src/service/token.service';
import { UserModel } from '../../../src/model/user.model';
import { TokenStatusEnum } from '../../../src/enum/token-status.enum';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

describe('TokenService', () => {
  let tokenService: TokenService;
  const configServiceMock = {
    get: (key: string) => {
      switch (key) {
        case 'JWT_SECRET':
          return 'jwt-secret-test';
      }
    },
  };
  const jwtMock = {
    sign: jest.fn(),
    verify: jest.fn(),
  };
  const token = 'token-test';

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        { provide: ConfigService, useValue: configServiceMock },
        { provide: 'jwt', useValue: jwtMock },
      ],
    }).compile();

    tokenService = app.get<TokenService>(TokenService);
  });

  describe('getTokenForUser', () => {
    const user: UserModel = {
      email: 'foo@gmail.com',
      password: 'secret',
    };

    it('should call jwt.sign() with proper params and return token', () => {
      jwtMock.sign.mockReturnValue(token);

      const result = tokenService.getTokenForUser(user, 99);

      expect(result).toBe(token);
      expect(jwtMock.sign).toHaveBeenCalledWith(
        { email: user.email },
        'jwt-secret-test',
        { expiresIn: 99 },
      );
    });
  });

  describe('getTokenDetails', () => {
    const email = 'foo@gmail.com';

    it('should return status VALID with payload containing email for valid token', () => {
      jwtMock.verify.mockReturnValue({ email });

      const result: TokenDetails = tokenService.getTokenDetails(token);

      expect(result).toStrictEqual({
        status: TokenStatusEnum.VALID,
        payload: { email },
      });
    });

    it('should return status EXPIRED when jwt.verify() threw TokenExpiredError', () => {
      jwtMock.verify.mockImplementation(() => {
        throw new TokenExpiredError('Ooops!', new Date());
      });

      const result: TokenDetails = tokenService.getTokenDetails(token);

      expect(result).toStrictEqual({
        status: TokenStatusEnum.EXPIRED,
      });
    });

    it('should return status INVALID when jwt.verify() threw error other than TokenExpiredError', () => {
      jwtMock.verify.mockImplementation(() => {
        throw new JsonWebTokenError('Ooops!');
      });

      const result: TokenDetails = tokenService.getTokenDetails(token);

      expect(result).toStrictEqual({
        status: TokenStatusEnum.INVALID,
      });
    });
  });
});
