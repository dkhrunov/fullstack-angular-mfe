import { Logger } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

export function LogObservableError(
  logger: Logger = new Logger(),
  type: Exclude<keyof Logger, 'localInstance'> = 'log'
): MethodDecorator {
  return function (
    _target: any,
    _propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ): TypedPropertyDescriptor<any> {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]): Observable<any> {
      return originalMethod.apply(this, args).pipe(tap({ error: (error) => logger[type](error) }));
    };

    return descriptor;
  };
}
