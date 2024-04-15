import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Scm120Component } from './scm120.component';

const routes: Routes = [
  { path: '', component: Scm120Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Scm120RoutingModule { }
