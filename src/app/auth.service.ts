import {
  HttpClient,
  HttpClientModule,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { WebrequestService } from './webrequest.service';
import { shareReplay, tap } from 'rxjs/operators';
import { Pipe } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private webservice: WebrequestService,
    private router: Router,
    private http: HttpClient
  ) {}

  login(email: string, password: string) {
    return this.webservice.login(email, password).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        this.setsession(
          res.body._id,
          res.headers.get('x-access-token'),
          res.headers.get('x-refresh-token')
        );
        console.log('logged in');
      })
    );
  }
  signup(email: string, password: string) {
    return this.webservice.signup(email, password).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        this.setsession(
          res.body._id,
          res.headers.get('x-access-token'),
          res.headers.get('x-refresh-token')
        );
        console.log('successfully signed up and logged in');
      })
    );
  }

  private setsession(userid: string, accesstoken: any, refreshtoken: any) {
    localStorage.setItem('user-id', userid);
    localStorage.setItem('x-access-token', accesstoken);
    localStorage.setItem('x-refresh-token', refreshtoken);
  }

  private removesession() {
    localStorage.removeItem('user-id');
    localStorage.removeItem('x-access-token');
    localStorage.removeItem('x-refresh-token');
  }

  logout() {
    this.removesession();
    this.router.navigate(['/login']);
  }
  getUserId() {
    let token = localStorage.getItem('user-id') as string;
    return token;
  }
  getaccesstoken() {
    return localStorage.getItem('x-access-token');
  }

  setaccesstoken(accesstoken: any) {
    localStorage.setItem('x-access-token', accesstoken);
  }

  getrefreshtoken() {
    let token = localStorage.getItem('x-refresh-token') as string;
    return token;
  }
  getNewAccessToken() {
    return this.http
      .get(`${this.webservice.root_url}/users/me/access-token`, {
        headers: {
          'x-refresh-token': this.getrefreshtoken(),
          _id: this.getUserId(),
        },
        observe: 'response',
      })
      .pipe(
        tap((res: HttpResponse<any>) => {
          this.setaccesstoken(res.headers.get('x-access-token'));
        })
      );
  }
}
