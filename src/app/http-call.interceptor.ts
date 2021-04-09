import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators'

@Injectable()
export class HttpCallInterceptor implements HttpInterceptor {

  constructor() {}
  private count = 0;

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (this.count == 0) {
      document.getElementById('spinner-div').style.display = 'block'
    }
    this.count++;
    return next.handle(request).pipe(
      finalize ( () => {
        this.count--;
        if (this.count == 0) {
          document.getElementById('spinner-div').style.display = 'none'
        }
      })
    );
  }
}
