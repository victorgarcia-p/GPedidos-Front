import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PedidosListComponent } from './components/pedidos-list/pedidos-list.component';
import { PedidoFormComponent } from './components/pedido-form/pedido-form.component';
import { PedidoDetailComponent } from './components/pedido-detail/pedido-detail.component';

const routes: Routes = [
  { path: '', component: PedidosListComponent },
  { path: 'novo', component: PedidoFormComponent },
  { path: 'editar/:id', component: PedidoFormComponent },
  { path: 'detalhes/:id', component: PedidoDetailComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class PedidosModule { }
