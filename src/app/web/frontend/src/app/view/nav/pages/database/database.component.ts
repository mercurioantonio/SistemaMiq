import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams,} from '@angular/common/http';
import { TrackService } from 'src/app/core/services/track.service';
import {Router} from '@angular/router'; 
import { ScambioService } from 'src/app/core/services/scambio';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

interface ItemData {
  id: any;
  cod_miq: any;
  scm: any;
  classe: any;
  data_ult_tarat: any;
  freq_tarat_gg: any;
  intervallo_di_taratura: any;
  scadenza: any;
  settimana_scadenza: any;
  anno_scadenza: any;
  in_uso: any;
  in_riparazione: any;
  n_cert: any;
  denominazione_strumento: any;
  campo_di_misura: any;
  risoluzione: any;
  incertezza: any;
  toll_tecnica_stabilita: any;
  toll_tecnica_ripetibilita: any;
  tolleranza_processo: any;
  tur: any;
  capability: any;
  y_rif: any;
  T_pre: any;
  pt_int_A: any;
  pt_int_B: any;
  pt_int_C: any;
  pt_int_D: any;
  pt_int_E: any;
  pt_int_F: any;
  grandezza_misurata: any;
  unita_di_misura: any;
  campione_di_riferimento: any;
  casa_costruttrice: any;
  modello: any;
  reparto: any;
  localizzazione: any;
  sot: any;
  addetto_taratura: any;
  responsabile_taratura: any;
  umidita_relativa: any;
  temperatura: any;
  taratura: any;
  emissione: any;
  data_emissione: any;
  revisione: any;
  data_revisione: any;
  matricola: any;
  note: any;
  cod_miq_vecchio: any;
  preparato_da: any;
}

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.less']
})

export class DatabaseComponent implements OnInit {
  dataframeData: ItemData[] = [];
  status: any;

  searchValue_cod_miq = '';
  searchValue_denominazione = '';

  visible_cod_miq = false;
  visible_denominazione = false;

  filter_scm!: any[];
  searchScm!: any[];
  flagScm = false;

  filter_year!: any[] ;
  searchYear!: any[];
  flagYear = false;

  filter_in_uso!: any[] ;
  searchInUso!: any[];
  flagInUso = false;

  filter_campione!: any[] ;
  searchCampione!: any[];
  flagCampione = false;

  filter_intervallo_di_taratura!: any[] ;
  searchIntervalloDiTaratura!: any[];
  flagIntervalloDiTaratura = false;

  flagCodMiq = false;
  filter_cod_miq!: any[] ;

  editCache: { [key: string]: { edit: boolean; data: ItemData } } = {};
  listOfDisplayData: ItemData[] = [];
  insert: ItemData[]= [];

  add: boolean = false;
  statusExport: any;

  login: boolean = false;
  username!: string;
  password!: string;

  passwordVisible = false;

  checkUser = 'Admin'
  checkPsw = 'admin'
  checkUser2 = 'User'
  checkPsw2 = 'user'

  checkUser3 = 'ferlafa001'
  checkPsw3 = 'admin'
  checkUser4 = 'mancida001'
  checkPsw4 = 'admin'
  checkUser5 = 'pstraka001'
  checkPsw5 = 'admin'

  checkUser6 = 'salaprove'
  checkPsw6 = 'user'
  checkUser7 = 'mansalamescole'
  checkPsw7 = 'Mix2024'

  myCheckAll:boolean = false;
  myCheckUser:boolean = false;

  modalDueDate:boolean = false;
  modalScadenza_data: any;
  modalScadenza_freq: any;
  modalScadenza_cod_miq: any;
  
  constructor(private message: NzMessageService, private http: HttpClient, private service: TrackService, private router:Router, private scambio:ScambioService) { } 
  

  updateEditCache(): void {
    this.listOfDisplayData.forEach(item => {
      // console.log("item:", item)
      this.editCache[item.id] = {
         edit: false,
         data: { ...item }
      };
    });
  }

  startEdit(id: any): void {
    this.editCache[id].edit = true;  
  }

  annullaEdit(id: any): void {
    this.editCache[id].edit = false;
  }

  cancelEdit(id: any): void {
    const index = this.listOfDisplayData.findIndex((item: { id: any; }) => item.id === id);
    Object.assign(this.listOfDisplayData[index], this.editCache[id].data);
    this.editCache[id] = {
      data: { ...this.listOfDisplayData[index] },
      edit: false
    };

    var editCache_json =this.editCache[id]    
    this.service.cancelDatabase(editCache_json).subscribe((res: any) => {
      console.log("res: ", res)
      if (res.status === 'success'){
        this.message.success("Strumento eliminato con successo", {
          nzDuration: 5000
        });
      }
      else{
        this.message.error("Eliminazione dello strumento fallita", {
          nzDuration: 5000
        });
  
      } 
    });
    
  }

  saveEdit(id: any): void {
    const index = this.listOfDisplayData.findIndex((item: { id: any; }) => item.id === id);
    Object.assign(this.listOfDisplayData[index], this.editCache[id].data);
    console.log(this.editCache[id])
    this.modalScadenza_data = this.editCache[id].data.data_ult_tarat
    this.modalScadenza_freq = this.editCache[id].data.freq_tarat_gg
    this.modalScadenza_cod_miq = this.editCache[id].data.cod_miq
    this.editCache[id].edit = false;
    var editCache_json =this.editCache[id]

    this.service.updateDatabase(editCache_json).subscribe((res: any) => {
      console.log("res: ", res)
      if (res.status === 'success'){
        this.message.success("Modifica del database eseguita con successo", {
          nzDuration: 5000
        });
        this.modalDueDate = true;
      }
      else{
        this.message.error("Modifica del database fallita", {
          nzDuration: 5000
        });
  
      }
    });
    
  }

