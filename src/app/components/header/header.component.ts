import { Component, Input, OnInit } from '@angular/core';

import { CustomUser } from 'src/app/models/CustomUser.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() currentUser: CustomUser;

  constructor() { }

  ngOnInit(): void {
  }

}
