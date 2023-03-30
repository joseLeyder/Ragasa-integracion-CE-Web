import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Actividad } from '../models/actividad.interface';


@Injectable({
    providedIn: 'root'
})

export class ActividadService{
    url = 'actividad/';

    constructor(private api:ApiService){}

    getActividadesByIds = async (data:any): Promise<Actividad[]> =>{
        let _ = await this.api.post(this.url + "getAllByIds/",data)
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