  chiudiModalDueDate(): void {
    this.modalDueDate = false;
  }

  insertEdit(id: any): void { 
    for (var i of this.filter_cod_miq.values()){
      if (this.insert[0].cod_miq == i.value ) {
        this.flagCodMiq = true;
      }
    }
    if (this.flagCodMiq == false) {
      this.service.appendDatabase(this.insert[0]).subscribe((res: any) => {
        console.log("res: ", res)
        if (res['status'] == 'success'){
          this.message.success(res.message, {
            nzDuration: 5000
          });
          this.add = false;
          this.flagCodMiq = false;
          this.insert = []
          this.ngOnInit();
        }
        else{
          this.message.error(res.message, {
            nzDuration: 5000
          });
          this.add = false;
          this.flagCodMiq = false;
          this.insert = []
          this.ngOnInit();
        }  
      });
    }
    else{
      this.message.error("Codice MIQ già esistente", {
        nzDuration: 5000
      });
      this.flagCodMiq = false;
      this.insert[0].cod_miq = []
    }  
  }

  cancelInsert(id: any): void {
    this.add = false
    this.insert = [] 
  }


  addRow(): void {
    const newRow: ItemData = 
      {
        id: '',
        cod_miq: '',
        scm: '',
        classe: '',
        data_ult_tarat: '',
        freq_tarat_gg: '',
        intervallo_di_taratura: '',
        scadenza: '',
        settimana_scadenza: '',
        anno_scadenza: '',
        in_uso: '',
        in_riparazione: '',
        n_cert: '',
        denominazione_strumento: '',
        campo_di_misura: '',
        risoluzione: '',
        incertezza: '',
        toll_tecnica_stabilita: '',
        toll_tecnica_ripetibilita: '',
        tolleranza_processo: '',
        tur: '',
        capability: '',
        y_rif: '',
        T_pre: '',
        pt_int_A: '',
        pt_int_B: '',
        pt_int_C: '',
        pt_int_D: '',
        pt_int_E: '',
        pt_int_F: '',
        grandezza_misurata: '',
        unita_di_misura: '',
        campione_di_riferimento: '',
        casa_costruttrice: '',
        modello: '',
        reparto: '',
        localizzazione: '',
        sot: '',
        addetto_taratura: '',
        responsabile_taratura: '',
        umidita_relativa: '',
        temperatura: '',
        taratura: '',
        emissione: '',
        data_emissione: '',
        revisione: '',
        data_revisione: '',
        matricola: '',
        note: '',
        cod_miq_vecchio: '',
        preparato_da: '',
      };
      this.insert = [...this.insert, newRow];
      console.log("this.insert: ", this.insert)
      this.add = true;
  }

  esporta(): void {
    this.service.esporta().subscribe((res: any)=>{
      this.statusExport = res.status;
      console.log("Lo status di esporta è:", this.statusExport)
      if (this.statusExport === 'success'){
        this.message.success("Esportazione del database terminata con successo", {
          nzDuration: 5000
        });
      }
      else{
        this.message.error("Esportazione del database fallita", {
          nzDuration: 5000
        });
  
      }  
    })
   
  }

  ngOnInit(): void {
    if(sessionStorage.getItem('usr') && sessionStorage.getItem('psw')){
      this.username = sessionStorage.getItem('usr') as string;
      this.password = sessionStorage.getItem('psw') as string;
      this.effettuaLogin(this.username, this.password)
    }else{
      this.myCheckAll  = false;
      this.myCheckUser = false;
    }

    this.service.getDatabase().subscribe((data: any) => {
      this.dataframeData = data.database_json;
      console.log("DATABASE: ", this.dataframeData)
      this.listOfDisplayData = this.dataframeData;
      this.updateEditCache();

      const year = [...new Set(this.dataframeData.map((item: { anno_scadenza: any; }) => item.anno_scadenza))];
      this.filter_year =  [];
      for (var i in year){
        const filter_year_final = { 'text': year[i], 'value': year[i] }
        this.filter_year.push(filter_year_final)
      }
      this.filter_year.sort((a, b) => {
        const numA = parseFloat(a.text);
        const numB = parseFloat(b.text);
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        } else if (isNaN(numA) && isNaN(numB)) {
          if (a.text === '<NA>') return 1;
          if (b.text === '<NA>') return -1;
          return a.text.localeCompare(b.text);
        } else {
          return isNaN(numA) ? 1 : -1;
        }
      });

      const scm = [...new Set(this.dataframeData.map((item: { scm: any; }) => item.scm))];
      this.filter_scm =  [];
      for (var i in scm){
        const filter_scm_final = { 'text': scm[i], 'value': scm[i] }
        this.filter_scm.push(filter_scm_final)
      }
      this.filter_scm.sort((a, b) => {
        const numA = parseFloat(a.text);
        const numB = parseFloat(b.text);
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        } else if (isNaN(numA) && isNaN(numB)) {
          if (a.text === '<NA>') return 1; 
          if (b.text === '<NA>') return -1; 
          return a.text.localeCompare(b.text);
        } else {
          return isNaN(numA) ? 1 : -1;
        }
      });

      const cod_miq = [...new Set(this.dataframeData.map((item: { cod_miq: any; }) => item.cod_miq))];
      this.filter_cod_miq =  [];
      for (var i in cod_miq){
        const filter_cod_miq_final = { 'text': cod_miq[i], 'value': cod_miq[i] }
        this.filter_cod_miq.push(filter_cod_miq_final)
      }

      const intervallo_di_taratura = [...new Set(this.dataframeData.map((item: { intervallo_di_taratura: any; }) => item.intervallo_di_taratura))];
      this.filter_intervallo_di_taratura =  [];
      for (var i in intervallo_di_taratura){
        const filter_intervallo_di_taratura_final = { 'text': intervallo_di_taratura[i], 'value': intervallo_di_taratura[i] }
        this.filter_intervallo_di_taratura.push(filter_intervallo_di_taratura_final)
      }
      this.filter_intervallo_di_taratura.sort((a, b) => {
        const numA = parseFloat(a.text);
        const numB = parseFloat(b.text);
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        } else if (isNaN(numA) && isNaN(numB)) {
          if (a.text === '<NA>') return 1; 
          if (b.text === '<NA>') return -1; 
          return a.text.localeCompare(b.text);
        } else {
          return isNaN(numA) ? 1 : -1;
        }
      });

