import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Login } from '../api.login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  selectedlogin: Login = {id: null, password: null};
  loginsuccess: Login;
  constructor(private apiService: ApiService) { }

  ngOnInit() {  }

  letlogin(form){

      this.apiService.matchLogin(this.selectedlogin).subscribe((token: string)=>{
        console.log(this.apiService.getToken());
        if(this.apiService.getToken()!="null"){console.log("Login successful");}
        else {console.log("Try again");}
      });


  }
}
