import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { JwtService } from './jwt.service';
import { StockService } from './stock.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  //title = 'stock-info';
  islogin:boolean;  // true - hide 'Login', 'Sign up' menu
  reIsLogin:boolean;  // true - hide 'My Account' menu
  searchStr:string=null;

  constructor(
    private jwtService:JwtService,
    private stockService:StockService,
    private router: Router
  ){}

  ngOnInit(){ // for hiding menu 'Login, Sign up' or 'My Account'
    this.islogin=this.jwtService.isAuthenicated();  // if token is authenicated
    this.reIsLogin = !this.islogin;
  }

  setIslogin(islogin: boolean){ // for hiding menu, set value
    this.islogin=islogin;
    this.reIsLogin = !this.islogin;
  }

  logout():void{
    this.jwtService.logout();   // logout - remove token
    this.ngOnInit();            // refresh nav bar
    this.router.navigate([""]); // redirect to home
  }

  search(form){ // save seleteced ticker to show company information
    this.stockService.setSearch(this.searchStr);
    this.router.navigate(["search"]); // rediect to company info
  }

}
