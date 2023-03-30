import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EjecucionesView } from 'src/app/models/ejecucionesview.interface';
import { Entidad } from 'src/app/models/entidad.interface';
import { Origenes } from 'src/app/models/origenes.interface';
import { TipoResultadoEjecucion } from 'src/app/models/tiporesultado.interface';
import { EjecucionesService } from 'src/app/Services/ejecuciones.service';
import { EntidadService } from 'src/app/Services/entidad.service';
import { OrigenesService } from 'src/app/Services/origenes.service';
import { SpinnerService } from 'src/app/Services/spinner.service';
import { TipoResultadoEjecucionService } from 'src/app/Services/tiporesultado.service';
import { ConsultasDetalleComponent } from '../consultas-detalle/consultas-detalle.component';

@Component({
  selector: 'app-consultas',
  templateUrl: './consultas.component.html',
  styleUrls: ['./consultas.component.scss']
})
export class ConsultasComponent implements OnInit, OnChanges {
  @Input() reload: boolean = false;
  now = new Date()

  //Filter
  origenesSelected = 0;
  comboOrigenes: Origenes[] = [];
  entidadSelected = 0;
  comboEntidad: Entidad[] = [];
  tipoResultadoSelected = 0;
  comboTipoResultado: TipoResultadoEjecucion[] = [];
  public currentDateFin = this.now.toISOString().substring(0,10)
  public currentDateInicio = ''
  totalRows = 0
  
  //Paginacion
  public current: number = 1;
  public total: number = 0;
  public perPage = 8


  dataSource: EjecucionesView[] = []
  columnNames = [
    {
      id:     'FechaEjecucion',
      value:  'Fecha y hora',
      headerclass: 'headerTable-start',
      cellclass: 'cellTable-start'
    },
    {
      id:     'Origen',
      value:  'Origen',
      headerclass: 'headerTable-origen',
      cellclass: 'cellTable-origen'
    },
    {
      id:'Arrow',
      value:'',
      headerclass: 'arrow-header',
      cellclass: 'arrow-cell'
    },
    {
      id:     'Destino',
      value:  'Destino',
      headerclass: 'headerTable-destino',
      cellclass: 'cellTable-destino'
    },
    {
      id:     'Entidad',
      value:  'Entidad',
      headerclass: 'headerTable-entidad',
      cellclass: 'cellTable-entidad'
    },
    {
      id:     'Resultado',
      value:  'Resultado',
      headerclass: 'headerTable-end',
      cellclass: 'cellTable-end'
    },
    {
      id:     'EjecucionId',
      value:  'EjecucionId',
      headerclass: '',
      cellclass: ''
    },
    {
      id:     'OrigenId',
      value:  'OrigenId',
      headerclass: '',
      cellclass: ''
    },
    {
      id:     'EntidadId',
      value:  'EntidadId',
      headerclass: '',
      cellclass: ''
    },
    {
      id:     'TipoResultadoId',
      value:  'TipoResultadoId',
      headerclass: '',
      cellclass: 'cellTable-end-error'
    },
  ];
  displayedColumns: string[] = []

  constructor(
    private ejecucionesService:EjecucionesService,
    private origenesService: OrigenesService,
    private entidadService:EntidadService,
    private tipoResultadoService:TipoResultadoEjecucionService,
    private spinnerService: SpinnerService,
    public dialog: MatDialog)
  {
    this.comboOrigenes.push({OrigenId:0,Origen:'Seleccione',OrigenIcon:'',Destino:'',DestinoIcon:''});
    this.comboEntidad.push({
      EntidadId: 0, Nombre: 'Seleccione',
      Do: false,
      Lu: false,
      Ma: false,
      Mi: false,
      Ju: false,
      Vi: false,
      Sa: false,
      Activo: false,
      UserAudit: '',
      ConfiguracionString: ''
    })
    this.comboTipoResultado.push({
      TipoResultadoId: 0,
      Descripcion: 'Seleccione',
      Icon: ''
    })

    let dateInicio = this.now.setDate(this.now.getDate()-2);

    this.currentDateInicio = this.now.toISOString().substring(0,10);

    setTimeout(() => {
      this.getAllView();
    }, 600);
    this.getComboOrigenes();
    this.getComboEntidades();
    this.getComboTipoResultado();
  }
  ngOnInit(): void {
    this.columnNames.forEach((current:any, index) => {
      if (current.id !== 'EjecucionId' && current.id != 'EntidadId' 
      && current.id != 'OrigenId' && current.id != 'DestinoId'
      && current.id != 'TipoResultadoId') {
        this.displayedColumns.push(current.id);
      }
    });
  }

