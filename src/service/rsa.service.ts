import { Inject, Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { RsaKeyPairModel } from '../model/rsa-key-pair.model';
import { ConfigService } from '@nestjs/config';
import * as hybridCrypto from 'hybrid-crypto-js';

@Injectable()
export class RsaService {
  private readonly rsaPrivateKeyPassphrase: string;

  constructor(
    @Inject('crypto') private cryptoService: typeof crypto,
    @Inject('hybridCrypto') private hybridCryptoService: typeof hybridCrypto,
    private configService: ConfigService,
  ) {
    this.rsaPrivateKeyPassphrase = configService.get<string>(
      'RSA_PRIV_KEY_PASSPHRASE',
    );
  }

  generateKeyPair(): RsaKeyPairModel {
    return this.cryptoService.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
        cipher: 'aes-256-cbc',
        passphrase: this.rsaPrivateKeyPassphrase,
      },
    });
  }

  getEncryptedBase64String(toEncrypt: Buffer, publicKey: string) {
    const crypt = new this.hybridCryptoService.Crypt();
    const encryptedData = JSON.parse(crypt.encrypt(publicKey, toEncrypt));

    return Buffer.from(encryptedData.cipher).toString('base64');
  }
}
