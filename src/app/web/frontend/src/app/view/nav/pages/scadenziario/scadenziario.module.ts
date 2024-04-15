import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
//import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FormsModule } from '@angular/forms';

import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { ScadenziarioComponent } from './scadenziario.component';
import { ScadenziarioRoutingModule } from './scadenziario-routing.module';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { NzTableFilterFn, NzTableFilterList, NzTableModule, NzTableSortFn, NzTableSortOrder, NzTableSortersComponent } from 'ng-zorro-antd/table';
import { HttpClientModule } from '@angular/common/http';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';

@NgModule({
  imports: [
    CommonModule,
    ScadenziarioRoutingModule,
    NzTableModule,
    FormsModule,
    NzCarouselModule,
    NzModalModule,
    NzDropDownModule,
    IconsProviderModule,
    HttpClientModule,
    NzDatePickerModule,
    NzPopconfirmModule

  ],  

  declarations: [ScadenziarioComponent],
  exports: [ScadenziarioComponent]
})
export class ScadenziarioModule { }
