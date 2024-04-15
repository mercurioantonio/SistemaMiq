import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Scm113Component } from './scm113.component';

const routes: Routes = [
  { path: '', component: Scm113Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Scm113RoutingModule { }
