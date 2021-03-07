export class SamplePdfFetchError extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, SamplePdfFetchError.prototype);
  }
}
