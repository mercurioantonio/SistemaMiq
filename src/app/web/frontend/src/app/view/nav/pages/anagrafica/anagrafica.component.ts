import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TrackService } from 'src/app/core/services/track.service';
import { ScambioService } from 'src/app/core/services/scambio';
import { isMainThread } from 'worker_threads';
import {Chart, Colors, BubbleController, CategoryScale, LinearScale, PointElement, Legend, registerables} from 'chart.js';
import { BulbOutline, CiCircleFill, CiCircleOutline } from '@ant-design/icons-angular/icons';
Chart.register(...registerables);
Chart.register(Colors, BubbleController, PointElement, CategoryScale, LinearScale, Legend);
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { max } from 'rxjs';
// import { format } from 'path';
Chart.register(ChartDataLabels); 
import { format } from 'date-fns';




@Component({
  selector: 'app-anagrafica',
  templateUrl: './anagrafica.component.html',
  styleUrls: ['./anagrafica.component.less']
})
export class AnagraficaComponent {

  dataframeData: any;
  listOfDisplayData?:any;
  inputString?: any;
  status: any;
  status_chart: boolean = false;
  tar: any;
  npt: any;
  min_y: any;
  max_y: any;
  min_y1: any;
  max_y1: any;
  myChart: any;
  myChart2: any;
  myChart3: any;
  myChart4: any;
  myChart5: any;
  myChart6: any;

  dataframeCampione: any; 
  status_campione: any;  

  tabella11 = false;

  constructor(private http: HttpClient, private service: TrackService, private scambio: ScambioService) { }

  modelChanged(newObj: any) {
    this.status_chart = false;
    this.tabella11 = false;
    if (this.myChart){
      this.myChart.destroy()
    }
    if (this.myChart2){
      this.myChart2.destroy()
    }
    if (this.myChart3){
      this.myChart3.destroy()
    }
    if (this.myChart4){
      this.myChart4.destroy()
    }
    if (this.myChart5){
      this.myChart5.destroy()
    }
    if (this.myChart6){
      this.myChart6.destroy()
    }
  }

  inviaDati(): void {
    this.tabella11 = false;
    if (this.myChart){
      this.myChart.destroy()
    }
    if (this.myChart2){
      this.myChart2.destroy()
    }
    if (this.myChart3){
      this.myChart3.destroy()
    }
    if (this.myChart4){
      this.myChart4.destroy()
    }
    if (this.myChart5){
      this.myChart5.destroy()
    }
    if (this.myChart6){
      this.myChart6.destroy()
    }
    var json_cod_str = JSON.stringify(this.inputString)
    console.log("Il codice MIQ selezionato e: ", json_cod_str)
    this.service.getAnagrafica(json_cod_str).subscribe((anagrafica) => { 
    this.dataframeData = anagrafica.anagrafica_json[0];
    this.status = anagrafica.status
    console.log("L'anagrafica del MIQ selezionato è: ", anagrafica)
    this.status_chart = true
      }); 
    if (!json_cod_str)
      this.status = 'failed'
  }

