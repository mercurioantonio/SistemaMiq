import {
  LogLevel,
  Configuration,
  BrowserCacheLocation,
} from '@azure/msal-browser';
import { environment } from 'src/environments/environment';

export const isSSO = environment.tenant_id && environment.client_id;

export const msalConfig: Configuration = {
  auth: {
    clientId: environment.client_id,
    authority: `https://login.microsoftonline.com/${environment.tenant_id}`,
    redirectUri: environment.redirect_uri,
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage,
    storeAuthStateInCookie: true,
    secureCookies: true,
  },
  system: {
    loggerOptions: {
      loggerCallback: (logLevel, message, containsPii) => {
        console.log(message);
      },
      logLevel: environment.production ? LogLevel.Error : LogLevel.Info,
      piiLoggingEnabled: false,
    },
  },
};
