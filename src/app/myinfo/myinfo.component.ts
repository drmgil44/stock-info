import { Component, OnInit } from '@angular/core';

import { ApiService } from '../api.service';
import { User } from '../api.userinfo';
import { JwtService } from '../jwt.service';

@Component({
  selector: 'app-myinfo',
  templateUrl: './myinfo.component.html',
  styleUrls: ['./myinfo.component.css']
})
export class MyinfoComponent implements OnInit {
  editinfo: User = {id: null, password: null, name:null, email:null};
  msgalert: String = null;

  constructor(
    private apiService: ApiService,
    private jwtService: JwtService
  ) { }

  ngOnInit() {
    let currentdata= this.jwtService.decodeData();
    this.editinfo.id = currentdata['id'];
    this.editinfo.name = currentdata['name'];
    this.editinfo.email = currentdata['email'];
    console.log(this.editinfo.id);
  }

}
