import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from '../api.service';
import { JwtService } from '../jwt.service';
import { Login } from '../api.userinfo';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  selectedlogin: Login = {id: null, password: null};
  msgalert: String = null;

  constructor(
    private apiService: ApiService,
    private jwtService: JwtService,
    private appComponent:AppComponent,
    private router: Router,
  ) { }

  ngOnInit() {  }

  tryLogin(form){
      this.apiService.tryLogin(this.selectedlogin).subscribe((token: string)=>{
        if(this.jwtService.getToken()!='null'){ // if login successful
          this.appComponent.setIslogin(true); // hide login, join menu
          this.router.navigate([""]); // rediect to home
        }else {
          this.msgalert="Invaild ID or password";
          this.appComponent.setIslogin(false); // hide My Account menu
        }
      });
  }
}
