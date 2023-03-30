import { Injectable } from '@angular/core';
import { ResponseRequest } from '../utility/responserequest.interface';
import { RobotService } from './robots.service';

@Injectable({
    providedIn: 'root'
})
export class SyncRobotService{
    // url = 'entidad/';

    constructor(private api:RobotService){}

    syncEntidad = async (data: any, url: string): Promise<any> => {
      let _ = await this.api.sync(url, data)
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