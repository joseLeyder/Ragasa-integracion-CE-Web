import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AusenteComponent } from './ausente/ausente.component';
import { AppAuthGuard } from './guards';

const routes: Routes = [
  {path:'',redirectTo:'home',pathMatch:'full'},
  {path: 'home',loadChildren: () => import('./modules').then(m=>m.HomeModule),canActivate: [AppAuthGuard]}, //
  {path: 'ausente', component: AusenteComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  
}
