import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Scm18Component } from './scm18.component';

const routes: Routes = [
  { path: '', component: Scm18Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Scm18RoutingModule { }
