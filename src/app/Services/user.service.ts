import { Injectable } from '@angular/core';
import { User } from '../models/user.interface';
import { ResponseRequest } from '../utility/responserequest.interface';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = "user/";
  usersLoad = false;

  constructor(private api: ApiService) { }

  get isUsersLoad():boolean  {
    return this.usersLoad;
  }

  getUsers = async () => {
    return this.api.get(this.url);
  }

  getUser = async (username: string): Promise<User> => {
    this.usersLoad = false;
    let _ = await this.api.get(this.url + username);
    return new Promise((resolve) => {
      let l = _.subscribe(
        async (res: any) => {
          l.unsubscribe();
          resolve(res);
          this.usersLoad = true;
        },
        async (error) => {
          l.unsubscribe();
          // resolve();
        }
      );
    });
  }
  saveUser = async (data: any): Promise<ResponseRequest> => {
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
}
