import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UtilsService } from '../Services/utils.service';
import { delay} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class PermissionsGuard implements CanActivate {
  constructor(private util:UtilsService){

  }
  /*canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.validationUserRol()){
      return true;
    }
    this.util.alertQuestionPermissions('No tienes permisos para acceder a este apartado del sistema favor de validar con tu administrador.');
    return false;
  }*/
  canActivate = async ( route: ActivatedRouteSnapshot): Promise<any> => {
    this.util.clog("veamos",route.data?.['allowedRoles'][0]);
    const menu = route.data?.['allowedRoles'][0];
    if(await this.validationUserRol(menu)){
      return true;
    }
    //this.util.alertQuestionPermissionsRedirect('No tienes permisos para acceder a este apartado del sistema favor de validar con tu administrador.');
    return false;
  }
 
  validationUserRol(menu:any): Promise<boolean> {
    return new Promise((resolve, reject) => {
    // const _l = this.util.validationService(menu)
    // resolve(_l)
    })
   
  }
}
