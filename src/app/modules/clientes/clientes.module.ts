import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClientesListComponent } from './components/clientes-list/clientes-list.component';
import { ClienteFormComponent } from './components/cliente-form/cliente-form.component';

const routes: Routes = [
  { path: '', component: ClientesListComponent },
  { path: 'novo', component: ClienteFormComponent },
  { path: 'editar/:id', component: ClienteFormComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class ClientesModule { }
