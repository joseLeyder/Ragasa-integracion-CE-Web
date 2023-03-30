import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Dias } from 'src/app/utility/enums/dias.enum';
import { EntidadService } from 'src/app/Services/entidad.service';
import { Entidad } from 'src/app/models/entidad.interface';
import { HorarioSync } from 'src/app/models/horariosync.interface';
import { HorarioSyncService } from 'src/app/Services/horariosync.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { StorageService } from 'src/app/Services/storage.service';
import { EntidadHorarioSyncService } from 'src/app/Services/entidadhorariosync.service';
import { EntidadHorarioSync } from 'src/app/models/entidadhorariosync.interface';
import { UtilsService } from 'src/app/Services/utils.service';
import { SystemMessage } from 'src/app/utility/enums/system-message.enum';


@Component({
   selector: 'app-sincronizacion-edit',
   templateUrl: './sincronizacion-edit.component.html',
   styleUrls: ['./sincronizacion-edit.component.scss']
})
export class SincronizacionEditComponent implements OnInit {
   systemMessage = SystemMessage;
   saved = false;

   dias = Dias;
   diasSelected: undefined
   diasSelectedSave: any[] = []
   banDiasValid = true;
   banHorasValid = true;

   horarioSync: HorarioSync[] = []
   horarioSyncAm: HorarioSync[] = []
   horarioSyncPm: HorarioSync[] = []
   isAm: boolean = true

   inputsHorario: any = []

   titleDialog = "Sincronización automática";
   nombreEntidad = "";

   constructor(public dialogRef: MatDialogRef<SincronizacionEditComponent>,
      @Inject(MAT_DIALOG_DATA) public data: Entidad,
      private entidadService: EntidadService,
      private horarioSyncService: HorarioSyncService,
      public dialog: MatDialog,
      private matIconRegistry: MatIconRegistry,
      private domSerialize: DomSanitizer,
      private storage: StorageService,
      private entidadhorarioService: EntidadHorarioSyncService,
      private utils: UtilsService) {
      if (data != null) {
         this.registerIcons();
         this.getData();
         this.getHorarios();
      }
      dialogRef.disableClose = true;
      dialogRef.backdropClick().subscribe(result => {
         dialogRef.close(this.saved);
       });
       dialogRef.beforeClosed().subscribe(result =>{

       });
   }
   ngOnInit(): void {
      this.nombreEntidad = "Puesto";
   }

   onChange(event: any) {
      this.diasSelected = event.value;
      this.diasSelectedSave = event.value;
      if(event.value.length == 0)
         this.banDiasValid = false;
      else{
         this.banDiasValid = true;
      }
   }

   async save() {
      if(this.banDiasValid && this.banHorasValid){
         let userNameStorage = await this.storage.getStorage('username')+'';
         
         let dataEntidad: Entidad = {
            EntidadId: this.data.EntidadId,
            Nombre: this.data.Nombre,
            Lu: this.diasSelectedSave.find(x => x == 0) ? true : false,
            Ma: this.diasSelectedSave.find(x => x == 1) ? true : false,
            Mi: this.diasSelectedSave.find(x => x == 2) ? true : false,
            Ju: this.diasSelectedSave.find(x => x == 3) ? true : false,
            Vi: this.diasSelectedSave.find(x => x == 4) ? true : false,
            Sa: this.diasSelectedSave.find(x => x == 5) ? true : false,
            Do: this.diasSelectedSave.find(x => x == 6) ? true : false,
            Activo: this.data.Activo,
            UserAudit: userNameStorage,
            ConfiguracionString: ''
         }
         this.diasSelectedSave.forEach(element => {
            if(element==0)
            {
               dataEntidad.Lu = true;
            }
         });

         let resultEntidad = await this.entidadService.saveEntidad(dataEntidad);

         if(resultEntidad != null){
            let horariosNew: EntidadHorarioSync[] =  [];

            this.inputsHorario.forEach((element: any) => {
               let realItem = this.horarioSync.find(
                  x => x.HorarioSyncId == element.HorarioSyncId);

               if(realItem != null){
                  horariosNew.push({EntidadId:this.data.EntidadId,HorarioSyncId:realItem.HorarioSyncId});
               }
            });

            if(horariosNew.length>0){
               let resultDeleteHorarios = await this.entidadhorarioService.deleteEntidadHorarios(this.data.EntidadId);

               let resultSaveHorarios = await this.entidadhorarioService.saveEntidadHorarios(horariosNew);
            }
            this.saved = true;
            this.closeDialog(1,this.systemMessage.SUCCESS)
         }
         else{
            this.closeDialog(3,this.systemMessage.ERROR);
            //TODO: Algunas validaciones de negocio
         }
      }
   }

