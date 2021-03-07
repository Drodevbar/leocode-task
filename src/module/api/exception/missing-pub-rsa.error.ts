export class MissingPubRsaError extends Error {
  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, MissingPubRsaError.prototype);
  }
}
