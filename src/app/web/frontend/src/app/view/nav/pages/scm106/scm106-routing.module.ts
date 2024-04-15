import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Scm106Component } from './scm106.component';

const routes: Routes = [
  { path: '', component: Scm106Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Scm106RoutingModule { }
