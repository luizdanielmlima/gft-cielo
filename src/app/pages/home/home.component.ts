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


  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    // this would be dynamic, with the firebase.auth information... but it´s fixed for the demo
    this.currentUserID = this.dataService.getUserID();

    this.dataService.getUserFromDB(this.currentUserID)
      .then(data => {
        this.currentUser = data;
      });
  }


  // apenas para colocar dado do lançamento no Firestore...
  createLanc(): void {
    this.dataService.createLancamento();
  }
}
