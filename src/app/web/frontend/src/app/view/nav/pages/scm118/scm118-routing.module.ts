import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Scm118Component } from './scm118.component';

const routes: Routes = [
  { path: '', component: Scm118Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Scm118RoutingModule { }
