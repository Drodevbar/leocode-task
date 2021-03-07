import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../../src/service/user.service';
import { InMemoryDbService } from '../../../src/service/in-memory-db.service';
import { UserModel } from '../../../src/model/user.model';

describe('AuthService', () => {
  let userService: UserService;
  const inMemoryDbServiceMock = {
    getUsers: jest.fn(),
  };
  const users: UserModel[] = [
    {
      email: 'foo@gmail.com',
      password: 'secret',
    },
    {
      email: 'bar@gmail.com',
      password: 'secret',
    },
  ];

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: InMemoryDbService, useValue: inMemoryDbServiceMock },
      ],
    }).compile();

    userService = app.get<UserService>(UserService);
    inMemoryDbServiceMock.getUsers.mockReturnValue(users);
  });

  describe('getAllUsers', () => {
    it('should call inMemoryService.getUsers() and return all users', () => {
      const result = userService.getAllUsers();

      expect(result).toBe(users);
      expect(inMemoryDbServiceMock.getUsers).toHaveBeenCalled();
    });
  });

  describe('getOneByEmail', () => {
    it('should call inMemoryService.getUsers() and return user with given email', () => {
      const result = userService.getOneByEmail(users[0].email);

      expect(result).toBe(users[0]);
      expect(inMemoryDbServiceMock.getUsers).toHaveBeenCalled();
    });
  });
});
