import { Component } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  UntypedFormArray,
  UntypedFormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { TrackService } from 'src/app/core/services/track.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzFormLayoutType } from 'ng-zorro-antd/form';
import { ScambioService } from 'src/app/core/services/scambio';
import { getISOWeek } from 'date-fns';
import { en_US, NzI18nService, zh_CN } from 'ng-zorro-antd/i18n';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-scm11',
  templateUrl: './scm11.component.html',
  styleUrls: ['./scm11.component.less']
})
export class Scm11Component {

  validateForm!: UntypedFormGroup;
    data: any;
    y_integrita: any;
    y_conformita: any;
    confirm: any;
    selectedMiq: any;
    dataframeData: any;  
    status: any;

    pt_int_A: any;
    pt_int_B: any;
    pt_int_C: any;
    pt_int_D: any;
    pt_int_E: any;
    pt_int_F: any;

    scm: any;
    toll_tecnica_stabilita: any;
    toll_tecnica_ripetibilita: any;
    esito_x: any;
    esito_r: any;
    isVisible_ok = false;
    isVisible_ko = false;
    y_rif: any;
    T_pre: any;

    dataframeCampione: any; 
    status_campione: any;   

    myCheckAll: any;
    myCheckUser:any;

    constructor(private message: NzMessageService, private fb: FormBuilder, private service: TrackService, private router:Router, private scambio:ScambioService) { }

    ngOnInit(): void {
      this.scambio.selectedMiq$.subscribe((test: any) => {
        this.selectedMiq = test;
        console.log("scm11.component.ts chiama getAnagrafica di: ", this.selectedMiq)
        this.service.getAnagrafica(this.selectedMiq).subscribe((anagrafica) => { 
        this.dataframeData = anagrafica.anagrafica_json[0]
        this.status = anagrafica.status
        console.log("scm11.component.ts riceve l'anagrafica di: ",this.selectedMiq, "con status: ",this.status, this.dataframeData)
        this.scm = this.dataframeData.scm
        this.toll_tecnica_stabilita = this.dataframeData.toll_tecnica_stabilita
        this.toll_tecnica_ripetibilita = this.dataframeData.toll_tecnica_ripetibilita
        this.pt_int_A = this.dataframeData.pt_int_A
        this.pt_int_B = this.dataframeData.pt_int_B
        this.pt_int_C = this.dataframeData.pt_int_C
        this.pt_int_D = this.dataframeData.pt_int_D 
        this.pt_int_E = this.dataframeData.pt_int_E
        this.pt_int_F = this.dataframeData.pt_int_F 
        this.y_rif = this.dataframeData.y_rif
        this.T_pre = this.dataframeData.T_pre
        console.log("La scm e: ", this.scm)
      });
      });   
      this.validateForm = this.fb.group({
//      cid: [[], [Validators.required,Validators.pattern("^[0-9]*$"),Validators.minLength(8), Validators.maxLength(8)]],
        cod_miq: [[], [Validators.required]],
        data: [null, [Validators.required]],
        y_integrita: [[], [Validators.required]],
        y_conformita: [[], [Validators.required]],

        scm: [[this.scm]],
        toll_tecnica_stabilita: [[this.toll_tecnica_stabilita]],
        toll_tecnica_ripetibilita: [[this.toll_tecnica_ripetibilita]],
        pt_int_A: [[this.pt_int_A]],
        pt_int_B: [[this.pt_int_B]],
        pt_int_C: [[this.pt_int_C]],
        pt_int_D: [[this.pt_int_D]],
        pt_int_E: [[this.pt_int_E]],
        pt_int_F: [[this.pt_int_F]],
        y_rif: [[this.y_rif]],
        T_pre: [[this.T_pre]],
        confermato: [[], []],
        data_validazione: [[], []]
      });
     
    }

    index: any;

    id(index:any){
      this.index = index    
    }
  
    dataChanged(newObj: any) {
      if (newObj == 'false') {
        this.validateForm.get('val_calib_'+ this.index)?.clearValidators();
        this.validateForm.get('val_calib_master_'+ this.index)?.clearValidators();
        this.validateForm.get('val_calib_'+ this.index)?.updateValueAndValidity();
        this.validateForm.get('val_calib_master_'+ this.index)?.updateValueAndValidity();
      }
    }

