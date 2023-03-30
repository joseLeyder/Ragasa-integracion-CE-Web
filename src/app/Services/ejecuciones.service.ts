import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { EjecucionesView } from '../models/ejecucionesview.interface';


@Injectable({
    providedIn: 'root'
})

export class EjecucionesService{
    url = 'ejecuciones/';

    constructor(private api:ApiService){}

    getEjecucionesView = async (data:any): Promise<any> =>{
        let _ = await this.api.post(this.url + "getallview/", data)
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