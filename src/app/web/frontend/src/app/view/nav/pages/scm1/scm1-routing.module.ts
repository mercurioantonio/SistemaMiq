import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Scm1Component } from './scm1.component';

const routes: Routes = [
  { path: '', component: Scm1Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Scm1RoutingModule { }