      const campione = [...new Set(this.dataframeData.map((item: { campione_di_riferimento: any; }) => item.campione_di_riferimento))];
      this.filter_campione =  [];
      for (var i in campione){
        const filter_campione_final = { 'text': campione[i], 'value': campione[i] }
        this.filter_campione.push(filter_campione_final)
      }
      this.filter_campione.sort((a, b) => {
        const numA = parseFloat(a.text);
        const numB = parseFloat(b.text);
        if (!isNaN(numA) && !isNaN(numB)) {
          return numA - numB;
        } else if (isNaN(numA) && isNaN(numB)) {
          if (a.text === '<NA>') return 1; 
          if (b.text === '<NA>') return -1; 
          return a.text.localeCompare(b.text);
        } else {
          return isNaN(numA) ? 1 : -1;
        }
      });

      // const in_uso = [...new Set(this.dataframeData.map((item: { in_uso: any; }) => item.in_uso))];
      // this.filter_in_uso =  [];
      // for (var i in in_uso){
      //   const filter_in_uso_final = { 'text': in_uso[i], 'value': in_uso[i] }
      //   this.filter_in_uso.push(filter_in_uso_final)
      // }
      // this.filter_in_uso.sort((a, b) => {
      //   const numA = parseFloat(a.text);
      //   const numB = parseFloat(b.text);
      //   if (!isNaN(numA) && !isNaN(numB)) {
      //     return numA - numB;
      //   } else if (isNaN(numA) && isNaN(numB)) {
      //     if (a.text === '<NA>') return 1;
      //     if (b.text === '<NA>') return -1;
      //     return a.text.localeCompare(b.text);
      //   } else {
      //     return isNaN(numA) ? 1 : -1;
      //   }
      // });

      const in_uso = [...new Set(this.dataframeData.map((item: { in_uso: any; }) => item.in_uso))];
      this.filter_in_uso =  [];
      for (const value of in_uso) {
        const filter_in_uso_final = { 'text': value, 'value': value };
        this.filter_in_uso.push(filter_in_uso_final);
      }

