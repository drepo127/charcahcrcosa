import {Component, ViewChild} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {firstValueFrom, toArray} from "rxjs";

import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexResponsive,
  ApexXAxis,
  ApexLegend,
  ApexFill, NgApexchartsModule
} from "ng-apexcharts";
import {HttpClient, HttpParams} from "@angular/common/http";

export type ChartOptions = {
  chart: ApexChart | undefined;
  series: ApexAxisChartSeries | undefined;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  legend: ApexLegend;
  fill: ApexFill;
};
export type ChartOptions2 = {
  chart: ApexChart | undefined;
  series: ApexAxisChartSeries | undefined;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  responsive: ApexResponsive[];
  xaxis: ApexXAxis;
  legend: ApexLegend;
  fill: ApexFill;
};


@Component({
  selector: 'app-diagramas',
  standalone: true,
  imports: [
    RouterLink,
    NgApexchartsModule
  ],
  templateUrl: './diagramas.component.html',
  styleUrl: './diagramas.component.css'
})
export class DiagramasComponent {
  @ViewChild("chart") chart: ChartComponent | undefined;
  public chartOptions: Partial<ChartOptions> | undefined;
  public chartOptions2: Partial<ChartOptions> | undefined;

  getLastNDays(n: number): string[] {
    const result = [];
    const today = new Date();
    for (let i = n - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      result.push(`${date.getDate()}/${date.getMonth() + 1}`);
    }
    return result;
  }
  async getLastNDaysVentas(n: number, id: number) {
    let nums: number[] = []
    for (let i = 0; i < n; i++) {
      let req = new HttpParams().set("id", id).set("dias", i)
      let num: any = await firstValueFrom(this.http.get<number>('http://localhost:3080/consultarVentes', {params: req}));
      nums.push(parseInt(num[0].total));
    }
    for (let i = 0; i < n; i++) {
      if(isNaN(nums[i])) {
        nums[i] = 0;

      }
    }
    return nums;
  }
  async getLastNDaysVentasDesc(n: number) {
    let nums: number[] = []
    for (let i = 0; i < n; i++) {
      let req = new HttpParams().set("dias", i)
      let num: any = await firstValueFrom(this.http.get<number>('http://localhost:3080/consultarVentesDescompte', {params: req}));
      nums.push(parseInt(num[0].total));
      console.log(nums);
      console.log(num);
    }
    for (let i = 0; i < n; i++) {
      if(isNaN(nums[i])) {
        nums[i] = 0;

      }
    }
    return nums;
  }
  async getLastNDaysVentasNoDesc(n: number) {
    let nums: number[] = []
    for (let i = 0; i < n; i++) {
      let req = new HttpParams().set("dias", i)
      let num: any = await firstValueFrom(this.http.get<number>('http://localhost:3080/consultarVentesNoDescompte', {params: req}));
      nums.push(parseInt(num[0].total));
      console.log(nums);
      console.log(num);
    }
    for (let i = 0; i < n; i++) {
      if(isNaN(nums[i])) {
        nums[i] = 0;

      }
    }
    return nums;
  }

  constructor(private router: Router, private http: HttpClient) {
    const categories = this.getLastNDays(6);
    this.getLastNDaysVentas(6,1).then((data) => {
      let var1 = data
      this.getLastNDaysVentas(6,2).then((data) => {
        let var2 = data
        this.getLastNDaysVentas(6,3).then((data) => {
          let var3 = data
          this.chartOptions = {
            series: [
              {
                name: "PSan jacobo",
                data: var1.reverse()
              },
              {
                name: "qirwbg",
                data: var2.reverse()

              },
              {
                name: "wetbwedd",
                data: var3.reverse()
              }
            ],
            chart: {
              type: "bar",
              height: 300,
              stacked: true,
              toolbar: {
                show: true
              },
              zoom: {
                enabled: true
              }
            },
            responsive: [
              {
                breakpoint: 480,
                options: {
                  legend: {
                    position: "bottom",
                    offsetX: -10,
                    offsetY: 0
                  }
                }
              }
            ],
            plotOptions: {
              bar: {
                horizontal: false
              }
            },
            xaxis: {
              type: "category",
              categories: categories
            },
            legend: {
              position: "right",
              offsetY: 40
            },
            fill: {
              opacity: 1
            }
          };
        })
      })
    })
    this.getLastNDaysVentasDesc(6).then((data) => {
      let var1 = data
      this.getLastNDaysVentasNoDesc(6).then((data) => {
        let var2 = data
        this.chartOptions2 = {
          series: [
            {
              name: "Amb Descompte",
              data: var1.reverse()
            },
            {
              name: "Sense Descompte",
              data: var2.reverse()

            }
          ],
          chart: {
            type: "bar",
            height: 300,
            stacked: false,
            toolbar: {
              show: true
            },
            zoom: {
              enabled: true
            }
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                legend: {
                  position: "bottom",
                  offsetX: -10,
                  offsetY: 0
                }
              }
            }
          ],
          plotOptions: {
            bar: {
              horizontal: false
            }
          },
          xaxis: {
            type: "category",
            categories: categories
          },
          legend: {
            position: "right",
            offsetY: 40
          },
          fill: {
            opacity: 1
          }
        };
      })
    })
  }

}
