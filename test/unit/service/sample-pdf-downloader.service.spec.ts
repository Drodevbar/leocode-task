import { Test, TestingModule } from '@nestjs/testing';
import { SamplePdfDownloaderService } from '../../../src/service/sample-pdf-downloader.service';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/common';
import { SamplePdfFetchError } from '../../../src/exception/sample-pdf-fetch.error';

describe('SamplePdfDownloaderService', () => {
  let samplePdfDownloaderService: SamplePdfDownloaderService;
  const configServiceMock = {
    get: (key: string) => {
      switch (key) {
        case 'SAMPLE_PDF_URI':
          return 'sample-pdf-uri-test';
      }
    },
  };
  const httpServiceMock = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        SamplePdfDownloaderService,
        { provide: ConfigService, useValue: configServiceMock },
        { provide: HttpService, useValue: httpServiceMock },
      ],
    }).compile();

    samplePdfDownloaderService = app.get<SamplePdfDownloaderService>(
      SamplePdfDownloaderService,
    );
  });

  describe('fetchSamplePdf', () => {
    it('should call httpService.get() with proper params and return promise', async () => {
      const data = Buffer.from([1, 2, 3]);
      httpServiceMock.get.mockReturnValue({
        toPromise: () => Promise.resolve({ data }),
      });

      const result = await samplePdfDownloaderService.fetchSamplePdf();

      expect(result).toStrictEqual({ data });
    });

    it('should throw SamplePdfFetchError when httpService threw an exception', async () => {
      httpServiceMock.get.mockRejectedValue(new Error('Ooops!'));

      await expect(samplePdfDownloaderService.fetchSamplePdf()).rejects.toThrow(
        new SamplePdfFetchError(
          'Cannot fetch sample pdf from sample-pdf-uri-test',
        ),
      );
    });
  });
});
