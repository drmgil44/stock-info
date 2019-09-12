import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { JwtService } from './jwt.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  //title = 'stock-info';
  islogin:boolean;
  reIsLogin:boolean;

  constructor(private jwtService:JwtService){}

  ngOnInit(){
    this.islogin=this.jwtService.isAuthenicated();
    this.reIsLogin = !this.islogin;
  }

  setIslogin(islogin: boolean){
    this.islogin=islogin;
    this.reIsLogin = !this.islogin;
  }
}
