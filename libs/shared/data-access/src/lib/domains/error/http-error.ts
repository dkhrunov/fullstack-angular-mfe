import { HttpErrorResponse } from '@angular/common/http';

export class HttpError<T> extends HttpErrorResponse {
	public error: T | undefined;
}
