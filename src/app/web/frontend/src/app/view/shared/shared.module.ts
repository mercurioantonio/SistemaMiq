import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasJSChart } from 'src/assets/canvasjs.angular.component';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { IconsProviderModule } from 'src/app/icons-provider.module';
import { NzTableFilterFn, NzTableFilterList, NzTableModule, NzTableSortFn, NzTableSortOrder, NzTableSortersComponent } from 'ng-zorro-antd/table';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@NgModule({
  declarations: [CanvasJSChart],
  imports: [
    CommonModule,
    NzButtonModule,
    NzIconModule,
    NzFormModule,
    NzInputModule,
    FormsModule,
    ReactiveFormsModule,
    NzDatePickerModule,
    NzSelectModule,
    NzSwitchModule,
    NzSpinModule,
    NzAlertModule,
    NzResultModule,
    NzLayoutModule,
    NzMenuModule,
    NzMessageModule,
    NzAvatarModule,
    NzDropDownModule,
    NzDescriptionsModule,
    NzCarouselModule,
    NzModalModule,
    IconsProviderModule,
    NzTableModule,
    FormsModule,
    NzModalModule,
    NzToolTipModule,
  ],
  exports: [
    CommonModule,
    NzButtonModule,
    NzIconModule,
    NzFormModule,
    NzInputModule,
    FormsModule,
    ReactiveFormsModule,
    NzDatePickerModule,
    NzSelectModule,
    NzSwitchModule,
    NzSpinModule,
    NzAlertModule,
    NzResultModule,
    NzLayoutModule,
    NzMenuModule,
    NzMessageModule,
    NzAvatarModule,
    NzDropDownModule,
    NzDescriptionsModule,
    NzCarouselModule,
    NzModalModule,
    IconsProviderModule,
    NzTableModule,
    FormsModule,
    NzModalModule,
    NzToolTipModule,
  ],
})
export class SharedModule {}
