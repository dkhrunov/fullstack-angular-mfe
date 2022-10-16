export class ConfirmRegistrationJob {
  public readonly recipient: string;

  public readonly token: string;

  constructor(partial: Partial<ConfirmRegistrationJob>) {
    Object.assign(this, partial);
  }
}
