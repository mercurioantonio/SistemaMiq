import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from 'src/app/view/shared/shared.module';
import { Scm30Component } from './scm30.component';
import { Scm30RoutingModule } from './scm30-routing.module';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';



@NgModule({
  imports: [
    CommonModule,
    Scm30RoutingModule,
    SharedModule,
    NzDescriptionsModule,
    NzDatePickerModule,
  ],
  declarations: [Scm30Component],
  exports: [Scm30Component]
})
export class Scm30Module { }
