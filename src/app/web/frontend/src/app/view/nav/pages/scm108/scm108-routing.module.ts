import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Scm108Component } from './scm108.component';

const routes: Routes = [
  { path: '', component: Scm108Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Scm108RoutingModule { }
