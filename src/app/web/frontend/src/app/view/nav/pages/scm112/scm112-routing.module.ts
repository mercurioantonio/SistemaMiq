import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Scm112Component } from './scm112.component';

const routes: Routes = [
  { path: '', component: Scm112Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Scm112RoutingModule { }
