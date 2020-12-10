import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { PassThrough } from 'stream';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  constructor(private authservice: AuthService) { }

  ngOnInit(): void {
  }

  onloginbuttonclick(email: string, pw: string) {
    this.authservice.login(email, pw).subscribe((res: HttpResponse<any>) => {
      console.log(res);
    })
  }
}
