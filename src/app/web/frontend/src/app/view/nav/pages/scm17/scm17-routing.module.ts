import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Scm17Component } from './scm17.component';

const routes: Routes = [
  { path: '', component: Scm17Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Scm17RoutingModule { }
