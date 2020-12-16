import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss'],
})
export class SignupPageComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void { }
  onSignUpButtonClicked(email: string, pw: string) {
    this.authService.signup(email, pw).subscribe((res: HttpResponse<any>) => {
      // if (res.status === 200) {
      this.router.navigate(['/lists']);
      //   }
      //   console.log(res);
    });
  }
}
