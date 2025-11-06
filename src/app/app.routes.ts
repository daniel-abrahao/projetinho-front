import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import("./pages/home/home.component").then(m => m.HomeComponent)
  },
  {
    path: 'breeds',
    loadChildren: () => import("./pages/breeds/breeds.routes").then(m => m.routes)
  }
];
