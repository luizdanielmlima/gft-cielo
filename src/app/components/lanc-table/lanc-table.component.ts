import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { MatTableDataSource } from '@angular/material/table';

import { Lancamento } from 'src/app/models/Lancamento.model';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-lanc-table',
  templateUrl: './lanc-table.component.html',
  styleUrls: ['./lanc-table.component.css']
})
export class LancTableComponent implements OnInit {
  currentUserID: string;
  userLancamentos: Lancamento[];

  // TABLE STUFF
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  displayedColumns = [
    'codigoIdentificadorUnico',
    'dataLanc',
    'descric',
    'numero',
    'situacao',
    'dataConf',
    'dadosBanc',
    'valorFinal',
  ];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    // this would be dynamic, with the firebase.auth information... but it´s fixed for the demo
    this.currentUserID = this.dataService.getUserID();
    this.getLancamentos();
  }

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
        item.dataForGraph = new Date(item.dateEfetivaLancamento);
      });
      // console.log('this.userLancamentos: ', this.userLancamentos);

      // Tive que colocar o setTimetou para a paginação funcionar! (?)
      setTimeout(() => this.refreshTableData(this.userLancamentos), 100);

    });
  }

  refreshTableData(data: Lancamento[]): void {
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}
