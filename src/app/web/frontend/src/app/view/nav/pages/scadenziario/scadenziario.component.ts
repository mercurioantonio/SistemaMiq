import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams,} from '@angular/common/http';
import { TrackService } from 'src/app/core/services/track.service';
import {Router} from '@angular/router'; 
import { ScambioService } from 'src/app/core/services/scambio';
import { NzMessageService } from 'ng-zorro-antd/message';
import { start } from 'repl';




@Component({
  selector: 'app-scadenziario',
  templateUrl: './scadenziario.component.html',
  styleUrls: ['./scadenziario.component.less']
})


export class ScadenziarioComponent implements OnInit {
  dataframeData: any;
  listOfDisplayData?:any;
  status: any;

  searchValue_cod_miq = '';
  searchValue_denominazione = '';
  searchValue_addetto = '';
  searchValue_localizzazione = '';

  visible_cod_miq = false;
  visible_denominazione = false;
  visible_addetto = false;
  visible_localizzazione = false;

  filter_scm!: any[];
  searchScm!: any[];
  flagScm = false;

  filter_year!: any[] ;
  searchYear!: any[];
  flagYear = false;

  filter_settimana!: any[] ;
  searchSettimana!: any[];
  flagSettimana = false;
  
  filter_conferma!: any[];
  searchConferma!: any[];
  flagConferma = false;

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
  myCheckUser: boolean = false;
  
  rescueTaraturaVisible: boolean = false;
  rescue_taratura: any;
  statusConfermaMetrologica: boolean = false;
  statusEliminaMetrologica: boolean = false;
  statusDataValidazione: boolean = false;
  modalDataValidazione: boolean = false;

  data_validazione: any;

  constructor(private message: NzMessageService, private http: HttpClient, private service: TrackService, private router:Router, private scambio:ScambioService) { }
  