  async getAllView(){
    this.spinnerService.show();
    let today = new Date();
    
    let todayString = this.formatDate(today);
    
    if(this.currentDateFin == todayString){
      today.setDate(today.getDate()+1);
      todayString = this.formatDate(today);
    }else{
      todayString = this.currentDateFin;
    }

    let dataGetEjecucionesView: any = {
      FilterOrigen:       this.origenesSelected,
      FilterEntidad:      this.entidadSelected,
      FilterFechaStart:   this.currentDateInicio,
      FilterFechaEnd:     todayString,
      FilterResultado:    this.tipoResultadoSelected,
      Skip:               (this.current-1)*this.perPage,
      Take:               this.perPage
    }

    let ejecucionesView = await this.ejecucionesService.getEjecucionesView(dataGetEjecucionesView);

    if(ejecucionesView != null){
      this.dataSource = ejecucionesView.rows[0];
      console.log(ejecucionesView.rows[0])
      
      this.dataSource.forEach(element => {
        element.FechaEjecucion = new Date(element.FechaEjecucion.toLocaleString().replace('Z',''))
        console.log(element.FechaEjecucion.toLocaleString().replace('Z',''));
        
      });

      console.log(this.dataSource);
      

      this.totalRows = ejecucionesView.count[0][0].count;

      this.total = Math.ceil(this.totalRows/this.perPage);
    }
    this.spinnerService.hide();
  }

  //Combos
  async getComboOrigenes(){
    let result = await this.origenesService.getCombo();

    if(result != null){
      result.forEach(element => {
        this.comboOrigenes.push(element);
      });
    }
  }

  async getComboEntidades(){
    let result = await this.entidadService.getCombo();

    if(result != null){
      result.forEach(element => {
        this.comboEntidad.push(element);
      });
    }
  }

  async getComboTipoResultado(){
    let result = await this.tipoResultadoService.getCombo();

    if(result != null){
      result.forEach(element => {
        this.comboTipoResultado.push(element);
      });
    }
  }

  onChangeSelectOrigenes(select:any){
    this.origenesSelected = select;
    this.current = 1;

    this.getAllView();
  }

  onChangeSelectEntidad(select:any){
    this.entidadSelected = select;
    this.current = 1;

    this.getAllView();
  }

  onChangeSelectResultado(select:any){
    this.tipoResultadoSelected = select;
    this.current = 1;

    this.getAllView();
  }

  dateInicioChange(event:any){
    const value = (event.target as HTMLInputElement).value;
    
    this.currentDateInicio = value;
    this.current = 1;

    this.getAllView();
  }

  dateFinChange(event:any){
    const value = (event.target as HTMLInputElement).value;
    
    this.currentDateFin = value;
    this.current = 1;

    this.getAllView();
  }

  public onGoTo(page: number): void {
    this.current = page

    this.getAllView()
    // this.filtered()
  }

  public onNext(page: number): void {
    this.current = page + 1

    this.getAllView()
    // this.filtered()
  }

  public onPrevious(page: number): void {
    this.current = page - 1

    this.getAllView()
    // this.filtered()
  }

  public paginate(current: number, perPage: number): EjecucionesView[] {
    return [...this.dataSource.slice((current - 1) * perPage).slice(0, perPage)]
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['reload']){
      this.origenesSelected = 0;
      this.entidadSelected = 0;
      this.tipoResultadoSelected = 0;
      this.now = new Date();
      this.currentDateFin = this.now.toISOString().substring(0,10);
      let dateInicio = this.now.setDate(this.now.getDate()-2);
      this.currentDateInicio = this.now.toISOString().substring(0,10);
      this.current = 1;
      this.getAllView()
    }
  }

  openDialog(consulta: any){
    
    const dialogRef = this.dialog.open(ConsultasDetalleComponent,{
      height: '400px',
      width: '800px',
      data:consulta
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  formatDate(date:Date) {
    var d = date,
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

}
