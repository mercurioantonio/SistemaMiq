// Used for ng serve
export const environment = {
  production: false,
  server: 'http://localhost:5000',
  contextRoot: '/api/v1/',
  apiVersion: 'v1',
  app_title: 'app_tmpl003',

  //LDAP AUTH
  auth_url: '', //'https://ad-auth.de.dm.pirelli.internal',

  //SSO AUTH
  tenant_id: '', //'dfbc96fe-7e6a-497e-9ba9-23dfd0b63361',
  client_id: '', //'da685843-f09c-4739-9be9-61e45008c608',
  redirect_uri: '',//'http://localhost:4200'
};
