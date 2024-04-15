// used for Rancher dev
export const environment = {
  production: true,
  server: '..',
  contextRoot: '/api/v1/',
  apiVersion: 'v1',
  app_title: 'app_tmpl003',

  //LDAP AUTH
  auth_url: 'https://ad-auth.de.dm.pirelli.internal', //'http://host.docker.internal:18081'

  //SSO AUTH
  tenant_id: '', //'dfbc96fe-7e6a-497e-9ba9-23dfd0b63361',
  client_id: '', //'da685843-f09c-4739-9be9-61e45008c608',
  redirect_uri: 'https://app-tmpl003.de.dm.pirelli.internal/context_replaceme/'
};
