import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, finalize, of, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { LoadingService } from '../services/loading.service';
import { isSSO } from 'src/app/view/auth/auth-config';
import { SsoService } from '../services/sso.service';

@Injectable()
export class AccessTokenInterceptor implements HttpInterceptor {
  isLDAP = !!environment.auth_url;
  ssoService?: SsoService;
  constructor(
    private auth: AuthService,
    private message: NzMessageService,
    private loadingService: LoadingService,
    private injector: Injector 
  ) {
    if(isSSO){
      this.ssoService = <SsoService>this.injector.get(SsoService);
    }
  }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let req = request;
    this.loadingService.loading = !request.headers?.has('skipLoader');

    if ((this.isLDAP || isSSO) && !request.headers?.has('skip')) {
      req = this.addAccessToken(request);
    }

    return next.handle(req).pipe(
      catchError((e) => this.handleError(e)),
      finalize(() => (this.loadingService.loading = false))
    );
  }

  addAccessToken(request: HttpRequest<unknown>): HttpRequest<unknown> {
    let token = localStorage.getItem('a_token') as string;

    return request.clone(
      this.isLDAP && !isSSO
        ? {
            setHeaders: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        : {
            setHeaders: {
              sso: ``,
            },
          }
    );
  }

  handleError(err: HttpErrorResponse): Observable<any> {
    switch (err.status) {
      case 401:
        this.handle401();
        this.message.error(err.error?.msg || 'USER UNAUTHORIZED');
        break;

      case 500:
        this.message.error(err.error?.msg || '500 INTERNAL SERVER ERROR');
        break;

      default:
        this.message.error(err.error?.msg || `ERROR ${err.status}`);
        break;
    }
    return throwError(() => err);
  }

  handle401(): void {
    if (isSSO) {
      this.ssoService?.logout();
    }

    if (this.isLDAP) {
      this.auth.logout();
    }
  }
}
