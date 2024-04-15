import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './view/app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { it_IT } from 'ng-zorro-antd/i18n';
import {
  DatePipe,
  HashLocationStrategy,
  LocationStrategy,
  registerLocaleData,
} from '@angular/common';
import it from '@angular/common/locales/it';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsProviderModule } from './icons-provider.module';
import { NotFoundComponent } from './view/not-found/not-found.component';
import { SharedModule } from './view/shared/shared.module';
import { AccessTokenInterceptor } from './core/interceptors/access-token.interceptor';
import { NZ_CONFIG, NzConfig } from 'ng-zorro-antd/core/config';
import { SsoModule } from './view/auth/sso.module';
import { isSSO } from './view/auth/auth-config';
const ngZorroConfig: NzConfig = {
  message: { nzMaxStack: 1 },
};

registerLocaleData(it);

@NgModule({
  declarations: [AppComponent, NotFoundComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IconsProviderModule,
    SharedModule,
    AppRoutingModule,
    isSSO ? SsoModule : [],
  ],

  providers: [
    { provide: NZ_I18N, useValue: it_IT },
    { provide: NZ_CONFIG, useValue: ngZorroConfig },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AccessTokenInterceptor,
      multi: true,
    },
    DatePipe,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
