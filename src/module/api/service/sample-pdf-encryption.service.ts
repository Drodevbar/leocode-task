import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { RsaService } from '../../../service/rsa.service';
import { InMemoryDbService } from '../../../service/in-memory-db.service';
import { MissingPubRsaError } from '../exception/missing-pub-rsa.error';
import { SamplePdfDownloaderService } from '../../../service/sample-pdf-downloader.service';
import { RequestWithEmailModel } from '../../../model/request-with-email.model';

@Injectable()
export class SamplePdfEncryptionService {
  constructor(
    private samplePdfDownloaderService: SamplePdfDownloaderService,
    private rsaService: RsaService,
    private inMemoryDbService: InMemoryDbService,
  ) {}

  async getBase64EncryptedSamplePdf(
    req: RequestWithEmailModel,
  ): Promise<string> {
    const userRsaPubKey = this.inMemoryDbService.getRsaPubKeyForUser(
      req.userEmail,
    );

    if (userRsaPubKey === null) {
      throw new MissingPubRsaError(
        'Public RSA key for given user does not exist',
      );
    }

    const fetchSamplePdfResponse: AxiosResponse<Buffer> = await this.samplePdfDownloaderService.fetchSamplePdf();

    return this.rsaService.getEncryptedBase64String(
      fetchSamplePdfResponse.data,
      userRsaPubKey,
    );
  }
}
