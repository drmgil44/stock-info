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

  ngOnInit(){ // for hiding menu 'Login, Sign up' or 'My Account'
    this.islogin=this.jwtService.isAuthenicated();
    this.reIsLogin = !this.islogin;
  }

  setIslogin(islogin: boolean){ // for hiding menu
    this.islogin=islogin;
    this.reIsLogin = !this.islogin;
  }

  logout():void{
    this.jwtService.logout();   // logout - remove token
    this.ngOnInit();            // refresh nav bar
    this.router.navigate([""]); // redirect to home
  }
}
