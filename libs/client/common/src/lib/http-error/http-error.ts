import { HttpErrorResponse } from '@angular/common/http';

export class HttpError<T> extends HttpErrorResponse {
	public override error: T | undefined;
}
