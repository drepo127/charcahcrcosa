import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IniciComponent } from './inici/inici.component';
import {CestaComponent} from "./cesta/cesta.component";
import {FormulariComponent} from "./formulari/formulari.component";
import {ContacteComponent} from "./contacte/contacte.component";
import {TiendaComponent} from "./tienda/tienda.component";
import {CondicionsComponent} from "./condicions/condicions.component";
import {ContrasenyaComponent} from "./contrasenya/contrasenya.component";
import {RegistreComponent} from "./registre/registre.component";
import {UsuarioComponent} from "./usuario/usuario.component";
import {ErrorComponent} from "./error/error.component";
import {ValidacionComponent} from "./validacion/validacion.component";
import {RecuperarComponent} from "./recuperar/recuperar.component";
import { FormulariAdminComponent } from "./formulari-admin/formulari-admin.component";
import { DiagramasComponent } from "./diagramas/diagramas.component";
import {HistorialProductesComponent } from "./historial-productes/historial-productes.component";



export const routes: Routes = [
  { path: '', component: IniciComponent },
  { path: 'inici', component: IniciComponent },
  { path: 'cesta', component: CestaComponent },
  { path: 'formulari', component: FormulariComponent },
  { path: 'contacte', component: ContacteComponent },
  { path: 'tienda', component: TiendaComponent },
  { path: 'condicions', component: CondicionsComponent },
  {path: 'registre', component: RegistreComponent},
  {path: 'usuario', component: UsuarioComponent},
  {path: 'contrasenya', component: ContrasenyaComponent },
  {path: 'validacion', component: ValidacionComponent},
  {path: 'recuperar', component: RecuperarComponent},
  {path: 'Admin', component: FormulariAdminComponent},
  {path: 'diagramas', component: DiagramasComponent},
  {path: 'historial', component: HistorialProductesComponent },
  {path: '404', component: ErrorComponent},
  {path: '**', redirectTo: '/404'}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


