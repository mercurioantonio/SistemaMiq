import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
const cacheBuster$: Subject<void> = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class TrackService {
  //track: Track | undefined;
  public global_cod_miq: any
  selectedProduct$: any;
  constructor(protected http: HttpClient) { 
  }

  public getScadenziario(): Observable<any>{
    return this.http.get<any>(`${environment.server}${environment.contextRoot}scadenziario`);
  }

  public getDatabase(): Observable<any>{
    return this.http.get<any>(`${environment.server}${environment.contextRoot}database` );
  }

  public getTaratura(cod:string, scm:number): Observable<any>{
    const dati = {cod, scm}
    return this.http.post<any>(`${environment.server}${environment.contextRoot}taratura`, dati);
  }

  public getAnagrafica(cod_miq:any): Observable<any>{
    const cod_anagrafica = {cod_miq}
    console.log("track.service esegue getAnagrafica di: ", cod_anagrafica)
    return this.http.post(`${environment.server}${environment.contextRoot}anagrafica`, cod_anagrafica);
  }

  public esporta(): Observable<any>{
    console.log("track.service esegue esporta")
    return this.http.get(`${environment.server}${environment.contextRoot}esporta` );
  }

  public esportaScadenziario(): Observable<any>{
    console.log("track.service esegue esportaScadenziario")
    return this.http.get(`${environment.server}${environment.contextRoot}esportaScadenziario` );
  }

  public searchCampione(campione:any): Observable<any>{
    const campione_di_riferimento = {campione}
    console.log("track.service esegue searchCampione di: ", campione_di_riferimento)
    return this.http.post(`${environment.server}${environment.contextRoot}campione_di_riferimento`, campione_di_riferimento);
  }

  public insertTarat(misure: any): Observable<any>{
    console.log("Track service insertTarat: ", misure);
    return this.http.post(`${environment.server}${environment.contextRoot}taratura`, misure);
    
  }

  public prediction(misure: any): Observable<any>{
    console.log("Track service prediction: ", misure);
    return this.http.post(`${environment.server}${environment.contextRoot}prediction`, misure);
    
  }

  public changeFrequency(scm: any, cod_miq: any, periodo_prec: any, data: any): Observable<any>{
    console.log("Track service changeFrequency: ", scm, cod_miq, periodo_prec);
    const requestData = {
      scm: scm,
      cod_miq: cod_miq,
      periodo_prec: periodo_prec,
      data: data
    };
    return this.http.post(`${environment.server}${environment.contextRoot}changeFrequency`, requestData);
    
  }

  public insertTarat0(misure: any): Observable<any>{
    console.log("Track service insertTarat0: ", misure);
    return this.http.post(`${environment.server}${environment.contextRoot}taratura0`, misure);
    
  }

  public updateDatabase(update: any): Observable<any>{
    console.log("Track service updateDatabase: ", update );
    return this.http.post(`${environment.server}${environment.contextRoot}updateDatabase`, update);
    
  }

  public appendDatabase(append: any): Observable<any>{
    console.log("Track service appendDatabase: ", append );
    return this.http.post(`${environment.server}${environment.contextRoot}appendDatabase`, append);
    
  }

  public cancelDatabase(cancel: any): Observable<any>{
    console.log("Track service cancelDatabase: ", cancel );
    return this.http.post(`${environment.server}${environment.contextRoot}cancelDatabase`, cancel);
    
  }

  public getGraph(cod_miq:any, scm:number): Observable<any>{
    const cod_anagrafica = {cod_miq, scm}
    console.log("track.service esegue getGraph di: ", cod_anagrafica)
    return this.http.post(`${environment.server}${environment.contextRoot}graph`, cod_anagrafica);
  }

  public rescueTaratura(cod_miq:any, scm:number): Observable<any>{
    const da_confermare = {cod_miq, scm}
    console.log("track.service esegue rescueTaratura di: ", da_confermare)
    return this.http.post(`${environment.server}${environment.contextRoot}rescueTaratura`, da_confermare);
  }

  public confermaMetrologica(data:any): Observable<any>{
    console.log("track.service confermaMetrologica di: ", data)
    return this.http.post(`${environment.server}${environment.contextRoot}confermaMetrologica`, data);
  }

  public eliminaMetrologica(data:any): Observable<any>{
    console.log("track.service eliminaMetrologica di: ", data)
    return this.http.post(`${environment.server}${environment.contextRoot}eliminaMetrologica`, data);
  }
}
