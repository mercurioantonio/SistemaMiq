import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Scm111Component } from './scm111.component';

const routes: Routes = [
  { path: '', component: Scm111Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Scm111RoutingModule { }
