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

      this.apiService.matchLogin(this.selectedlogin).subscribe((login: Login)=>{
        this.loginsuccess=login;  // get value from server 
        console.log(this.loginsuccess);
        if(this.loginsuccess.id == this.loginsuccess.password){ //login success
          this.selectedlogin.id=null; this.selectedlogin.password=null;
        }
      });


  }
}
