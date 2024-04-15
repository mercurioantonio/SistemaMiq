import { ChangeDetectorRef, Component, Injector } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoadingService } from 'src/app/core/services/loading.service';
import { IUser } from 'src/app/model/interfaces/IAuth';
import { environment } from 'src/environments/environment';
import { isSSO } from '../auth/auth-config';
import { SsoService } from 'src/app/core/services/sso.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.less'],
})
export class NavComponent {
  isCollapsed = true;
  dropDownOpened = false;
  environment = environment;
  ssoService?: SsoService;

  constructor(
    private auth: AuthService,
    private loadingService: LoadingService,
    private cdr: ChangeDetectorRef,
    private injector: Injector,
    private router: Router
  ) {
    if(isSSO){
      this.ssoService = <SsoService>this.injector.get(SsoService);
    }
  }

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log('Percorso corrente:', event.url);
        if (event.url !== '/' && event.url !== '') {
          sessionStorage.setItem('currentPath', event.url);
        }
      }
    });

    const savedPath = sessionStorage.getItem('currentPath');
    if (savedPath) {
      this.router.navigateByUrl(savedPath);
    }
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  ngAfterViewChecked(): void {
    this.cdr.detectChanges();
  }

  logout(): void {
    if (isSSO) {
      this.ssoService?.logout();
      return;
    }
    this.auth.logout();
  }

  get loading(): boolean {
    return this.loadingService.loading;
  }

  get User(): IUser {
    return JSON.parse(localStorage.getItem('user') as string);
  }
}
