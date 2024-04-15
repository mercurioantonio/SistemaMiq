import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Scm114Component } from './scm114.component';

const routes: Routes = [
  { path: '', component: Scm114Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Scm114RoutingModule { }
