import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit, Inject, AfterContentChecked, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Permisos } from 'src/app/models/permisos.interface';
import { User } from 'src/app/models/user.interface';
import { UsuarioPermiso } from 'src/app/models/usuariopermiso.interface';
import { PermisosService } from 'src/app/Services/permisos.service';
import { UserService } from 'src/app/Services/user.service';
import { UsuarioPermisoService } from 'src/app/Services/usuariopermiso.service';
import { UtilsService } from 'src/app/Services/utils.service';
import { StorageService } from 'src/app/Services/storage.service';
import { SystemMessage } from 'src/app/utility/enums/system-message.enum';

export interface UsuarioPermisoView {
  PermisoId: number;
  Permiso: string,
  lbActive: string;
  Active: boolean;
}

@Component({
  selector: 'app-userae',
  templateUrl: './userae.component.html',
  styleUrls: ['./userae.component.scss']
})
export class UseraeComponent implements OnInit {
  //system
  systemMessage = SystemMessage;
  title: string = "Nuevo Usuario";
  viewSpinner = false;

  usuarioId = 0;
  nombreUser = ""
  correoUser = "";
  estatus: boolean = false;
  userName = "";

  allPermisos: Permisos[] = []
  allUsuarioPermisos: UsuarioPermiso[] = []
  allPermisosView: UsuarioPermisoView[] = []

  columns = [
    {
      id: 'IdAcceso',
      value: 'IdAcceso'
    }, {
      id: 'acceso',
      value: 'Accesos'
    }, {
      id: 'permiso',
      value: ''
    }
  ]
  userForm!: FormGroup;
  btnTitle: string = "Guardar";
  lbStatus: string = 'Inactivo'

  constructor(public dialogRef: MatDialogRef<UseraeComponent>,
    private formB: FormBuilder,
    private permisos: PermisosService,
    private userService: UserService,
    private userPermisos: UsuarioPermisoService,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private utils: UtilsService,
    private storage: StorageService) {

    this.userForm = this.initForm();
    if (data != null) {
      this.usuarioId  =    data.UsuarioId;
      this.nombreUser =    data.Nombre;
      this.correoUser =    data.Email;
      this.estatus    =    data.Estatus;
      this.userName   =    data.UserName;
    }else{
      this.usuarioId  =    0;
      this.nombreUser =    '';
      this.correoUser =    '';
      this.estatus    =    false;
      this.userName   =    "";
    }
  }

  ngOnInit(): void {
    this.allPermisos =        []
    this.allUsuarioPermisos = []
    this.allPermisosView =    []
    this.getAllPermisos();
    this.userForm = this.initForm();
    this.title = (this.usuarioId == 0) ? "Nuevo usuario" : "Editar usuario";
  }

  async getAllPermisos() {
    let result = await this.permisos.getPermisos();

    result.forEach((item: any) => {
      this.allPermisosView.push(
        {
          PermisoId: item.PermisoId,
          Permiso:   item.Permiso,
          lbActive:  'Inactivo',
          Active:    false
        }
      );
    });

    if (this.usuarioId != 0) {
      let permisosUsuariosTemp = await this.userPermisos.getPermisosByUsuarioId(this.usuarioId);
      if (permisosUsuariosTemp !== null) {
        this.allPermisosView.forEach((item) => {
          let permisoUsuario = permisosUsuariosTemp.find(x => x.PermisoId == item.PermisoId);
          if (permisoUsuario != null) {
            item.Active = true;
          }
        })
      }
    }
  }

  async save() {
    let userNameStorage = await this.storage.getStorage('username')+'';

    let userData: User = {
      UsuarioId:  this.usuarioId,
      Email:      this.correoUser,
      Nombre:     this.nombreUser,
      Estatus:    this.userForm.controls['status'].value,
      UserName:   this.userName,
      UserAudit:  userNameStorage
    }

    let result = await this.userService.saveUser(userData);
    if (result != null) {
      if(result.codigo == 1){
        this.allPermisosView.forEach((item) => {
          if (item.Active)
            this.allUsuarioPermisos.push(
              { 
                UsuarioID: (this.usuarioId != 0) ? this.usuarioId : result.data.UsuarioId, 
                PermisoId: item.PermisoId 
              });
        });
  
        if(this.usuarioId != 0){
          var resultDeletePermisos = await this.userPermisos.deletePermisosUsuario(
                                                              this.usuarioId);
          if(resultDeletePermisos != null){
            let resullSavePermisos = await this.userPermisos.savePermisosUsuario(
                                                              this.allUsuarioPermisos);
          }
        }else{
          let resullSavePermisos = await this.userPermisos.savePermisosUsuario(
                                                            this.allUsuarioPermisos);
        }
        this.closeDialog(1,this.systemMessage.SUCCESS);
      }else if(result.codigo==2){
        this.closeDialog(2,this.systemMessage.LOSE);
      
      }else if(result.codigo==3){
        this.closeDialog(3,this.systemMessage.USEREXISTS);
      }
      else{
        this.closeDialog(3,this.systemMessage.ERROR);
      }
    }
  }

  changeStatus() {
    let statusValue = !this.userForm.controls['status'].value;
    this.lbStatus = (statusValue) ? 'Activo' : 'Inactivo';
  }

  activePermision(id: number) {
    this.allPermisosView.forEach((item) => {
      if (item.PermisoId == id) {
        console.log('Permiso activado');
        item.Active = !item.Active
        item.lbActive = (item.Active) ? 'Activo' : 'Inactivo'
      }
    });
  }

  initForm(): FormGroup {
    return this.formB.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.email, Validators.required]],
      username: ['',[Validators.required, Validators.minLength(2)]],
      status: [false, [Validators.required]],
    })
  }

  async closeDialog(typeMessage:number,message:string){
    if(typeMessage==1){
      let r = await this.utils.alertSuccess(message).then(resultado => {
        if (resultado.value) {//success
          const dialogRef = UseraeComponent;
          this.dialogRef.close();
  
        } else {
          // Dijeron que no
          //location.reload();
          this.dialogRef.close();
        }
      });
    }else if(typeMessage==2){//infor
      let r = await this.utils.alertInfo(message).then(resultado => {
        if (resultado.value) {
          this.dialogRef.close();
        }
      });
    }else if(typeMessage==3){
      let result = await this.utils.alertDanger("Error",message).then(result =>{
        if(result.value)
          this.dialogRef.close();
      });
    }
  }
}
