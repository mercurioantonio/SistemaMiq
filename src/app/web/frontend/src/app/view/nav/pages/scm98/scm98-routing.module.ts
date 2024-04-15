import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Scm98Component } from './scm98.component';

const routes: Routes = [
  { path: '', component: Scm98Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Scm98RoutingModule { }
