import {
  BadRequestException,
  Controller,
  HttpCode,
  Post,
  Req,
  ServiceUnavailableException,
} from '@nestjs/common';
import { SamplePdfEncryptionService } from '../service/sample-pdf-encryption.service';
import { RequestWithEmailModel } from '../../../model/request-with-email.model';
import { MissingPubRsaError } from '../exception/missing-pub-rsa.error';

interface EncryptResponse {
  content: string;
}

@Controller('/api')
export class EncryptionController {
  constructor(private samplePdfEncryptionService: SamplePdfEncryptionService) {}

  @Post('/encrypt')
  @HttpCode(201)
  async encrypt(@Req() req: RequestWithEmailModel): Promise<EncryptResponse> {
    try {
      const base64EncryptedSamplePdf = await this.samplePdfEncryptionService.getBase64EncryptedSamplePdf(
        req,
      );

      return {
        content: base64EncryptedSamplePdf,
      };
    } catch (err) {
      if (err instanceof MissingPubRsaError) {
        throw new BadRequestException({
          message:
            'There is no public RSA key generated for this user. Generate RSA key pair first',
          link: {
            rel: 'Generating RSA key pair',
            href: '/api/generate-key-pair',
            method: 'POST',
          },
        });
      }

      throw new ServiceUnavailableException(err.message);
    }
  }
}
