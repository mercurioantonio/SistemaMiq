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
import { SharedModule } from 'src/app/view/shared/shared.module';
import { Data } from '@angular/router';
import {Router} from '@angular/router'; 

@Component({
  selector: 'app-scm0',
  templateUrl: './scm0.component.html',
  styleUrls: ['./scm0.component.less']
})

export class Scm0Component {
  validateForm!: UntypedFormGroup;
  data: any;
  n_cert: any;
  incertezza: any;
  revisione: any;
  data_revisione: any;
  confirm: any;
  selectedMiq: any;
  isDisabled: boolean = true;
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
  isVisible = false;
  y_rif: any;
  T_pre: any;

  dataframeCampione: any; 
  status_campione: any; 

  constructor(private fb: FormBuilder, private service: TrackService, private router:Router, private scambio:ScambioService) { }

  ngOnInit(): void {
      this.scambio.selectedMiq$.subscribe((test: any) => {
        this.selectedMiq = test;
        console.log("Il codice MIQ selezionato e: ", this.selectedMiq)
        this.service.getAnagrafica(this.selectedMiq).subscribe((anagrafica) => { 
        this.dataframeData = anagrafica.anagrafica_json[0];
        this.status = anagrafica.status
        console.log("L'anagrafica del MIQ selezionato e: ", this.dataframeData)

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
        });

      });

      this.validateForm = this.fb.group({
//      cid: [[], [Validators.required,Validators.pattern("^[0-9]*$"),Validators.minLength(8), Validators.maxLength(8)]],
        cod_miq: [[], [Validators.required]],
        data: [null, [Validators.required]],
        n_cert: [[], [Validators.required]],
        incertezza: [[], [Validators.required]],
        revisione: [[], [Validators.required]],
        data_revisione: [null, [Validators.required]],

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
        T_pre: [[this.T_pre]]
      });
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
      const misure =  JSON.stringify(this.validateForm.value);
      console.log('submit', misure);
      this.service.insertTarat0({misure}).subscribe((res: any) => {
        console.log('res', res)
        this.esito_x = res.esito_x;
        this.esito_r = res.esito_r;
      });
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
    this.isVisible = true;
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
    this.router.navigate(['/scadenziario']);
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
  }

  campione(campione_di_riferimento:string): void{
    var campione_di_riferimento = campione_di_riferimento;
    console.log("scm0.component.ts ha individuato questo campione_di riferimento: ", campione_di_riferimento);
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
