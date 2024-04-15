import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScadenziarioComponent } from './scadenziario.component';

const routes: Routes = [
  { path: '', component: ScadenziarioComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScadenziarioRoutingModule { }
