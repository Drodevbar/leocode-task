import {
  Body,
  Controller,
  NotFoundException,
  Post,
  HttpCode,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from 'src/dto/sign-in.dto';
import { AuthService } from 'src/service/auth.service';
import { TokenService } from 'src/service/token.service';
import { UserService } from 'src/service/user.service';

interface SignInResponse {
  authToken: string;
}

@Controller('/api')
export class LoginController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private tokenService: TokenService,
  ) {}

  @Post('/sign-in')
  @HttpCode(201)
  signIn(@Body() signInDto: SignInDto): SignInResponse {
    const { email, password } = signInDto;
    const user = this.userService.getOneByEmail(email);

    if (user === undefined) {
      throw new NotFoundException('User with given email does not exist');
    }

    if (!this.authService.passwordMatch(password, user)) {
      throw new UnauthorizedException('Email and password does not match');
    }

    return {
      authToken: this.tokenService.getTokenForUser(user),
    };
  }
}
