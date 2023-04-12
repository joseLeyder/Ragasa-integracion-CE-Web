// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  api:"https://ragasa_integracion_api.consiss.com/api/v1/",
  robots: "https://ragasa-integracion-ce.azurewebsites.net/api/",
  codeRobot: "vXlyl5GDvPTuLwQhzYRapi6sFPzhzwjsWBrhfb4gEctwAzFu_Cs2Ow==",
  keycloak:{
    issuer:'https://oauth.ragasaapps.io/auth/realms/ragasa',
    redirectUri: 'https://ragasa-integracion-c-e.azurewebsites.net/',//'http://localhost:4200/',
    clientId:'middleware-corner-brive',//'cotizador-bidones',
    responseType:'code',
    scope:'openid profile email',
    logoutUrl:'https://oauth.ragasaapps.io/auth/realms/ragasa/protocol/openid-connect/logout',
    requireHttps:true,
    showDebugInformation:true,
    disableAtHashCheck:true
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
