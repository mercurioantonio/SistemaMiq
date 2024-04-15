import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Scm121Component } from './scm121.component';

const routes: Routes = [
  { path: '', component: Scm121Component },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Scm121RoutingModule { }
