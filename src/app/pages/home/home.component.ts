import { Component, OnInit } from '@angular/core';
import { CustomUser } from 'src/app/models/CustomUser.model';
import { Lancamento } from 'src/app/models/Lancamento.model';

import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentUserID: string;
  currentUser: CustomUser;
  lancamentos: Lancamento[];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    // userID seria dinâmico com firebase.auth, mas é fixo para o demo (somente 1 usuário com dados)
    this.currentUserID = this.dataService.getUserID();

    this.dataService.getUserFromDB(this.currentUserID)
      .then(data => {
        this.currentUser = data;
      });

    this.getLancamentos();
  }

  getLancamentos(): void {
    this.dataService.getLancamentos(this.currentUserID).subscribe(res => {
      this.lancamentos = res;
      if (this.lancamentos && this.lancamentos.length > 0) {
        this.lancamentos.map(item => {
          item.dataLanc = item.dataEfetivaLancamento;
          item.descric = item.lancamentoContaCorrenteCliente.nomeTipoOperacao;
          item.numero = item.lancamentoContaCorrenteCliente.numeroRemessaBanco;
          item.situacao = item.lancamentoContaCorrenteCliente.nomeSituacaoRemessa ;
          item.dataConf = item.dataLancamentoContaCorrenteCliente;
          item.dadosBanc = `${item.nomeBanco} Ag ${item.lancamentoContaCorrenteCliente.dadosDomicilioBancario.numeroAgencia} CC ${item.lancamentoContaCorrenteCliente.dadosDomicilioBancario.numeroContaCorrente}`;
          item.valorFinal = item.valorLancamentoRemessa;
          item.dataForGraph = new Date(item.dateEfetivaLancamento);
        });
        // console.log('this.lancamentos: ', this.lancamentos);

        // Envia os dados para o Subject, para disponibilizá-los para outros componentes (table e graph)
        this.dataService.setLancamentos(this.lancamentos);
      }
    });
  }


  // apenas para colocar dados de lançamentos no Firestore...
  createLanc(): void {
    this.dataService.createLancamento();
  }
}
