import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProdutosListComponent } from './components/produtos-list/produtos-list.component';
import { ProdutoFormComponent } from './components/produto-form/produto-form.component';

const routes: Routes = [
  { path: '', component: ProdutosListComponent },
  { path: 'novo', component: ProdutoFormComponent },
  { path: 'editar/:id', component: ProdutoFormComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class ProdutosModule { }
