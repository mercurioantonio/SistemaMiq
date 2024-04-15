import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Scm10Component } from './scm10.component';

const routes: Routes = [
  { path: '', component: Scm10Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Scm10RoutingModule { }
