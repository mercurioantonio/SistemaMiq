import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from 'src/app/view/shared/shared.module';
import { Scm16Component } from './scm16.component';
import { Scm16RoutingModule } from './scm16-routing.module';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';



@NgModule({
  imports: [
    CommonModule,
    Scm16RoutingModule,
    SharedModule,
    NzDescriptionsModule,
    NzDatePickerModule,
  ],
  declarations: [Scm16Component],
  exports: [Scm16Component]
})
export class Scm16Module { }
