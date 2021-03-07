import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { SamplePdfFetchError } from '../exception/sample-pdf-fetch.error';

@Injectable()
export class SamplePdfDownloaderService {
  private readonly samplePdfUri: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.samplePdfUri = configService.get<string>('SAMPLE_PDF_URI');
  }

  async fetchSamplePdf(): Promise<AxiosResponse<Buffer>> {
    try {
      return this.httpService
        .get(this.samplePdfUri, {
          responseType: 'arraybuffer',
        })
        .toPromise();
    } catch (err) {
      throw new SamplePdfFetchError(
        `Cannot fetch sample pdf from ${this.samplePdfUri}`,
      );
    }
  }
}
