import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
//import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/view/shared/shared.module';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { NzTableFilterFn, NzTableFilterList, NzTableModule, NzTableSortFn, NzTableSortOrder, NzTableSortersComponent } from 'ng-zorro-antd/table';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { Scm0Component } from './scm0.component';
import { Scm0RoutingModule } from './scm0-routing.module';

@NgModule({
  imports: [
    CommonModule,
    Scm0RoutingModule,
    NzTableModule,
    FormsModule,
    NzCarouselModule,
    NzModalModule,
    NzDropDownModule,
    IconsProviderModule,
    SharedModule,
    NzDescriptionsModule,
  ],

  declarations: [Scm0Component],
  exports: [Scm0Component]
})
export class Scm0Module { }