      this.filter_in_uso.sort((a, b) => {
        if (a.text === '<NA>') return 1;
        if (b.text === '<NA>') return -1;

        // Verifica se i valori sono stringhe prima di utilizzare localeCompare
        if (typeof a.text === 'string' && typeof b.text === 'string') {
          return a.text.localeCompare(b.text);
        } else {
          // Gestisci il caso in cui almeno uno dei valori non è una stringa
          // Puoi personalizzare questa parte a seconda delle tue esigenze
          return 0;
        }
      });

      
    });
  }

  filterScm(value: string[]): void {
    this.searchScm = value;
    if (this.flagInUso == false && this.flagYear == false && this.flagCampione == false && this.searchScm.length === 0){
      this.flagScm = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1);
    }
    else if (this.flagInUso == false && this.flagYear == false && this.flagCampione == false){
      this.flagScm = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { scm: string; }) => this.searchScm.some(y => y === x.scm.toString())); 
    }
    else if (this.flagInUso == false && this.searchScm.length === 0 && this.flagCampione == false){
      this.flagScm = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { anno_scadenza: string; }) =>  this.searchYear.some(z => z === x.anno_scadenza.toString())); 
    }
    else if (this.searchScm.length === 0 && this.flagYear == false && this.flagCampione == false){
      this.flagScm = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { in_uso: string; }) => this.searchInUso.some(y => y === x.in_uso)); 
    }
    else if (this.flagInUso == false && this.flagYear == false && this.searchScm.length === 0){
      this.flagScm = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { campione_di_riferimento: string; }) => this.searchCampione.some(y => y === x.campione_di_riferimento)); 
    }
    else if (this.flagInUso == false && this.flagYear == false){
      this.flagScm = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { scm: string; campione_di_riferimento: string;}) => this.searchScm.some(y => y === x.scm.toString() && this.searchCampione.some(z => z === x.campione_di_riferimento))); 
    }
    else if (this.flagInUso == false && this.searchScm.length === 0){
      this.flagScm = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { anno_scadenza: string; campione_di_riferimento: string;}) =>  this.searchYear.some(z => z === x.anno_scadenza.toString() && this.searchCampione.some(y => y === x.campione_di_riferimento))); 
    }
    else if (this.searchScm.length === 0 && this.flagYear == false){
      this.flagScm = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { in_uso: string; campione_di_riferimento: string;}) => this.searchInUso.some(y => y === x.in_uso) && this.searchCampione.some(y => y === x.campione_di_riferimento)); 
    }
    else if (this.flagInUso == false && this.flagCampione == false){
      this.flagScm = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { scm: string; anno_scadenza: string;}) => this.searchScm.some(y => y === x.scm.toString() && this.searchYear.some(z => z === x.anno_scadenza.toString()))); 
    }
    else if (this.flagCampione == false && this.searchScm.length === 0){
      this.flagScm = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { anno_scadenza: string; in_uso: string;}) =>  this.searchYear.some(z => z === x.anno_scadenza.toString() && this.searchInUso.some(y => y === x.in_uso))); 
    }
    else if (this.flagCampione == false && this.flagYear == false){
      this.flagScm = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { in_uso: string; scm: string;}) => this.searchInUso.some(y => y === x.in_uso) && this.searchScm.some(y => y === x.scm.toString())); 
    }
    else if (this.searchScm.length === 0){
      this.flagScm = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: {anno_scadenza: string; in_uso: string; campione_di_riferimento: string;}) => this.searchYear.some(z => z === x.anno_scadenza.toString() && this.searchInUso.some(y => y === x.in_uso)  && this.searchCampione.some(w => w === x.campione_di_riferimento))); 
    }
    else if (this.flagYear== false){
      this.flagScm = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: {in_uso: string; scm: string; campione_di_riferimento: string;}) => this.searchInUso.some(z => z === x.in_uso && this.searchScm.some(y => y === x.scm.toString())  && this.searchCampione.some(w => w === x.campione_di_riferimento))); 
    }
    else if (this.flagInUso == false){
      this.flagScm = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: {anno_scadenza: string; scm: string; campione_di_riferimento: string;}) => this.searchYear.some(z => z === x.anno_scadenza.toString() && this.searchScm.some(y => y === x.scm.toString()) && this.searchCampione.some(w => w === x.campione_di_riferimento) )); 
    }
    else if (this.flagCampione == false){
      this.flagScm = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: {anno_scadenza: string; scm: string; in_uso: string;}) => this.searchYear.some(z => z === x.anno_scadenza.toString() && this.searchScm.some(y => y === x.scm.toString()) && this.searchInUso.some(w => w === x.in_uso))); 
    }
    else{
      this.flagScm = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: {anno_scadenza: string; scm: string, in_uso: string; campione_di_riferimento: string;}) => this.searchYear.some(z => z === x.anno_scadenza.toString() && this.searchScm.some(y => y === x.scm.toString()) && this.searchInUso.some(w => w === x.in_uso) && this.searchCampione.some(k => k === x.campione_di_riferimento) )); 
    } 
  }

  filterYear(value: string[]): void {   
    this.searchYear = value;
    if (this.flagInUso == false && this.searchYear.length === 0 && this.flagScm == false && this.flagCampione == false){
      this.flagYear = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1);
    }
    else if (this.flagInUso == false && this.searchYear.length === 0 && this.flagCampione == false){
      this.flagYear = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { scm: string; }) => this.searchScm.some(y => y === x.scm.toString())); 
    }
    else if (this.flagInUso == false && this.flagScm == false && this.flagCampione == false){
      this.flagYear = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { anno_scadenza: string; }) =>  this.searchYear.some(z => z === x.anno_scadenza.toString())); 
    }
    else if (this.flagScm == false && this.searchYear.length === 0 && this.flagCampione == false){
      this.flagYear = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { in_uso: string; }) => this.searchInUso.some(y => y === x.in_uso)); 
    }
    else if (this.flagScm == false && this.searchYear.length === 0 && this.flagInUso == false){
      this.flagYear = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { campione_di_riferimento: string; }) => this.searchCampione.some(y => y === x.campione_di_riferimento)); 
    }
    else if (this.flagInUso == false && this.searchYear.length === 0){
      this.flagYear = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { scm: string; campione_di_riferimento: string; }) => this.searchScm.some(y => y === x.scm.toString() && this.searchCampione.some(z => z === x.campione_di_riferimento))); 
    }
    else if (this.flagInUso == false && this.flagScm == false){
      this.flagYear = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { anno_scadenza: string; campione_di_riferimento: string;}) =>  this.searchYear.some(z => z === x.anno_scadenza.toString() && this.searchCampione.some(y => y === x.campione_di_riferimento))); 
    }
    else if (this.flagScm == false && this.searchYear.length === 0){
      this.flagYear = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { in_uso: string; campione_di_riferimento: string;}) => this.searchInUso.some(y => y === x.in_uso) && this.searchCampione.some(z => z === x.campione_di_riferimento)); 
    }
    else if (this.flagInUso == false && this.flagCampione == false){
      this.flagYear = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { scm: string; anno_scadenza: string;}) => this.searchScm.some(y => y === x.scm.toString() && this.searchYear.some(z => z === x.anno_scadenza.toString()))); 
    }
    else if (this.flagCampione == false && this.flagScm == false){
      this.flagYear = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { anno_scadenza: string; in_uso: string;}) =>  this.searchYear.some(z => z === x.anno_scadenza.toString() && this.searchInUso.some(y => y === x.in_uso))); 
    }
    else if (this.flagCampione == false && this.searchYear.length === 0){
      this.flagYear = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { in_uso: string; scm: string;}) => this.searchInUso.some(y => y === x.in_uso) && this.searchScm.some(z => z === x.scm.toString())); 
    }



    else if (this.flagScm == false){
      this.flagYear = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: {anno_scadenza: string; in_uso: string; campione_di_riferimento: string;}) => this.searchYear.some(z => z === x.anno_scadenza.toString() && this.searchInUso.some(y => y === x.in_uso) && this.searchCampione.some(w => w === x.campione_di_riferimento) )); 
    }
    else if (this.searchYear.length === 0){
      this.flagYear = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: {in_uso: string; scm: string; campione_di_riferimento: string;}) => this.searchInUso.some(z => z === x.in_uso && this.searchScm.some(y => y === x.scm.toString()) && this.searchCampione.some(w => w === x.campione_di_riferimento) )); 
    }
    else if (this.flagInUso == false){
      this.flagYear = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: {anno_scadenza: string; scm: string; campione_di_riferimento: string;}) => this.searchYear.some(z => z === x.anno_scadenza.toString() && this.searchScm.some(y => y === x.scm.toString()) && this.searchCampione.some(w => w === x.campione_di_riferimento) )); 
    }
    else if (this.flagCampione == false){
      this.flagYear = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: {anno_scadenza: string; scm: string; in_uso: string; }) => this.searchYear.some(z => z === x.anno_scadenza.toString() && this.searchScm.some(y => y === x.scm.toString()) && this.searchInUso.some(w => w === x.in_uso) )); 
    }
  
    else{
      this.flagYear = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: {anno_scadenza: string; scm: string, in_uso: string; campione_di_riferimento: string;}) => this.searchYear.some(z => z === x.anno_scadenza.toString() && this.searchScm.some(y => y === x.scm.toString()) && this.searchInUso.some(w => w === x.in_uso) && this.searchCampione.some(k => k === x.campione_di_riferimento) )); 
    } 
  }

  filterInUso(value: string[]): void {   
    this.searchInUso = value;

    if (this.searchInUso.length === 0 && this.flagYear == false && this.flagScm == false && this.flagCampione == false){
      this.flagInUso = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1);
    }

    else if (this.searchInUso.length === 0 && this.flagYear == false && this.flagCampione == false){
      this.flagInUso = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { scm: string; }) => this.searchScm.some(y => y === x.scm.toString())); 
    }
    else if (this.searchInUso.length === 0 && this.flagScm == false && this.flagCampione == false){
      this.flagInUso = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { anno_scadenza: string; }) =>  this.searchYear.some(z => z === x.anno_scadenza.toString())); 
    }
    else if (this.flagScm == false && this.flagYear == false && this.flagCampione == false){
      this.flagInUso = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { in_uso: string; }) => this.searchInUso.some(y => y === x.in_uso)); 
    }
    else if (this.flagScm == false && this.flagYear == false && this.searchInUso.length === 0){
      this.flagInUso = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { campione_di_riferimento: string; }) => this.searchCampione.some(y => y === x.campione_di_riferimento)); 
    }
    else if (this.searchInUso.length === 0 && this.flagYear == false){
      this.flagInUso = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { scm: string; campione_di_riferimento: string;}) => this.searchScm.some(y => y === x.scm.toString() && this.searchCampione.some(z => z === x.campione_di_riferimento))); 
    }
    else if (this.searchInUso.length === 0 && this.flagScm == false){
      this.flagInUso = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { anno_scadenza: string; campione_di_riferimento: string;}) =>  this.searchYear.some(z => z === x.anno_scadenza.toString() && this.searchCampione.some(y => y === x.campione_di_riferimento))); 
    }
    else if (this.flagScm == false && this.flagYear == false){
      this.flagInUso = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { in_uso: string; campione_di_riferimento: string;}) => this.searchInUso.some(y => y === x.in_uso) && this.searchCampione.some(z => z === x.campione_di_riferimento)); 
    }
    else if (this.flagCampione == false && this.flagYear == false){
      this.flagInUso = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { scm: string; in_uso: string;}) => this.searchScm.some(y => y === x.scm.toString() && this.searchInUso.some(z => z === x.in_uso))); 
    }
    else if (this.searchInUso.length === 0 && this.flagCampione == false){
      this.flagInUso = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { anno_scadenza: string; scm: string;}) =>  this.searchYear.some(z => z === x.anno_scadenza.toString() && this.searchScm.some(y => y === x.scm.toString()))); 
    }
    else if (this.flagScm == false && this.flagCampione == false){
      this.flagInUso = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { in_uso: string; anno_scadenza: string;}) => this.searchInUso.some(y => y === x.in_uso) && this.searchYear.some(z => z === x.anno_scadenza.toString())); 
    }
    else if (this.flagScm == false){
      this.flagInUso = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: {anno_scadenza: string; in_uso: string; campione_di_riferimento: string;}) => this.searchYear.some(z => z === x.anno_scadenza.toString() && this.searchInUso.some(y => y === x.in_uso) && this.searchCampione.some(w => w === x.campione_di_riferimento) )); 
    }
    else if (this.flagYear== false){
      this.flagInUso = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: {in_uso: string; scm: string; campione_di_riferimento: string;}) => this.searchInUso.some(z => z === x.in_uso && this.searchScm.some(y => y === x.scm.toString()) && this.searchCampione.some(w => w === x.campione_di_riferimento) )); 
    }
    else if (this.searchInUso.length === 0){
      this.flagInUso = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: {anno_scadenza: string; scm: string; campione_di_riferimento: string;}) => this.searchYear.some(z => z === x.anno_scadenza.toString() && this.searchScm.some(y => y === x.scm.toString()) && this.searchCampione.some(w => w === x.campione_di_riferimento) )); 
    }
    else if (this.flagCampione == false){
      this.flagInUso = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: {in_uso: string; scm: string; anno_scadenza: string;}) => this.searchInUso.some(z => z === x.in_uso && this.searchScm.some(y => y === x.scm.toString()) && this.searchYear.some(w => w === x.anno_scadenza.toString()))); 
    }  
    else{
      this.flagInUso = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: {anno_scadenza: string; scm: string, in_uso: string; campione_di_riferimento: string;}) => this.searchYear.some(z => z === x.anno_scadenza.toString() && this.searchScm.some(y => y === x.scm.toString()) && this.searchInUso.some(w => w === x.in_uso) && this.searchCampione.some(k => k === x.campione_di_riferimento) )); 
    } 
  }

  filterCampione(value: string[]): void {   
    this.searchCampione = value;

    if (this.searchCampione.length === 0 && this.flagYear == false && this.flagScm == false && this.flagInUso == false){
      this.flagCampione = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1);
    }

    else if (this.searchCampione.length === 0 && this.flagYear == false && this.flagInUso == false){
      this.flagCampione = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { scm: string; }) => this.searchScm.some(y => y === x.scm.toString())); 
    }
    else if (this.searchCampione.length === 0 && this.flagScm == false && this.flagInUso == false){
      this.flagCampione = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { anno_scadenza: string; }) =>  this.searchYear.some(z => z === x.anno_scadenza.toString())); 
    }
    else if (this.flagScm == false && this.flagYear == false && this.flagInUso == false){
      this.flagCampione = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { campione_di_riferimento: string; }) => this.searchCampione.some(y => y === x.campione_di_riferimento)); 
    }
    else if (this.flagScm == false && this.flagYear == false && this.searchCampione.length === 0){
      this.flagCampione = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { in_uso: string; }) => this.searchInUso.some(y => y === x.in_uso)); 
    }
    else if (this.searchCampione.length === 0 && this.flagYear == false){
      this.flagCampione = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { scm: string; in_uso: string;}) => this.searchScm.some(y => y === x.scm.toString() && this.searchInUso.some(z => z === x.in_uso))); 
    }
    else if (this.searchCampione.length === 0 && this.flagScm == false){
      this.flagCampione = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { anno_scadenza: string; in_uso: string;}) =>  this.searchYear.some(z => z === x.anno_scadenza.toString() && this.searchInUso.some(y => y === x.in_uso))); 
    }
    else if (this.flagScm == false && this.flagYear == false){
      this.flagCampione = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { in_uso: string; campione_di_riferimento: string;}) => this.searchInUso.some(y => y === x.in_uso) && this.searchCampione.some(z => z === x.campione_di_riferimento)); 
    }
    else if (this.flagInUso == false && this.flagYear == false){
      this.flagCampione = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { scm: string; campione_di_riferimento: string;}) => this.searchScm.some(y => y === x.scm.toString() && this.searchCampione.some(z => z === x.campione_di_riferimento))); 
    }
    else if (this.searchCampione.length === 0 && this.flagInUso == false){
      this.flagCampione = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { anno_scadenza: string; scm: string;}) =>  this.searchYear.some(z => z === x.anno_scadenza.toString() && this.searchScm.some(y => y === x.scm.toString()))); 
    }
    else if (this.flagScm == false && this.flagInUso == false){
      this.flagCampione = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { campione_di_riferimento: string; anno_scadenza: string;}) => this.searchCampione.some(y => y === x.campione_di_riferimento) && this.searchYear.some(z => z === x.anno_scadenza.toString())); 
    }
    else if (this.flagScm == false){
      this.flagCampione = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: {anno_scadenza: string; in_uso: string; campione_di_riferimento: string;}) => this.searchYear.some(z => z === x.anno_scadenza.toString() && this.searchInUso.some(y => y === x.in_uso) && this.searchCampione.some(w => w === x.campione_di_riferimento) )); 
    }
    else if (this.flagYear== false){
      this.flagCampione = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: {in_uso: string; scm: string; campione_di_riferimento: string;}) => this.searchInUso.some(z => z === x.in_uso && this.searchScm.some(y => y === x.scm.toString()) && this.searchCampione.some(w => w === x.campione_di_riferimento) )); 
    }
    else if (this.searchCampione.length === 0){
      this.flagCampione = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: {anno_scadenza: string; scm: string; in_uso: string;}) => this.searchYear.some(z => z === x.anno_scadenza.toString() && this.searchScm.some(y => y === x.scm.toString()) && this.searchInUso.some(w => w === x.in_uso) )); 
    }
    else if (this.flagInUso == false){
      this.flagCampione = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: {campione_di_riferimento: string; scm: string; anno_scadenza: string;}) => this.searchCampione.some(z => z === x.campione_di_riferimento && this.searchScm.some(y => y === x.scm.toString()) && this.searchYear.some(w => w === x.anno_scadenza.toString()))); 
    }  
    else{
      this.flagCampione = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: {anno_scadenza: string; scm: string, in_uso: string; campione_di_riferimento: string;}) => this.searchYear.some(z => z === x.anno_scadenza.toString() && this.searchScm.some(y => y === x.scm.toString()) && this.searchInUso.some(w => w === x.in_uso) && this.searchCampione.some(k => k === x.campione_di_riferimento) )); 
    } 
  }

  reset_cod_miq(): void {
    this.searchValue_cod_miq = '';
    this.search_cod_miq();
  }

  search_cod_miq(): void {
    this.visible_cod_miq = false;
    if (this.flagInUso == false && this.flagYear == false && this.flagScm == false && this.flagCampione == false){
      this.flagInUso = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1);
    }
    else if (this.flagInUso == false && this.flagYear == false && this.flagCampione == false){
      this.flagInUso = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { scm: string; }) => this.searchScm.some(y => y === x.scm.toString())); 
    }
    else if (this.flagInUso == false && this.flagScm == false && this.flagCampione == false){
      this.flagInUso = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { anno_scadenza: string; }) =>  this.searchYear.some(z => z === x.anno_scadenza.toString())); 
    }
    else if (this.flagScm == false && this.flagYear == false && this.flagCampione == false){
      this.flagInUso = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { in_uso: string; }) => this.searchInUso.some(y => y === x.in_uso)); 
    }
    else if (this.flagScm == false && this.flagYear == false && this.flagInUso == false){
      this.flagInUso = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { campione_di_riferimento: string; }) => this.searchCampione.some(y => y === x.campione_di_riferimento)); 
    }
    else if (this.flagInUso == false && this.flagYear == false){
      this.flagInUso = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { scm: string; campione_di_riferimento: string;}) => this.searchScm.some(y => y === x.scm.toString() && this.searchCampione.some(z => z === x.campione_di_riferimento))); 
    }
    else if (this.flagInUso == false && this.flagScm == false){
      this.flagInUso = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { anno_scadenza: string; campione_di_riferimento: string;}) =>  this.searchYear.some(z => z === x.anno_scadenza.toString() && this.searchCampione.some(y => y === x.campione_di_riferimento))); 
    }
    else if (this.flagScm == false && this.flagYear == false){
      this.flagInUso = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { in_uso: string; campione_di_riferimento: string;}) => this.searchInUso.some(y => y === x.in_uso) && this.searchCampione.some(z => z === x.campione_di_riferimento)); 
    }
    else if (this.flagCampione == false && this.flagYear == false){
      this.flagInUso = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { scm: string; in_uso: string;}) => this.searchScm.some(y => y === x.scm.toString() && this.searchInUso.some(z => z === x.in_uso))); 
    }
    else if (this.flagInUso == false && this.flagCampione == false){
      this.flagInUso = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { anno_scadenza: string; scm: string;}) =>  this.searchYear.some(z => z === x.anno_scadenza.toString() && this.searchScm.some(y => y === x.scm.toString()))); 
    }
    else if (this.flagScm == false && this.flagCampione == false){
      this.flagInUso = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { in_uso: string; anno_scadenza: string;}) => this.searchInUso.some(y => y === x.in_uso) && this.searchYear.some(z => z === x.anno_scadenza.toString())); 
    }
    else if (this.flagScm == false){
      this.flagInUso = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: {anno_scadenza: string; in_uso: string; campione_di_riferimento: string;}) => this.searchYear.some(z => z === x.anno_scadenza.toString() && this.searchInUso.some(y => y === x.in_uso) && this.searchCampione.some(w => w === x.campione_di_riferimento) )); 
    }
    else if (this.flagYear== false){
      this.flagInUso = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: {in_uso: string; scm: string; campione_di_riferimento: string;}) => this.searchInUso.some(z => z === x.in_uso && this.searchScm.some(y => y === x.scm.toString()) && this.searchCampione.some(w => w === x.campione_di_riferimento) )); 
    }
    else if (this.flagInUso == false){
      this.flagInUso = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: {anno_scadenza: string; scm: string; campione_di_riferimento: string;}) => this.searchYear.some(z => z === x.anno_scadenza.toString() && this.searchScm.some(y => y === x.scm.toString()) && this.searchCampione.some(w => w === x.campione_di_riferimento) )); 
    }
    else if (this.flagCampione == false){
      this.flagInUso = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: {in_uso: string; scm: string; anno_scadenza: string;}) => this.searchInUso.some(z => z === x.in_uso && this.searchScm.some(y => y === x.scm.toString()) && this.searchYear.some(w => w === x.anno_scadenza.toString()))); 
    }  
    else{
      this.flagInUso = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: {anno_scadenza: string; scm: string, in_uso: string; campione_di_riferimento: string;}) => this.searchYear.some(z => z === x.anno_scadenza.toString() && this.searchScm.some(y => y === x.scm.toString()) && this.searchInUso.some(w => w === x.in_uso) && this.searchCampione.some(k => k === x.campione_di_riferimento) )); 
    }
  }

  reset_denominazione(): void {
    this.searchValue_denominazione = '';
    this.search_denominazione();
  }

  search_denominazione(): void {
    this.visible_denominazione = false;
    if (this.flagInUso == false && this.flagYear == false && this.flagScm == false && this.flagCampione == false){
      this.flagInUso = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1);
    }
    else if (this.flagInUso == false && this.flagYear == false && this.flagCampione == false){
      this.flagInUso = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { scm: string; }) => this.searchScm.some(y => y === x.scm.toString())); 
    }
    else if (this.flagInUso == false && this.flagScm == false && this.flagCampione == false){
      this.flagInUso = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { anno_scadenza: string; }) =>  this.searchYear.some(z => z === x.anno_scadenza.toString())); 
    }
    else if (this.flagScm == false && this.flagYear == false && this.flagCampione == false){
      this.flagInUso = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { in_uso: string; }) => this.searchInUso.some(y => y === x.in_uso)); 
    }
    else if (this.flagScm == false && this.flagYear == false && this.flagInUso == false){
      this.flagInUso = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { campione_di_riferimento: string; }) => this.searchCampione.some(y => y === x.campione_di_riferimento)); 
    }
    else if (this.flagInUso == false && this.flagYear == false){
      this.flagInUso = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { scm: string; campione_di_riferimento: string;}) => this.searchScm.some(y => y === x.scm.toString() && this.searchCampione.some(z => z === x.campione_di_riferimento))); 
    }
    else if (this.flagInUso == false && this.flagScm == false){
      this.flagInUso = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { anno_scadenza: string; campione_di_riferimento: string;}) =>  this.searchYear.some(z => z === x.anno_scadenza.toString() && this.searchCampione.some(y => y === x.campione_di_riferimento))); 
    }
    else if (this.flagScm == false && this.flagYear == false){
      this.flagInUso = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { in_uso: string; campione_di_riferimento: string;}) => this.searchInUso.some(y => y === x.in_uso) && this.searchCampione.some(z => z === x.campione_di_riferimento)); 
    }
    else if (this.flagCampione == false && this.flagYear == false){
      this.flagInUso = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { scm: string; in_uso: string;}) => this.searchScm.some(y => y === x.scm.toString() && this.searchInUso.some(z => z === x.in_uso))); 
    }
    else if (this.flagInUso == false && this.flagCampione == false){
      this.flagInUso = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { anno_scadenza: string; scm: string;}) =>  this.searchYear.some(z => z === x.anno_scadenza.toString() && this.searchScm.some(y => y === x.scm.toString()))); 
    }
    else if (this.flagScm == false && this.flagCampione == false){
      this.flagInUso = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: { in_uso: string; anno_scadenza: string;}) => this.searchInUso.some(y => y === x.in_uso) && this.searchYear.some(z => z === x.anno_scadenza.toString())); 
    }
    else if (this.flagScm == false){
      this.flagInUso = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: {anno_scadenza: string; in_uso: string; campione_di_riferimento: string;}) => this.searchYear.some(z => z === x.anno_scadenza.toString() && this.searchInUso.some(y => y === x.in_uso) && this.searchCampione.some(w => w === x.campione_di_riferimento) )); 
    }
    else if (this.flagYear== false){
      this.flagInUso = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: {in_uso: string; scm: string; campione_di_riferimento: string;}) => this.searchInUso.some(z => z === x.in_uso && this.searchScm.some(y => y === x.scm.toString()) && this.searchCampione.some(w => w === x.campione_di_riferimento) )); 
    }
    else if (this.flagInUso == false){
      this.flagInUso = false;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: {anno_scadenza: string; scm: string; campione_di_riferimento: string;}) => this.searchYear.some(z => z === x.anno_scadenza.toString() && this.searchScm.some(y => y === x.scm.toString()) && this.searchCampione.some(w => w === x.campione_di_riferimento) )); 
    }
    else if (this.flagCampione == false){
      this.flagInUso = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: {in_uso: string; scm: string; anno_scadenza: string;}) => this.searchInUso.some(z => z === x.in_uso && this.searchScm.some(y => y === x.scm.toString()) && this.searchYear.some(w => w === x.anno_scadenza.toString()))); 
    }  
    else{
      this.flagInUso = true;
      this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1).filter((x: {anno_scadenza: string; scm: string, in_uso: string; campione_di_riferimento: string;}) => this.searchYear.some(z => z === x.anno_scadenza.toString() && this.searchScm.some(y => y === x.scm.toString()) && this.searchInUso.some(w => w === x.in_uso) && this.searchCampione.some(k => k === x.campione_di_riferimento) )); 
    }
  }

  isEditing(itemId: any): boolean {
    return this.editCache[itemId]?.edit || false;
  }

  Login(): void {
    this.login = true;
}

