export interface IMailService {
  confirmRegistration(recipient: string, token: string): Promise<void>;
}
