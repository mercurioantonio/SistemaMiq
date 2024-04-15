import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Scm119Component } from './scm119.component';

const routes: Routes = [
  { path: '', component: Scm119Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Scm119RoutingModule { }