chiudiLogin(): void {
  this.login = false;
}

effettuaLogin(username: string, password: string) {
  console.log("effettuaLogin è stato schiacciato")
  
  if ((this.username == this.checkUser && this.password == this.checkPsw) || (this.username == this.checkUser3 && this.password == this.checkPsw3) || (this.username == this.checkUser4 && this.password == this.checkPsw4) || (this.username == this.checkUser5 && this.password == this.checkPsw5)) {
    this.myCheckAll = true;
    sessionStorage.setItem('usr',username)
    sessionStorage.setItem('psw',password)

    let myCheckAllString = JSON.stringify(this.myCheckAll)
    let myCheckUserString = JSON.stringify(this.myCheckUser)
    sessionStorage.setItem('myCheckAll', myCheckAllString)
    sessionStorage.setItem('myCheckUser',myCheckUserString) 
    console.log('sessionStorage',sessionStorage)
    this.login = false;
    }
    else if ((this.username == this.checkUser2 && this.password == this.checkPsw2) || (this.username == this.checkUser6 && this.password == this.checkPsw6) || (this.username == this.checkUser7 && this.password == this.checkPsw7)) {
      this.myCheckUser = true;
      sessionStorage.setItem('usr',username)
      sessionStorage.setItem('psw',password)

      let myCheckAllString = JSON.stringify(this.myCheckAll)
      let myCheckUserString = JSON.stringify(this.myCheckUser)
      sessionStorage.setItem('myCheckAll', myCheckAllString)
      sessionStorage.setItem('myCheckUser',myCheckUserString)
      console.log('sessionStorage',sessionStorage)
      this.login = false;
    }
    else{
          this.message.error("Login fallito", {
            nzDuration: 5000
          });
    }   
  
}

effettuaLogout() {
  sessionStorage.removeItem('usr')
  sessionStorage.removeItem('psw')
  sessionStorage.removeItem('myCheckAll')
  sessionStorage.removeItem('myCheckUser')
  this.username='';
  this.password='';
  this.myCheckAll = false;
  this.myCheckUser = false;
  this.ngOnInit();
}

calculateDueDate(): string {
  const startDate = new Date(this.modalScadenza_data);
  const frequencyDays = this.modalScadenza_freq;
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
  const startDate = new Date(this.modalScadenza_data);
  const frequencyDays = this.modalScadenza_freq;
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

}
