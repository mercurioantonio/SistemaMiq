import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Scm104Component } from './scm104.component';

const routes: Routes = [
  { path: '', component: Scm104Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Scm104RoutingModule { }
