import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LancamentosListComponent } from './components/lancamentos-list/lancamentos-list.component';

const routes: Routes = [
  { path: '', component: LancamentosListComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class LancamentosModule { }
