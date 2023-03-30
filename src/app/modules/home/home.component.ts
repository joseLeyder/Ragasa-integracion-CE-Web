import { AfterContentChecked, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from "@angular/platform-browser";
import { StorageService } from 'src/app/Services/storage.service';
import { UserService } from 'src/app/Services/user.service';
import { UtilsService } from 'src/app/Services/utils.service';
import { UsuarioPermisoService } from 'src/app/Services/usuariopermiso.service';
import { delay } from 'rxjs';
import { ConectorService } from 'src/app/Services/conector.service';
import { OAuthService } from 'angular-oauth2-oidc';
import { AppAuthGuard } from 'src/app/guards';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class HomeComponent implements AfterContentChecked {
    public nameSesion = '';
    public info = 'Monitor de integración CornerStone - Brive';
    private styleTapActive = 'color: #006540';
    private styleTapDefault = 'color: gray';
    public colorTap = 'color: gray';
    recargar: boolean = false;

    tabConsultas: boolean = true;
    tabSincronizacion: boolean = true;
    tabUsuarios: boolean = true;

    reloadTabUsuarios: boolean = false;
    reloadTabConsultas: boolean = false;
    reloadTabSincronizacion: boolean = false;

    tabsList = [
        {
            id: 1,
            name: "Consultas",
            enabled: true,
            reload: false,
            permiso: 1
        },
        {
            id: 2,
            name: "Sincronización",
            enabled: true,
            reload: false,
            permiso: 2
        },
        {
            id: 3,
            name: "Usuarios",
            enabled: true,
            reload: false,
            permiso: 3
        }
    ];

    constructor(
        private matIconRegistry: MatIconRegistry,
        private domSerialize: DomSanitizer,
        private cdref: ChangeDetectorRef,
        protected storageService: StorageService,
        private userService: UserService,
        private utils: UtilsService,
        private userPermisosService: UsuarioPermisoService,
        private conector: ConectorService,
        protected auth:AppAuthGuard) {
        this.auth.getValue()
        this.registerIcons();
        setTimeout(() => {
            this.getSesion();
        }, 1000);
    }

    ngAfterContentChecked() {

        this.cdref.detectChanges();

    }

    registerIcons() {
        this.matIconRegistry.addSvgIcon(
            "settings",
            this.domSerialize.bypassSecurityTrustResourceUrl("../../assets/svgicons/settings_black_24dp.svg")
        );
        this.matIconRegistry.addSvgIcon(
            "arrowMenu",
            this.domSerialize.bypassSecurityTrustResourceUrl("../../assets/svgicons/keyboard_arrow_down_black_24dp.svg")
        );
        this.matIconRegistry.addSvgIcon(
            "person",
            this.domSerialize.bypassSecurityTrustResourceUrl("../../assets/svgicons/account_box_black_24dp.svg")
        );
    }

    async getSesion() {
        this.conector.spinner$.next(true);
        let firstName = await this.storageService.getStorage('firstName') + ' ';
        let lastName = await this.storageService.getStorage('lastName') + '';
        this.nameSesion = firstName + lastName;

        let userNameStorage = await this.storageService.getStorage('username') + '';

        let user = await this.userService.getUser(userNameStorage);
        if (user != null) {
            if (user.Estatus) {
                let resultPermisos = await this.userPermisosService.getPermisosByUsuarioId(user.UsuarioId);
                if (resultPermisos.length == 0) {
                    let alert = await this.utils.alertInfo("El usuario no tiene permisos").then(result => {
                        this.logout();
                    })
                } else {
                    await this.storageService.saveStorage("permisos", JSON.stringify(resultPermisos));
                    // delay(1000);
                    //Validate tabs permisions
                    this.tabsList.forEach((item) => {
                        let permiso = resultPermisos.find(x => x.PermisoId == item.permiso)
                        item.enabled = (permiso != null && permiso != undefined);
                    });
                    // this.tabSincronizacion = 
                }
            }
            else {
                let alert = await this.utils.alertInfo("El usuario no se encuentra activo").then(result => {
                    this.logout();
                })
            }
        } else {
            let alert = await this.utils.alertInfo("El usuario no se encuentra registrado").then(result => {
                this.logout();
            })
        }
        this.conector.spinner$.next(false);

    }

    onReload(tab: string) {
        this.tabsList.forEach((item) => {
            if (item.name == tab)
                item.reload = !item.reload;
        });

    }

    logout() {
        this.auth.logout();
    }
}