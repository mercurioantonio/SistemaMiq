import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Scm101Component } from './scm101.component';

const routes: Routes = [
  { path: '', component: Scm101Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Scm101RoutingModule { }
