import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Scm12Component } from './scm12.component';

const routes: Routes = [
  { path: '', component: Scm12Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Scm12RoutingModule { }
