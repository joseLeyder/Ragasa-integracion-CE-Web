import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }


  saveStorage(name:string, value:any){
    sessionStorage.setItem(name, value);  
  }
  
  getStorage(name:string){
  return  new Promise(function(resolve, reject) {
    const regresar= sessionStorage.getItem(name)!=null?sessionStorage.getItem(name):'';
    resolve(regresar);
    });
  }

  deleteStorage(name:string){
    sessionStorage.removeItem(name);
  }
}