  graph(scm: number): void {
    console.log(scm)
    if (scm == 11){
      this.tabella11 = true;
      this.status_chart = false;
      var json_cod_str = JSON.stringify(this.inputString)
      this.service.getGraph(json_cod_str,scm).subscribe((graph) => { 
      this.tar = graph.graph_json;
      console.log("this.tar: ", this.tar)
      }); 
    }
    else {
      this.tabella11 = false
      if (this.myChart){
        this.myChart.destroy()
      }
      if (this.myChart2){
        this.myChart2.destroy()
      }
      if (this.myChart3){
        this.myChart3.destroy()
      }
      if (this.myChart4){
        this.myChart4.destroy()
      }
      if (this.myChart5){
        this.myChart5.destroy()
      }
      if (this.myChart6){
        this.myChart6.destroy()
      }
      var json_cod_str = JSON.stringify(this.inputString)
      this.service.getGraph(json_cod_str,scm).subscribe((graph) => { 
        this.tar = graph.graph_json;
        console.log("this.tar: ", this.tar)


        // console.log("this.tar.data: ", this.tar.map((x: { data: string; }) => x.data))
        // const [dateString, timeString] = this.tar.map((x: { data: string; }) => x.data)[0].split(' ')
        // const [day, month, year] = this.tar.map((x: { data: string; }) => x.data)[0].split('-')
        // const [hour, minute, second] = this.tar.map((x: { data: string; }) => x.data)[0].split(':')
        // const dateObj = new Date(+year, +month - 1, +day, +hour, +minute, +second)
        // console.log(dateObj.toISOString())


        this.npt = graph.npt
        this.min_y = Math.min(...this.tar.map((x: { LIC_x: Float32Array; }) => x.LIC_x)).toFixed(2);
        this.max_y = Math.max(...this.tar.map((x: { LSC_x: Float32Array; }) => x.LSC_x)).toFixed(2);
        this.min_y1 = Math.min(...this.tar.map((x: { LIC_r: Float32Array; }) => x.LIC_r)).toFixed(2);
        this.max_y1 = Math.max(...this.tar.map((x: { LSC_r: Float32Array; }) => x.LSC_r)).toFixed(2);
        console.log("graph: ", graph)
        
        if (this.tar){
          this.createChart();
          console.log("Il graph del MIQ selezionato è: ",this.myChart)  
          console.log("myChart2", this.myChart2)       
        }
      }); 
      // if (!json_cod_str)
      //   this.status = 'failed'
    }
  }
  
