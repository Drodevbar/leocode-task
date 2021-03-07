import { HttpModule, MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/service/auth.service';
import { InMemoryDbService } from 'src/service/in-memory-db.service';
import { TokenService } from 'src/service/token.service';
import { UserService } from 'src/service/user.service';
import { LoginController } from './controller/login.controller';
import { AuthMiddleware } from '../../middleware/auth.middleware';
import { RsaService } from '../../service/rsa.service';
import { RsaController } from './controller/rsa.controller';
import { NewRsaService } from './service/new-rsa.service';
import { EncryptionController } from './controller/encryption.controller';
import { SamplePdfEncryptionService } from './service/sample-pdf-encryption.service';
import { SamplePdfDownloaderService } from '../../service/sample-pdf-downloader.service';

@Module({
  imports: [HttpModule],
  controllers: [LoginController, RsaController, EncryptionController],
  providers: [
    InMemoryDbService,
    UserService,
    AuthService,
    TokenService,
    ConfigService,
    RsaService,
    NewRsaService,
    SamplePdfEncryptionService,
    SamplePdfDownloaderService,
    { provide: 'fs', useFactory: () => require('fs') },
    { provide: 'jwt', useFactory: () => require('jsonwebtoken') },
    { provide: 'crypto', useFactory: () => require('crypto') },
    { provide: 'hybridCrypto', useFactory: () => require('hybrid-crypto-js') },
  ],
})
export class ApiModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes('/api/generate-key-pair', '/api/encrypt');
  }
}
