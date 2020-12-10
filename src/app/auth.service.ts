import { HttpClientModule, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { WebrequestService } from './webrequest.service';
import { shareReplay, tap } from 'rxjs/operators';
import { Pipe } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private webservice: WebrequestService, private router: Router) { }

  login(email: string, password: string) {
    return this.webservice.login(email, password).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        this.setsession(res.body._id, res.headers.get('x-access-token'), res.headers.get('x-refresh-token'));
        console.log('logged in');
      })
    )
  }

  private setsession(userid: string, accesstoken: any, refreshtoken: any) {
    localStorage.setItem('user-id', userid);
    localStorage.setItem('access-token', accesstoken);
    localStorage.setItem('refresh-token', refreshtoken);
  }

  private removesession() {
    localStorage.removeItem('user-id');
    localStorage.removeItem('access-token');
    localStorage.removeItem('refresh-token');
  }

  logout() {
    this.removesession();
  }

  getaccesstoken() {
    return localStorage.getItem('x-access-token');
  }

  setaccesstoken(accesstoken: any) {
    localStorage.setItem('x-access-token', accesstoken);
  }

  getrefreshtoken() {
    return localStorage.getItem('x-refresh-token');
  }

}
