import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Scm16Component } from './scm16.component';

const routes: Routes = [
  { path: '', component: Scm16Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Scm16RoutingModule { }
