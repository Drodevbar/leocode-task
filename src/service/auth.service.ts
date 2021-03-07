import { Injectable } from '@nestjs/common';
import { UserModel } from 'src/model/user.model';

@Injectable()
export class AuthService {
  passwordMatch(password: string, user: UserModel): boolean {
    return password === user.password;
  }
}
