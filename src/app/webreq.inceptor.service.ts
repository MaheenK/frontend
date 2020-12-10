import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WebreqinceptorService implements HttpInterceptor {

  constructor(private authservice: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    request = this.addautheader(request);
    return next.handle(request).pipe(catchError((error: HttpErrorResponse) => {
      return throwError(error);
    }))
  }

  addautheader(request: HttpRequest<any>) {
    const token = this.authservice.getaccesstoken();
    if (token) {
      return request.clone({
        setHeaders: {
          'x-access-token': token
        }
      })
    }
    return request;
  }

}
