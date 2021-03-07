import { Injectable } from '@nestjs/common';
import { InMemoryDbService } from '../../../service/in-memory-db.service';
import { RsaService } from '../../../service/rsa.service';
import { RsaKeyPairModel } from '../../../model/rsa-key-pair.model';
import { RequestWithEmailModel } from '../../../model/request-with-email.model';

@Injectable()
export class NewRsaService {
  constructor(
    private inMemoryDbService: InMemoryDbService,
    private rsaService: RsaService,
  ) {}

  handleRequest(req: RequestWithEmailModel): RsaKeyPairModel {
    const rsaKeyPair = this.rsaService.generateKeyPair();
    this.inMemoryDbService.saveRsaPubKeyForUser(
      req.userEmail,
      rsaKeyPair.publicKey,
    );

    return rsaKeyPair;
  }
}
