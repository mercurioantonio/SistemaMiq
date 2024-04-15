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
import {Router} from '@angular/router';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog'; 
import { NzMessageService } from 'ng-zorro-antd/message';



@Component({
  selector: 'app-scm1',
  templateUrl: './scm1.component.html',
  styleUrls: ['./scm1.component.less']
})
export class Scm1Component {

  validateForm!: UntypedFormGroup;
  data: any;
  calibrazione_A: any;
  val_calib_A: any;
  val_calib_master_A: any;
  pt_int_A: any;
  pt_int_B: any;
  pt_int_C: any;
  pt_int_D: any;
  pt_int_E: any;
  pt_int_F: any;
  y1_strum_A: any;
  y2_strum_A: any;
  y3_strum_A: any;
  y4_strum_A: any;
  y5_strum_A: any;
  y1_master_A: any;
  y2_master_A: any;
  y3_master_A: any;
  y4_master_A: any;
  y5_master_A: any;
  confirm: any;
  selectedMiq: any;
  dataframeData: any;  
  status: any;
  cal_option: any;
  scm: any;
  toll_tecnica_stabilita: any;
  toll_tecnica_ripetibilita: any;
  esito_x: any;
  esito_r: any;
  isVisible_ok = false;
  isVisible_ko = false;
  y_rif: any;
  T_pre: any;

  differenze_A: string = '';
  mediaDifferenze_A: number = NaN;
  range_A: number = NaN;

  esito_A_x: any;
  esito_A_r: any;
  esito_A_bias: any;

  predizioni_A: number = NaN;
  out_control: any;
  esito_A_ML: any;
  periodo_prec: any;
  periodo_succ: any;
  esito_out_control: any;
  esito_change: any;
  change_done = 'False';

  dataframeCampione: any; 
  status_campione: any; 

  status_prediction: any;

  myCheckAll: any;
  myCheckUser:any;

  constructor(private message: NzMessageService, private fb: FormBuilder, private service: TrackService, private router:Router, private scambio:ScambioService) { }

