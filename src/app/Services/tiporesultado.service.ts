import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { TipoResultadoEjecucion } from '../models/tiporesultado.interface';

@Injectable({
    providedIn: 'root'
})
export class TipoResultadoEjecucionService{
    url = 'tiporesultado/';

    constructor(private api:ApiService){}

    getCombo = async (): Promise<TipoResultadoEjecucion[]> =>{
      let _ = await this.api.get(this.url + "combo")
      return new Promise((resolve) => {
        let l = _.subscribe(
          async (res: any) => {
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