   getData() {
      let arrar: any = []
      if (this.data.Lu)
         arrar.push(this.dias.LUNES);
      if (this.data.Ma)
         arrar.push(this.dias.MARTES);
      if (this.data.Mi)
         arrar.push(this.dias.MIERCOLES);
      if (this.data.Ju)
         arrar.push(this.dias.JUEVES);
      if (this.data.Vi)
         arrar.push(this.dias.VIERNES);
      if (this.data.Sa)
         arrar.push(this.dias.SABADO);
      if (this.data.Do)
         arrar.push(this.dias.DOMINGO);

         console.log(arrar);
         
      this.diasSelected = arrar;
      this.diasSelectedSave = arrar;
      if(arrar.length > 0 && this.inputsHorario.length == 0)
         {
            this.banHorasValid = false;
         }
   }

   async getHorarios(){
      let horarios : any[] = await this.horarioSyncService.getHorarios();
      this.horarioSync = horarios;

      this.horarioSyncAm = horarios.filter(x => x.Horario == 'AM');
      this.horarioSyncPm = horarios.filter(x => x.Horario == 'PM');

      let horariosUser: any [] = await this.entidadhorarioService.getHorariosByEntidadId(this.data.EntidadId);

      if(horariosUser != null){
         horariosUser.forEach(element => {
            let realItem = this.horarioSync.find(x => x.HorarioSyncId == element.HorarioSyncId)
            if(realItem != null){
               this.inputsHorario.push({
                  EntidadId:this.data.EntidadId,
                  HorarioSyncId:realItem.HorarioSyncId,
                  Orden:realItem.Orden
               })
            }
         });
         if(this.inputsHorario.length>0)
            this.banHorasValid = true;
      }
   }

   addHorario(){
      // let nextHour = 
      if(this.inputsHorario.length > 0)
      {
         this.inputsHorario.sort((a : any,b : any) => a.Orden<b.Orden);
         
         let lastHour = this.inputsHorario[this.inputsHorario.length-1];
         let nextHour = this.horarioSync.find(x => x.Orden==lastHour.Orden+1);

         this.inputsHorario.push(
            {
               EntidadId: this.data.EntidadId,
               HorarioSyncId: nextHour?.HorarioSyncId,
               Orden: nextHour?.Orden
            }
         )
         
      }else{
         this.inputsHorario.push(
            {
               EntidadId: this.data.EntidadId,
               HorarioSyncId: 1,
               Orden: 1
            }
         );
         this.banHorasValid = true;
      }
   }

   removeHorario(horario:any){
      let index = this.inputsHorario.indexOf(horario);

      this.inputsHorario.splice(index,1);

      if(this.inputsHorario.length == 0){
         if(this.diasSelected != undefined)
            this.banHorasValid= false;
      }
   }

   onValuechange(event:any,index:any){
      let rela = this.horarioSync.find(x => x.HorarioSyncId==event);
      let inputItem = this.inputsHorario.find((x : any) => x.HorarioSyncId==event && x.Orden==rela?.Orden)
      if(inputItem != null){
         this.inputsHorario[index].HorarioSyncId = 0;
         this.inputsHorario[index].Orden = 0;
      }else{
         this.inputsHorario[index].Orden = rela?.Orden;
      }
      
   }

   registerIcons(){
      this.matIconRegistry.addSvgIcon(
         "trash",
         this.domSerialize.bypassSecurityTrustResourceUrl("../../assets/svgicons/delete_FILL1_wght400_GRAD0_opsz24.svg")
     );
   }

   async closeDialog(typeMessage:number,message:string){
      if(typeMessage==1){
        let r = await this.utils.alertSuccess(message).then(resultado => {
          if (resultado.value) {//success
            const dialogRef = SincronizacionEditComponent;
            this.dialogRef.close(this.saved);
    
          } else {
            // Dijeron que no
            //location.reload();
            this.dialogRef.close(this.saved);
          }
        });
      }else if(typeMessage==2){//infor
        let r = await this.utils.alertInfo(message).then(resultado => {
          if (resultado.value) {
            this.dialogRef.close(this.saved);
          }
        });
      }else if(typeMessage==3){
        let result = await this.utils.alertDanger("Error",message).then(result =>{
          if(result.value)
            this.dialogRef.close(this.saved);
        });
      }
    }
}
