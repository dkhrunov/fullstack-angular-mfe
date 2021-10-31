import { HttpException } from '@nestjs/common';
import { map, Observable, OperatorFunction } from 'rxjs';

export type ExceptionFunction<T> = (value: T) => HttpException | Error;

export function exception<T>(
	predicate: (value: T) => boolean,
	exception: HttpException | Error | ExceptionFunction<T>
): OperatorFunction<T, T> {
	return function (source: Observable<T>): Observable<T> {
		return source.pipe(
			map((value) => {
				if (predicate(value)) {
					if (typeof exception === 'function') {
						throw exception(value);
					}

					throw exception;
				}

				return value;
			})
		);
	};
}
