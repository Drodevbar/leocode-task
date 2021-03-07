import { Injectable } from '@nestjs/common';
import { UserModel } from 'src/model/user.model';
import { InMemoryDbService } from './in-memory-db.service';

@Injectable()
export class UserService {
  constructor(private inMemoryDbService: InMemoryDbService) {}

  getAllUsers(): UserModel[] {
    return this.inMemoryDbService.getUsers();
  }

  getOneByEmail(email: string): UserModel {
    const users: UserModel[] = this.inMemoryDbService.getUsers();

    return users.find((user) => email === user.email);
  }
}
