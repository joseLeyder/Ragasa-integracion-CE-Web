import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LayoutComponent } from 'src/app/components/layout/layout.component';
import { MatTabsModule } from '@angular/material/tabs';
import { UserComponent } from './user';
import { TabContainerComponent, TabListComponent } from 'src/app/components/shared/tabs';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';
import { PaginationComponent } from 'src/app/components/shared/pagination/pagination.component';
import { UseraeComponent } from './userae/userae.component';
import { ReactiveFormsModule } from '@angular/forms';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatListModule} from '@angular/material/list';
import { ToggleSwitchComponent } from 'src/app/components/shared/toggle-switch/toggle-switch.component';
import { ToggleSwitchColor } from 'src/app/components/shared/toggle-switch/toggle-switch-color.enum';
import { SincronizacionComponent } from './sincronizacion/sincronizacion.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MatDividerModule} from '@angular/material/divider';
import { SincronizacionEditComponent } from './sincronizacion-edit/sincronizacion-edit.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { SpinnerComponent } from 'src/app/components/shared/spinner/spinner.component';
import { ConsultasComponent } from './consultas/consultas.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import localeEs from "@angular/common/locales/es";
import { registerLocaleData } from "@angular/common";
import { ConsultasDetalleComponent } from './consultas-detalle/consultas-detalle.component';
import { AuthConfigModule } from 'src/config/auth.config.module';
registerLocaleData(localeEs, "es");


@NgModule({
  declarations: [
    HomeComponent,
    LayoutComponent,
    UserComponent,
    TabContainerComponent,
    TabListComponent,
    PaginationComponent,
    UseraeComponent,
    ToggleSwitchComponent,
    SincronizacionComponent,
    SincronizacionEditComponent,
    SpinnerComponent,
    ConsultasComponent,
    ConsultasDetalleComponent
  ],
  imports: [
    HomeRoutingModule,
    CommonModule,
    MatToolbarModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatPaginatorModule,
    MatTableModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatListModule,
    FontAwesomeModule,
    MatDividerModule,
    MatButtonToggleModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule
    // AuthConfigModule
    // MatFormFieldModule
  ],
  bootstrap: [HomeComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  providers: [{ provide: LOCALE_ID, useValue: "es" }]
})

export class HomeModule { }