    ngOnInit(): void {
      if(sessionStorage.getItem('usr') && sessionStorage.getItem('psw')){
        this.username = sessionStorage.getItem('usr') as string;
        this.password = sessionStorage.getItem('psw') as string;
        this.effettuaLogin(this.username, this.password)
      }else{
        this.myCheckAll=false
        this.myCheckUser=false;
      }

      // Esegui una richiesta HTTP per ottenere i dati dal tuo servizio API
        this.service.getScadenziario().subscribe((data: any) => {
        this.dataframeData = data;
        console.log(this.dataframeData)
        this.listOfDisplayData = this.dataframeData;
        this.listOfDisplayData = this.listOfDisplayData.map((item: any) => {
          if (item.da_confermare === false) {
              item.da_confermare = 'No';
          }
          if (item.da_confermare === true) {
            item.da_confermare = 'Si';
          }
          return item;
        });
       

        const year = [...new Set(this.dataframeData.map((item: { anno_scadenza: any; }) => item.anno_scadenza))];
        this.filter_year =  [];
        for (var i in year){
          const filter_year_final = { 'text': year[i], 'value': year[i] } 
          this.filter_year.push(filter_year_final)
        }
        // this.filter_year.sort((a,b) => (parseFloat(a.text) > parseFloat(b.text)) ? 1 : ((parseFloat(b.text) > parseFloat(a.text)) ? -1 : 0))
        this.filter_year.sort((a, b) => {
          const numA = parseFloat(a.text);
          const numB = parseFloat(b.text);
        
          if (!isNaN(numA) && !isNaN(numB)) {
            // Se entrambi i valori sono numeri, ordinamento basato sui numeri
            return numA - numB;
          } else if (isNaN(numA) && isNaN(numB)) {
            // Se entrambi i valori non sono numeri, ordinamento basato sulla stringa
            if (a.text === '<NA>') return 1; // <NA> va alla fine
            if (b.text === '<NA>') return -1; // <NA> va alla fine
            return a.text.localeCompare(b.text);
          } else {
            // Se uno dei valori non è un numero, posizionalo alla fine
            return isNaN(numA) ? 1 : -1;
          }
        });

        const scm = [...new Set(this.dataframeData.map((item: { scm: any; }) => item.scm))];
        this.filter_scm =  [];
        for (var i in scm){
          const filter_scm_final = { 'text': scm[i], 'value': scm[i] }
          this.filter_scm.push(filter_scm_final)
        }
        // this.filter_scm.sort((a,b) => (parseFloat(a.text) > parseFloat(b.text)) ? 1 : ((parseFloat(b.text) > parseFloat(a.text)) ? -1 : 0))
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

        const settimana = [...new Set(this.dataframeData.map((item: { settimana_scadenza: any; }) => item.settimana_scadenza))];
        this.filter_settimana =  [];
        for (var i in settimana){
          const filter_settimana_final = { 'text': settimana[i], 'value': settimana[i] }
          this.filter_settimana.push(filter_settimana_final)
        }
        this.filter_settimana.sort((a, b) => {
          const numA = parseFloat(a.text);
          const numB = parseFloat(b.text);
        
          if (!isNaN(numA) && !isNaN(numB)) {
            return numA - numB;
          } else if (isNaN(numA) && isNaN(numB)) {
            if (a.text === '<NA>') return 1; // <NA> va alla fine
            if (b.text === '<NA>') return -1; // <NA> va alla fine
            return a.text.localeCompare(b.text);
          } else {
            return isNaN(numA) ? 1 : -1;
          }
        });


        const conferma = [...new Set(this.dataframeData.map((item: { da_confermare: any; }) => item.da_confermare))];
        this.filter_conferma =  [];
        for (var i in conferma){
          const filter_conferma_final = { 'text': conferma[i], 'value': conferma[i] }
          this.filter_conferma.push(filter_conferma_final)
        }
        // this.filter_scm.sort((a,b) => (parseFloat(a.text) > parseFloat(b.text)) ? 1 : ((parseFloat(b.text) > parseFloat(a.text)) ? -1 : 0))
        this.filter_conferma.sort((a, b) => {
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


      });
    }

    filterScm(value: string[]): void {
      this.searchScm = value;
      if (this.flagYear == false && this.flagSettimana == false && this.flagConferma == false && this.searchScm.length === 0){
        this.flagScm = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1);
      }
  
      else if (this.flagYear == false && this.flagSettimana == false && this.flagConferma == false){
        this.flagScm = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { scm: string; }) => this.searchScm.some(y => y === x.scm.toString())); 
      }
      else if (this.flagYear == false && this.searchScm.length === 0 && this.flagConferma == false){
        this.flagScm = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { settimana_scadenza: string; }) =>  this.searchSettimana.some(z => z === x.settimana_scadenza.toString())); 
      }
      else if (this.searchScm.length === 0 && this.flagSettimana == false && this.flagConferma == false){
        this.flagScm = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { anno_scadenza: string; }) => this.searchYear.some(y => y === x.anno_scadenza)); 
      }

      else if (this.searchScm.length === 0 && this.flagSettimana == false && this.flagYear == false){
        this.flagScm = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { da_confermare: string; }) => this.searchConferma.some(y => y === x.da_confermare)); 
      }
      else if (this.flagYear == false && this.flagSettimana == false){
        this.flagScm = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { scm: string; da_confermare: string}) => this.searchScm.some(y => y === x.scm.toString() && this.searchConferma.some(z => z === x.da_confermare))); 
      }
      else if (this.flagYear == false && this.searchScm.length === 0){
        this.flagScm = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { settimana_scadenza: string; da_confermare: string }) =>  this.searchSettimana.some(z => z === x.settimana_scadenza.toString() && this.searchConferma.some(y => y === x.da_confermare))); 
      }
      else if (this.searchScm.length === 0 && this.flagSettimana == false){
        this.flagScm = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { anno_scadenza: string; da_confermare: string}) => this.searchYear.some(y => y === x.anno_scadenza && this.searchConferma.some(z => z === x.da_confermare))); 
      }
      else if (this.searchScm.length === 0 && this.flagConferma == false){
        this.flagScm = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { anno_scadenza: string; settimana_scadenza: string}) => this.searchYear.some(y => y === x.anno_scadenza && this.searchSettimana.some(z => z === x.settimana_scadenza))); 
      }
      else if (this.flagYear == false && this.flagConferma == false){
        this.flagScm = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { scm: string; settimana_scadenza: string}) => this.searchScm.some(y => y === x.scm.toString() && this.searchSettimana.some(z => z === x.settimana_scadenza))); 
      }
      else if (this.flagConferma == false && this.flagSettimana == false){
        this.flagScm = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { scm: string; anno_scadenza: string}) => this.searchScm.some(y => y === x.scm.toString() && this.searchYear.some(z => z === x.anno_scadenza))); 
      }
      else if (this.searchScm.length === 0){
        this.flagScm = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: {settimana_scadenza: string; anno_scadenza: string; da_confermare: string}) => this.searchSettimana.some(z => z === x.settimana_scadenza.toString() && this.searchYear.some(y => y === x.anno_scadenza) && this.searchConferma.some(w => w === x.da_confermare))); 
      }
      else if (this.flagSettimana == false){
        this.flagScm = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: {anno_scadenza: string; scm: string; da_confermare: string}) => this.searchYear.some(z => z === x.anno_scadenza.toString() && this.searchScm.some(y => y === x.scm.toString()) && this.searchConferma.some(w => w === x.da_confermare))); 
      }
      else if (this.flagYear == false){
        this.flagScm = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: {settimana_scadenza: string; scm: string; da_confermare: string}) => this.searchSettimana.some(z => z === x.settimana_scadenza.toString() && this.searchScm.some(y => y === x.scm.toString()) && this.searchConferma.some(w => w === x.da_confermare))); 
      }
      else if (this.flagConferma == false){
        this.flagScm = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: {settimana_scadenza: string; scm: string; anno_scadenza: string}) => this.searchSettimana.some(z => z === x.settimana_scadenza.toString() && this.searchScm.some(y => y === x.scm.toString()) && this.searchYear.some(w => w === x.anno_scadenza))); 
      }

    
      else{
        this.flagScm = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: {settimana_scadenza: string; scm: string, anno_scadenza: string; da_confermare: string;}) => this.searchSettimana.some(z => z === x.settimana_scadenza.toString() && this.searchScm.some(y => y === x.scm.toString()) && this.searchYear.some(w => w === x.anno_scadenza) && this.searchConferma.some(k => k === x.da_confermare))); 
      } 
    }

    filterYear(value: string[]): void {   
      this.searchYear = value;
      if (this.searchYear.length === 0 && this.flagSettimana == false && this.flagScm == false && this.flagConferma == false){
        this.flagYear = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1);
      }
      else if (this.searchYear.length === 0 && this.flagSettimana == false  && this.flagConferma == false){
        this.flagYear = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { scm: string; }) => this.searchScm.some(y => y === x.scm.toString())); 
      }
      else if (this.searchYear.length === 0 && this.flagScm == false && this.flagConferma == false){
        this.flagYear = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { settimana_scadenza: string; }) =>  this.searchSettimana.some(z => z === x.settimana_scadenza.toString())); 
      }
      else if (this.flagScm == false && this.flagSettimana == false){
        this.flagYear = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { anno_scadenza: string; }) => this.searchYear.some(y => y === x.anno_scadenza)); 
      }
      else if (this.flagScm == false && this.flagSettimana == false && this.searchYear.length === 0){
        this.flagYear = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { da_confermare: string; }) => this.searchConferma.some(y => y === x.da_confermare)); 
      }
      else if (this.searchYear.length === 0 && this.flagSettimana == false){
        this.flagYear = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { scm: string; da_confermare: string}) => this.searchScm.some(y => y === x.scm.toString() && this.searchConferma.some(z => z === x.da_confermare))); 
      }
      else if (this.searchYear.length === 0 && this.flagScm == false){
        this.flagYear = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { settimana_scadenza: string; da_confermare: string}) =>  this.searchSettimana.some(z => z === x.settimana_scadenza.toString() && this.searchConferma.some(y => y === x.da_confermare))); 
      }
      else if (this.flagScm == false && this.flagSettimana == false){
        this.flagYear = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { anno_scadenza: string;  da_confermare: string}) => this.searchYear.some(y => y === x.anno_scadenza && this.searchConferma.some(z => z === x.da_confermare))); 
      }
      else if (this.flagScm == false && this.flagConferma == false){
        this.flagYear = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: {anno_scadenza: string; settimana_scadenza: string}) => this.searchYear.some(y => y === x.anno_scadenza && this.searchSettimana.some(z => z === x.settimana_scadenza)));
      }
      else if (this.searchYear.length === 0 && this.flagConferma == false){
        this.flagYear = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { settimana_scadenza: string; scm: string}) =>  this.searchSettimana.some(z => z === x.settimana_scadenza.toString() && this.searchScm.some(y => y === x.scm.toString()))); 
      }
      else if (this.flagConferma == false && this.flagSettimana == false){
        this.flagYear = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { anno_scadenza: string; scm: string}) => this.searchYear.some(y => y === x.anno_scadenza && this.searchScm.some(z => z === x.scm.toString()))); 
      }
      else if (this.flagScm == false){
        this.flagYear = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: {settimana_scadenza: string; anno_scadenza: string; da_confermare: string}) => this.searchSettimana.some(z => z === x.settimana_scadenza.toString() && this.searchYear.some(y => y === x.anno_scadenza) && this.searchConferma.some(w => w === x.da_confermare))); 
      }
      else if (this.flagSettimana == false){
        this.flagYear = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: {anno_scadenza: string; scm: string; da_confermare: string}) => this.searchYear.some(z => z === x.anno_scadenza.toString() && this.searchScm.some(y => y === x.scm.toString()) && this.searchConferma.some(w => w === x.da_confermare))); 
      }
      else if (this.searchYear.length === 0){
        this.flagYear = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: {settimana_scadenza: string; scm: string; da_confermare: string}) => this.searchSettimana.some(z => z === x.settimana_scadenza.toString() && this.searchScm.some(y => y === x.scm.toString()) && this.searchConferma.some(w => w === x.da_confermare))); 
      }
      else if (this.flagConferma == false){
        this.flagYear = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: {settimana_scadenza: string; anno_scadenza: string; scm: string;}) => this.searchSettimana.some(z => z === x.settimana_scadenza.toString() && this.searchYear.some(y => y === x.anno_scadenza) && this.searchScm.some(w => w === x.scm.toString()))); 
      }
    
      else{
        this.flagYear = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: {settimana_scadenza: string; scm: string, anno_scadenza: string; da_confermare: string}) => this.searchSettimana.some(z => z === x.settimana_scadenza.toString() && this.searchScm.some(y => y === x.scm.toString()) && this.searchYear.some(w => w === x.anno_scadenza) && this.searchConferma.some(k => k === x.da_confermare))); 
      } 
    }

    filterSettimana(value: string[]): void {   
      this.searchSettimana = value;
      if (this.flagYear == false && this.searchSettimana.length === 0 && this.flagScm == false && this.flagConferma == false){
        this.flagSettimana = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1);
      }
      else if (this.flagYear == false && this.searchSettimana.length === 0 && this.flagConferma == false){
        this.flagSettimana = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { scm: string; }) => this.searchScm.some(y => y === x.scm.toString())); 
      }
      else if (this.flagYear == false && this.flagScm == false && this.flagConferma == false){
        this.flagSettimana = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { settimana_scadenza: string; }) =>  this.searchSettimana.some(z => z === x.settimana_scadenza.toString())); 
      }
      else if (this.flagScm == false && this.searchSettimana.length === 0 && this.flagConferma == false){
        this.flagSettimana = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { anno_scadenza: string; }) => this.searchYear.some(y => y === x.anno_scadenza)); 
      }
      else if (this.flagScm == false && this.searchSettimana.length === 0 && this.flagYear == false){
        this.flagSettimana = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { da_confermare: string; }) => this.searchConferma.some(y => y === x.da_confermare)); 
      }
      else if (this.flagYear == false && this.searchSettimana.length === 0){
        this.flagSettimana = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { scm: string; da_confermare: string }) => this.searchScm.some(y => y === x.scm.toString() && this.searchConferma.some(z => z === x.da_confermare))); 
      }
      else if (this.flagYear == false && this.flagScm == false){
        this.flagSettimana = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { settimana_scadenza: string; da_confermare: string}) =>  this.searchSettimana.some(z => z === x.settimana_scadenza.toString() && this.searchConferma.some(y => y === x.da_confermare))); 
      }
      else if (this.flagScm == false && this.searchSettimana.length === 0){
        this.flagSettimana = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { anno_scadenza: string; da_confermare: string}) => this.searchYear.some(y => y === x.anno_scadenza && this.searchConferma.some(z => z === x.da_confermare))); 
      }
      else if (this.flagConferma == false && this.flagScm == false){
        this.flagSettimana = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { anno_scadenza: string; settimana_scadenza: string;}) => this.searchYear.some(y => y === x.anno_scadenza && this.searchSettimana.some(z => z === x.settimana_scadenza.toString()))); 
      }
      else if (this.flagYear == false && this.flagConferma == false){
        this.flagSettimana = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { settimana_scadenza: string; scm: string;}) =>  this.searchSettimana.some(z => z === x.settimana_scadenza.toString() && this.searchScm.some(y => y === x.scm.toString()))); 
      }
      else if (this.flagConferma == false && this.searchSettimana.length === 0){
        this.flagSettimana = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { anno_scadenza: string; scm: string;}) => this.searchYear.some(y => y === x.anno_scadenza && this.searchScm.some(y => y === x.scm.toString()))); 
      }
      else if (this.flagScm == false){
        this.flagSettimana = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: {settimana_scadenza: string; anno_scadenza: string; da_confermare: string}) => this.searchSettimana.some(z => z === x.settimana_scadenza.toString() && this.searchYear.some(y => y === x.anno_scadenza) && this.searchConferma.some(w => w === x.da_confermare))); 
      }
      else if (this.searchSettimana.length === 0){
        this.flagSettimana = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: {anno_scadenza: string; scm: string; da_confermare: string}) => this.searchYear.some(z => z === x.anno_scadenza.toString() && this.searchScm.some(y => y === x.scm.toString()) && this.searchConferma.some(w => w === x.da_confermare))); 
      }
      else if (this.flagYear == false){
        this.flagSettimana = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: {settimana_scadenza: string; scm: string; da_confermare: string}) => this.searchSettimana.some(z => z === x.settimana_scadenza.toString() && this.searchScm.some(y => y === x.scm.toString()) && this.searchConferma.some(w => w === x.da_confermare))); 
      }
      else if (this.flagConferma == false){
        this.flagSettimana = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: {settimana_scadenza: string; scm: string; anno_scadenza: string;}) => this.searchSettimana.some(z => z === x.settimana_scadenza.toString() && this.searchScm.some(y => y === x.scm.toString()) && this.searchYear.some(y => y === x.anno_scadenza))); 
      }
      else{
        this.flagSettimana = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: {settimana_scadenza: string; scm: string, anno_scadenza: string; da_confermare: string}) => this.searchSettimana.some(z => z === x.settimana_scadenza.toString() && this.searchScm.some(y => y === x.scm.toString()) && this.searchYear.some(w => w === x.anno_scadenza) && this.searchConferma.some(k => k === x.da_confermare))); 
      } 
    }

    filterConferma(value: string[]): void {   
      this.searchConferma = value;
      if (this.flagYear == false && this.searchConferma.length === 0 && this.flagScm == false && this.flagSettimana == false){
        this.flagConferma = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1);
      }
      else if (this.flagYear == false && this.searchConferma.length === 0 && this.flagSettimana == false){
        this.flagConferma = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { scm: string; }) => this.searchScm.some(y => y === x.scm.toString())); 
      }
      else if (this.flagYear == false && this.flagScm == false && this.flagSettimana == false){
        this.flagConferma = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { da_confermare: string; }) =>  this.searchConferma.some(z => z === x.da_confermare)); 
      }
      else if (this.flagScm == false && this.searchConferma.length === 0 && this.flagSettimana == false){
        this.flagConferma = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { anno_scadenza: string; }) => this.searchYear.some(y => y === x.anno_scadenza)); 
      }
      else if (this.flagScm == false && this.searchConferma.length === 0 && this.flagYear == false){
        this.flagConferma = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { settimana_scadenza: string; }) => this.searchSettimana.some(y => y === x.settimana_scadenza.toString())); 
      }
      else if (this.flagYear == false && this.searchConferma.length === 0){
        this.flagConferma = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { scm: string; settimana_scadenza: string }) => this.searchScm.some(y => y === x.scm.toString() && this.searchSettimana.some(z => z === x.settimana_scadenza.toString()))); 
      }
      else if (this.flagYear == false && this.flagScm == false){
        this.flagConferma = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { settimana_scadenza: string; da_confermare: string}) =>  this.searchSettimana.some(z => z === x.settimana_scadenza.toString() && this.searchConferma.some(y => y === x.da_confermare))); 
      }
      else if (this.flagScm == false && this.searchConferma.length === 0){
        this.flagConferma = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { anno_scadenza: string; settimana_scadenza: string}) => this.searchYear.some(y => y === x.anno_scadenza && this.searchSettimana.some(z => z === x.settimana_scadenza.toString()))); 
      }
      else if (this.flagSettimana == false && this.flagScm == false){
        this.flagConferma = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { anno_scadenza: string; da_confermare: string;}) => this.searchYear.some(y => y === x.anno_scadenza && this.searchConferma.some(z => z === x.da_confermare))); 
      }
      else if (this.flagYear == false && this.flagSettimana == false){
        this.flagConferma = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { da_confermare: string; scm: string;}) =>  this.searchConferma.some(z => z === x.da_confermare && this.searchScm.some(y => y === x.scm.toString()))); 
      }
      else if (this.flagSettimana == false && this.searchConferma.length === 0){
        this.flagConferma = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { anno_scadenza: string; scm: string;}) => this.searchYear.some(y => y === x.anno_scadenza && this.searchScm.some(y => y === x.scm.toString()))); 
      }
      else if (this.flagScm == false){
        this.flagConferma = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: {settimana_scadenza: string; anno_scadenza: string; da_confermare: string}) => this.searchSettimana.some(z => z === x.settimana_scadenza.toString() && this.searchYear.some(y => y === x.anno_scadenza) && this.searchConferma.some(w => w === x.da_confermare))); 
      }
      else if (this.searchConferma.length === 0){
        this.flagConferma = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: {anno_scadenza: string; scm: string; settimana_scadenza: string}) => this.searchYear.some(z => z === x.anno_scadenza.toString() && this.searchScm.some(y => y === x.scm.toString()) && this.searchSettimana.some(w => w === x.settimana_scadenza.toString()))); 
      }
      else if (this.flagYear == false){
        this.flagConferma = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: {settimana_scadenza: string; scm: string; da_confermare: string}) => this.searchSettimana.some(z => z === x.settimana_scadenza.toString() && this.searchScm.some(y => y === x.scm.toString()) && this.searchConferma.some(w => w === x.da_confermare))); 
      }
      else if (this.flagSettimana == false){
        this.flagConferma = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: {da_confermare: string; scm: string; anno_scadenza: string;}) => this.searchConferma.some(z => z === x.da_confermare && this.searchScm.some(y => y === x.scm.toString()) && this.searchYear.some(y => y === x.anno_scadenza))); 
      }
      else{
        this.flagConferma = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: {settimana_scadenza: string; scm: string, anno_scadenza: string; da_confermare: string}) => this.searchSettimana.some(z => z === x.settimana_scadenza.toString() && this.searchScm.some(y => y === x.scm.toString()) && this.searchYear.some(w => w === x.anno_scadenza) && this.searchConferma.some(k => k === x.da_confermare))); 
      } 
    }

  
    reset_cod_miq(): void {
      this.searchValue_cod_miq = '';
      this.search_cod_miq();
    }
  
    search_cod_miq(): void {
      this.visible_cod_miq = false;
      if (this.flagYear == false && this.flagConferma == false && this.flagScm == false && this.flagSettimana == false){
        this.flagConferma = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1);
      }
      else if (this.flagYear == false && this.flagConferma == false && this.flagSettimana == false){
        this.flagConferma = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { scm: string; }) => this.searchScm.some(y => y === x.scm.toString())); 
      }
      else if (this.flagYear == false && this.flagScm == false && this.flagSettimana == false){
        this.flagConferma = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { da_confermare: string; }) =>  this.searchConferma.some(z => z === x.da_confermare)); 
      }
      else if (this.flagScm == false && this.flagConferma == false && this.flagSettimana == false){
        this.flagConferma = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { anno_scadenza: string; }) => this.searchYear.some(y => y === x.anno_scadenza)); 
      }
      else if (this.flagScm == false && this.flagConferma == false && this.flagYear == false){
        this.flagConferma = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { settimana_scadenza: string; }) => this.searchSettimana.some(y => y === x.settimana_scadenza.toString())); 
      }
      else if (this.flagYear == false && this.flagConferma == false){
        this.flagConferma = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { scm: string; settimana_scadenza: string }) => this.searchScm.some(y => y === x.scm.toString() && this.searchSettimana.some(z => z === x.settimana_scadenza.toString()))); 
      }
      else if (this.flagYear == false && this.flagScm == false){
        this.flagConferma = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { settimana_scadenza: string; da_confermare: string}) =>  this.searchSettimana.some(z => z === x.settimana_scadenza.toString() && this.searchConferma.some(y => y === x.da_confermare))); 
      }
      else if (this.flagScm == false && this.flagConferma == false){
        this.flagConferma = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { anno_scadenza: string; settimana_scadenza: string}) => this.searchYear.some(y => y === x.anno_scadenza && this.searchSettimana.some(z => z === x.settimana_scadenza.toString()))); 
      }
      else if (this.flagSettimana == false && this.flagScm == false){
        this.flagConferma = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { anno_scadenza: string; da_confermare: string;}) => this.searchYear.some(y => y === x.anno_scadenza && this.searchConferma.some(z => z === x.da_confermare))); 
      }
      else if (this.flagYear == false && this.flagSettimana == false){
        this.flagConferma = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { da_confermare: string; scm: string;}) =>  this.searchConferma.some(z => z === x.da_confermare && this.searchScm.some(y => y === x.scm.toString()))); 
      }
      else if (this.flagSettimana == false && this.flagConferma == false){
        this.flagConferma = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { anno_scadenza: string; scm: string;}) => this.searchYear.some(y => y === x.anno_scadenza && this.searchScm.some(y => y === x.scm.toString()))); 
      }
      else if (this.flagScm == false){
        this.flagConferma = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: {settimana_scadenza: string; anno_scadenza: string; da_confermare: string}) => this.searchSettimana.some(z => z === x.settimana_scadenza.toString() && this.searchYear.some(y => y === x.anno_scadenza) && this.searchConferma.some(w => w === x.da_confermare))); 
      }
      else if (this.flagConferma == false){
        this.flagConferma = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: {anno_scadenza: string; scm: string; settimana_scadenza: string}) => this.searchYear.some(z => z === x.anno_scadenza.toString() && this.searchScm.some(y => y === x.scm.toString()) && this.searchSettimana.some(w => w === x.settimana_scadenza.toString()))); 
      }
      else if (this.flagYear == false){
        this.flagConferma = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: {settimana_scadenza: string; scm: string; da_confermare: string}) => this.searchSettimana.some(z => z === x.settimana_scadenza.toString() && this.searchScm.some(y => y === x.scm.toString()) && this.searchConferma.some(w => w === x.da_confermare))); 
      }
      else if (this.flagSettimana == false){
        this.flagConferma = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: {da_confermare: string; scm: string; anno_scadenza: string;}) => this.searchConferma.some(z => z === x.da_confermare && this.searchScm.some(y => y === x.scm.toString()) && this.searchYear.some(y => y === x.anno_scadenza))); 
      }
      else{
        this.flagConferma = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: {settimana_scadenza: string; scm: string, anno_scadenza: string; da_confermare: string}) => this.searchSettimana.some(z => z === x.settimana_scadenza.toString() && this.searchScm.some(y => y === x.scm.toString()) && this.searchYear.some(w => w === x.anno_scadenza) && this.searchConferma.some(k => k === x.da_confermare))); 
      } 
      }

    reset_denominazione(): void {
      this.searchValue_denominazione = '';
      this.search_denominazione();
    }
  
    search_denominazione(): void {
      this.visible_denominazione = false;
      if (this.flagYear == false && this.flagConferma == false && this.flagScm == false && this.flagSettimana == false){
        this.flagConferma = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1);
      }
      else if (this.flagYear == false && this.flagConferma == false && this.flagSettimana == false){
        this.flagConferma = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { scm: string; }) => this.searchScm.some(y => y === x.scm.toString())); 
      }
      else if (this.flagYear == false && this.flagScm == false && this.flagSettimana == false){
        this.flagConferma = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { da_confermare: string; }) =>  this.searchConferma.some(z => z === x.da_confermare)); 
      }
      else if (this.flagScm == false && this.flagConferma == false && this.flagSettimana == false){
        this.flagConferma = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { anno_scadenza: string; }) => this.searchYear.some(y => y === x.anno_scadenza)); 
      }
      else if (this.flagScm == false && this.flagConferma == false && this.flagYear == false){
        this.flagConferma = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { settimana_scadenza: string; }) => this.searchSettimana.some(y => y === x.settimana_scadenza.toString())); 
      }
      else if (this.flagYear == false && this.flagConferma == false){
        this.flagConferma = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { scm: string; settimana_scadenza: string }) => this.searchScm.some(y => y === x.scm.toString() && this.searchSettimana.some(z => z === x.settimana_scadenza.toString()))); 
      }
      else if (this.flagYear == false && this.flagScm == false){
        this.flagConferma = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { settimana_scadenza: string; da_confermare: string}) =>  this.searchSettimana.some(z => z === x.settimana_scadenza.toString() && this.searchConferma.some(y => y === x.da_confermare))); 
      }
      else if (this.flagScm == false && this.flagConferma == false){
        this.flagConferma = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { anno_scadenza: string; settimana_scadenza: string}) => this.searchYear.some(y => y === x.anno_scadenza && this.searchSettimana.some(z => z === x.settimana_scadenza.toString()))); 
      }
      else if (this.flagSettimana == false && this.flagScm == false){
        this.flagConferma = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { anno_scadenza: string; da_confermare: string;}) => this.searchYear.some(y => y === x.anno_scadenza && this.searchConferma.some(z => z === x.da_confermare))); 
      }
      else if (this.flagYear == false && this.flagSettimana == false){
        this.flagConferma = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { da_confermare: string; scm: string;}) =>  this.searchConferma.some(z => z === x.da_confermare && this.searchScm.some(y => y === x.scm.toString()))); 
      }
      else if (this.flagSettimana == false && this.flagConferma == false){
        this.flagConferma = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { anno_scadenza: string; scm: string;}) => this.searchYear.some(y => y === x.anno_scadenza && this.searchScm.some(y => y === x.scm.toString()))); 
      }
      else if (this.flagScm == false){
        this.flagConferma = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: {settimana_scadenza: string; anno_scadenza: string; da_confermare: string}) => this.searchSettimana.some(z => z === x.settimana_scadenza.toString() && this.searchYear.some(y => y === x.anno_scadenza) && this.searchConferma.some(w => w === x.da_confermare))); 
      }
      else if (this.flagConferma == false){
        this.flagConferma = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: {anno_scadenza: string; scm: string; settimana_scadenza: string}) => this.searchYear.some(z => z === x.anno_scadenza.toString() && this.searchScm.some(y => y === x.scm.toString()) && this.searchSettimana.some(w => w === x.settimana_scadenza.toString()))); 
      }
      else if (this.flagYear == false){
        this.flagConferma = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: {settimana_scadenza: string; scm: string; da_confermare: string}) => this.searchSettimana.some(z => z === x.settimana_scadenza.toString() && this.searchScm.some(y => y === x.scm.toString()) && this.searchConferma.some(w => w === x.da_confermare))); 
      }
      else if (this.flagSettimana == false){
        this.flagConferma = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: {da_confermare: string; scm: string; anno_scadenza: string;}) => this.searchConferma.some(z => z === x.da_confermare && this.searchScm.some(y => y === x.scm.toString()) && this.searchYear.some(y => y === x.anno_scadenza))); 
      }
      else{
        this.flagConferma = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: {settimana_scadenza: string; scm: string, anno_scadenza: string; da_confermare: string}) => this.searchSettimana.some(z => z === x.settimana_scadenza.toString() && this.searchScm.some(y => y === x.scm.toString()) && this.searchYear.some(w => w === x.anno_scadenza) && this.searchConferma.some(k => k === x.da_confermare))); 
      }  
    }

    reset_addetto(): void {
      this.searchValue_addetto = '';
      this.search_addetto();
    }
  
    search_addetto(): void {
      this.visible_addetto = false;
      if (this.flagYear == false && this.flagConferma == false && this.flagScm == false && this.flagSettimana == false){
        this.flagConferma = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1);
      }
      else if (this.flagYear == false && this.flagConferma == false && this.flagSettimana == false){
        this.flagConferma = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { scm: string; }) => this.searchScm.some(y => y === x.scm.toString())); 
      }
      else if (this.flagYear == false && this.flagScm == false && this.flagSettimana == false){
        this.flagConferma = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { da_confermare: string; }) =>  this.searchConferma.some(z => z === x.da_confermare)); 
      }
      else if (this.flagScm == false && this.flagConferma == false && this.flagSettimana == false){
        this.flagConferma = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { anno_scadenza: string; }) => this.searchYear.some(y => y === x.anno_scadenza)); 
      }
      else if (this.flagScm == false && this.flagConferma == false && this.flagYear == false){
        this.flagConferma = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { settimana_scadenza: string; }) => this.searchSettimana.some(y => y === x.settimana_scadenza.toString())); 
      }
      else if (this.flagYear == false && this.flagConferma == false){
        this.flagConferma = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { scm: string; settimana_scadenza: string }) => this.searchScm.some(y => y === x.scm.toString() && this.searchSettimana.some(z => z === x.settimana_scadenza.toString()))); 
      }
      else if (this.flagYear == false && this.flagScm == false){
        this.flagConferma = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { settimana_scadenza: string; da_confermare: string}) =>  this.searchSettimana.some(z => z === x.settimana_scadenza.toString() && this.searchConferma.some(y => y === x.da_confermare))); 
      }
      else if (this.flagScm == false && this.flagConferma == false){
        this.flagConferma = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { anno_scadenza: string; settimana_scadenza: string}) => this.searchYear.some(y => y === x.anno_scadenza && this.searchSettimana.some(z => z === x.settimana_scadenza.toString()))); 
      }
      else if (this.flagSettimana == false && this.flagScm == false){
        this.flagConferma = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { anno_scadenza: string; da_confermare: string;}) => this.searchYear.some(y => y === x.anno_scadenza && this.searchConferma.some(z => z === x.da_confermare))); 
      }
      else if (this.flagYear == false && this.flagSettimana == false){
        this.flagConferma = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { da_confermare: string; scm: string;}) =>  this.searchConferma.some(z => z === x.da_confermare && this.searchScm.some(y => y === x.scm.toString()))); 
      }
      else if (this.flagSettimana == false && this.flagConferma == false){
        this.flagConferma = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { anno_scadenza: string; scm: string;}) => this.searchYear.some(y => y === x.anno_scadenza && this.searchScm.some(y => y === x.scm.toString()))); 
      }
      else if (this.flagScm == false){
        this.flagConferma = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: {settimana_scadenza: string; anno_scadenza: string; da_confermare: string}) => this.searchSettimana.some(z => z === x.settimana_scadenza.toString() && this.searchYear.some(y => y === x.anno_scadenza) && this.searchConferma.some(w => w === x.da_confermare))); 
      }
      else if (this.flagConferma == false){
        this.flagConferma = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: {anno_scadenza: string; scm: string; settimana_scadenza: string}) => this.searchYear.some(z => z === x.anno_scadenza.toString() && this.searchScm.some(y => y === x.scm.toString()) && this.searchSettimana.some(w => w === x.settimana_scadenza.toString()))); 
      }
      else if (this.flagYear == false){
        this.flagConferma = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: {settimana_scadenza: string; scm: string; da_confermare: string}) => this.searchSettimana.some(z => z === x.settimana_scadenza.toString() && this.searchScm.some(y => y === x.scm.toString()) && this.searchConferma.some(w => w === x.da_confermare))); 
      }
      else if (this.flagSettimana == false){
        this.flagConferma = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: {da_confermare: string; scm: string; anno_scadenza: string;}) => this.searchConferma.some(z => z === x.da_confermare && this.searchScm.some(y => y === x.scm.toString()) && this.searchYear.some(y => y === x.anno_scadenza))); 
      }
      else{
        this.flagConferma = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: {settimana_scadenza: string; scm: string, anno_scadenza: string; da_confermare: string}) => this.searchSettimana.some(z => z === x.settimana_scadenza.toString() && this.searchScm.some(y => y === x.scm.toString()) && this.searchYear.some(w => w === x.anno_scadenza) && this.searchConferma.some(k => k === x.da_confermare))); 
      } 
    }

    reset_localizzazione(): void {
      this.searchValue_localizzazione = '';
      this.search_localizzazione();
    }
  
    search_localizzazione(): void {
      this.visible_localizzazione = false;
      if (this.flagYear == false && this.flagConferma == false && this.flagScm == false && this.flagSettimana == false){
        this.flagConferma = false;
        console.log(this.searchValue_localizzazione)

        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1);
      }
      else if (this.flagYear == false && this.flagConferma == false && this.flagSettimana == false){
        this.flagConferma = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { scm: string; }) => this.searchScm.some(y => y === x.scm.toString())); 
      }
      else if (this.flagYear == false && this.flagScm == false && this.flagSettimana == false){
        this.flagConferma = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { da_confermare: string; }) =>  this.searchConferma.some(z => z === x.da_confermare)); 
      }
      else if (this.flagScm == false && this.flagConferma == false && this.flagSettimana == false){
        this.flagConferma = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { anno_scadenza: string; }) => this.searchYear.some(y => y === x.anno_scadenza)); 
      }
      else if (this.flagScm == false && this.flagConferma == false && this.flagYear == false){
        this.flagConferma = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { settimana_scadenza: string; }) => this.searchSettimana.some(y => y === x.settimana_scadenza.toString())); 
      }
      else if (this.flagYear == false && this.flagConferma == false){
        this.flagConferma = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { scm: string; settimana_scadenza: string }) => this.searchScm.some(y => y === x.scm.toString() && this.searchSettimana.some(z => z === x.settimana_scadenza.toString()))); 
      }
      else if (this.flagYear == false && this.flagScm == false){
        this.flagConferma = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { settimana_scadenza: string; da_confermare: string}) =>  this.searchSettimana.some(z => z === x.settimana_scadenza.toString() && this.searchConferma.some(y => y === x.da_confermare))); 
      }
      else if (this.flagScm == false && this.flagConferma == false){
        this.flagConferma = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { anno_scadenza: string; settimana_scadenza: string}) => this.searchYear.some(y => y === x.anno_scadenza && this.searchSettimana.some(z => z === x.settimana_scadenza.toString()))); 
      }
      else if (this.flagSettimana == false && this.flagScm == false){
        this.flagConferma = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { anno_scadenza: string; da_confermare: string;}) => this.searchYear.some(y => y === x.anno_scadenza && this.searchConferma.some(z => z === x.da_confermare))); 
      }
      else if (this.flagYear == false && this.flagSettimana == false){
        this.flagConferma = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { da_confermare: string; scm: string;}) =>  this.searchConferma.some(z => z === x.da_confermare && this.searchScm.some(y => y === x.scm.toString()))); 
      }
      else if (this.flagSettimana == false && this.flagConferma == false){
        this.flagConferma = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: { anno_scadenza: string; scm: string;}) => this.searchYear.some(y => y === x.anno_scadenza && this.searchScm.some(y => y === x.scm.toString()))); 
      }
      else if (this.flagScm == false){
        this.flagConferma = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: {settimana_scadenza: string; anno_scadenza: string; da_confermare: string}) => this.searchSettimana.some(z => z === x.settimana_scadenza.toString() && this.searchYear.some(y => y === x.anno_scadenza) && this.searchConferma.some(w => w === x.da_confermare))); 
      }
      else if (this.flagConferma == false){
        this.flagConferma = false;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: {anno_scadenza: string; scm: string; settimana_scadenza: string}) => this.searchYear.some(z => z === x.anno_scadenza.toString() && this.searchScm.some(y => y === x.scm.toString()) && this.searchSettimana.some(w => w === x.settimana_scadenza.toString()))); 
      }
      else if (this.flagYear == false){
        this.flagConferma = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: {settimana_scadenza: string; scm: string; da_confermare: string}) => this.searchSettimana.some(z => z === x.settimana_scadenza.toString() && this.searchScm.some(y => y === x.scm.toString()) && this.searchConferma.some(w => w === x.da_confermare))); 
      }
      else if (this.flagSettimana == false){
        this.flagConferma = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: {da_confermare: string; scm: string; anno_scadenza: string;}) => this.searchConferma.some(z => z === x.da_confermare && this.searchScm.some(y => y === x.scm.toString()) && this.searchYear.some(y => y === x.anno_scadenza))); 
      }
      else{
        this.flagConferma = true;
        this.listOfDisplayData = this.dataframeData.filter((item: { cod_miq: string | string[]; denominazione_strumento: string | string; addetto_taratura: string | string; localizzazione: string | string; }) =>  item.cod_miq.indexOf(this.searchValue_cod_miq) !== -1 && item.denominazione_strumento.toUpperCase().indexOf(this.searchValue_denominazione.toUpperCase()) !== -1 && item.addetto_taratura.toUpperCase().indexOf(this.searchValue_addetto.toUpperCase()) !== -1 && item.localizzazione.toString().toUpperCase().indexOf(this.searchValue_localizzazione.toString().toUpperCase()) !== -1).filter((x: {settimana_scadenza: string; scm: string, anno_scadenza: string; da_confermare: string}) => this.searchSettimana.some(z => z === x.settimana_scadenza.toString() && this.searchScm.some(y => y === x.scm.toString()) && this.searchYear.some(w => w === x.anno_scadenza) && this.searchConferma.some(k => k === x.da_confermare))); 
      } 
      }

    taratura(cod:string,scm:number): void{
      var cod = cod;
      var scm = scm;
      console.log("Scadenziario.component.ts: ", cod,scm);
      this.scambio.setMiq(cod);
      this.router.navigate(['/scm'+ scm]);

      
    }

    esportaScadenziario(): void {
      this.service.esportaScadenziario().subscribe((res: any)=>{
        this.statusExport = res.status;
        console.log("Lo status di esportaScadenziario è:", this.statusExport)
        if (this.statusExport === 'success'){
          this.message.success("Esportazione dello scadenziario terminata con successo", {
            nzDuration: 5000
          });
        }
        else{
          this.message.error("Esportazione dello scadenziario fallita", {
            nzDuration: 5000
          });
    
        }  
      })
     
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

    rescueTaratura(cod_miq:any, scm:any){
      this.service.rescueTaratura(cod_miq,scm).subscribe((resRescueTaratura: any) => {
        console.log(resRescueTaratura)
        if (resRescueTaratura.status == 'success'){
          this.rescueTaraturaVisible = true;
          this.rescue_taratura = resRescueTaratura.rescue_taratura
          

          this.rescue_taratura = this.rescue_taratura.map((item: any) => {
            if ('calibrazione_A' in item) {
                if (item.calibrazione_A === 'false') {
                    item.calibrazione_A = 'No';
                }
                if (item.calibrazione_A === 'true') {
                  item.calibrazione_A = 'Si';
                }
            }

            if ('calibrazione_B' in item) {
              if (item.calibrazione_B === 'false') {
                  item.calibrazione_B = 'No';
              }
              if (item.calibrazione_B === 'true') {
                item.calibrazione_B = 'Si';
              }
            }

            if ('calibrazione_C' in item) {
              if (item.calibrazione_C === 'false') {
                  item.calibrazione_C = 'No';
              }
              if (item.calibrazione_C === 'true') {
                item.calibrazione_C = 'Si';
              }
            }

            if ('calibrazione_D' in item) {
              if (item.calibrazione_D === 'false') {
                  item.calibrazione_D = 'No';
              }
              if (item.calibrazione_D === 'true') {
                item.calibrazione_D = 'Si';
              }
            }

            if ('calibrazione_E' in item) {
              if (item.calibrazione_E === 'false') {
                  item.calibrazione_E = 'No';
              }
              if (item.calibrazione_E === 'true') {
                item.calibrazione_E = 'Si';
              }
            }

            if ('calibrazione_F' in item) {
              if (item.calibrazione_F === 'false') {
                  item.calibrazione_F = 'No';
              }
              if (item.calibrazione_F === 'true') {
                item.calibrazione_F = 'Si';
              }
            }            
            return item;
        });


        }
      });

    }

    chiudiRescueTaratura(): void {
      this.rescueTaraturaVisible = false;
      this.data_validazione = null;
    }

    validaData(): void {
      this.modalDataValidazione = true;
    }

    confermaMetrologica(data: any){
      this.service.confermaMetrologica(data).subscribe((resConfermaMetrologica: any) => {
        console.log(resConfermaMetrologica)
        if (resConfermaMetrologica.statusConfermaMetrologica == 'success'){
          this.statusConfermaMetrologica = true;
          this.rescueTaraturaVisible = false
          this.message.success("Conferma metrologica avvenuta con successo", {
            nzDuration: 5000
          });
          this.ngOnInit();
        }
        else{
          this.statusConfermaMetrologica = false;
          this.message.error("Conferma metrologica fallita", {
            nzDuration: 5000
          });
          this.ngOnInit();
        }
      });

    }

    eliminaMetrologica(data: any){
      this.service.eliminaMetrologica(data).subscribe((resEliminaMetrologica: any) => {
        console.log(resEliminaMetrologica)
        if (resEliminaMetrologica.statusEliminaMetrologica == 'success'){
          this.statusEliminaMetrologica = true;
          this.rescueTaraturaVisible = false
          this.message.success("Hai correttamente eliminato la taratura", {
            nzDuration: 5000
          });
          this.ngOnInit();
        }
        else{
          this.statusEliminaMetrologica = false;
          this.message.error("Eliminazione della taratura fallita", {
            nzDuration: 5000
          });
          this.ngOnInit();
        }
      });

    }

    modelChanged(newObj: any) {
      this.data_validazione = newObj;
    }

    calculateDueDate(): string {
      const startDate = new Date(this.data_validazione);
      const frequencyDays = this.rescue_taratura[0].freq_tarat_gg;
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
      const startDate = new Date(this.data_validazione);
      const frequencyDays = this.rescue_taratura[0].freq_tarat_gg;
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

