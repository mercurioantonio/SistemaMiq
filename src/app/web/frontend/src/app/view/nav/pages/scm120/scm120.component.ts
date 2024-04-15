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
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-scm120',
  templateUrl: './scm120.component.html',
  styleUrls: ['./scm120.component.less']
})
export class Scm120Component {
  validateForm!: UntypedFormGroup;
  data: any;
  calibrazione_A: any;
  val_calib_A: any;
  val_calib_master_A: any;
  calibrazione_B: any;
  val_calib_B: any;
  val_calib_master_B: any;
  calibrazione_C: any;
  val_calib_C: any;
  val_calib_master_C: any;
  calibrazione_D: any;
  val_calib_D: any;
  val_calib_master_D: any;
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
  y1_strum_B: any;
  y2_strum_B: any;
  y3_strum_B: any;
  y4_strum_B: any;
  y5_strum_B: any;
  y1_master_B: any;
  y2_master_B: any;
  y3_master_B: any;
  y4_master_B: any;
  y5_master_B: any;
  y1_strum_C: any;
  y2_strum_C: any;
  y3_strum_C: any;
  y4_strum_C: any;
  y5_strum_C: any;
  y1_master_C: any;
  y2_master_C: any;
  y3_master_C: any;
  y4_master_C: any;
  y5_master_C: any;
  y1_strum_D: any;
  y2_strum_D: any;
  y3_strum_D: any;
  y4_strum_D: any;
  y5_strum_D: any;
  y1_master_D: any;
  y2_master_D: any;
  y3_master_D: any;
  y4_master_D: any;
  y5_master_D: any;
  confirm: any;
  selectedMiq: any;
  dataframeData: any;  
  status: any;
  cal_option1:any;
  cal_option2:any;
  cal_option3: any;
  cal_option4: any;
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
  differenze_B: string = '';
  differenze_C: string = '';
  differenze_D: string = '';
  mediaDifferenze_A: number = NaN;
  mediaDifferenze_B: number = NaN;
  mediaDifferenze_C: number = NaN;
  mediaDifferenze_D: number = NaN;
  range_A: number = NaN;
  range_B: number = NaN;
  range_C: number = NaN;
  range_D: number = NaN;

  esito_A_x: any;
  esito_B_x: any;
  esito_C_x: any;
  esito_D_x: any;
  esito_A_r: any;
  esito_B_r: any;
  esito_C_r: any;
  esito_D_r: any;
  esito_A_bias: any;
  esito_B_bias: any;
  esito_C_bias: any;
  esito_D_bias: any;

  dataframeCampione: any; 
  status_campione: any;
  
  myCheckAll: any;
  myCheckUser:any;

  constructor(private message: NzMessageService, private fb: FormBuilder, private service: TrackService, private router:Router, private scambio:ScambioService) { }

