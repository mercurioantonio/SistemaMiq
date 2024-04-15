import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Scm103Component } from './scm103.component';

const routes: Routes = [
  { path: '', component: Scm103Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Scm103RoutingModule { }
