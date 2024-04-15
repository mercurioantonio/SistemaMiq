import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Scm27Component } from './scm27.component';

const routes: Routes = [
  { path: '', component: Scm27Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Scm27RoutingModule { }
