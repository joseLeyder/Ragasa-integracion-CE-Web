import { Component } from '@angular/core';
import { faPen, faPlus } from '@fortawesome/free-solid-svg-icons';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { EntidadService } from 'src/app/Services/entidad.service';
import { Entidad } from 'src/app/models/entidad.interface';
import { SincronizacionEditComponent } from '../sincronizacion-edit/sincronizacion-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { EntidadHorarioSyncService } from 'src/app/Services/entidadhorariosync.service';
import { HorarioSyncService } from 'src/app/Services/horariosync.service';
import { HorarioSync } from 'src/app/models/horariosync.interface';
import { ConectorService } from 'src/app/Services/conector.service';
import { RobotService } from 'src/app/Services/robots.service';
import { RobotEnum } from 'src/app/utility/enums/robots.enum';
import { SyncRobotService } from 'src/app/Services/syncrobot.service';
import { SpinnerService } from 'src/app/Services/spinner.service';
import { UtilsService } from 'src/app/Services/utils.service';

export interface EntidadesView {
   EntidadId: number;
   Nombre: string;
   ConfiguracionString: string
}

@Component({
   selector: 'app-sincronizacion',
   templateUrl: './sincronizacion.component.html',
   styleUrls: ['./sincronizacion.component.css']
})
export class SincronizacionComponent {
   robotsEnum = RobotEnum;


   faPen = faPen;

   entidades: Entidad[] = []
   entidadesView: EntidadesView[] = []
   horarioSync: HorarioSync[] = []

   constructor(private matIconRegistry: MatIconRegistry,
      private domSerialize: DomSanitizer,
      private entidadService: EntidadService,
      public dialog: MatDialog,
      private entidadhorarioService: EntidadHorarioSyncService,
      private horarioSyncService: HorarioSyncService,
      private conector: ConectorService,
      private robotService: SyncRobotService,
      private spinnerService: SpinnerService,
      private utils: UtilsService) {
      this.getHorarios();
      setTimeout(() => {
         this.getEntidades();
      }, 1000);
   }

   async getHorarios() {
      let horarios: any[] = await this.horarioSyncService.getHorarios();
      this.horarioSync = horarios;
   }

   async getEntidades() {
      this.spinnerService.show();
      let result = await this.entidadService.getEntidades();
      if (result !== null) {
         this.entidades = result;
         this.entidades.forEach(async element => {
            //TODO: Traer las configuraciones de cada entidad
            let horariosEntidad = await this.entidadhorarioService.getHorariosByEntidadId(element.EntidadId)

            let configuracion = this.getDescription(element, horariosEntidad);

            //TODO: Después de traernos la configuracion de cada una se llena la lista view
            element.ConfiguracionString = configuracion;
         });
      }
      this.spinnerService.hide();
   }

   openDialog(data: Entidad) {
      const dialogRef = this.dialog.open(SincronizacionEditComponent, {
         height: '410px',
         width: '300px',
         data: data
      })

      dialogRef.afterClosed().subscribe(result => {
         if (result)
            this.getEntidades();
      });
   }

   registerIcons() {
      this.matIconRegistry.addSvgIcon(
         "edit",
         faPen
      );
   }

   getDescription(entidad: Entidad, horarios: any[]): any {
      let descripcion = ''
      if (entidad.Lu && entidad.Ma && entidad.Mi && entidad.Ju && entidad.Vi && entidad.Sa && entidad.Do)
         descripcion = 'Lunes a Domingo ';
      else if (entidad.Lu && entidad.Ma && entidad.Mi && entidad.Ju && entidad.Vi && entidad.Sa)
         descripcion = 'Lunes a Sabado ';
      else if (entidad.Lu && entidad.Ma && entidad.Mi && entidad.Ju && entidad.Vi)
         descripcion = 'Lunes a Viernes ';
      else if (entidad.Lu && entidad.Ma && entidad.Mi && entidad.Ju)
         descripcion = 'Lunes a Jueves ';
      else if (entidad.Lu && entidad.Ma && entidad.Mi)
         descripcion = 'Lunes a Miercoles ';
      else if (entidad.Lu && entidad.Ma)
         descripcion = 'Lunes y Martes ';
      else {
         if (entidad.Lu)
            descripcion = descripcion + 'Lunes, ';
         if (entidad.Ma)
            descripcion = descripcion + 'Martes, ';
         if (entidad.Mi)
            descripcion = descripcion + 'Miercoles, ';
         if (entidad.Ju)
            descripcion = descripcion + 'Jueves, ';
         if (entidad.Vi)
            descripcion = descripcion + 'Viernes, ';
         if (entidad.Sa)
            descripcion = descripcion + 'Sabado, ';
         if (entidad.Do)
            descripcion = descripcion + 'Domingo, ';
      }

      descripcion = descripcion + 'a las ';

      horarios.forEach(element => {
         let real = this.horarioSync.find(x => x.HorarioSyncId == element.HorarioSyncId);

         if (real != null) {
            if (horarios.length == 1)
               descripcion = descripcion + real.Horario;
            else if (horarios.indexOf(element) == horarios.length - 1)
               descripcion = descripcion + ' y ' + real.Horario;
            else if (horarios.indexOf(element) == 0)
               descripcion = descripcion + real.Horario;
            else
               descripcion = descripcion + ', ' + real.Horario;
         }
      });
      return descripcion;
   }

   async syncEntidad(id: number, event: any) {
      const button = (event.srcElement.disabled === undefined) ? event.srcElement.parentElement : event.srcElement;
      button.setAttribute('disabled', true);

      this.spinnerService.show();
      const keys = Object.keys;

      let dataRobots: any[] = [];

      for (const role of keys(this.robotsEnum)) {
         const roleAsKey = role as keyof typeof this.robotsEnum;

         let dataRobot = {
            key: role.toString(),
            value: this.robotsEnum[roleAsKey]
         }

         dataRobots.push(dataRobot);
      }
      
      setTimeout(async () => {
         console.log(dataRobots[id].value);
         
         let resultRobot = this.robotService.syncEntidad({ id: id },dataRobots[id].value);
         this.spinnerService.hide();
         let r = await this.utils.alertSuccess("Se inicio la sincronización").then(resultado => {
            if (resultado.value) {//success
            } else {
            }
            button.removeAttribute('disabled');
          });
       }, 1000);
      
   }
}