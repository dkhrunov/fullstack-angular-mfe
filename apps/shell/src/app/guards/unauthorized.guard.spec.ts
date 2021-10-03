import { TestBed } from '@angular/core/testing';

import { UnauthorizedGuard } from './unauthorized.guard';

describe('UnauthorizedGuard', () => {
  let guard: UnauthorizedGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UnauthorizedGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
