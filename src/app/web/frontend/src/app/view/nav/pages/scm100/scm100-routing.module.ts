import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Scm100Component } from './scm100.component';

const routes: Routes = [
  { path: '', component: Scm100Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Scm100RoutingModule { }
