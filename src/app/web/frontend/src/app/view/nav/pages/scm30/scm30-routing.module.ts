import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Scm30Component } from './scm30.component';

const routes: Routes = [
  { path: '', component: Scm30Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Scm30RoutingModule { }
