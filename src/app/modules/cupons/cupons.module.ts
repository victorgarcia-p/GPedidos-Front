import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CuponsListComponent } from './components/cupons-list/cupons-list.component';
import { CupomFormComponent } from './components/cupom-form/cupom-form.component';

const routes: Routes = [
  { path: '', component: CuponsListComponent },
  { path: 'novo', component: CupomFormComponent },
  { path: 'editar/:codigo', component: CupomFormComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class CuponsModule { }