  ngOnInit(): void {
    this.scambio.selectedMiq$.subscribe((test: any) => {
      this.selectedMiq = test;
      console.log("scm120.component.ts chiama getAnagrafica di: ", this.selectedMiq)
      this.service.getAnagrafica(this.selectedMiq).subscribe((anagrafica) => { 
      this.dataframeData = anagrafica.anagrafica_json[0]
      this.status = anagrafica.status
      console.log("scm120.component.ts riceve l'anagrafica di: ",this.selectedMiq, "con status: ",this.status, this.dataframeData)
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

      this.y1_master_A = this.pt_int_A
      this.y2_master_A = this.pt_int_A
      this.y3_master_A = this.pt_int_A
      this.y4_master_A = this.pt_int_A
      this.y5_master_A = this.pt_int_A
      this.y1_master_B = this.pt_int_B
      this.y2_master_B = this.pt_int_B
      this.y3_master_B = this.pt_int_B
      this.y4_master_B = this.pt_int_B
      this.y5_master_B = this.pt_int_B
      this.y1_master_C = this.pt_int_C
      this.y2_master_C = this.pt_int_C
      this.y3_master_C = this.pt_int_C
      this.y4_master_C = this.pt_int_C
      this.y5_master_C = this.pt_int_C
      this.y1_master_D = this.pt_int_D
      this.y2_master_D = this.pt_int_D
      this.y3_master_D = this.pt_int_D
      this.y4_master_D = this.pt_int_D
      this.y5_master_D = this.pt_int_D

      this.val_calib_master_A = this.pt_int_A
      this.val_calib_master_B = this.pt_int_B
      this.val_calib_master_C = this.pt_int_C
      this.val_calib_master_D = this.pt_int_D
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
      calibrazione_B: [[], []],
      val_calib_B: [[], []],
      val_calib_master_B: [[], []],
      calibrazione_C: [[], []],
      val_calib_C: [[], []], 
      val_calib_master_C: [[], []], 
      calibrazione_D: [[], []],
      val_calib_D: [[], []], 
      val_calib_master_D: [[], []],  

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

      y1_strum_B: [[], []],
      y2_strum_B: [[], []],
      y3_strum_B: [[], []],
      y4_strum_B: [[], []],
      y5_strum_B: [[], []],
      y1_master_B: [[], []],
      y2_master_B: [[], []],
      y3_master_B: [[], []],
      y4_master_B: [[], []],
      y5_master_B: [[], []],

      y1_strum_C: [[], []],
      y2_strum_C: [[], []],
      y3_strum_C: [[], []],
      y4_strum_C: [[], []],
      y5_strum_C: [[], []],
      y1_master_C: [[], []],
      y2_master_C: [[], []],
      y3_master_C: [[], []],
      y4_master_C: [[], []],
      y5_master_C: [[], []],

      y1_strum_D: [[], []],
      y2_strum_D: [[], []],
      y3_strum_D: [[], []],
      y4_strum_D: [[], []],
      y5_strum_D: [[], []],
      y1_master_D: [[], []],
      y2_master_D: [[], []],
      y3_master_D: [[], []],
      y4_master_D: [[], []],
      y5_master_D: [[], []],

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
    var option2 = 0
    var option3 = 0
    var option4 = 0
    var val1 = 0
    var val2 = 0
    var val3 = 0
    var val4 = 0
    var check_pt_int_B = 0
    var check_pt_int_C = 0
    var check_pt_int_D = 0

    if (this.validateForm.valid) {
      if(this.pt_int_B != ''){
        console.log("sono entato nel check B")
        this.validateForm.get('y1_strum_B')?.setValidators([Validators.required]);
        this.validateForm.get('y2_strum_B')?.setValidators([Validators.required]);
        this.validateForm.get('y3_strum_B')?.setValidators([Validators.required]);
        this.validateForm.get('y4_strum_B')?.setValidators([Validators.required]);
        this.validateForm.get('y5_strum_B')?.setValidators([Validators.required]);
        this.validateForm.get('y1_master_B')?.setValidators([Validators.required]);
        this.validateForm.get('y2_master_B')?.setValidators([Validators.required]);
        this.validateForm.get('y3_master_B')?.setValidators([Validators.required]);
        this.validateForm.get('y4_master_B')?.setValidators([Validators.required]);
        this.validateForm.get('y5_master_B')?.setValidators([Validators.required]);
        this.validateForm.get('calibrazione_B')?.setValidators([Validators.required]);
        check_pt_int_B = 1;
      }
    }

    if (this.validateForm.valid) {
      if(this.pt_int_C != ''){
        console.log("sono entato nel check C")
        this.validateForm.get('y1_strum_C')?.setValidators([Validators.required]);
        this.validateForm.get('y2_strum_C')?.setValidators([Validators.required]);
        this.validateForm.get('y3_strum_C')?.setValidators([Validators.required]);
        this.validateForm.get('y4_strum_C')?.setValidators([Validators.required]);
        this.validateForm.get('y5_strum_C')?.setValidators([Validators.required]);
        this.validateForm.get('y1_master_C')?.setValidators([Validators.required]);
        this.validateForm.get('y2_master_C')?.setValidators([Validators.required]);
        this.validateForm.get('y3_master_C')?.setValidators([Validators.required]);
        this.validateForm.get('y4_master_C')?.setValidators([Validators.required]);
        this.validateForm.get('y5_master_C')?.setValidators([Validators.required]);
        this.validateForm.get('calibrazione_C')?.setValidators([Validators.required]);
        check_pt_int_C = 1;
      }
    }

    if (this.validateForm.valid) {
      if(this.pt_int_D != ''){
        console.log("sono entato nel check D")
        this.validateForm.get('y1_strum_D')?.setValidators([Validators.required]);
        this.validateForm.get('y2_strum_D')?.setValidators([Validators.required]);
        this.validateForm.get('y3_strum_D')?.setValidators([Validators.required]);
        this.validateForm.get('y4_strum_D')?.setValidators([Validators.required]);
        this.validateForm.get('y5_strum_D')?.setValidators([Validators.required]);
        this.validateForm.get('y1_master_D')?.setValidators([Validators.required]);
        this.validateForm.get('y2_master_D')?.setValidators([Validators.required]);
        this.validateForm.get('y3_master_D')?.setValidators([Validators.required]);
        this.validateForm.get('y4_master_D')?.setValidators([Validators.required]);
        this.validateForm.get('y5_master_D')?.setValidators([Validators.required]);
        this.validateForm.get('calibrazione_D')?.setValidators([Validators.required]);
        check_pt_int_D = 1;
      }
    }


    if (this.validateForm.valid) {
       console.log("validateForm.value: ", this.validateForm.value)

       if (this.cal_option1 == 'true') {        
        this.validateForm.get('val_calib_A')?.setValidators([Validators.required]);
        this.validateForm.get('val_calib_master_A')?.setValidators([Validators.required]);
        option1 = 1
        console.log("option1 true and option1=1")
       }
       if (this.cal_option2 == 'true') {
        console.log("option2 true and option2=1")
        this.validateForm.get('val_calib_B')?.setValidators([Validators.required]);
        this.validateForm.get('val_calib_master_B')?.setValidators([Validators.required]);
        option2 = 1
       }
       if (this.cal_option3 == 'true') {
        console.log("option3 true and option3=1")
        this.validateForm.get('val_calib_C')?.setValidators([Validators.required]);
        this.validateForm.get('val_calib_master_C')?.setValidators([Validators.required]);
        option3 = 1
       }
       if (this.cal_option4 == 'true') {
        console.log("option4 true and option4=1")
        this.validateForm.get('val_calib_D')?.setValidators([Validators.required]);
        this.validateForm.get('val_calib_master_D')?.setValidators([Validators.required]);
        option4 = 1
       }
       console.log(option1, option2, option3, option4)

        if (option1 == 1 && this.validateForm.value.val_calib_A && this.validateForm.value.val_calib_master_A){
          console.log("option1=1 e ora val=1")
          val1 = 1
        }
        if (option2 == 1 && this.validateForm.value.val_calib_B && this.validateForm.value.val_calib_master_B){
          console.log("option2=1 e ora val2=1")
          val2 = 1
        }
        if (option3 == 1 && this.validateForm.value.val_calib_C && this.validateForm.value.val_calib_master_C){
          console.log("option3=1 e ora val3=1")
          val3 = 1
        }
        if (option4 == 1 && this.validateForm.value.val_calib_D && this.validateForm.value.val_calib_master_D){
          console.log("option4=1 e ora val4=1")
          val4 = 1
        }

        if (check_pt_int_B === 0){
          console.log("check_pt_int_B = 0")
          this.validateForm.value.y1_strum_B = null;
          this.validateForm.value.y2_strum_B = null;
          this.validateForm.value.y3_strum_B = null;
          this.validateForm.value.y4_strum_B = null;
          this.validateForm.value.y5_strum_B = null;
          this.validateForm.value.y1_master_B = null;
          this.validateForm.value.y2_master_B = null;
          this.validateForm.value.y3_master_B = null;
          this.validateForm.value.y4_master_B = null;
          this.validateForm.value.y5_master_B = null;
          this.validateForm.value.calibrazione_B = null;
          this.validateForm.value.y1_strum_C = null;
          this.validateForm.value.y2_strum_C = null;
          this.validateForm.value.y3_strum_C = null;
          this.validateForm.value.y4_strum_C = null;
          this.validateForm.value.y5_strum_C = null;
          this.validateForm.value.y1_master_C = null;
          this.validateForm.value.y2_master_C = null;
          this.validateForm.value.y3_master_C = null;
          this.validateForm.value.y4_master_C = null;
          this.validateForm.value.y5_master_C = null;
          this.validateForm.value.calibrazione_C = null;
          this.validateForm.value.y1_strum_D = null;
          this.validateForm.value.y2_strum_D = null;
          this.validateForm.value.y3_strum_D = null;
          this.validateForm.value.y4_strum_D = null;
          this.validateForm.value.y5_strum_D = null;
          this.validateForm.value.y1_master_D = null;
          this.validateForm.value.y2_master_D = null;
          this.validateForm.value.y3_master_D = null;
          this.validateForm.value.y4_master_D = null;
          this.validateForm.value.y5_master_D = null;
          this.validateForm.value.calibrazione_D = null;
          if(option1+option2+option3+option4 === 0){
            this.validateForm.value.val_calib_A = null;
            this.validateForm.value.val_calib_B = null;
            this.validateForm.value.val_calib_C = null;
            this.validateForm.value.val_calib_D = null;
            this.validateForm.value.val_calib_master_A = null;
            this.validateForm.value.val_calib_master_B = null;
            this.validateForm.value.val_calib_master_C = null;
            this.validateForm.value.val_calib_master_D = null;

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
          }
          else if(option1+option2+option3+option4 === val1+val2+val3+val4){
            if(option1 === 0){
              this.validateForm.value.val_calib_A = null;
              this.validateForm.value.val_calib_master_A = null;
            }
            if(option2 === 0){
              this.validateForm.value.val_calib_B = null;
              this.validateForm.value.val_calib_master_B = null;
            }
            if(option3 === 0){
              this.validateForm.value.val_calib_C = null;
              this.validateForm.value.val_calib_master_C = null;
            }
            if(option4 === 0){
              this.validateForm.value.val_calib_D = null;
              this.validateForm.value.val_calib_master_D = null;
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
        }
        else if (check_pt_int_C === 0){
          console.log("check_pt_int_C = 0")
          this.validateForm.value.y1_strum_C = null;
          this.validateForm.value.y2_strum_C = null;
          this.validateForm.value.y3_strum_C = null;
          this.validateForm.value.y4_strum_C = null;
          this.validateForm.value.y5_strum_C = null;
          this.validateForm.value.y1_master_C = null;
          this.validateForm.value.y2_master_C = null;
          this.validateForm.value.y3_master_C = null;
          this.validateForm.value.y4_master_C = null;
          this.validateForm.value.y5_master_C = null;
          this.validateForm.value.calibrazione_C = null;
          this.validateForm.value.y1_strum_D = null;
          this.validateForm.value.y2_strum_D = null;
          this.validateForm.value.y3_strum_D = null;
          this.validateForm.value.y4_strum_D = null;
          this.validateForm.value.y5_strum_D = null;
          this.validateForm.value.y1_master_D = null;
          this.validateForm.value.y2_master_D = null;
          this.validateForm.value.y3_master_D = null;
          this.validateForm.value.y4_master_D = null;
          this.validateForm.value.y5_master_D = null;
          this.validateForm.value.calibrazione_D = null;
          if(option1+option2+option3+option4 === 0){
            this.validateForm.value.val_calib_A = null;
            this.validateForm.value.val_calib_B = null;
            this.validateForm.value.val_calib_C = null;
            this.validateForm.value.val_calib_D = null;
            this.validateForm.value.val_calib_master_A = null;
            this.validateForm.value.val_calib_master_B = null;
            this.validateForm.value.val_calib_master_C = null;
            this.validateForm.value.val_calib_master_D = null;

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
          }
          else if(option1+option2+option3+option4 === val1+val2+val3+val4){
            if(option1 === 0){
              this.validateForm.value.val_calib_A = null;
              this.validateForm.value.val_calib_master_A = null;
            }
            if(option2 === 0){
              this.validateForm.value.val_calib_B = null;
              this.validateForm.value.val_calib_master_B = null;
            }
            if(option3 === 0){
              this.validateForm.value.val_calib_C = null;
              this.validateForm.value.val_calib_master_C = null;
            }
            if(option4 === 0){
              this.validateForm.value.val_calib_D = null;
              this.validateForm.value.val_calib_master_D = null;
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
        }
        else if (check_pt_int_D === 0){
          console.log("check_pt_int_D = 0")
          this.validateForm.value.y1_strum_D = null;
          this.validateForm.value.y2_strum_D = null;
          this.validateForm.value.y3_strum_D = null;
          this.validateForm.value.y4_strum_D = null;
          this.validateForm.value.y5_strum_D = null;
          this.validateForm.value.y1_master_D = null;
          this.validateForm.value.y2_master_D = null;
          this.validateForm.value.y3_master_D = null;
          this.validateForm.value.y4_master_D = null;
          this.validateForm.value.y5_master_D = null;
          this.validateForm.value.calibrazione_D = null;
          if(option1+option2+option3+option4 === 0){
            this.validateForm.value.val_calib_A = null;
            this.validateForm.value.val_calib_B = null;
            this.validateForm.value.val_calib_C = null;
            this.validateForm.value.val_calib_D = null;
            this.validateForm.value.val_calib_master_A = null;
            this.validateForm.value.val_calib_master_B = null;
            this.validateForm.value.val_calib_master_C = null;
            this.validateForm.value.val_calib_master_D = null;

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
          }
          else if(option1+option2+option3+option4 === val1+val2+val3+val4){
            if(option1 === 0){
              this.validateForm.value.val_calib_A = null;
              this.validateForm.value.val_calib_master_A = null;
            }
            if(option2 === 0){
              this.validateForm.value.val_calib_B = null;
              this.validateForm.value.val_calib_master_B = null;
            }
            if(option3 === 0){
              this.validateForm.value.val_calib_C = null;
              this.validateForm.value.val_calib_master_C = null;
            }
            if(option4 === 0){
              this.validateForm.value.val_calib_D = null;
              this.validateForm.value.val_calib_master_D = null;
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
    } 
    else {
      if(option1+option2+option3+option4 === 0){
        this.validateForm.value.val_calib_A = null;
        this.validateForm.value.val_calib_B = null;
        this.validateForm.value.val_calib_C = null;
        this.validateForm.value.val_calib_D = null;
        this.validateForm.value.val_calib_master_A = null;
        this.validateForm.value.val_calib_master_B = null;
        this.validateForm.value.val_calib_master_C = null;
        this.validateForm.value.val_calib_master_D = null;

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
      }
      else if(option1+option2+option3+option4 === val1+val2+val3+val4){
        if(option1 === 0){
          this.validateForm.value.val_calib_A = null;
          this.validateForm.value.val_calib_master_A = null;
        }
        if(option2 === 0){
          this.validateForm.value.val_calib_B = null;
          this.validateForm.value.val_calib_master_B = null;
        }
        if(option3 === 0){
          this.validateForm.value.val_calib_C = null;
          this.validateForm.value.val_calib_master_C = null;
        }
        if(option4 === 0){
          this.validateForm.value.val_calib_D = null;
          this.validateForm.value.val_calib_master_D = null;
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
}

calcolaDifferenze_A() {
  const LSC_x = Number(this.y_rif)+0.15*(Number(this.T_pre.replace(',','.'))/Math.sqrt(5));
  const LIC_x = Number(this.y_rif)-0.15*(Number(this.T_pre.replace(',','.'))/Math.sqrt(5));

  const LSC_r = 2.114*2.326*0.05*Number(this.T_pre.replace(',','.'))
  const LIC_r = 0*2.326*0.05*Number(this.T_pre.replace(',','.'))

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

  if (this.toll_tecnica_stabilita.includes('%')){

    var differenze_A = [((y1_strum_A - y1_master_A)/this.pt_int_A.replace(',','.'))*100, ((y2_strum_A - y2_master_A)/this.pt_int_A.replace(',','.'))*100, ((y3_strum_A - y3_master_A)/this.pt_int_A.replace(',','.'))*100, ((y4_strum_A - y4_master_A)/this.pt_int_A.replace(',','.'))*100, ((y5_strum_A - y5_master_A)/this.pt_int_A.replace(',','.'))*100];
    differenze_A = differenze_A.map((valore) => isNaN(valore) || !isFinite(valore) ? 0 : valore);
    var sommaDifferenze_A = differenze_A.reduce((acc, diff) => acc + diff, 0);
  }
  else {

    var differenze_A = [y1_strum_A - y1_master_A, y2_strum_A - y2_master_A, y3_strum_A - y3_master_A, y4_strum_A - y4_master_A, y5_strum_A - y5_master_A];
    var sommaDifferenze_A = differenze_A.reduce((acc, diff) => acc + diff, 0);
  }
  this.mediaDifferenze_A = differenze_A.length > 0 ? sommaDifferenze_A / differenze_A.length : 0;
  
  const maxDifferenza_A = Math.max(...differenze_A);
  const minDifferenza_A = Math.min(...differenze_A);
  this.range_A = maxDifferenza_A - minDifferenza_A;

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
  if((y1_strum_A + y2_strum_A + y3_strum_A + y4_strum_A + y5_strum_A) / differenze_A.length <= Number(this.pt_int_A.replace(',','.')) - (Number(this.T_pre.replace(',','.'))/2)  || (y1_strum_A + y2_strum_A + y3_strum_A + y4_strum_A + y5_strum_A) / differenze_A.length >= Number(this.pt_int_A.replace(',','.'))+ (Number(this.T_pre.replace(',','.'))/2)){
    this.esito_A_bias = 'True';
  }
  else{
    this.esito_A_bias = 'False';
  }
}
calcolaDifferenze_B() {
  const LSC_x = Number(this.y_rif)+0.15*(Number(this.T_pre.replace(',','.'))/Math.sqrt(5));
  const LIC_x = Number(this.y_rif)-0.15*(Number(this.T_pre.replace(',','.'))/Math.sqrt(5));

  const LSC_r = 2.114*2.326*0.05*Number(this.T_pre.replace(',','.'))
  const LIC_r = 0*2.326*0.05*Number(this.T_pre.replace(',','.'))

  const y1_strum_B = parseFloat((document.getElementById("y1_strum_B") as HTMLInputElement).value.replace(',','.'));
  const y2_strum_B = parseFloat((document.getElementById("y2_strum_B") as HTMLInputElement).value.replace(',','.'));
  const y3_strum_B = parseFloat((document.getElementById("y3_strum_B") as HTMLInputElement).value.replace(',','.'));
  const y4_strum_B = parseFloat((document.getElementById("y4_strum_B") as HTMLInputElement).value.replace(',','.'));
  const y5_strum_B = parseFloat((document.getElementById("y5_strum_B") as HTMLInputElement).value.replace(',','.'));

  const y1_master_B = parseFloat((document.getElementById("y1_master_B") as HTMLInputElement).value.replace(',','.'));
  const y2_master_B = parseFloat((document.getElementById("y2_master_B") as HTMLInputElement).value.replace(',','.'));
  const y3_master_B = parseFloat((document.getElementById("y3_master_B") as HTMLInputElement).value.replace(',','.'));
  const y4_master_B = parseFloat((document.getElementById("y4_master_B") as HTMLInputElement).value.replace(',','.'));
  const y5_master_B = parseFloat((document.getElementById("y5_master_B") as HTMLInputElement).value.replace(',','.'));

  
  if (this.toll_tecnica_stabilita.includes('%')){

    var differenze_B = [((y1_strum_B - y1_master_B)/this.pt_int_B.replace(',','.'))*100, ((y2_strum_B - y2_master_B)/this.pt_int_B.replace(',','.'))*100, ((y3_strum_B - y3_master_B)/this.pt_int_B.replace(',','.'))*100, ((y4_strum_B - y4_master_B)/this.pt_int_B.replace(',','.'))*100, ((y5_strum_B - y5_master_B)/this.pt_int_B.replace(',','.'))*100];
    differenze_B = differenze_B.map((valore) => isNaN(valore) || !isFinite(valore) ? 0 : valore);
    var sommaDifferenze_B = differenze_B.reduce((acc, diff) => acc + diff, 0);
  }
  else {

    var differenze_B = [y1_strum_B - y1_master_B, y2_strum_B - y2_master_B, y3_strum_B - y3_master_B, y4_strum_B - y4_master_B, y5_strum_B - y5_master_B];
    var sommaDifferenze_B = differenze_B.reduce((acc, diff) => acc + diff, 0);
  }
  this.mediaDifferenze_B = differenze_B.length > 0 ? sommaDifferenze_B / differenze_B.length : 0;

  const maxDifferenza_B = Math.max(...differenze_B);
  const minDifferenza_B = Math.min(...differenze_B);
  this.range_B = maxDifferenza_B - minDifferenza_B;

  if(LIC_x <= this.mediaDifferenze_B && this.mediaDifferenze_B <= LSC_x ){
    this.esito_B_x = 'True';
  }
  else{
    this.esito_B_x = 'False';
  }
  if(LIC_r <= this.range_B && this.range_B <= LSC_r ){
    this.esito_B_r = 'True';
  }
  else{
    this.esito_B_r = 'False';
  }  
  if((y1_strum_B + y2_strum_B + y3_strum_B + y4_strum_B + y5_strum_B) / differenze_B.length <= Number(this.pt_int_B.replace(',','.')) - (Number(this.T_pre.replace(',','.'))/2)  || (y1_strum_B + y2_strum_B + y3_strum_B + y4_strum_B + y5_strum_B) / differenze_B.length >= Number(this.pt_int_B.replace(',','.'))+ (Number(this.T_pre.replace(',','.'))/2)){
    this.esito_B_bias = 'True';
  }
  else{
    this.esito_B_bias = 'False';
  }       
}
calcolaDifferenze_C() {
  const LSC_x = Number(this.y_rif)+0.15*(Number(this.T_pre.replace(',','.'))/Math.sqrt(5));
  const LIC_x = Number(this.y_rif)-0.15*(Number(this.T_pre.replace(',','.'))/Math.sqrt(5));

  const LSC_r = 2.114*2.326*0.05*Number(this.T_pre.replace(',','.'))
  const LIC_r = 0*2.326*0.05*Number(this.T_pre.replace(',','.'))

  const y1_strum_C = parseFloat((document.getElementById("y1_strum_C") as HTMLInputElement).value.replace(',','.'));
  const y2_strum_C = parseFloat((document.getElementById("y2_strum_C") as HTMLInputElement).value.replace(',','.'));
  const y3_strum_C = parseFloat((document.getElementById("y3_strum_C") as HTMLInputElement).value.replace(',','.'));
  const y4_strum_C = parseFloat((document.getElementById("y4_strum_C") as HTMLInputElement).value.replace(',','.'));
  const y5_strum_C = parseFloat((document.getElementById("y5_strum_C") as HTMLInputElement).value.replace(',','.'));

  const y1_master_C = parseFloat((document.getElementById("y1_master_C") as HTMLInputElement).value.replace(',','.'));
  const y2_master_C = parseFloat((document.getElementById("y2_master_C") as HTMLInputElement).value.replace(',','.'));
  const y3_master_C = parseFloat((document.getElementById("y3_master_C") as HTMLInputElement).value.replace(',','.'));
  const y4_master_C = parseFloat((document.getElementById("y4_master_C") as HTMLInputElement).value.replace(',','.'));
  const y5_master_C = parseFloat((document.getElementById("y5_master_C") as HTMLInputElement).value.replace(',','.'));

  if (this.toll_tecnica_stabilita.includes('%')){

    var differenze_C = [((y1_strum_C - y1_master_C)/this.pt_int_C.replace(',','.'))*100, ((y2_strum_C - y2_master_C)/this.pt_int_C.replace(',','.'))*100, ((y3_strum_C - y3_master_C)/this.pt_int_C.replace(',','.'))*100, ((y4_strum_C - y4_master_C)/this.pt_int_C.replace(',','.'))*100, ((y5_strum_C - y5_master_C)/this.pt_int_C.replace(',','.'))*100];
    differenze_C = differenze_C.map((valore) => isNaN(valore) || !isFinite(valore) ? 0 : valore);
    var sommaDifferenze_C = differenze_C.reduce((acc, diff) => acc + diff, 0);
  }
  else {

    var differenze_C = [y1_strum_C - y1_master_C, y2_strum_C - y2_master_C, y3_strum_C - y3_master_C, y4_strum_C - y4_master_C, y5_strum_C - y5_master_C];
    var sommaDifferenze_C = differenze_C.reduce((acc, diff) => acc + diff, 0);
  }
  this.mediaDifferenze_C = differenze_C.length > 0 ? sommaDifferenze_C / differenze_C.length : 0;

  const maxDifferenza_C = Math.max(...differenze_C);
  const minDifferenza_C = Math.min(...differenze_C);
  this.range_C = maxDifferenza_C - minDifferenza_C;

  if(LIC_x <= this.mediaDifferenze_C && this.mediaDifferenze_C <= LSC_x ){
    this.esito_C_x = 'True';
  }
  else{
    this.esito_C_x = 'False';
  }
  if(LIC_r <= this.range_C && this.range_C <= LSC_r ){
    this.esito_C_r = 'True';
  }
  else{
    this.esito_C_r = 'False';
  }
  if((y1_strum_C + y2_strum_C + y3_strum_C + y4_strum_C + y5_strum_C) / differenze_C.length <= Number(this.pt_int_C.replace(',','.')) - (Number(this.T_pre.replace(',','.'))/2)  || (y1_strum_C + y2_strum_C + y3_strum_C + y4_strum_C + y5_strum_C) / differenze_C.length >= Number(this.pt_int_C.replace(',','.'))+ (Number(this.T_pre.replace(',','.'))/2)){
    this.esito_C_bias = 'True';
  }
  else{
    this.esito_C_bias = 'False';
  }
}
calcolaDifferenze_D(){
  const LSC_x = Number(this.y_rif)+0.15*(Number(this.T_pre.replace(',','.'))/Math.sqrt(5));
  const LIC_x = Number(this.y_rif)-0.15*(Number(this.T_pre.replace(',','.'))/Math.sqrt(5));

  const LSC_r = 2.114*2.326*0.05*Number(this.T_pre.replace(',','.'))
  const LIC_r = 0*2.326*0.05*Number(this.T_pre.replace(',','.')) 
  
  const y1_strum_D = parseFloat((document.getElementById("y1_strum_D") as HTMLInputElement).value.replace(',','.'));
  const y2_strum_D = parseFloat((document.getElementById("y2_strum_D") as HTMLInputElement).value.replace(',','.'));
  const y3_strum_D = parseFloat((document.getElementById("y3_strum_D") as HTMLInputElement).value.replace(',','.'));
  const y4_strum_D = parseFloat((document.getElementById("y4_strum_D") as HTMLInputElement).value.replace(',','.'));
  const y5_strum_D = parseFloat((document.getElementById("y5_strum_D") as HTMLInputElement).value.replace(',','.'));

  const y1_master_D = parseFloat((document.getElementById("y1_master_D") as HTMLInputElement).value.replace(',','.'));
  const y2_master_D = parseFloat((document.getElementById("y2_master_D") as HTMLInputElement).value.replace(',','.'));
  const y3_master_D = parseFloat((document.getElementById("y3_master_D") as HTMLInputElement).value.replace(',','.'));
  const y4_master_D = parseFloat((document.getElementById("y4_master_D") as HTMLInputElement).value.replace(',','.'));
  const y5_master_D = parseFloat((document.getElementById("y5_master_D") as HTMLInputElement).value.replace(',','.'));

  if (this.toll_tecnica_stabilita.includes('%')){

    var differenze_D = [((y1_strum_D - y1_master_D)/this.pt_int_D.replace(',','.'))*100, ((y2_strum_D - y2_master_D)/this.pt_int_D.replace(',','.'))*100, ((y3_strum_D - y3_master_D)/this.pt_int_D.replace(',','.'))*100, ((y4_strum_D - y4_master_D)/this.pt_int_D.replace(',','.'))*100, ((y5_strum_D - y5_master_D)/this.pt_int_D.replace(',','.'))*100];
    differenze_D = differenze_D.map((valore) => isNaN(valore) || !isFinite(valore) ? 0 : valore);
    var sommaDifferenze_D = differenze_D.reduce((acc, diff) => acc + diff, 0);
  }
  else{

    var differenze_D = [y1_strum_D - y1_master_D, y2_strum_D - y2_master_D, y3_strum_D - y3_master_D, y4_strum_D - y4_master_D, y5_strum_D - y5_master_D];
    var sommaDifferenze_D = differenze_D.reduce((acc, diff) => acc + diff, 0);
  }
  this.mediaDifferenze_D = differenze_D.length > 0 ? sommaDifferenze_D / differenze_D.length : 0;

  const maxDifferenza_D = Math.max(...differenze_D);
  const minDifferenza_D = Math.min(...differenze_D);
  this.range_D = maxDifferenza_D - minDifferenza_D;

  if(LIC_x <= this.mediaDifferenze_D && this.mediaDifferenze_D <= LSC_x ){
    this.esito_D_x = 'True';
  }
  else{
    this.esito_D_x = 'False';
  }
  if(LIC_r <= this.range_D && this.range_D <= LSC_r ){
    this.esito_D_r = 'True';
  }
  else{
    this.esito_D_r = 'False';
  }
  if((y1_strum_D + y2_strum_D + y3_strum_D + y4_strum_D + y5_strum_D) / differenze_D.length <= Number(this.pt_int_D.replace(',','.')) - (Number(this.T_pre.replace(',','.'))/2)  || (y1_strum_D + y2_strum_D + y3_strum_D + y4_strum_D + y5_strum_D) / differenze_D.length >= Number(this.pt_int_D.replace(',','.'))+ (Number(this.T_pre.replace(',','.'))/2)){
    this.esito_D_bias = 'True';
  }
  else{
    this.esito_D_bias = 'False';
  }
}

  isNumeric(val: any): boolean {
    return !isNaN(parseFloat(val)) && isFinite(val);
  }

  showModal(): void {
    let Bnull = 0;
    let Cnull = 0;
    let Dnull = 0;

    if(this.y1_strum_A == ''){
      this.y1_strum_A = null
    }
    if(this.y2_strum_A == ''){
      this.y2_strum_A = null
    }
    if(this.y3_strum_A == ''){
      this.y3_strum_A = null
    }
    if(this.y4_strum_A == ''){
      this.y4_strum_A = null
    }
    if(this.y5_strum_A == ''){
      this.y5_strum_A = null
    }
    if(this.y1_strum_B == ''){
      this.y1_strum_B = null
    }
    if(this.y2_strum_B == ''){
      this.y2_strum_B = null
    }
    if(this.y3_strum_B == ''){
      this.y3_strum_B = null
    }
    if(this.y4_strum_B == ''){
      this.y4_strum_B = null
    }
    if(this.y5_strum_B == ''){
      this.y5_strum_B = null
    }
    if(this.y1_strum_C == ''){
      this.y1_strum_C = null
    }
    if(this.y2_strum_C == ''){
      this.y2_strum_C = null
    }
    if(this.y3_strum_C == ''){
      this.y3_strum_C = null
    }
    if(this.y4_strum_C == ''){
      this.y4_strum_C = null
    }
    if(this.y5_strum_C == ''){
      this.y5_strum_C = null
    }
    if(this.y1_strum_D == ''){
      this.y1_strum_D = null
    }
    if(this.y2_strum_D == ''){
      this.y2_strum_D = null
    }
    if(this.y3_strum_D == ''){
      this.y3_strum_D = null
    }
    if(this.y4_strum_D == ''){
      this.y4_strum_D = null
    }
    if(this.y5_strum_D == ''){
      this.y5_strum_D = null
    }
      
    if(this.y1_master_A == ''){
      this.y1_master_A = null
    }
    if(this.y2_master_A == ''){
      this.y2_master_A = null
    }
    if(this.y3_master_A == ''){
      this.y3_master_A = null
    }
    if(this.y4_master_A == ''){
      this.y4_master_A = null
    }
    if(this.y5_master_A == ''){
      this.y5_master_A = null
    }
    if(this.y1_master_B == ''){
      this.y1_master_B = null
    }
    if(this.y2_master_B == ''){
      this.y2_master_B = null
    }
    if(this.y3_master_B == ''){
      this.y3_master_B = null
    }
    if(this.y4_master_B == ''){
      this.y4_master_B = null
    }
    if(this.y5_master_B == ''){
      this.y5_master_B = null
    }
    if(this.y1_master_C == ''){
      this.y1_master_C = null
    }
    if(this.y2_master_C == ''){
      this.y2_master_C = null
    }
    if(this.y3_master_C == ''){
      this.y3_master_C = null
    }
    if(this.y4_master_C == ''){
      this.y4_master_C = null
    }
    if(this.y5_master_C == ''){
      this.y5_master_C = null
    }
    if(this.y1_master_D == ''){
      this.y1_master_D = null
    }
    if(this.y2_master_D == ''){
      this.y2_master_D = null
    }
    if(this.y3_master_D == ''){
      this.y3_master_D = null
    }
    if(this.y4_master_D == ''){
      this.y4_master_D = null
    }
    if(this.y5_master_D == ''){
      this.y5_master_D = null
    }


    if(this.pt_int_B == ''){

      this.esito_B_x = 'True'; 
      this.esito_B_r = 'True';
      this.y1_strum_B = null;
      this.y2_strum_B = null;
      this.y3_strum_B = null;
      this.y4_strum_B = null;
      this.y5_strum_B = null;
      this.y1_master_B = null;
      this.y2_master_B = null;
      this.y3_master_B = null;
      this.y4_master_B = null;
      this.y5_master_B = null;
      this.calibrazione_B = null;
      this.val_calib_B = null;
      this.val_calib_master_B = null;
      Bnull = 1;
    }
    if(this.pt_int_C == ''){

      this.esito_C_x = 'True'; 
      this.esito_C_r = 'True';
      this.y1_strum_C = null;
      this.y2_strum_C = null;
      this.y3_strum_C = null;
      this.y4_strum_C = null;
      this.y5_strum_C = null;
      this.y1_master_C = null;
      this.y2_master_C = null;
      this.y3_master_C = null;
      this.y4_master_C = null;
      this.y5_master_C = null;
      this.calibrazione_C = null;
      this.val_calib_C = null;
      this.val_calib_master_C = null;
      Cnull = 1;
    }
    if(this.pt_int_D == ''){

      this.esito_D_x = 'True'; 
      this.esito_D_r = 'True';
      this.y1_strum_D = null;
      this.y2_strum_D = null;
      this.y3_strum_D = null;
      this.y4_strum_D = null;
      this.y5_strum_D = null;
      this.y1_master_D = null;
      this.y2_master_D = null;
      this.y3_master_D = null;
      this.y4_master_D = null;
      this.y5_master_D = null;
      this.calibrazione_D = null;
      this.val_calib_D = null;
      this.val_calib_master_D = null;
      Dnull = 1;
    }
    
    if (Bnull ==1){
      if(this.y1_strum_A == undefined|| this.y2_strum_A == undefined || this.y3_strum_A == undefined || this.y4_strum_A == undefined || this.y5_strum_A == undefined || 
        this.y1_master_A == undefined || this.y2_master_A == undefined || this.y3_master_A == undefined || this.y4_master_A == undefined || this.y5_master_A == undefined ||
        this.cal_option1 == undefined  
        ){
          this.showModal_ko();
        }
      else{
        if (this.esito_A_x == 'True' && this.esito_A_r == 'True' && this.esito_B_x == 'True' && this.esito_B_r == 'True' && this.esito_C_x == 'True' && this.esito_C_r == 'True' && this.esito_D_x == 'True' && this.esito_D_r == 'True' && this.validateForm.valid){
          this.submitForm();
          this.showModal_ok();
            
        }
        else {
          this.showModal_ko();
        } 
      }
    }
    else if (Cnull ==1){
      if(this.y1_strum_A == undefined|| this.y2_strum_A == undefined || this.y3_strum_A == undefined || this.y4_strum_A == undefined || this.y5_strum_A == undefined ||
        this.y1_strum_B == undefined|| this.y2_strum_B == undefined || this.y3_strum_B == undefined || this.y4_strum_B == undefined || this.y5_strum_B == undefined || 
        this.y1_master_A == undefined || this.y2_master_A == undefined || this.y3_master_A == undefined || this.y4_master_A == undefined || this.y5_master_A == undefined ||
        this.y1_master_B == undefined || this.y2_master_B == undefined || this.y3_master_B == undefined || this.y4_master_B == undefined || this.y5_master_B == undefined ||
        this.cal_option1 == undefined || this.cal_option2 == undefined
        ){
          this.showModal_ko();
        }
      else{
        if (this.esito_A_x == 'True' && this.esito_A_r == 'True' && this.esito_B_x == 'True' && this.esito_B_r == 'True' && this.esito_C_x == 'True' && this.esito_C_r == 'True' && this.esito_D_x == 'True' && this.esito_D_r == 'True' && this.validateForm.valid){
          this.submitForm();
          this.showModal_ok();
            
        }
        else {
          this.showModal_ko();
        } 
      }
    }
    else if (Dnull ==1){
      if(this.y1_strum_A == undefined|| this.y2_strum_A == undefined || this.y3_strum_A == undefined || this.y4_strum_A == undefined || this.y5_strum_A == undefined ||
        this.y1_strum_B == undefined|| this.y2_strum_B == undefined || this.y3_strum_B == undefined || this.y4_strum_B == undefined || this.y5_strum_B == undefined ||
        this.y1_strum_C == undefined|| this.y2_strum_C == undefined || this.y3_strum_C == undefined || this.y4_strum_C == undefined || this.y5_strum_C == undefined || 
        this.y1_master_A == undefined || this.y2_master_A == undefined || this.y3_master_A == undefined || this.y4_master_A == undefined || this.y5_master_A == undefined ||
        this.y1_master_B == undefined || this.y2_master_B == undefined || this.y3_master_B == undefined || this.y4_master_B == undefined || this.y5_master_B == undefined ||
        this.y1_master_C == undefined || this.y2_master_C == undefined || this.y3_master_C == undefined || this.y4_master_C == undefined || this.y5_master_C == undefined ||
        this.cal_option1 == undefined || this.cal_option2 == undefined || this.cal_option3 == undefined 
        ){
          this.showModal_ko();
        }
      else{
        if (this.esito_A_x == 'True' && this.esito_A_r == 'True' && this.esito_B_x == 'True' && this.esito_B_r == 'True' && this.esito_C_x == 'True' && this.esito_C_r == 'True' && this.esito_D_x == 'True' && this.esito_D_r == 'True' && this.validateForm.valid){
          this.submitForm();
          this.showModal_ok();
            
        }
        else {
          this.showModal_ko();
        } 
      }
    }
    else {
      if(this.y1_strum_A == undefined|| this.y2_strum_A == undefined || this.y3_strum_A == undefined || this.y4_strum_A == undefined || this.y5_strum_A == undefined ||
        this.y1_strum_B == undefined|| this.y2_strum_B == undefined || this.y3_strum_B == undefined || this.y4_strum_B == undefined || this.y5_strum_B == undefined ||
        this.y1_strum_C == undefined|| this.y2_strum_C == undefined || this.y3_strum_C == undefined || this.y4_strum_C == undefined || this.y5_strum_C == undefined ||
        this.y1_strum_D == undefined || this.y2_strum_D == undefined || this.y3_strum_D == undefined || this.y4_strum_D == undefined || this.y5_strum_D == undefined || 
        this.y1_master_A == undefined || this.y2_master_A == undefined || this.y3_master_A == undefined || this.y4_master_A == undefined || this.y5_master_A == undefined ||
        this.y1_master_B == undefined || this.y2_master_B == undefined || this.y3_master_B == undefined || this.y4_master_B == undefined || this.y5_master_B == undefined ||
        this.y1_master_C == undefined || this.y2_master_C == undefined || this.y3_master_C == undefined || this.y4_master_C == undefined || this.y5_master_C == undefined ||
        this.y1_master_D == undefined || this.y2_master_D == undefined || this.y3_master_D == undefined || this.y4_master_D == undefined || this.y5_master_D == undefined ||
        this.cal_option1 == undefined || this.cal_option2 == undefined || this.cal_option3 == undefined || this.cal_option4 == undefined     
        ){
          this.showModal_ko();
        }
      else{
        if (this.esito_A_x == 'True' && this.esito_A_r == 'True' && this.esito_B_x == 'True' && this.esito_B_r == 'True' && this.esito_C_x == 'True' && this.esito_C_r == 'True' && this.esito_D_x == 'True' && this.esito_D_r == 'True' && this.validateForm.valid){
          this.submitForm();
          this.showModal_ok();
            
        }
        else {
          this.showModal_ko();
        } 
      }
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
    console.log("scm120.component.ts ha individuato questo campione_di riferimento: ", campione_di_riferimento);
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