    submitForm(): void {
      if (this.validateForm.valid) {
        if(sessionStorage.getItem('myCheckAll') && sessionStorage.getItem('myCheckUser')) {
          this.myCheckAll = sessionStorage.getItem('myCheckAll') as string;
          this.myCheckUser = sessionStorage.getItem('myCheckUser') as string;
          console.log(this.myCheckAll)
          console.log(this.myCheckUser)
          if (this.myCheckAll == 'true' && this.myCheckUser == 'false'){
            this.validateForm.value.confermato = true;
            this.validateForm.value.data_validazione = this.validateForm.value.data;
          }
          else {
            this.validateForm.value.confermato = false;
            this.validateForm.value.data_validazione = null;
        }
        const misure =  JSON.stringify(this.validateForm.value);
        console.log('submit', misure);
        this.service.insertTarat({misure}).subscribe((res: any) => {
        console.log('res', res)
        this.esito_x = res.esito_x;
        this.esito_r = res.esito_r;
        });
      }
      else{
        this.message.error("Login fallito", {
          nzDuration: 5000
        });
      }

      } else {
        Object.values(this.validateForm.controls).forEach(control => {
          if (control.invalid) {
            control.markAsDirty();
            control.updateValueAndValidity({ onlySelf: true });
          }
        });
      }
    }

    showModal(): void {
      if (this.validateForm.valid){
        this.submitForm();
        this.showModal_ok();  
      }
      else {
        this.showModal_ko();
      }
    }

    showModal_ok(): void {
      this.isVisible_ok = true;
      this.isVisible_ko = false;
    }
    showModal_ko(): void {
      this.isVisible_ko = true;
      this.isVisible_ok = false;
    }

    handleOk_ko(): void {
      console.log('Button ok clicked!');
      this.isVisible_ok = false;
      this.isVisible_ko = false;
    }  
  
    handleOk(): void {
      console.log('Button ok clicked!');
      this.isVisible_ok = false;
      this.isVisible_ko = false;
      this.router.navigate(['/scadenziario']);
    }
  
    handleCancel(): void {
      console.log('Button cancel clicked!');
    }

    autoTips: Record<string, Record<string, string>> = {
      'zh-cn': {
        required: '必填项'
      },
      en: {
        required: 'Input is required'
      },
      default: {
        email: '邮箱格式不正确/The input is not valid email'
      }
    }

    calculateDueDate(): string {
      const startDate = new Date(this.data);
      const frequencyDays = this.dataframeData.freq_tarat_gg;
      const dueDate = new Date(startDate.getTime() + frequencyDays * 24 * 60 * 60 * 1000);
  
       // Formatta manualmente la data nel formato desiderato
       const day = dueDate.getUTCDate();
       const month = this.getMonthName(dueDate.getUTCMonth());
       const year = dueDate.getUTCFullYear();
   
       const formattedDueDate = `${day} ${month} ${year}`;
   
       return formattedDueDate;
     }
   
     private getMonthName(month: number): string {
       const monthNames = [
         'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
         'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
       ];
   
       return monthNames[month];
     }

     calculateDueWeek(): string {
      const startDate = new Date(this.data);
      const frequencyDays = this.dataframeData.freq_tarat_gg;
      const dueDate = new Date(startDate.getTime() + frequencyDays * 24 * 60 * 60 * 1000);
  
      // Ottieni il numero della settimana relativa alla data di scadenza
      const weekNumber = this.getWeekNumber(dueDate);
  
      return weekNumber.toString();
    }
  
    private getWeekNumber(date: Date): number {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }

     campione(campione_di_riferimento:string): void{
      var campione_di_riferimento = campione_di_riferimento;
      console.log("scm11.component.ts ha individuato questo campione_di riferimento: ", campione_di_riferimento);
      this.service.searchCampione(campione_di_riferimento).subscribe((res) => { 
        console.log('res', res)
        this.dataframeCampione = res.anagrafica_json
        if(res.status == 'success'){
          this.status_campione = true
        }
        else {
          this.status_campione = false
        }
        console.log(this.dataframeCampione)
        console.log(this.status_campione)
      }); 
    }
  
    handleOkCampione(): void {
      console.log('Button ok clicked!');
      this.status_campione = false;
    }  
}
