import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Scm28Component } from './scm28.component';

const routes: Routes = [
  { path: '', component: Scm28Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Scm28RoutingModule { }
