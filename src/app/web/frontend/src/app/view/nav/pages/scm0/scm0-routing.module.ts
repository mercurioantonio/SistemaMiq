import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Scm0Component } from './scm0.component';

const routes: Routes = [
  { path: '', component: Scm0Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Scm0RoutingModule { }
