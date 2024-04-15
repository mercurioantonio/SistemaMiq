import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Scm122Component } from './scm122.component';

const routes: Routes = [
  { path: '', component: Scm122Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Scm122RoutingModule { }
