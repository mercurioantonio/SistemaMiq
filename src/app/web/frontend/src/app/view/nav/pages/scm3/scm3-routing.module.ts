import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Scm3Component } from './scm3.component';

const routes: Routes = [
  { path: '', component: Scm3Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Scm3RoutingModule { }