  ngOnInit(): void {
    this.scambio.selectedMiq$.subscribe((test: any) => {
      this.selectedMiq = test;
      console.log("scm1.component.ts chiama getAnagrafica di: ", this.selectedMiq)
      this.service.getAnagrafica(this.selectedMiq).subscribe((anagrafica) => { 
      this.dataframeData = anagrafica.anagrafica_json[0]
      this.status = anagrafica.status
      console.log("scm1.component.ts riceve l'anagrafica di: ",this.selectedMiq, "con status: ",this.status, this.dataframeData)
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
      calibrazione_A: [[], [Validators.required]],
      val_calib_A: [[], []],
      val_calib_master_A: [[], []],
      y1_strum_A: [[], [Validators.required]],
      y2_strum_A: [[], [Validators.required]],
      y3_strum_A: [[], [Validators.required]],
      y4_strum_A: [[], [Validators.required]],
      y5_strum_A: [[], [Validators.required]],
      y1_master_A: [[], [Validators.required]],
      y2_master_A: [[], [Validators.required]],
      y3_master_A: [[], [Validators.required]],
      y4_master_A: [[], [Validators.required]],
      y5_master_A: [[], [Validators.required]],
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
    var option1 = 0
    var val1 = 0
      if (this.validateForm.valid) {
        console.log("validateForm.value: ", this.validateForm.value)
        if (this.cal_option == 'true') {        
          this.validateForm.get('val_calib_A')?.setValidators([Validators.required]);
          this.validateForm.get('val_calib_master_A')?.setValidators([Validators.required]);
          option1 = 1
          console.log("option1 true and option1=1")
        }
        
        console.log(option1)

          if (option1 == 1 && this.validateForm.value.val_calib_A && this.validateForm.value.val_calib_master_A){
            console.log("option1=1 e ora val=1")
            val1 = 1
          }

          if(option1 === 0){
            this.validateForm.value.val_calib_A = null;
            this.validateForm.value.val_calib_master_A = null;  
            
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
              this.service.prediction({misure}).subscribe((res: any) => {
                console.log('res', res)
                if (res.statusPrediction == 'success'){
                  this.status_prediction = 'success';
                  this.predizioni_A = Number(res.predizioni_A);
                  this.out_control = res.out_control;
                  this.periodo_prec = res.periodo_prec;
                  this.periodo_succ = res.periodo_succ;
                  this.limitML();
                }
                else {
                  this.status_prediction = 'failed';
                }
              });
            }
            else{
              this.message.error("Login fallito", {
                nzDuration: 5000
              });
            }
          }
          else if(option1 === val1){
            if(option1 === 0){
              this.validateForm.value.val_calib_A = null;
              this.validateForm.value.val_calib_master_A = null;
            }

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
              this.service.prediction({misure}).subscribe((res: any) => {
                console.log('res', res)
                if (res.statusPrediction == 'success'){
                  this.status_prediction = 'success';
                  this.predizioni_A = Number(res.predizioni_A);
                  this.out_control = res.out_control;
                  this.periodo_prec = res.periodo_prec;
                  this.periodo_succ = res.periodo_succ;
                  this.limitML();
                }
                else {
                  this.status_prediction = 'failed';
                }
              });
            }
            else{
              this.message.error("Login fallito", {
                nzDuration: 5000
              });
            }
          }
          else {
            Object.values(this.validateForm.controls).forEach(control => {
              if (control.invalid) {
                control.markAsDirty();
                control.updateValueAndValidity({ onlySelf: true });
              }
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

  limitML(){
    let LSG_x = Number(this.y_rif)+0.15*(Number(this.T_pre.replace(',','.'))/Math.sqrt(5));
    let LIG_x = Number(this.y_rif)-0.15*(Number(this.T_pre.replace(',','.'))/Math.sqrt(5));

    LSG_x = Number(this.y_rif)+(2*0.05*Number(this.T_pre.replace(',','.')));
    LIG_x = Number(this.y_rif)-(2*0.05*Number(this.T_pre.replace(',','.')));

    console.log("out_control", this.out_control)
    // Ordina l'array in base alla data in ordine decrescente
    const currentDate = new Date();
    const filtered_out_control = this.out_control.filter((entry: { data: string | number | Date; }) => new Date(entry.data) < currentDate);
    const sort_out_control = filtered_out_control.sort((a: { data: string | number | Date; }, b: { data: string | number | Date; }) => new Date(b.data).getTime() - new Date(a.data).getTime());

    // Estrai solo le due righe con la data più recente
    const ultimeDueRighe = sort_out_control.slice(0, 2);

    // Ora ultimeDueRighe contiene solo le due righe con la data più recente
    console.log(ultimeDueRighe);

    if (ultimeDueRighe.some((riga: { calibrazione_A: string; calibrazione_B: string; calibrazione_C: string; calibrazione_D: string; }) => riga.calibrazione_A === 'true' || riga.calibrazione_B === 'true' || riga.calibrazione_C === 'true' || riga.calibrazione_D === 'true')) {
      console.log("Almeno una delle due righe contiene una calibrazione con valore 'true'");
      this.esito_out_control = 'True';
    } else {
      console.log("Nessuna delle due righe contiene una calibrazione con valore 'true'");
      this.esito_out_control = 'False';
    }

    if(LIG_x <= this.predizioni_A && this.predizioni_A <= LSG_x ){
      this.esito_A_ML = 'True';
    }
    else{
      this.esito_A_ML = 'False';
    }
  }

  changeFrequency_prec(){
    this.service.changeFrequency(this.dataframeData.scm, this.dataframeData.cod_miq, this.periodo_prec, this.data).subscribe((res: any) => {
      console.log("res: ", res)
      if (res.statusPrediction == 'success'){
        this.esito_change = 'True';
        this.change_done = 'True';
        console.log(this.esito_change)
      }
      else {
        this.esito_change = 'False';
        this.change_done = 'False';
        console.log(this.esito_change)
      }

    });
  }

  changeFrequency_succ(){
    this.service.changeFrequency(this.dataframeData.scm, this.dataframeData.cod_miq, this.periodo_succ, this.data).subscribe((res: any) => {
      console.log("res: ", res)
      if (res.statusPrediction == 'success'){
        this.esito_change = 'True';
        this.change_done = 'True';
      }
      else {
        this.esito_change = 'False';
        this.change_done = 'False';
      }

    });
  }

  calcolaDifferenze() {
    const y1_strum_A = parseFloat((document.getElementById("y1_strum_A") as HTMLInputElement).value.replace(',','.'));
    const y2_strum_A = parseFloat((document.getElementById("y2_strum_A") as HTMLInputElement).value.replace(',','.'));
    const y3_strum_A = parseFloat((document.getElementById("y3_strum_A") as HTMLInputElement).value.replace(',','.'));
    const y4_strum_A = parseFloat((document.getElementById("y4_strum_A") as HTMLInputElement).value.replace(',','.'));
    const y5_strum_A = parseFloat((document.getElementById("y5_strum_A") as HTMLInputElement).value.replace(',','.'));

    const y1_master_A = parseFloat((document.getElementById("y1_master_A") as HTMLInputElement).value.replace(',','.'));
    const y2_master_A = parseFloat((document.getElementById("y2_master_A") as HTMLInputElement).value.replace(',','.'));
    const y3_master_A = parseFloat((document.getElementById("y3_master_A") as HTMLInputElement).value.replace(',','.'));
    const y4_master_A = parseFloat((document.getElementById("y4_master_A") as HTMLInputElement).value.replace(',','.'));
    const y5_master_A = parseFloat((document.getElementById("y5_master_A") as HTMLInputElement).value.replace(',','.'));

    const differenze_A = [y1_strum_A - y1_master_A, y2_strum_A - y2_master_A, y3_strum_A - y3_master_A, y4_strum_A - y4_master_A, y5_strum_A - y5_master_A];
    
    const sommaDifferenze_A = differenze_A.reduce((acc, diff) => acc + diff, 0);
    this.mediaDifferenze_A = differenze_A.length > 0 ? sommaDifferenze_A / differenze_A.length : 0;
    
    const maxDifferenza_A = Math.max(...differenze_A);
    const minDifferenza_A = Math.min(...differenze_A);
    this.range_A = maxDifferenza_A - minDifferenza_A;

    const LSC_x = Number(this.y_rif)+0.15*(Number(this.T_pre.replace(',','.'))/Math.sqrt(5));
    const LIC_x = Number(this.y_rif)-0.15*(Number(this.T_pre.replace(',','.'))/Math.sqrt(5));

    const LSC_r = 2.114*2.326*0.05*Number(this.T_pre.replace(',','.'))
    const LIC_r = 0*2.326*0.05*Number(this.T_pre.replace(',','.'))

    if(LIC_x <= this.mediaDifferenze_A && this.mediaDifferenze_A <= LSC_x ){
      this.esito_A_x = 'True';
    }
    else{
      this.esito_A_x = 'False';
    }
    if(LIC_r <= this.range_A && this.range_A <= LSC_r ){
      this.esito_A_r = 'True';
    }
    else{
      this.esito_A_r = 'False';
    }
    if((y1_strum_A + y2_strum_A + y3_strum_A + y4_strum_A + y5_strum_A) / differenze_A.length <= Number(this.pt_int_A.replace(',','.')) - (Number(this.T_pre.replace(',','.'))/2)  || (y1_strum_A + y2_strum_A + y3_strum_A + y4_strum_A + y5_strum_A) / differenze_A.length >= Number(this.pt_int_A.replace(',','.')) + (Number(this.T_pre.replace(',','.'))/2)){
      this.esito_A_bias = 'True';
    }
    else{
      this.esito_A_bias = 'False';
    }
  }

  isNumeric(val: any): boolean {
    return !isNaN(parseFloat(val)) && isFinite(val);
  }

  
  showModal(): void {
    if (this.esito_A_x == 'True' && this.esito_A_r == 'True' && this.validateForm.valid){
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
    console.log("scm1.component.ts ha individuato questo campione_di riferimento: ", campione_di_riferimento);
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

  
  numericPattern = /^[0-9.,]*$/;
  onInput(event: any) {
    event.target.value = event.target.value.replace(/[^0-9.,]/g, '');
  }

}
