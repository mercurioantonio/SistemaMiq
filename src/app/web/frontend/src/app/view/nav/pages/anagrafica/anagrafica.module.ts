import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { NzTableFilterFn, NzTableFilterList, NzTableModule, NzTableSortFn, NzTableSortOrder, NzTableSortersComponent } from 'ng-zorro-antd/table';
import { AnagraficaRoutingModule } from './anagrafica-routing.module';
import { AnagraficaComponent } from './anagrafica.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NgOptimizedImage } from '@angular/common';
import { SharedModule } from 'src/app/view/shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    AnagraficaRoutingModule,
    NzTableModule,
    FormsModule,
    NzCarouselModule,
    NzModalModule,
    NzDropDownModule,
    IconsProviderModule,
    NzInputModule,
    NzDescriptionsModule,
    NzBadgeModule,
    NzAlertModule,
    NgOptimizedImage,
    SharedModule,
  ],

  declarations: [AnagraficaComponent],
  exports: [AnagraficaComponent]
})
export class AnagraficaModule { }
