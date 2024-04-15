import { Component, Injector, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SsoService } from '../core/services/sso.service';
import { isSSO } from './auth/auth-config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
  private readonly _destroying$ = new Subject<void>();
  ssoService?: SsoService;
  constructor(private injector: Injector) {
    if(isSSO){
      this.ssoService = <SsoService>this.injector.get(SsoService);
    }
  }

  ngOnInit() {
    if (isSSO) {
      this.ssoService?.init();
    }
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
