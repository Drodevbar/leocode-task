import { Controller, HttpCode, Post, Req } from '@nestjs/common';
import { RequestWithEmailModel } from '../../../model/request-with-email.model';
import { NewRsaService } from '../service/new-rsa.service';
import { RsaKeyPairModel } from '../../../model/rsa-key-pair.model';

interface GenerateKeyPairResponse {
  privKey: string;
  pubKey: string;
}

@Controller('/api')
export class RsaController {
  constructor(private newRsaService: NewRsaService) {}

  @Post('/generate-key-pair')
  @HttpCode(201)
  generateKeyPair(@Req() req: RequestWithEmailModel): GenerateKeyPairResponse {
    const rsaKeyPair: RsaKeyPairModel = this.newRsaService.handleRequest(req);

    return {
      privKey: rsaKeyPair.privateKey,
      pubKey: rsaKeyPair.publicKey,
    };
  }
}
