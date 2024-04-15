import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from 'src/app/view/shared/shared.module';
import { Scm104Component } from './scm104.component';
import { Scm104RoutingModule } from './scm104-routing.module';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';



@NgModule({
  imports: [
    CommonModule,
    Scm104RoutingModule,
    SharedModule,
    NzDescriptionsModule,
    NzDatePickerModule,
  ],
  declarations: [Scm104Component],
  exports: [Scm104Component]
})
export class Scm104Module { }
