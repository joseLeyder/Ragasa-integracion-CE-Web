import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Origenes } from '../models/origenes.interface';

@Injectable({
    providedIn: 'root'
})
export class OrigenesService{
    url = 'origenes/';

    constructor(private api:ApiService){}

    getCombo = async (): Promise<Origenes[]> =>{
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