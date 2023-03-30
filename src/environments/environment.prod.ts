export const environment = {
  production: true,
  api:"https://ragasa_integracion_api.consiss.com/api/v1/",
  keycloak:{
    issuer:'https://oauth.ragasaapps.io/auth/realms/ragasa',
    redirectUri: 'http://localhost:4200/',//'https://ragasa-integracion-c-e.azurewebsites.net/',
    clientId:'cotizador-bidones',//'middleware-corner-brive',
    responseType:'code',
    scope:'openid profile email',
    logoutUrl:'https://oauth.ragasaapps.io/auth/realms/ragasa/protocol/openid-connect/logout',
    requireHttps:false,
    showDebugInformation:true,
    disableAtHashCheck:true
  }
};
