import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Scm6Component } from './scm6.component';

const routes: Routes = [
  { path: '', component: Scm6Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Scm6RoutingModule { }
