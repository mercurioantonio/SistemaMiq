import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Scm8Component } from './scm8.component';

const routes: Routes = [
  { path: '', component: Scm8Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Scm8RoutingModule { }
