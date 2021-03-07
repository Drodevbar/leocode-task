import { Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { UserModel } from 'src/model/user.model';

@Injectable()
export class InMemoryDbService {
  private readonly DB_PATH_USERS = 'db/users.json';
  private readonly DB_PATH_RSA_PUB_KEYS_DIR = 'db/rsa_pub_keys';

  constructor(@Inject('fs') private fileSystem: typeof fs) {}

  getUsers(): UserModel[] {
    return JSON.parse(
      this.fileSystem.readFileSync(this.DB_PATH_USERS, 'utf-8'),
    );
  }

  getRsaPubKeyForUser(userEmail: string): string | null {
    try {
      return JSON.parse(
        this.fileSystem.readFileSync(
          `${this.DB_PATH_RSA_PUB_KEYS_DIR}/${userEmail}.json`,
          'utf-8',
        ),
      ).rsaPubKey;
    } catch (err) {
      return null;
    }
  }

  saveRsaPubKeyForUser(userEmail: string, rsaPublicKey: string): void {
    const filePath = `${this.DB_PATH_RSA_PUB_KEYS_DIR}/${userEmail}.json`;
    const data = JSON.stringify({ rsaPubKey: rsaPublicKey });

    this.fileSystem.writeFileSync(filePath, data);
  }
}
