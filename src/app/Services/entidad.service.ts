import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Entidad } from '../models/entidad.interface';
import { ResponseRequest } from '../utility/responserequest.interface';

@Injectable({
    providedIn: 'root'
})
export class EntidadService{
    url = 'entidad/';

    constructor(private api:ApiService){}

    getEntidades = async (): Promise<Entidad[]> =>{
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
    saveEntidad = async (data: any): Promise<number> => {
      let _ = await this.api.post(this.url + "save/", data)
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

    getCombo = async (): Promise<Entidad[]> =>{
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