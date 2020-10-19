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
  months: string[];
  curMonth: string;
  total: number;

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
    this.months = this.getMonths();
    this.curMonth = this.months[5]; // somente dados de junho no demo!

    // userID seria dinâmico com firebase.auth, mas é fixo para o demo (somente 1 usuário com dados)
    this.currentUserID = this.dataService.getUserID();

    // Para obter os dados de lançamentos, via Subject (data.service)
    this.dataService.curLancamentos.subscribe(data => {
      this.userLancamentos = data;
      this.total = this.userLancamentos.map((item) => item.valorFinal).reduce((prev, next) => prev + next);

      // Tive que colocar o setTimeout para a paginação funcionar! (investigar por que...)
      setTimeout(() => this.refreshTableData(this.userLancamentos), 100);
    });
  }

  refreshTableData(data: Lancamento[]): void {
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getMonths(): string[] {
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto','Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return months;
  }

}
