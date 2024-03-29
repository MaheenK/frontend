import {
  HttpErrorResponse,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, empty, Subject } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class WebreqinceptorService implements HttpInterceptor {
  constructor(private authservice: AuthService) { }

  refreshingAccessToken: boolean;
  accesstokenrefreshed: Subject<any> = new Subject();


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    request = this.addautheader(request);
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log(error);

        if (error.status === 401) {
          // 401 error so we are unauthorized

          // refresh the access token
          return this.refreshAccessToken().pipe(
            switchMap(() => {
              request = this.addautheader(request);
              return next.handle(request);
            }),
            catchError((err: any) => {
              console.log(err);
              this.authservice.logout();
              return empty();
            })
          );
        }

        return throwError(error);
      })
    );
  }

  refreshAccessToken() {
    if (this.refreshingAccessToken) {
      return new Observable(observer => {
        this.accesstokenrefreshed.subscribe(() => {
          observer.next();
          observer.complete();
        })
      })
    }
    else {
      this.refreshingAccessToken = true;
      return this.authservice.getNewAccessToken().pipe(
        tap(() => {
          this.refreshingAccessToken = false;
          console.log('access token refreshed');
          this.accesstokenrefreshed.next();
        })
      );
    }

  }
  addautheader(request: HttpRequest<any>) {
    const token = this.authservice.getaccesstoken();
    if (token) {
      return request.clone({
        setHeaders: {
          'x-access-token': token,
        },
      });
    }
    return request;
  }
}
