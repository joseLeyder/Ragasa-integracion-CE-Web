import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { User } from 'src/app/models/user.interface';
import { ConectorService } from '../../../Services/conector.service';
import { UseraeComponent } from '../userae/userae.component';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/Services/user.service';
import { delay } from 'rxjs';
import { SpinnerService } from 'src/app/Services/spinner.service';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnChanges {
  @Input() active: boolean = false;
  public current: number = 1;
  public total: number = 0;
  public perPage = 10

  dataSource: any;
  dataSourceTemp: any;
  public inputSearch = ''

  users: User[] = []
  usersTemp: User[] = []

  result: any

  displayedColumns: string[] = [];

  columnNames = [{
    id: 'IdUsuario',
    value: 'IdUsuario',

  }, 
  {
    id: 'Nombre',
    value: 'Nombre',
  },
  {
    id: 'UserName',
    value: 'Usuario',
  },
  {
    id: 'Email',
    value: 'Correo',
  },
  {
    id: 'Estatus',
    value: 'Estatus',
  }];

  @ViewChild(MatPaginator) paginator !: MatPaginator;
  @ViewChild(MatSort) sort !: MatSort;
  constructor(
    private conector: ConectorService,
    public dialog: MatDialog,
    private user: UserService,
    private spinnerService: SpinnerService
  ) {
    setTimeout(() => {
      this.getAll();
    }, 500);
  }
  ngOnInit(): void {
    this.columnNames.forEach((current, index) => {
      if (current.id !== 'IdUsuario') {
        this.displayedColumns.push(current.id);
      }
    });

    this.dataSource = this.paginate(this.current, this.perPage)
  }

  filterChange(event: Event) {
    // this.conector.spinner$.next(true);
    const filterValue = (event.target as HTMLInputElement).value;

    this.inputSearch = filterValue;

    this.current = 1;

    this.filtered()
  }

  filtered() {
    this.users = this.usersTemp;

    this.usersTemp = this.usersTemp.filter(
      x => x.Nombre.toLocaleLowerCase().includes(this.inputSearch.toLocaleLowerCase()));

    this.total = Math.ceil(this.usersTemp.length / this.perPage)

    this.dataSource = this.paginate(this.current, this.perPage);

    this.usersTemp = this.users;
  }

  async getAll() {
    this.spinnerService.show();
    let listUser = await this.user.getUsers()
    listUser.subscribe(res => {
      this.result = res;
      this.usersTemp = this.result[0];
      this.usersTemp.sort((a, b) => a.Nombre.localeCompare(b.Nombre));

      this.total = Math.ceil(this.usersTemp.length / this.perPage)

      this.dataSource = this.paginate(this.current, this.perPage);
      this.spinnerService.hide();
    });
    // delay(5000);
    // this.conector.spinner$.next(false);
  }

  openDialogEditar(user: any) {
    const dialogRef = this.dialog.open(UseraeComponent,{
      height: '490px',
      width: '450px',
      data:user
    });
    //this.storage.saveStorage("tipoModal","agregar");
    dialogRef.afterClosed().subscribe(result => {
      this.getAll();
      //this.util.clog(`Dialog result: ${result}`);
    });
  }

  openDialogAgregar() {
    const dialogRef = this.dialog.open(UseraeComponent, {
      height: '490px',
      width: '450px',
    });
    //this.storage.saveStorage("tipoModal","agregar");
    dialogRef.afterClosed().subscribe(result => {
      this.getAll();
      //this.util.clog(`Dialog result: ${result}`);
    });
  }

  public onGoTo(page: number): void {
    this.current = page
    this.filtered()
  }

  public onNext(page: number): void {
    this.current = page + 1
    this.filtered()
  }

  public onPrevious(page: number): void {
    this.current = page - 1
    this.filtered()
  }

  public paginate(current: number, perPage: number): User[] {
    return [...this.usersTemp.slice((current - 1) * perPage).slice(0, perPage)]
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['active']){
      this.inputSearch = "";
      this.current = 1;
      this.getAll()
    }
  }
}


