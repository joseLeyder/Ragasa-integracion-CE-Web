import { KeycloakService } from 'keycloak-angular';

export function initializeKeycloak(keycloak: KeycloakService):()=>Promise<boolean> {
    return () => {
        return keycloak.init({
          config: {
            
            url: 'https://oauth.ragasaapps.io/auth',
            realm: 'ragasa',
            clientId: 'middleware-corner-brive'
            // clientId: 'cotizador-bidones'
          },
          initOptions:{
            checkLoginIframe:false,
            checkLoginIframeInterval:25,
            
          }
        });
    }
  }