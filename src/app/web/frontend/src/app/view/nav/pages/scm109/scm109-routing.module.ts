import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Scm109Component } from './scm109.component';

const routes: Routes = [
  { path: '', component: Scm109Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Scm109RoutingModule { }