  createChart() {
    if (this.npt >=1){
        this.myChart = new Chart("myChart", {
          type: 'bar',
          data: {
            labels: this.tar.map((x: { data: any; }) => format(new Date(x.data), 'dd/MM/yyyy')),
            datasets: [{
              type: 'bar',
              label: 'Range W5',
              //label: '# of Votes',
              data: this.tar.map((x: { range_A: any; }) => { if (x.range_A != '') {return x.range_A} else {return null}}),
              backgroundColor: 'rgba(255, 26, 104, 0.2)',
              borderColor: 'rgba(255, 26, 104, 1)',
              borderWidth: 1,
              yAxisID: 'y1',
              order: 2,
            }
            ,{
              tension: 0.4,
              type: 'line',
              label: 'Stabilità X5',
              data: this.tar.map((x: { avg_x_A: any; }) => { if (x.avg_x_A != '') {return x.avg_x_A} else {return null}}),
              fill: false,
              backgroundColor: 'rgba(43, 0, 255, 0.2)',
              borderColor: 'rgba(43, 0, 255, 1)',
              borderWidth: 2,
              pointStyle: 'circle',          
              yAxisID: 'y',
              order: 1,             
            },
            {
              tension: 0.4,
              type: 'scatter',  
              label: 'Calibrazione ' + this.tar.map((x: { final_cal_A: any; }) => { if (x.final_cal_A != '') {return x.final_cal_A} else {return null}}),                
              data: this.tar.map((x: { final_cal_A: any; }) => { if (x.final_cal_A) {if (Number(x.final_cal_A) < Number(this.tar.map((x: { avg_x_A: any; }) => { if (x.avg_x_A != '') {return x.avg_x_A} else {return null}}),)) {return this.min_y} else {return this.max_y}} else {return null}}),
              datalabels: {
                anchor: 'center',
                align: 'center',
                display: false 
              },                 
              fill: false,
              backgroundColor: 'rgba(0, 183, 6, 0.2)',
              borderColor: 'rgba(0, 183, 6, 1)',
              borderWidth: 2,
              pointStyle: 'crossRot',   
              pointRadius: 20,
              pointHoverRadius: 20,
              yAxisID: 'y',
              order: 1,
            }
          ]
          },
          options: {
            aspectRatio: 1,
            animation: false,
            scales: {
              y: { 
                  type: 'linear',
                  position: 'left',
                  min: Number(this.min_y),
                  max:  Number(this.max_y),
                  border:{
                    color: 'rgba(102,012,102,1)'
                  },
                  ticks: {
                    maxTicksLimit: 7,
                    stepSize: 0.25,
                    callback: (value, values, ctx) => {
                      return Number(value).toFixed(2)
                    }
                  },
                  title: {
                    display:true,
                    text: 'Stabilità X5',    
                    color: 'blue',  
                  }         
              },
              y1: {
                type: 'linear',
                position: 'right',
                min:  Number(this.min_y1),
                max:  Number(this.max_y1),
                border: {
                  dash: [12, 6],
                  color: 'rgba(102,012,102,1)'
                },
                ticks: {
                  maxTicksLimit: 7,
                  stepSize: 0.25,
                  callback: (value, values, ctx) => {
                    return Number(value).toFixed(2)
                  }
                },
                title: {
                  display: true,
                  text: 'Range W5', 
                  color: '#f0768b',
                },
                // grid line settings
              },
              y2: {
                type: 'linear',
                display: false,
                beginAtZero: true,      
              }
            },            
            plugins:  {
              datalabels: {
                // anchor: 'end',
                clamp: true,
                align: 'top',
              },
              legend: {
                display: true,
              },
              title: {
                display: true,
                padding: 10, 
                text: this.dataframeData.denominazione_strumento,
                font: {
                  size: 15,
                  family:'Poppins',
                }
              },
              subtitle: {
                display: true,
                text: (this.tar.map((x: { pt_int_A: any; }) => x.pt_int_A)).find((pt_int_A: any) => pt_int_A != ''),
                padding: 10,
                font: {
                  size: 15,
                  family:'Poppins',
                }
              },
            },
            
            font: {
              size: 14,
              family:'Poppins',
            },
            
          },
          plugins: [ChartDataLabels]
        });
    }

    if (this.npt >=2){
      this.myChart2 = new Chart("myChart2", {
        type: 'bar',
        data: {
          labels: this.tar.map((x: { data: any; }) => format(new Date(x.data), 'dd/MM/yyyy')),
          datasets: [{
            type: 'bar',
            label: 'Range W5',
            //label: '# of Votes',
            data: this.tar.map((x: { range_B: any; }) => { if (x.range_B != '') {return x.range_B} else {return null}}),
            backgroundColor: 'rgba(255, 26, 104, 0.2)',
            borderColor: 'rgba(255, 26, 104, 1)',
            borderWidth: 1,
            yAxisID: 'y1',
            order: 2,
            
          }
          ,{
            tension: 0.4,
            type: 'line',
            label: 'Stabilità X5',
            data: this.tar.map((x: { avg_x_B: any; }) => { if (x.avg_x_B != '') {return x.avg_x_B} else {return null}}),
            fill: false,
            backgroundColor: 'rgba(43, 0, 255, 0.2)',
            borderColor: 'rgba(43, 0, 255, 1)',
            borderWidth: 2,
            pointStyle: 'circle',          
            yAxisID: 'y',
            order: 1,
            
          },
          {
            tension: 0.4,
            type: 'scatter',  
            label: 'Calibrazione ' + this.tar.map((x: { final_cal_B: any; }) => { if (x.final_cal_B != '') {return x.final_cal_B} else {return null}}),                
            // data: this.tar.map((x: { final_cal_B: any; }) => { if (x.final_cal_B != '') {return x.final_cal_B} else {return null}}),
            data: this.tar.map((x: { final_cal_B: any; }) => { if (x.final_cal_B) {if (Number(x.final_cal_B) < Number(this.tar.map((x: { avg_x_B: any; }) => { if (x.avg_x_B != '') {return x.avg_x_B} else {return null}}),)) {return this.min_y} else {return this.max_y }} else {return null}}),
            datalabels: {
              anchor: 'center',
              align: 'center',
              display: false 
            },
            
            
            fill: false,
            backgroundColor: 'rgba(0, 183, 6, 0.2)',
            borderColor: 'rgba(0, 183, 6, 1)',
            borderWidth: 2,
            pointStyle: 'crossRot',   
            pointRadius: 20,
            pointHoverRadius: 20,
            yAxisID: 'y',
            order: 1,
          }
        ]
        },
        options: {
          aspectRatio: 1,
          animation: false,
          scales: {
            y: { 
                type: 'linear',
                position: 'left',
                min: Number(this.min_y),
                max:  Number(this.max_y),
                border:{
                  color: 'rgba(102,012,102,1)'
                },
                ticks: {
                  maxTicksLimit: 7,
                  stepSize: 0.25,
                  callback: (value, values, ctx) => {
                    return Number(value).toFixed(2)
                  }
                },
                title: {
                  display:true,
                  text: 'Stabilità X5',    
                  color: 'blue',  
                }         
            },
            y1: {
              type: 'linear',
              position: 'right',
              min:  Number(this.min_y1),
              max:  Number(this.max_y1),
              border: {
                dash: [12, 6],
                color: 'rgba(102,012,102,1)'
              },
              ticks: {
                maxTicksLimit: 7,
                stepSize: 0.25,
                callback: (value, values, ctx) => {
                  return Number(value).toFixed(2)
                }
              },
              title: {
                display: true,
                text: 'Range W5', 
                color: '#f0768b',
              },
              // grid line settings
              grid: {
                drawOnChartArea: true, // only want the grid lines for one axis to show up
              },
            },
            y2: {
              type: 'linear',
              display: false,
              ticks: {
                maxTicksLimit: 7,
                stepSize: 0.25,
                
              }
            }
          },
          
          plugins:  { 
          
            
            datalabels: {
              // anchor: 'end',
              clamp: true,
              align: 'top',
            },
            legend: {
              display: true,
            },
            title: {
              display: true,
              padding: 10,
              text: this.dataframeData.denominazione_strumento,
              font: {
                size: 15,
                family:'Poppins',
              }
            },
            subtitle: {
              display: true,
              text: (this.tar.map((x: { pt_int_B: any; }) => x.pt_int_B)).find((pt_int_B: any) => pt_int_B != ''),
              padding: 10,
              font: {
                size: 15,
                family:'Poppins',
              }
            }          
          },      
          font: {
            size: 14,
            family:'Poppins',
          },
          
        },
        plugins: [ChartDataLabels]
      });
    }

    if (this.npt >=3){
      this.myChart3 = new Chart("myChart3", {
        type: 'bar',
        data: {
          labels: this.tar.map((x: { data: any; }) => format(new Date(x.data), 'dd/MM/yyyy')),
          datasets: [{
            type: 'bar',
            label: 'Range W5',
            //label: '# of Votes',
            data: this.tar.map((x: { range_C: any; }) => { if (x.range_C != '') {return x.range_C} else {return null}}),
            backgroundColor: 'rgba(255, 26, 104, 0.2)',
            borderColor: 'rgba(255, 26, 104, 1)',
            borderWidth: 1,
            yAxisID: 'y1',
            order: 2,
            
          }
          ,{
            tension: 0.4,
            type: 'line',
            label: 'Stabilità X5',
            data: this.tar.map((x: { avg_x_C: any; }) => { if (x.avg_x_C != '') {return x.avg_x_C} else {return null}}),
            fill: false,
            backgroundColor: 'rgba(43, 0, 255, 0.2)',
            borderColor: 'rgba(43, 0, 255, 1)',
            borderWidth: 2,
            pointStyle: 'circle',          
            yAxisID: 'y',
            order: 1,
          },
          {
            tension: 0.4,
            type: 'scatter',  
            label: 'Calibrazione ' + this.tar.map((x: { final_cal_C: any; }) => { if (x.final_cal_C != '') {return x.final_cal_C} else {return null}}),                
            data: this.tar.map((x: { final_cal_C: any; }) => { if (x.final_cal_C) {if (Number(x.final_cal_C) < Number(this.tar.map((x: { avg_x_C: any; }) => { if (x.avg_x_C != '') {return x.avg_x_C} else {return null}}),)) {return this.min_y} else {return this.max_y }} else {return null}}),
            datalabels: {
              anchor: 'center',
              align: 'center',
              display: false 
            },
            fill: false,
            backgroundColor: 'rgba(0, 183, 6, 0.2)',
            borderColor: 'rgba(0, 183, 6, 1)',
            borderWidth: 2,
            pointStyle: 'crossRot',   
            pointRadius: 20,
            pointHoverRadius: 20,
            yAxisID: 'y',
            order: 1,
          }
        ]
        },
        options: {
          aspectRatio: 1,
          animation: false,
          scales: {
            y: { 
                type: 'linear',
                position: 'left',
                min: Number(this.min_y),
                max:  Number(this.max_y),
                border:{
                  color: 'rgba(102,012,102,1)'
                },
                ticks: {
                  maxTicksLimit: 7,
                  stepSize: 0.25,
                  callback: (value, values, ctx) => {
                    return Number(value).toFixed(2)
                  }
                },
                title: {
                  display:true,
                  text: 'Stabilità X5',    
                  color: 'blue',  
                }         
            },
            y1: {
              type: 'linear',
              position: 'right',
              min:  Number(this.min_y1),
              max:  Number(this.max_y1),
              border: {
                dash: [12, 6],
                color: 'rgba(102,012,102,1)'
              },
              ticks: {
                maxTicksLimit: 7,
                stepSize: 0.25,
                callback: (value, values, ctx) => {
                  return Number(value).toFixed(2)
                }
              },
              title: {
                display: true,
                text: 'Range W5', 
                color: '#f0768b',
              },
              // grid line settings
              grid: {
                drawOnChartArea: true, // only want the grid lines for one axis to show up
              },
            },
            y2: {
              type: 'linear',
              display: false,
              beginAtZero: true,      
            }
          },
          
          plugins:  {
            datalabels: {
              // anchor: 'end',
              clamp: true,
              align: 'top',
            },
            legend: {
              display: true,
            },
            title: {
              display: true,
              padding: 10,
              text: this.dataframeData.denominazione_strumento,
              font: {
                size: 15,
                family:'Poppins',
              }
            },
            subtitle: {
              display: true,
              text: (this.tar.map((x: { pt_int_C: any; }) => x.pt_int_C)).find((pt_int_C: any) => pt_int_C != ''),
              padding: 10,
              font: {
                size: 15,
                family:'Poppins',
              }
            },
          },
          
          font: {
            size: 14,
            family:'Poppins',
          },
          
        },
        plugins: [ChartDataLabels]
      });
  }

  if (this.npt >=4){
    this.myChart4 = new Chart("myChart4", {
      type: 'bar',
      data: {
        labels: this.tar.map((x: { data: any; }) => format(new Date(x.data), 'dd/MM/yyyy')),
        datasets: [{
          type: 'bar',
          label: 'Range W5',
          //label: '# of Votes',
          data: this.tar.map((x: { range_D: any; }) => { if (x.range_D != '') {return x.range_D} else {return null}}),
          backgroundColor: 'rgba(255, 26, 104, 0.2)',
          borderColor: 'rgba(255, 26, 104, 1)',
          borderWidth: 1,
          yAxisID: 'y1',
          order: 2,
          
        }
        ,{
          tension: 0.4,
          type: 'line',
          label: 'Stabilità X5',
          data: this.tar.map((x: { avg_x_D: any; }) => { if (x.avg_x_D != '') {return x.avg_x_D} else {return null}}),
          fill: false,
          backgroundColor: 'rgba(43, 0, 255, 0.2)',
          borderColor: 'rgba(43, 0, 255, 1)',
          borderWidth: 2,
          pointStyle: 'circle',          
          yAxisID: 'y',
          order: 1,
          
        },
        {
          tension: 0.4,
          type: 'scatter',  
          label: 'Calibrazione ' + this.tar.map((x: { final_cal_D: any; }) => { if (x.final_cal_D != '') {return x.final_cal_D} else {return null}}),                
          data: this.tar.map((x: { final_cal_D: any; }) => { if (x.final_cal_D) {if (Number(x.final_cal_D) < Number(this.tar.map((x: { avg_x_D: any; }) => { if (x.avg_x_D != '') {return x.avg_x_D} else {return null}}),)) {return this.min_y} else {return this.max_y }} else {return null}}),
          datalabels: {
            anchor: 'center',
            align: 'center',
            display: false 
          },
          fill: false,
          backgroundColor: 'rgba(0, 183, 6, 0.2)',
          borderColor: 'rgba(0, 183, 6, 1)',
          borderWidth: 2,
          pointStyle: 'crossRot',   
          pointRadius: 20,
          pointHoverRadius: 20,
          yAxisID: 'y',
          order: 1,
        }
      ]
      },
      options: {
        aspectRatio: 1,
        animation: false,
        scales: {
          y: { 
              type: 'linear',
              position: 'left',
              min: Number(this.min_y),
              max:  Number(this.max_y),
              border:{
                color: 'rgba(102,012,102,1)'
              },
              ticks: {
                maxTicksLimit: 7,
                stepSize: 0.25,
                callback: (value, values, ctx) => {
                  return Number(value).toFixed(2)
                }
              },
              title: {
                display:true,
                text: 'Stabilità X5',
                color: 'blue',      
              }         
          },
          y1: {
            type: 'linear',
            position: 'right',
            min:  Number(this.min_y1),
            max:  Number(this.max_y1),
            border: {
              dash: [12, 6],
              color: 'rgba(102,012,102,1)'
            },
            ticks: {
              maxTicksLimit: 7,
              stepSize: 0.25,
                callback: (value, values, ctx) => {
                  return Number(value).toFixed(2)
                }
            },
            title: {
              display: true,
              text: 'Range W5', 
              color: '#f0768b',
            },
            // grid line settings
            grid: {
              drawOnChartArea: true, // only want the grid lines for one axis to show up
            },
          },
          y2: {
            type: 'linear',
            display: false,
            beginAtZero: true,      
          },
        },
        
        plugins:  {
          datalabels: {
            // anchor: 'end',
            clamp: true,
            align: 'top',
          },
          legend: {
            display: true,
          },
          title: {
            display: true,
            padding: 10, 
            text: this.dataframeData.denominazione_strumento,
            font: {
              size: 15,
              family:'Poppins',
            }
          },
          subtitle: {
            display: true,
            text: (this.tar.map((x: { pt_int_D: any; }) => x.pt_int_D)).find((pt_int_D: any) => pt_int_D != ''),
            padding: 10,
            font: {
              size: 15,
              family:'Poppins',
            }
          },
        },
        
        font: {
          size: 14,
          family:'Poppins',
        },
        
      },
      plugins: [ChartDataLabels]
    });
  }

  if (this.npt >=5){
    this.myChart5 = new Chart("myChart5", {
      type: 'bar',
      data: {
        labels: this.tar.map((x: { data: any; }) => format(new Date(x.data), 'dd/MM/yyyy')),
        datasets: [{
          type: 'bar',
          label: 'Range W5',
          //label: '# of Votes',
          data: this.tar.map((x: { range_E: any; }) => { if (x.range_E != '') {return x.range_E} else {return null}}),
          backgroundColor: 'rgba(255, 26, 104, 0.2)',
          borderColor: 'rgba(255, 26, 104, 1)',
          borderWidth: 1,
          yAxisID: 'y1',
          order: 2,
          
        }
        ,{
          tension: 0.4,
          type: 'line',
          label: 'Stabilità X5',
          data: this.tar.map((x: { avg_x_E: any; }) => { if (x.avg_x_E != '') {return x.avg_x_E} else {return null}}),
          fill: false,
          backgroundColor: 'rgba(43, 0, 255, 0.2)',
          borderColor: 'rgba(43, 0, 255, 1)',
          borderWidth: 2,
          pointStyle: 'circle',          
          yAxisID: 'y',
          order: 1,
          
        },
        {
          tension: 0.4,
          type: 'scatter',  
          label: 'Calibrazione ' + this.tar.map((x: { final_cal_E: any; }) => { if (x.final_cal_E != '') {return x.final_cal_E} else {return null}}),                
          data: this.tar.map((x: { final_cal_E: any; }) => { if (x.final_cal_E) {if (Number(x.final_cal_E) < Number(this.tar.map((x: { avg_x_E: any; }) => { if (x.avg_x_E != '') {return x.avg_x_E} else {return null}}),)) {return this.min_y} else {return this.max_y }} else {return null}}),
          datalabels: {
            anchor: 'center',
            align: 'center',
            display: false 
          },
          fill: false,
          backgroundColor: 'rgba(0, 183, 6, 0.2)',
          borderColor: 'rgba(0, 183, 6, 1)',
          borderWidth: 2,
          pointStyle: 'crossRot',   
          pointRadius: 20,
          pointHoverRadius: 20,
          yAxisID: 'y',
          order: 1,
        }
      ]
      },
      options: {
        aspectRatio: 1,
        animation: false,
        scales: {
          y: { 
              type: 'linear',
              position: 'left',
              min: Number(this.min_y),
              max:  Number(this.max_y),
              border:{
                color: 'rgba(102,012,102,1)'
              },
              ticks: {
                maxTicksLimit: 7,
                stepSize: 0.25,
                callback: (value, values, ctx) => {
                  return Number(value).toFixed(2)
                }
              },
              title: {
                display:true,
                text: 'Stabilità X5',    
                color: 'blue',  
              }         
          },
          y1: {
            type: 'linear',
            position: 'right',
            min:  Number(this.min_y1),
            max:  Number(this.max_y1),
            border: {
              dash: [12, 6],
              color: 'rgba(102,012,102,1)'
            },
            ticks: {
              maxTicksLimit: 7,
              stepSize: 0.25,
                callback: (value, values, ctx) => {
                  return Number(value).toFixed(2)
                }
            },
            title: {
              display: true,
              text: 'Range W5', 
              color: '#f0768b',
            },
            // grid line settings
            grid: {
              drawOnChartArea: true, // only want the grid lines for one axis to show up
            },
          },
          y2: {
            type: 'linear',
            display: false,
            beginAtZero: true,      
          },
        },
        
        plugins:  {
          datalabels: {
            // anchor: 'end',
            clamp: true,
            align: 'top',
          },
          legend: {
            display: true,
          },
          title: {
            display: true,
            padding: 10, 
            text: this.dataframeData.denominazione_strumento,
            font: {
              size: 15,
              family:'Poppins',
            }
          },
          subtitle: {
            display: true,
            text: (this.tar.map((x: { pt_int_E: any; }) => x.pt_int_E)).find((pt_int_E: any) => pt_int_E != ''),
            padding: 10,
            font: {
              size: 15,
              family:'Poppins',
            }
          },
        },
        
        font: {
          size: 14,
          family:'Poppins',
        },
        
      },
      plugins: [ChartDataLabels]
    });
  }

  if (this.npt >=6){
    this.myChart6 = new Chart("myChart6", {
      type: 'bar',
      data: {
        labels: this.tar.map((x: { data: any; }) => format(new Date(x.data), 'dd/MM/yyyy')),
        datasets: [{
          type: 'bar',
          label: 'Range W5',
          data: this.tar.map((x: { range_F: any; }) => { if (x.range_F != '') {return x.range_F} else {return null}}),
          backgroundColor: 'rgba(255, 26, 104, 0.2)',
          borderColor: 'rgba(255, 26, 104, 1)',
          borderWidth: 1,
          yAxisID: 'y1',
          order: 2,
          
        }
        ,{
          tension: 0.4,
          type: 'scatter',  
          label: 'Calibrazione ' + this.tar.map((x: { final_cal_F: any; }) => { if (x.final_cal_F != '') {return x.final_cal_F} else {return null}}),                
          data: this.tar.map((x: { final_cal_F: any; }) => { if (x.final_cal_F) {if (Number(x.final_cal_F) < Number(this.tar.map((x: { avg_x_F: any; }) => { if (x.avg_x_F != '') {return x.avg_x_F} else {return null}}),)) {return this.min_y} else {return this.max_y }} else {return null}}),
          datalabels: {
            anchor: 'center',
            align: 'center',
            display: false 
          },
          fill: false,
          backgroundColor: 'rgba(0, 183, 6, 0.2)',
          borderColor: 'rgba(0, 183, 6, 1)',
          borderWidth: 2,
          pointStyle: 'crossRot',   
          pointRadius: 20,
          pointHoverRadius: 20,
          yAxisID: 'y',
          order: 1,
          
        },
        {
          tension: 0.4,
          type: 'scatter',
          data: this.tar.map((x: { final_cal_F: any; }) => { if (x.final_cal_F != '') {return x.final_cal_F} else {return null}}),
          fill: false,
          borderColor: 'green',
          borderWidth: 2,
          pointStyle: 'crossRot',          
          yAxisID: 'y2',
          order: 1,
        }
      ]
      },
      options: {
        aspectRatio: 1,
        animation: false,
        scales: {
          y: { 
              type: 'linear',
              position: 'left',
              min: Number(this.min_y),
              max:  Number(this.max_y),
              border:{
                color: 'rgba(102,012,102,1)'
              },
              ticks: {
                maxTicksLimit: 7,
                stepSize: 0.25,
                callback: (value, values, ctx) => {
                  return Number(value).toFixed(2)
                }                                
              },
              title: {
                display:true,
                text: 'Stabilità X5',    
                color: 'blue',  
              }         
          },
          y1: {
            type: 'linear',
            position: 'right',
            min:  Number(this.min_y1),
            max:  Number(this.max_y1),
            border: {
              dash: [12, 6],
              color: 'rgba(102,012,102,1)'
            },
            ticks: {
              maxTicksLimit: 7,
              stepSize: 0.25,
                callback: (value, values, ctx) => {
                  return Number(value).toFixed(2)
                }
            },
            title: {
              display: true,
              text: 'Range W5', 
              color: '#f0768b',
            },
            // grid line settings
            grid: {
              drawOnChartArea: true, // only want the grid lines for one axis to show up
            },
          },
          y2: {
            type: 'linear',
            display: false,
            beginAtZero: true,      
          },
        },
        
        plugins:  {
          datalabels: {
            // anchor: 'end',
            clamp: true,
            align: 'top',
          },
          legend: {
            display: true,
          },
          title: {
            display: true,
            padding: 10, 
            text: this.dataframeData.denominazione_strumento,
            font: {
              size: 15,
              family:'Poppins',
            }
          },
          subtitle: {
            display: true,
            text: (this.tar.map((x: { pt_int_F: any; }) => x.pt_int_F)).find((pt_int_F: any) => pt_int_F != ''),
            padding: 10,
            font: {
              size: 15,
              family:'Poppins',
            }
          },
        },
        
        font: {
          size: 14,
          family:'Poppins',
        },
        
      },
      plugins: [ChartDataLabels]
    });
  }
  }

  campione(campione_di_riferimento:string): void{
    var campione_di_riferimento = campione_di_riferimento;
    console.log("anagrafica.component.ts ha individuato questo campione_di riferimento: ", campione_di_riferimento);
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
