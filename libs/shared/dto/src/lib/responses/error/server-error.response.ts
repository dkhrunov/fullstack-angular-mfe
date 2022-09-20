export class ServerErrorResponse {
  public readonly statusCode: number;
  public readonly message: string;
  public readonly error: string;
  public readonly timestamp: string;
  public readonly path: string;
}
