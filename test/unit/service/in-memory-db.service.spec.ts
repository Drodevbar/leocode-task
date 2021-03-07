import { Test, TestingModule } from '@nestjs/testing';
import { InMemoryDbService } from '../../../src/service/in-memory-db.service';
import { UserModel } from '../../../src/model/user.model';

describe('InMemoryDbService', () => {
  let inMemoryDbService: InMemoryDbService;
  const fileSystemMock = { readFileSync: jest.fn(), writeFileSync: jest.fn() };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        InMemoryDbService,
        { provide: 'fs', useValue: fileSystemMock },
      ],
    }).compile();

    inMemoryDbService = app.get<InMemoryDbService>(InMemoryDbService);
  });

  describe('getUsers', () => {
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

    it('should call fileSystem.readFileSync with correct params and return list of users', () => {
      const jsonString = JSON.stringify(users);
      fileSystemMock.readFileSync.mockReturnValue(jsonString);

      const result: UserModel[] = inMemoryDbService.getUsers();

      expect(result).toStrictEqual(users);
      expect(fileSystemMock.readFileSync).toHaveBeenCalledWith(
        'db/users.json',
        'utf-8',
      );
    });
  });

  describe('getRsaPubKeyForUser', () => {
    it('should call fileSystem.readFileSync with correct params and return rsaPubKey when file exists', () => {
      const rsaPubKey = 'rsa-pub-key-test';
      const jsonString = JSON.stringify({ rsaPubKey });
      fileSystemMock.readFileSync.mockReturnValue(jsonString);

      const result: string = inMemoryDbService.getRsaPubKeyForUser(
        'foo@gmail.com',
      );

      expect(result).toBe(rsaPubKey);
      expect(fileSystemMock.readFileSync).toHaveBeenCalledWith(
        'db/rsa_pub_keys/foo@gmail.com.json',
        'utf-8',
      );
    });

    it('should return null when fileSystem.readFileSync thrown an exception', () => {
      fileSystemMock.readFileSync.mockImplementation(() => {
        throw new Error('Ooops!');
      });

      const result: string = inMemoryDbService.getRsaPubKeyForUser(
        'foo@gmail.com',
      );

      expect(result).toBeNull();
    });
  });

  describe('saveRsaPubKeyForUser', () => {
    it('should call fileSystem.writeFileSync with proper params', () => {
      const userEmail = 'foo@gmail.com';
      const rsaPublicKey = 'rsa-public-key-test';

      inMemoryDbService.saveRsaPubKeyForUser(userEmail, rsaPublicKey);

      expect(fileSystemMock.writeFileSync).toHaveBeenCalledWith(
        'db/rsa_pub_keys/foo@gmail.com.json',
        JSON.stringify({ rsaPubKey: rsaPublicKey }),
      );
    });
  });
});
