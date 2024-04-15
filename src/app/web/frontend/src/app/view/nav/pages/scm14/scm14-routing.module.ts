import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Scm14Component } from './scm14.component';

const routes: Routes = [
  { path: '', component: Scm14Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Scm14RoutingModule { }
