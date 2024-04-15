import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
const cacheBuster$: Subject<void> = new Subject<void>();

@Injectable({
  providedIn: 'root'
})
export class ScambioService {

  constructor(protected http: HttpClient) { }

  private cod_miq$ = new BehaviorSubject<any>({});
  selectedMiq$ = this.cod_miq$.asObservable();


  setMiq(cod_miq: any) {
    console.log("Scambio.ts esegue setMiq su: ", cod_miq);
    this.cod_miq$.next(cod_miq);

  }

}
