import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Pais } from 'src/app/models/pais.model';
import { Persona } from 'src/app/models/persona.model';
import { PaisService } from 'src/app/services/pais.service';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

class ChartData {
  personas: Persona[];
}

@Component({
  selector: 'chart-dialog',
  templateUrl: 'chart.dialog.component.html',
  styleUrls: ['chart.dialog.component.scss'],
})
export class ChartDialogComponent implements OnInit {
  public barChartOptions: ChartOptions = {
    responsive: true,
  };
  TAG: string = 'ChartDialogComponent';
  personasArray: Persona[];
  paises: Pais[];
  data: number[];
  labels: Label[];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];
  public barChartData: ChartDataSets[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: ChartData,
    private paisService: PaisService
  ) {
    this.personasArray = dialogData.personas;
    this.paises = [];
    this.data = [];
    this.labels = [];
    this.barChartData = [];
    console.log('data > ', this.personasArray);
  }

  ngOnInit(): void {
    var count;
    console.log('Ocurrencias > ', this.countOcurrences('Argentina'));
    this.paisService.getAll().subscribe((res) => {
      res.map((e: any, i: number) => {
        this.paises.push(e.payload.doc.data());
        this.paises = [...this.paises];
      });
      for (let i = 0; i < this.paises.length; i++) {
        count = 0;
        count = this.countOcurrences(this.paises[i].nombre);
        this.data.push(count);
        this.labels.push(this.paises[i].nombre);
      }
      this.barChartData = [{ data: this.data, label: 'Paises' }];
      console.log(`${this.TAG} > paises  > `, this.data);
    });
  }

  countOcurrences(val: string) {
    const res = this.personasArray.reduce(
      (a, v) => (v.pais === val ? a + 1 : a),
      0
    );
    return res;
  }
}
