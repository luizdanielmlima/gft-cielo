import { Component, Input, OnInit } from '@angular/core';

import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { Lancamento } from 'src/app/models/Lancamento.model';
import { DataService } from 'src/app/services/data.service';

function am4themes_myTheme(target):void {
  if (target instanceof am4core.InterfaceColorSet) {
    target.setFor('text', am4core.color('#b3c6d4'));
    target.setFor('grid', am4core.color('#80a0b8'));
  }
}

am4core.useTheme(am4themes_animated);
am4core.useTheme(am4themes_myTheme);

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit {
  // @Input() userLancamentos: Lancamento[];
  currentUserID: string;
  userLancamentos: Lancamento[];
  lancChart: am4charts.XYChart;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    // this would be dynamic, with the firebase.auth information... but it´s fixed for the demo
    this.currentUserID = this.dataService.getUserID();
    this.getLancamentos();
  }

  // IMPORTANTE: usar solução única para pegar lançamentos, disponibilizar via "state" (Subject?) para table e graph
  getLancamentos(): void {
    this.dataService.getLancamentos(this.currentUserID).subscribe(res => {
      this.userLancamentos = res;
      this.userLancamentos.map(item => {
        item.dataLanc = item.dataEfetivaLancamento;
        item.descric = item.lancamentoContaCorrenteCliente.nomeTipoOperacao;
        item.numero = item.lancamentoContaCorrenteCliente.numeroRemessaBanco;
        item.situacao = item.lancamentoContaCorrenteCliente.nomeSituacaoRemessa ;
        item.dataConf = item.dataLancamentoContaCorrenteCliente;
        item.dadosBanc = `${item.nomeBanco} Ag ${item.lancamentoContaCorrenteCliente.dadosDomicilioBancario.numeroAgencia} CC ${item.lancamentoContaCorrenteCliente.dadosDomicilioBancario.numeroContaCorrente}`;
        item.valorFinal = item.valorLancamentoRemessa;
        item.dataForGraph = new Date(item.dateEfetivaLancamento).toDateString();
      });
      console.log('this.userLancamentos: ', this.userLancamentos);
      this.createlancChart();
    });
  }

  sortByDataDesc(a, b): number {
    return a.dateEfetivaLancamento - b.dateEfetivaLancamento;
  }

  createlancChart(): void {
    const lancChart = am4core.create('chartdiv', am4charts.XYChart);

    // no data during creation, will be added later
    lancChart.data = this.userLancamentos;
    lancChart.data.sort(this.sortByDataDesc);

    const categoryAxis = lancChart.xAxes.push(
      new am4charts.CategoryAxis(),
    );
    categoryAxis.dataFields.category = 'dataForGraph';
    categoryAxis.renderer.minGridDistance = 20;
    const valueAxis = lancChart.yAxes.push(
      new am4charts.ValueAxis(),
    );
    valueAxis.title.text = 'VALOR';

    const series = lancChart.series.push(
      new am4charts.ColumnSeries(),
    );
    series.name = 'Operacões';
    // series.columns.template.tooltipText =
    //   'Total:\n{amount} {coin}\n{amountUSD} USD ';
    series.columns.template.fill = am4core.color('#00aeef'); // fill
    series.dataFields.valueY = 'valorFinal';
    series.dataFields.categoryX = 'dataForGraph';

    this.lancChart = lancChart;
  }

}
