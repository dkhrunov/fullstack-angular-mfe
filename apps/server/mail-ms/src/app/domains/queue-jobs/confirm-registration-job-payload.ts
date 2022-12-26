export class ConfirmRegistrationJobPayload {
  public readonly recipient: string;

  public readonly token: string;

  constructor(partial: Partial<ConfirmRegistrationJobPayload>) {
    Object.assign(this, partial);
  }
}
