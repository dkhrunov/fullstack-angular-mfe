import { Observable } from 'rxjs';

export const VOID = new Observable<void>((observer) => {
  observer.next();
  observer.complete();
});
