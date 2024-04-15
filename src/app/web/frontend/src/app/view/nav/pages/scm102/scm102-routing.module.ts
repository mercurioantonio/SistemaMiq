import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Scm102Component } from './scm102.component';

const routes: Routes = [
  { path: '', component: Scm102Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Scm102RoutingModule { }
