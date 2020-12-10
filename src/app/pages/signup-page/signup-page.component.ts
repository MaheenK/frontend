import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss'],
})
export class SignupPageComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {}
  onSignUpButtonClicked(email: string, pw: string) {
    this.authService.signup(email, pw).subscribe((res: HttpResponse<any>) => {
      console.log(res);
    });
  }
}
