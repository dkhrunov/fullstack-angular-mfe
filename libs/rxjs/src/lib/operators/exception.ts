import { HttpException } from '@nestjs/common';
import { map, Observable, OperatorFunction } from 'rxjs';

export function exception<T>(
	predicate: (value: T) => boolean,
	exception: HttpException | Error,
): OperatorFunction<T, T> {
	return function (source: Observable<T>): Observable<T> {
		return source.pipe(
			map((value) => {
				if (predicate(value)) throw exception;

				return value;
			}),
		);
	};
}
