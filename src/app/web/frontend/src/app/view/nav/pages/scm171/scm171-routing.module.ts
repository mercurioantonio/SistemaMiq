import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Scm171Component } from './scm171.component';

const routes: Routes = [
  { path: '', component: Scm171Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Scm171RoutingModule { }
