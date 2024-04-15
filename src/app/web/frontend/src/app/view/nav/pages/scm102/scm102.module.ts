import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from 'src/app/view/shared/shared.module';
import { Scm102Component } from './scm102.component';
import { Scm102RoutingModule } from './scm102-routing.module';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';



@NgModule({
  imports: [
    CommonModule,
    Scm102RoutingModule,
    SharedModule,
    NzDescriptionsModule,
    NzDatePickerModule,
  ],
  declarations: [Scm102Component],
  exports: [Scm102Component]
})
export class Scm102Module { }
