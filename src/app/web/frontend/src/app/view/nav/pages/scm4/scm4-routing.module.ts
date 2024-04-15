import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Scm4Component } from './scm4.component';

const routes: Routes = [
  { path: '', component: Scm4Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Scm4RoutingModule { }
