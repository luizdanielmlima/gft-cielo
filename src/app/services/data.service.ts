import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';

import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { CustomUser } from '../models/CustomUser.model';
import { Lancamento } from '../models/Lancamento.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  usersCollection: AngularFirestoreCollection<any>;
  fixedUserID: string;

  constructor(private afs: AngularFirestore) {
    this.fixedUserID = 'khgH4qf6iw0gs6xj44Rn';
    this.usersCollection = this.afs.collection('/users');
  }

  getUserID(): string {
    // Como esse app demo não possui login/signup...
    // ...retorna apenas o ID do usuário pré-cadastrado no BD do firestore que criei para a demonstração ;)
    return this.fixedUserID;
  }

  getUserFromDB(uid: string): Promise<CustomUser> {
    return new Promise((resolve, reject) => {
      this.usersCollection
        .doc(uid)
        .get()
        .subscribe(
          (userDoc) => {
            const data = userDoc.data() as any;
            // console.log('user data: ', data);
            resolve(data);
          },
          (err) => reject(err),
        );
    });
  }

  getLancamentos(userID: string): Observable<Lancamento[]> {
    const lancCollection = this.afs.collection(
      `/users/${userID}/lancamentos/`,
    );
    const lancamentos = lancCollection.snapshotChanges().pipe(
      map((changes) => {
        return changes.map((action) => {
          const data = action.payload.doc.data() as Lancamento;
          data.id = action.payload.doc.id;
          // console.log('data: ', data);
          return data;
        });
      }),
    );

    return lancamentos;
  }

  // Criei esse método apenas para "popular" alguns lancamentos no BD...
  // variando os dados dos campos para ter diferentes dados para a tabela/gráfico
  createLancamento(): void {
    const lancCollection = this.afs.collection(`/users/${this.fixedUserID}/lancamentos`);
    const lancamento: Lancamento = {
      id: 'A7a7a7a7a',
      lancamentoContaCorrenteCliente: {
        numeroRemessaBanco: 64320626054,
        dadosAnaliticoLancamentoFinanceiroCliente: [],
        nomeSituacaoRemessa: 'Pago',
        dadosDomicilioBancario: {
          codigoBanco: 123,
          numeroAgencia: 1,
          numeroContaCorrente: '00000000065470',
        },
        nomeTipoOperacao: 'regular'
      },
      dataEfetivaLancamento: '03/06/2016',
      dataLancamentoContaCorrenteCliente: '03/06/2016',
      numeroEvento: 42236790,
      descricaoGrupoPagamento: 'LA-56',
      codigoIdentificadorUnico: '1',
      nomeBanco: 'BANCO ABCD S.A.',
      quantidadeLancamentoRemessa: 22,
      numeroRaizCNPJ: '12996721',
      numeroSufixoCNPJ: '1597',
      valorLancamentoRemessa: 11499.1,
      dateLancamentoContaCorrenteCliente: 1464922800000,
      dateEfetivaLancamento: 1464922800000
    };
    lancCollection
      .add(lancamento)
      .then((docRef) => {
        // console.log('docRef: ', docRef);
      })
      .catch(() => {
        console.log('error creating lancamento');
      });
  }
}
