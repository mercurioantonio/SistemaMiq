import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Scm15Component } from './scm15.component';

const routes: Routes = [
  { path: '', component: Scm15Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Scm15RoutingModule { }
