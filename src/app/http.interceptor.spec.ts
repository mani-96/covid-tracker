import { TestBed } from '@angular/core/testing';

import { HttpCallInterceptor } from './http-call.interceptor';

describe('HttpInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      HttpCallInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: HttpCallInterceptor = TestBed.inject(HttpCallInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
