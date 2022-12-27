import { plainToInstance } from 'class-transformer';
import { map, Observable, OperatorFunction } from 'rxjs';

interface Type<T> extends Function {
  new (...args: any[]): T;
}

export function mapToInstance<TSource, TDestination>(
  destination: Type<TDestination>
): OperatorFunction<TSource, TDestination> {
  return (source: Observable<TSource>): Observable<TDestination> => {
    return source.pipe(map((value) => plainToInstance(destination, value)));
  };
}
