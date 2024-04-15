import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Scm116Component } from './scm116.component';

const routes: Routes = [
  { path: '', component: Scm116Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Scm116RoutingModule { }
