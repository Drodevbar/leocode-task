import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../../src/service/auth.service';
import { UserModel } from '../../../src/model/user.model';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    authService = app.get<AuthService>(AuthService);
  });

  describe('passwordMatch', () => {
    const user: UserModel = {
      email: 'foo@bar.com',
      password: 'secret',
    };

    it('should return true when given password match user password', () => {
      expect(authService.passwordMatch('secret', user)).toBe(true);
    });

    it('should return false when given password does not match', () => {
      expect(authService.passwordMatch('wrong-password', user)).toBe(false);
    });
  });
});
