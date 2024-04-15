import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Scm9Component } from './scm9.component';

const routes: Routes = [
  { path: '', component: Scm9Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Scm9RoutingModule { }
