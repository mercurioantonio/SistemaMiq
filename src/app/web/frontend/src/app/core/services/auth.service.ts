import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable, map, tap } from 'rxjs';
import {
  ILoginReq,
  ISSOUser,
  ITokenReq,
  ITokenRes,
  IUserRes,
} from 'src/app/model/interfaces/IAuth';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  headers = { headers: { skip: '' } };
  timer!: any;
  time!: number;

  constructor(
    private http: HttpClient,
    private cookie: CookieService,
    private router: Router
  ) {
    this.setTokenInterval();
  }

  getUser(r_token: string): Observable<IUserRes> {
    const req: ITokenReq = {
      r_token: r_token,
      api_version: environment.apiVersion,
    };
    return this.http.post(
      `${environment.auth_url}${environment.contextRoot}login/r_token`,
      req,
      this.headers
    ) as Observable<IUserRes>;
  }

  getSSOUser(): Observable<ISSOUser> {
    return this.http.get(
      `https://graph.microsoft.com/v1.0/me`
    ) as Observable<ISSOUser>;
  }

  login(user: ILoginReq): Observable<ITokenRes> {
    return this.http.post(
      `${environment.auth_url}${environment.contextRoot}getRefreshToken`,
      user,
      this.headers
    ) as Observable<ITokenRes>;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('r_token') && !!localStorage.getItem('user');
  }

  refreshToken(r_token: string): Observable<ITokenRes> {
    const req: ITokenReq = {
      r_token: r_token,
      api_version: environment.apiVersion,
    };

    return this.http
      .post(
        `${environment.auth_url}${environment.contextRoot}refresh/a_token`,
        req,
        this.headers
      )
      .pipe(
        map((response: Object) => response as ITokenRes),
        tap((response) => {
          localStorage.setItem('a_token', response.a_token);
          localStorage.setItem('ts_exp', response.ts_exp.toString());
          this.cookie.set('a_token', response.a_token, undefined, '/');
          this.setTokenInterval();
        })
      ) as Observable<ITokenRes>;
  }

  setTokenInterval(): void {
    if (localStorage.getItem('ts_exp') && localStorage.getItem('r_token')) {
      const time =
        new Date(localStorage.getItem('ts_exp') as string).getTime() -
        new Date().getTime();

      this.timer = window.setTimeout(() => {
        this.refreshToken(
          localStorage.getItem('r_token') as string
        ).subscribe();
      }, time);
    } else {
      this.logout();
    }
  }

  logout(): void {
    localStorage.clear();
    clearTimeout(this.timer);
    this.cookie.deleteAll();
    this.router.navigateByUrl('login');
  }
}
