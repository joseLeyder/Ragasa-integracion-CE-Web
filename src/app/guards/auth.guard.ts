import { Injectable } from '@angular/core';
import {Router,ActivatedRouteSnapshot,RouterStateSnapshot,} from '@angular/router';
import { KeycloakService, KeycloakAuthGuard } from 'keycloak-angular';

@Injectable({
  providedIn: 'any'
})
export class AppAuthGuard extends KeycloakAuthGuard {
  constructor(
    protected override router: Router,
    protected override keycloakAngular: KeycloakService,
  ) {
    super(router, keycloakAngular);
  }

  isAccessAllowed(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
    let permission;
      if (!this.authenticated) {
        this.keycloakAngular.login().catch((e) => console.error(e));
        return reject(false);
      }

      const requiredRoles: string[] = route.data['roles'];
      if (!requiredRoles || requiredRoles.length === 0) {
        permission = true;
      } else {
        if (!this.roles || this.roles.length === 0) {
        permission = false
        }
        if (requiredRoles.every((role) => this.roles.indexOf(role) > -1))
        {
            permission=true;
        } else {
            permission=false;
        };
      }
      if(!permission){
          this.router.navigate(['/']);
      }
      resolve(permission)
    });
  }

  logout(){
    sessionStorage.clear();
    this.keycloakAngular.logout();
  }

  getValue(){
    this.keycloakAngular.loadUserProfile().then(function(profile) {
      //  console.log(JSON.stringify(profile, null, "  "));
       sessionStorage.setItem('username', profile.username?profile.username:'');  
       sessionStorage.setItem('firstName', profile.firstName?profile.firstName:'');  
       sessionStorage.setItem('lastName', profile.lastName?profile.lastName:'');  
    })
  }
}