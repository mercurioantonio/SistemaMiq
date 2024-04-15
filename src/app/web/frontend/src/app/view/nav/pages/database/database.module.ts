import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { DatabaseComponent } from './database.component';
import { DatabaseRoutingModule } from './database-routing.module';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { NzTableFilterFn, NzTableFilterList, NzTableModule, NzTableSortFn, NzTableSortOrder, NzTableSortersComponent } from 'ng-zorro-antd/table';
import { HttpClientModule } from '@angular/common/http';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { ScrollingModule } from '@angular/cdk/scrolling';



@NgModule({
  imports: [
    CommonModule,
    DatabaseRoutingModule,
    NzTableModule,
    FormsModule,
    NzCarouselModule,
    NzModalModule,
    NzDropDownModule,
    IconsProviderModule,
    HttpClientModule,
    NzPopconfirmModule,
    NzDatePickerModule,
    NzSelectModule,
    NzPaginationModule,
    ScrollingModule,
  ],  

  declarations: [DatabaseComponent],
  exports: [DatabaseComponent]
})
export class DatabaseModule { }
