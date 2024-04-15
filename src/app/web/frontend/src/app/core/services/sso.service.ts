import { Injectable } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { Observable, concatMap, filter } from 'rxjs';
import { ISSOUser, IUser } from 'src/app/model/interfaces/IAuth';
import { HttpClient } from '@angular/common/http';
import { EventMessage, EventType } from '@azure/msal-browser';

@Injectable({
  providedIn: 'root',
})
export class SsoService {
  constructor(
    private msalAuthService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private http: HttpClient
  ) {}

  getSSOUser(): Observable<ISSOUser> {
    return this.http.get(
      `https://graph.microsoft.com/v1.0/me`
    ) as Observable<ISSOUser>;
  }

  init(): void {
    this.msalAuthService
      .handleRedirectObservable()
      .pipe(concatMap(() => this.getSSOUser()))
      .subscribe({
        next: (_user) => {
          const user: IUser = {
            name: _user.givenName,
            display_name: _user.displayName,
            mail: _user.mail,
            pirelli_user: _user.userPrincipalName.split('@')[0],
            surname: _user.surname,
          };
          localStorage.setItem('user', JSON.stringify(user));
        },
      });

    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_FAILURE)
      )
      .subscribe((result: EventMessage) => {
        this.logout();
      });
  }

  logout(): void {
    window.location.href =
      'https://login.microsoftonline.com/common/oauth2/logout';
  }
}
