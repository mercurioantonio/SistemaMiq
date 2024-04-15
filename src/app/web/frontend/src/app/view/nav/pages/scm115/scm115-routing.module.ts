import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Scm115Component } from './scm115.component';

const routes: Routes = [
  { path: '', component: Scm115Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Scm115RoutingModule { }
