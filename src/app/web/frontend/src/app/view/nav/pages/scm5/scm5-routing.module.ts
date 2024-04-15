import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Scm5Component } from './scm5.component';

const routes: Routes = [
  { path: '', component: Scm5Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Scm5RoutingModule { }
