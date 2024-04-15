import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Scm2Component } from './scm2.component';

const routes: Routes = [
  { path: '', component: Scm2Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Scm2RoutingModule { }
