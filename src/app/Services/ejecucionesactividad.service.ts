import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { EjecucionesActividad } from '../models/ejecucionesactividad';


@Injectable({
    providedIn: 'root'
})

export class EjecucionesActividadService{
    url = 'ejecucionesactividad/';

    constructor(private api:ApiService){}

    getEjecucionesActividad = async (id:number): Promise<EjecucionesActividad[]> =>{
        let _ = await this.api.get(this.url + `getAllByEjecucionId/${id.toString()}`)
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