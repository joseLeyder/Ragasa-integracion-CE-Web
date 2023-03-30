import { Injectable } from '@angular/core';
import { Permisos } from '../models/permisos.interface';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class PermisosService{
    url = 'permisos/';

    constructor(private api:ApiService){}

    getPermisos = async (): Promise<Permisos[]> =>{
        let _ = await this.api.get(this.url);
        return new Promise((resolve) => {
            let l = _.subscribe(
              async(res: any) => {
                l.unsubscribe();
                resolve(res);
              },
              async (error) => {
                l.unsubscribe();
                // resolve();
              }
            );
        });
    }
}