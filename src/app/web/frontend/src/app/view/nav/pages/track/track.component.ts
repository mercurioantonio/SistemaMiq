import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams,} from '@angular/common/http';
import { TrackService } from 'src/app/core/services/track.service';
import {Router} from '@angular/router'; 
import { ScambioService } from 'src/app/core/services/scambio';


@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.less']
})
export class TrackComponent {

  constructor(private http: HttpClient, private service: TrackService, private router:Router, private scambio:ScambioService) { }


  scadenziario(): void{
    console.log("Card scadenziario schiacciata");
    this.router.navigate(['/scadenziario']);
  }

  anagrafica(): void{
    console.log("Card anagrafica schiacciata");
    this.router.navigate(['/anagrafica']);
  }

  database(): void{
    console.log("Card database schiacciata");
    this.router.navigate(['/database']);
  }

  

}
