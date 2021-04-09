import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppDataProvider } from '../app-data-provider.service';
import { STATE_NAMES } from './../constant';
import * as ChartJs from 'chart.js'
import 'chartjs-adapter-moment';
import { tick } from '@angular/core/testing';
ChartJs.Chart.register(...ChartJs.registerables)

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.scss']
})
export class StateComponent implements OnInit {

  @ViewChild('LastDays', {static: true})
  lastDays
  @ViewChild('LastDaysRecovered', {static: true})
  lastDaysRecovered

  stateData:any = []
  stateName = ''
  stateMeta = {
    population: 1
  }
  count = {
    totalConfirmed: 0,
    totalActive: 0,
    totalRecovered: 0,
    totalDeceased: 0,
    totalTested: 0,
  }
  Math = Math;
  districtData: any = [];
  constructor(private route: ActivatedRoute, private router: Router, private appData: AppDataProvider) { }

  ngOnInit(): void {
    this.route.params.subscribe(data => {
      this.stateName = STATE_NAMES[data.id]
      this.fetchDataFromId(data.id);
    })
    window.scroll({
      behavior: 'smooth',
      top: 0      
    })
  }

  fetchDataFromId(id) {
    this.appData.completeTimeSeries.subscribe( data => {
      if (data) {
        this.stateData = data[id].dates;
        this.stateData = Object.keys(this.stateData).map( key => {
          this.stateData[key]['date'] = key;
          return this.stateData[key]
        });
        this.stateData = Object.values(this.stateData);
        let count = this.stateData.splice(-1, 1)[0];
        this.count.totalConfirmed = count.total.confirmed;
        this.count.totalRecovered = count.total.recovered;
        this.count.totalDeceased = count.total.deceased;
        this.count.totalTested = count.total.tested;
        this.count.totalActive = count.total.confirmed - count.total.recovered - count.total.deceased;
        this.createGraph();
        this.createGraphRecovered();
      }
      else {
        this.appData.getCompleteTimeSeries()
      }
    })
    this.appData.stateData.subscribe( data => {
      if (data) {
        this.stateMeta = data[id].meta;
        this.districtData = data[id].districts;
        this.districtData = Object.keys(this.districtData).map(key => {
          this.districtData[key].districtName = key;
          return this.districtData[key]
        })
        this.districtData = Object.values(this.districtData);
        this.districtData = this.districtData.sort()
      } else {
        this.appData.getStateData()
      }
    })
  }

  createGraph() {
    let data = this.stateData.slice(this.stateData.length-7, this.stateData.length);
    data = data.map(key => {
      if (key['delta']) {
        if (!key['delta'].confirmed) {
          key['delta'].confirmed = 0;
        }
        if (!key['delta'].recovered) {
          key['delta'].recovered = 0;
        }
      } else {
        key['delta'] = {
          confirmed: 0,
          recovered: 0
        }
      }
      return key
    })
    let config: ChartJs.ChartConfiguration = {
      type: "bar",
      data: {
        datasets: [{
            data: data,
            backgroundColor: '#FF073a',
            parsing: {
              xAxisKey: 'date',
              yAxisKey: 'delta.confirmed'
            }
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false,
            }
          },
          y: {
            grid: {
              display: false
            },
            ticks: {
              autoSkip: true
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Confirmed in last week',
            color: 'black',
            font: {
              size: 14,              
            }
          }
        }
      }

    }
    let chart = new ChartJs.Chart(this.lastDays.nativeElement, config)
  }

  createGraphRecovered() {
    let data = this.stateData.slice(this.stateData.length-7, this.stateData.length);
    data = data.map(key => {
      if (key['delta']) {
        if (!key['delta'].confirmed) {
          key['delta'].confirmed = 0;
        }
        if (!key['delta'].recovered) {
          key['delta'].recovered = 0;
        }
      } else {
        key['delta'] = {
          confirmed: 0,
          recovered: 0
        }
      }
      return key
    })
    let config: ChartJs.ChartConfiguration = {
      type: "bar",
      data: {
        datasets: [{
            data: data,
            backgroundColor: '#28a745',
            parsing: {
              xAxisKey: 'date',
              yAxisKey: 'delta.recovered'
            }
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false,
            }
          },
          y: {
            grid: {
              display: false
            },
            ticks: {
              autoSkip: true
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Recovered in last week',
            color: 'black',
            font: {
              size: 14,              
            }
          }
        }
      }

    }
    let chart = new ChartJs.Chart(this.lastDaysRecovered.nativeElement, config)
  }

  home() {
    this.router.navigate(['/home'])
  }

}
