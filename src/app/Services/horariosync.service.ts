import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { HorarioSync } from '../models/horariosync.interface';

@Injectable({
    providedIn: 'root'
})
export class HorarioSyncService{
    url = 'horariosync/';

    constructor(private api:ApiService){}

    getHorarios = async (): Promise<HorarioSync[]> =>{
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