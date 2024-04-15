import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';
import { isSSO } from 'src/app/view/auth/auth-config';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private auth: AuthService, private router: Router) {}

  authGuard(): boolean {
    if (!!isSSO || !environment.auth_url || this.auth.isLoggedIn()) {
      return true;
    } else {
      this.auth.logout();
      return false;
    }
  }

  loginGuard(): boolean {
    return !isSSO && !!environment.auth_url && !this.auth.isLoggedIn();
  }
}
