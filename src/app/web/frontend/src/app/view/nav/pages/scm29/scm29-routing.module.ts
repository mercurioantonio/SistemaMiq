import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Scm29Component } from './scm29.component';

const routes: Routes = [
  { path: '', component: Scm29Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Scm29RoutingModule { }
