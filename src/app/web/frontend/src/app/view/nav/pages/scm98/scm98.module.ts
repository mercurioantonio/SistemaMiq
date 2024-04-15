import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from 'src/app/view/shared/shared.module';
import { Scm98Component } from './scm98.component';
import { Scm98RoutingModule } from './scm98-routing.module';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';



@NgModule({
  imports: [
    CommonModule,
    Scm98RoutingModule,
    SharedModule,
    NzDescriptionsModule,
    NzDatePickerModule,
  ],
  declarations: [Scm98Component],
  exports: [Scm98Component]
})
export class Scm98Module { }
