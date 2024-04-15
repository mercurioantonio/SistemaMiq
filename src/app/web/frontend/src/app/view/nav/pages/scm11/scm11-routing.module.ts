import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Scm11Component } from './scm11.component';

const routes: Routes = [
  { path: '', component: Scm11Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Scm11RoutingModule { }
