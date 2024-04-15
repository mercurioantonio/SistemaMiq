import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  MsalModule,
  MsalInterceptor,
  MsalRedirectComponent,
  MsalBroadcastService,
  MsalGuard,
  MsalService,
} from '@azure/msal-angular';
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { environment } from 'src/environments/environment';
import { isSSO, msalConfig } from './auth-config';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MsalModule.forRoot(
      new PublicClientApplication(msalConfig),
      {
        // The routing guard configuration.
        interactionType: InteractionType.Redirect,

        authRequest: {
          scopes: [],
        },
      },
      {
        // MSAL interceptor configuration.
        // The protected resource mapping maps your web API with the corresponding app scopes. If your code needs to call another web API, add the URI mapping here.
        interactionType: InteractionType.Redirect,
        protectedResourceMap: new Map([
          ['https://graph.microsoft.com/v1.0/me', ['']],
          [
            `${environment.server}${environment.contextRoot}`,
            [`${environment.client_id}/.default`],
          ],
        ]),
      }
    ),
  ],
  providers: [
    isSSO
      ? {
          provide: HTTP_INTERCEPTORS,
          useClass: MsalInterceptor,
          multi: true,
        }
      : [],
    MsalService,
    MsalGuard,
    MsalBroadcastService,
  ],
  bootstrap: [MsalRedirectComponent],
})
export class SsoModule {}
