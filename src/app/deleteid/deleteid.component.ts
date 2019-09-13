import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from '../api.service';
import { JwtService } from '../jwt.service';
import { Login } from '../api.userinfo';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-deleteid',
  templateUrl: './deleteid.component.html',
  styleUrls: ['./deleteid.component.css']
})
export class DeleteidComponent implements OnInit {
  deleteinfo: Login = {id: null, password: null};
  msgalert: String = null;

  constructor(
    private apiService: ApiService,
    private jwtService: JwtService,
    private appComponent:AppComponent,
    private router: Router,
  ) { }

  ngOnInit() {
    let currentdata= this.jwtService.decodeData();
    this.deleteinfo.id = currentdata['id'];
  }

  deleteAccount(form){

  }

}
