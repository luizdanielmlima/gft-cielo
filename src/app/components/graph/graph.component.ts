import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { Lancamento } from 'src/app/models/Lancamento.model';
import { DataService } from 'src/app/services/data.service';

function am4themes_myTheme(target):void {
  if (target instanceof am4core.InterfaceColorSet) {
    target.setFor('text', am4core.color('#b3c6d4'));
    target.setFor('grid', am4core.color('#ccc'));
  }
}

am4core.useTheme(am4themes_animated);
am4core.useTheme(am4themes_myTheme);

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit, OnDestroy {
  currentUserID: string;
  userLancamentos: Lancamento[];
  lancChart: am4charts.XYChart;

  constructor(private zone: NgZone, private dataService: DataService) { }

  ngOnInit(): void {
    // userID seria dinâmico com firebase.auth, mas é fixo para o demo (somente 1 usuário com dados)
    this.currentUserID = this.dataService.getUserID();

    // Para obter os dados de lançamentos, via Subject (data.service)
    this.dataService.curLancamentos.subscribe(data => {
      this.userLancamentos = data;
      if (this.lancChart) {
        this.lancChart.dispose();
      }
      this.createlancChart();
    });
  }

  ngOnDestroy(): void {
    this.zone.runOutsideAngular(() => {
      if (this.lancChart) {
        this.lancChart.dispose();
      }
    });
  }

  sortByDataDesc(a, b): number {
    return a.dateEfetivaLancamento - b.dateEfetivaLancamento;
  }

  createlancChart(): void {
    const lancChart = am4core.create('chartdiv', am4charts.XYChart);

    lancChart.data = this.userLancamentos;
    lancChart.data.sort(this.sortByDataDesc);

    const categoryAxis = lancChart.xAxes.push(
      new am4charts.DateAxis(),
    );
    categoryAxis.dataFields.date = 'dataForGraph';
    const valueAxis = lancChart.yAxes.push(
      new am4charts.ValueAxis(),
    );
    valueAxis.title.text = 'Valores';

    const series = lancChart.series.push(
      new am4charts.ColumnSeries(),
    );
    series.name = 'Operacões';
    series.columns.template.tooltipText =
      'Valor: {valorFinal}\n Data: {dataForGraph.formatDate("dd/MMM/yy")}';
    series.columns.template.fill = am4core.color('#00aeef'); // fill
    series.columns.template.width = 30;
    series.dataFields.valueY = 'valorFinal';
    series.dataFields.dateX  = 'dataForGraph';

    // lancChart.legend = new am4charts.Legend();
    this.lancChart = lancChart;
  }

  findOutTimestamp(): void {
    // apenas para ajudar a converter datas para timestamp, ao editar os lançamentos no banco de dados
    const date = new Date('June 21, 2016');
    const timest = date.getTime();
    console.log('timestamp: ', timest);
  }

}
