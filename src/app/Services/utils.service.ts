import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }


  async alertSuccess(title:string){
   return  Swal.fire({
      icon: 'success',
      title: title,
      showConfirmButton: false,
      timer: 1500
    })
  }

  async alertDanger(title:string,msg:string){
    return Swal.fire({
      title: title,
      text: msg,
      icon: 'error',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#006540'
    });
  }

  async alertInfo(title:string){
    return Swal.fire(
      'Lo sentimos',
      title,
      'info'
    )
  }
  clog = (algo: any, ...args:any) => {
    if (!environment.production) {
      console.log(algo, ...args)
    }
  }
  redirect(url:any){
    window.location.href =url
  }
}
