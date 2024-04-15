import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Scm61Component } from './scm61.component';

const routes: Routes = [
  { path: '', component: Scm61Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Scm61RoutingModule { }
