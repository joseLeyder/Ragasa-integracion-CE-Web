import { Injectable } from '@angular/core';
import { UsuarioPermiso } from '../models/usuariopermiso.interface';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class UsuarioPermisoService {
    url = 'usuariopermiso/';

    constructor(private api: ApiService) { }

    getPermisosByUsuarioId = async (id: number): Promise<UsuarioPermiso[]> => {
        let _ = await this.api.get(this.url + id.toString());
        return new Promise((resolve) => {
            let req = _.subscribe(
                async (res: any) => {
                    req.unsubscribe();
                    resolve(res);
                },
                async (error) => {
                    req.unsubscribe();
                    resolve([]);
                }
            )
        });
    }

    savePermisosUsuario = async (data: any): Promise<boolean> => {
        let _ = await this.api.post(this.url + "saveall/", data);

        return new Promise((resolve) => {
            let req = _.subscribe(
                async (res: any) => {
                    req.unsubscribe();
                    resolve(res);
                },
                async (error) => {
                    req.unsubscribe();
                    resolve(false);
                }
            )
        });
    }

    deletePermisosUsuario = async (id:number): Promise<number> =>{
        let _ = await this.api.delete(this.url+id.toString());

        return new Promise((resolve) => {
            let req = _.subscribe(
                async (res: any) => {
                    req.unsubscribe();
                    resolve(res);
                },
                async (error) => {
                    req.unsubscribe();
                    resolve(0);
                }
            )
        });
    }
}