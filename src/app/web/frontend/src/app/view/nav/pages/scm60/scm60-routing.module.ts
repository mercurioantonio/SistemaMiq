import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Scm60Component } from './scm60.component';

const routes: Routes = [
  { path: '', component: Scm60Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Scm60RoutingModule { }
