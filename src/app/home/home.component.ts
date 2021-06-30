import { Component, OnInit, ViewChild } from '@angular/core';
import { HomeService } from './home.service';
import { STATE_NAMES } from './../constant';
import { AppDataProvider } from '../app-data-provider.service';
import { Router } from '@angular/router';
import * as ChartJs from 'chart.js'
import 'chartjs-adapter-moment';
ChartJs.Chart.register(...ChartJs.registerables)

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  count: any = {
    totalConfirmed: 0,
    totalActive: 0,
    totalRecovered: 0,
    totalDeceased: 0,
    totalTested: 0,
    totalVaccinated: 0
  }
  allStateCount = [];
  indiaData = [];
  stateSearchResult = [];
  allStates = Object.keys(STATE_NAMES).map(key => {
    return {
      name: STATE_NAMES[key],
      stateCode: key
    }
  }).filter(key => key.name != 'India');
  searchTimeout;
  @ViewChild('IndiaCases', { static: true })
  indiaCases;

  @ViewChild('StateCount', { static: true })
  stateCount;

  @ViewChild('GrowthPattern', { static: true })
  growthPattern

  constructor(private homeServ: HomeService, private appData: AppDataProvider, private router: Router) { }

  ngOnInit(): void {
    window.scroll({
      behavior: 'smooth',
      top: 0
    })
    this.appData.stateData.subscribe(data => {
      if (data) {
        this.count.totalConfirmed = data['TT'].total.confirmed;
        this.count.totalDeceased = data['TT'].total.deceased;
        this.count.totalRecovered = data['TT'].total.recovered;
        this.count.totalTested = data['TT'].total.tested;
        this.count.totalVaccinated = data['TT'].total.vaccinated1;
        this.count.totalActive = this.count.totalConfirmed - this.count.totalRecovered - this.count.totalDeceased;
        Object.keys(data).map(key => {
          data[key].stateName = STATE_NAMES[key]
          data[key].stateCode = key
        })
        this.allStateCount = Object.values(data);
        this.allStateCount = this.allStateCount.filter(key => key.stateName != 'India');
        this.createStateCountGraph()
      } else {
        this.appData.getStateData()
      }
    })

    this.appData.completeTimeSeries.subscribe(data => {
      if (data) {
        Object.keys(data['TT'].dates).map(key => {
          data['TT'].dates[key].date = key;
        })
        for (let i = 15; i < 29; i++) {
          let date = '2020-02-' + i;
          data['TT'].dates[date] = JSON.parse(JSON.stringify(data['TT'].dates['2020-02-14']));
          data['TT'].dates[date].date = date
        }
        this.indiaData = Object.values(data['TT'].dates);
        this.indiaData = this.indiaData.map(key => {
          key.total['active'] = key.total.recovered ? (key.total.confirmed - key.total.recovered - key.total.deceased) : 0;
          return key
        })
        this.indiaData = this.indiaData.sort((a, b) => {
          return a['date'].localeCompare(b['date'])
        })
        if (this.indiaData[this.indiaData.length - 1].date == this.getDate())
          this.indiaData.splice(-1, 1);
        this.createIndiaCases();
        this.createGrowthPattern();
      } else {
        this.appData.getCompleteTimeSeries()
      }
    })
  }

  getDate() {
    let date = new Date();
    let month = date.getMonth() + 1;
    let today = date.getDate();
    return date.getFullYear() + '-' + (month < 10 ? '0' + month : month) + '-' + (today < 10 ? '0' + today : today)
  }

  createStateCountGraph() {
    let config: ChartJs.ChartConfiguration = {
      type: "bar",
      data: {
        datasets: [{
          data: this.allStateCount,
          backgroundColor: 'gray',

        }]
      },
      options: {
        parsing: {
          xAxisKey: 'stateName',
          yAxisKey: 'total.confirmed'
        },
        locale: 'en-IN',
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false
        },
        scales: {
          x: {
            display: 'auto',
            ticks: {
              autoSkip: false,
              maxRotation: 90,
              color: 'black',
              font: {
                size: 10
              },
              padding: 0,
              textStrokeWidth: 0
            },
            grid: {
              offset: false
            }
          },
          y: {
            ticks: {
              font: {
                size: 10
              }
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'State Count',
            color: 'black',
            font: {
              size: 14,
            }
          }
        }
      }

    }
    let chart = new ChartJs.Chart(this.stateCount.nativeElement, config)

  }

  createIndiaCases() {
    let config: ChartJs.ChartConfiguration = {
      type: "line",
      data: {
        datasets: [
          {
            data: this.indiaData,
            backgroundColor: '#ff073a',
            label: 'Confirmed',
            parsing: {
              xAxisKey: 'date',
              yAxisKey: 'total.confirmed'
            },
            borderColor: '#ff073a',
            pointRadius: 0,
            borderWidth: 2
          },
          {
            data: this.indiaData,
            backgroundColor: '#28a745',
            label: 'Recovered',
            parsing: {
              xAxisKey: 'date',
              yAxisKey: 'total.recovered'
            },
            borderColor: '#28a745',
            pointRadius: 0,
            borderWidth: 2
          },
          {
            data: this.indiaData,
            backgroundColor: '#007bff',
            label: 'Active',
            parsing: {
              xAxisKey: 'date',
              yAxisKey: 'total.active'
            },
            borderColor: '#007bff',
            pointRadius: 0,
            borderWidth: 2
          }
        ]
      },
      options: {
        interaction: {
          intersect: false
        },
        locale: 'en-IN',
        scales: {
          x: {
            type: 'timeseries',
            ticks: {
              autoSkip: true,
            },
            grid: {
              display: false
            },
            time: {
              round: false,
            },

          },

        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom'
          },
          title: {
            display: true,
            text: 'PAN India',
            color: 'black',
            font: {
              size: 14,
            }
          }
        }
      }
    }
    let chart = new ChartJs.Chart(this.indiaCases.nativeElement, config)
  }

  createGrowthPattern() {
    let config: ChartJs.ChartConfiguration = {
      type: "line",
      data: {
        datasets: [
          {
            data: this.indiaData,
            backgroundColor: '#ff073a',
            label: 'Confirmed',
            parsing: {
              xAxisKey: 'date',
              yAxisKey: 'delta.confirmed'
            },
            borderColor: '#ff073a',
            pointRadius: 0,
            borderWidth: 1.5
          },
          {
            data: this.indiaData,
            backgroundColor: '#28a745',
            label: 'Recovered',
            parsing: {
              xAxisKey: 'date',
              yAxisKey: 'delta.recovered'
            },
            borderColor: '#28a745',
            pointRadius: 0,
            borderWidth: 1.5
          },
        ]
      },
      options: {
        interaction: {
          intersect: false
        },
        locale: 'en-IN',
        scales: {
          x: {
            type: 'timeseries',
            display: 'auto',
            ticks: {
              autoSkip: true,
            },
            grid: {
              display: false
            },
            time: {
              round: false
            }

          },

        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom'
          },
          title: {
            display: true,
            text: 'Growth Pattern',
            color: 'black',
            font: {
              size: 14,
            }
          }
        }
      }
    }
    let chart = new ChartJs.Chart(this.growthPattern.nativeElement, config)

  }

  rowClicked(data) {
    this.router.navigate(['/state', data.stateCode])
  }

  inputChanged(event) {
    let value = event.target.value;
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout)
    }
    this.searchTimeout = setTimeout(() => {
      if (value) {
        this.stateSearchResult = this.allStates.filter(key => key.name.toLowerCase().indexOf(value.toLowerCase()) != -1);
        if (window.innerWidth < 550) {
          setTimeout(() => {
            document.getElementById('search-div').scrollIntoView({ behavior: 'smooth', block: 'start' })
          })
        }
      }
      else
        this.stateSearchResult = [];

    }, 150)
  }

}
