import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedModule } from 'src/app/view/shared/shared.module';
import { TrackComponent } from './track.component';
import { TrackRoutingModule } from './track-routing.module';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzCardModule } from 'ng-zorro-antd/card';



@NgModule({
  imports: [
    CommonModule,
    TrackRoutingModule,
    SharedModule,
    NzDescriptionsModule,
    NzDatePickerModule,
    NzCardModule,
  ],
  declarations: [TrackComponent],
  exports: [TrackComponent]
})
export class TrackModule { }
