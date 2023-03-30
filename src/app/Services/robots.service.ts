import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
  })
  export class RobotService {
    urlConection=environment.robots;
    // code = environment.codeRobot;
    constructor(private http: HttpClient) { }
  

    sync(url:string, param:any){
        console.log(this.urlConection+url);
        
        return this.http.post(`${this.urlConection}${url}`,param);
    }

    // get(url:string) {
    //   console.log(this.urlConection+url);
    //   return   this.http.get(this.urlConection+url);
    // }
    // getUrl(url:string) {
    //   console.log(this.urlConection+url);
    //   return   this.http.get(this.urlConection+url);
    // }
    // post(url:string,param:any) {
    //   console.log(this.urlConection+url);
    //   return this.http.post(this.urlConection+"/"+url,param);
    // }
    // delete(url:string){
    //   return this.http.delete(this.urlConection+url);
    // }
  }

