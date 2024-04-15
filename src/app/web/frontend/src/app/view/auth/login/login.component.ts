import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { ILoginReq } from 'src/app/model/interfaces/IAuth';
import { environment } from 'src/environments/environment';
import { Buffer } from 'buffer';
import { Router } from '@angular/router';
import { concatMap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { trigger } from '@angular/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class LoginComponent {
  passwordVisible = false;
  email: string = '';
  password: string = '';
  loading = false;
  loginSuccess = false;
  environment = environment;

  constructor(
    private auth: AuthService,
    private router: Router,
    private cookie: CookieService
  ) {
  }

  ngOnInit(): void {}

  login(): void {
    this.loading = true;

    const user: ILoginReq = {
      api_version: environment.apiVersion,
      sid: 'a8108ba4-fe60-42d1-9a44-439450aee1e9',
      USER_NAME: this.email,
      PASSWORD: Buffer.from(this.email + this.password).toString('base64'),
    };

    this.auth
      .login(user)
      .pipe(concatMap((res) => this.auth.getUser(res.r_token)))
      .subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            this.loginSuccess = true;

            localStorage.setItem('r_token', response.r_token);
            localStorage.setItem(
              'user',
              JSON.stringify(response.um_data.currentUser)
            );
            localStorage.setItem('a_token', response.a_token);
            localStorage.setItem('ts_exp', response.um_data.ts_exp.toString());
            this.cookie.set('a_token', response.a_token, undefined, '/');
            this.auth.setTokenInterval();

            setTimeout(() => {
              this.router.navigate(['track']);
            }, 8000);
          }
        },
        error: (err) => {
          this.loading = false;
        },
      });
  }
}
