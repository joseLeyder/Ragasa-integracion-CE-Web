import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { EjecucionesView } from 'src/app/models/ejecucionesview.interface';
import { ActividadService } from 'src/app/Services/actividad.service';
import { EjecucionesActividadService } from 'src/app/Services/ejecucionesactividad.service';

@Component({
  selector: 'app-consultas-detalle',
  templateUrl: './consultas-detalle.component.html',
  styleUrls: ['./consultas-detalle.component.scss']
})
export class ConsultasDetalleComponent {
  detalleConsulta: any = {
    EjecucionId: 0,
    Fecha: new Date(),
    Origen: '',
    Destino: '',
    Entidad: '',
    OrigenIcon: '',
    DestinoIcon: ''
  };

  requestStatuses: any[] = [
    {
      StatusId: 200,
      Message: 'Ok',
      Icon: 'success.svg'
    },
    {
      StatusId: 202,
      Message: 'Accepted',
      Icon: 'success.svg'
    },
    {
      StatusId: 400,
      Message: 'Bad request',
      Icon: 'errorfind.svg'
    },
    {
      StatusId: 401,
      Message: 'Unauthorized',
      Icon: 'errorfind.svg'
    }
  ]

  listActividades: any[] = [];
  constructor(public dialogRef: MatDialogRef<ConsultasDetalleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EjecucionesView,
    private ejecucionesActividadService: EjecucionesActividadService,
    private actividadService: ActividadService,
    private sanitizer: DomSanitizer) {
    if (data != null) {
      this.detalleConsulta.EjecucionId = data.EjecucionId
      this.detalleConsulta.Fecha = data.FechaEjecucion;
      this.detalleConsulta.Origen = data.Origen;
      this.detalleConsulta.Destino = data.Destino;
      this.detalleConsulta.Entidad = data.Entidad;
      this.detalleConsulta.OrigenIcon = data.OrigenIcon;
      this.detalleConsulta.DestinoIcon = data.DestinoIcon;
      this.getAllActividades();
    }
  }

  async getAllActividades() {
    let result = await this.ejecucionesActividadService.getEjecucionesActividad(this.detalleConsulta.EjecucionId);

    if (result.length > 0) {
      let detalleActividadesIds: number[] = Array.from(result, x => x.ActividadId);

      let dataIds = {
        ids: detalleActividadesIds
      };

      let resultActividades = await this.actividadService.getActividadesByIds(dataIds);
      console.log(resultActividades);
      

      if(resultActividades.length > 0){

        result.forEach(element => {

          let actividad = resultActividades.find((x:any) => x.ActividadId == element.ActividadId);

          let resultado = this.requestStatuses.find((x:any) => x.StatusId == element.ResponseStatus);

          let detalleActividades: any = {
            Fecha: new Date(element.RequestEjecuta.toLocaleString().replace('Z', '')),
            Accion: actividad ? actividad.Actividad : '',
            Resultado: resultado ? `${element.ResponseStatus} ${resultado.Message}` : 'Unknow',
            ResultadoIcon: resultado ? resultado.Icon : 'errorfind.svg',
            Request: {
              Body: element.RequestBody,
              Name: `Request - ${actividad ? actividad.Actividad : ''}.txt`,
              Type: 'application/octet-stream'
            },
            Response: {
              Body: element.ResponseBody,
              Name: `Response - ${actividad ? actividad.Actividad : ''}.txt`,
              Type: 'application/octet-stream'
            },
            Mensaje: element.Mensaje
          };

          this.listActividades.push(detalleActividades);

        });
      }else{
        //TODO: add error alert
      }

    }
  }

  downloadBody(resultado:any){
    const blob = new Blob([resultado.Body], { type: resultado.Type });

    let a = document.createElement('a');

    a.download = resultado.Name;
    a.href = window.URL.createObjectURL(blob);

    a.click();
  }
}
