import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Scm117Component } from './scm117.component';

const routes: Routes = [
  { path: '', component: Scm117Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Scm117RoutingModule { }
