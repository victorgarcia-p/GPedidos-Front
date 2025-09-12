import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/pedidos', pathMatch: 'full' },
  { 
    path: 'pedidos', 
    loadChildren: () => import('./modules/pedidos/pedidos.module').then(m => m.PedidosModule) 
  },
  { 
    path: 'clientes', 
    loadChildren: () => import('./modules/clientes/clientes.module').then(m => m.ClientesModule) 
  },
  { 
    path: 'produtos', 
    loadChildren: () => import('./modules/produtos/produtos.module').then(m => m.ProdutosModule) 
  },
  { 
    path: 'cupons', 
    loadChildren: () => import('./modules/cupons/cupons.module').then(m => m.CuponsModule) 
  },
  { 
    path: 'lancamentos', 
    loadChildren: () => import('./modules/lancamentos/lancamentos.module').then(m => m.LancamentosModule) 
  }
];