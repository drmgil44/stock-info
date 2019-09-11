import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Login } from '../api.login';
import { JwtService } from '../jwt.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  selectedlogin: Login = {id: null, password: null};
  loginsuccess: Login;

  constructor(private apiService: ApiService, private jwtService: JwtService) { }

  ngOnInit() {  }

  letlogin(form){

      this.apiService.matchLogin(this.selectedlogin).subscribe((token: string)=>{
        console.log(this.jwtService.getToken());
        if(this.jwtService.getToken()!='null'){console.log("Login successful");}
        else {console.log("Try again");}
      });

  }
}
