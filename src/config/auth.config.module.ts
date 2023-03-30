import { NgModule, APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { OAuthModule, AuthConfig } from 'angular-oauth2-oidc';

import { AuthConfigService } from './authconfig.service';
import { authConfig, OAuthModuleConfig } from './auth.config';
import localeEs from "@angular/common/locales/es";
import { registerLocaleData } from "@angular/common";
registerLocaleData(localeEs, "es");

export function init_app(authConfigService: AuthConfigService) {
    return () => authConfigService.initAuth();
}

@NgModule({
  imports: [ HttpClientModule, OAuthModule.forRoot() ],
  providers: [
    AuthConfigService,
    { provide: AuthConfig, useValue: authConfig },
    OAuthModuleConfig,
    { 
      provide: APP_INITIALIZER, 
      useFactory: init_app, 
      deps: [ AuthConfigService ], 
      multi: true
    },
    { provide: LOCALE_ID, useValue: "es" }
  ]
})
export class AuthConfigModule { }