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
  loginsucess: Login;
  constructor(private apiService: ApiService) { }

  ngOnInit() {  }

  letlogin(form){
    if(this.selectedlogin && this.selectedlogin.id){
      form.value.id = this.selectedlogin.id;
      this.apiService.matchLogin(this.selectedlogin).subscribe((login: Login)=>{
        this.loginsucess=login;  // after
        console.log(this.loginsucess);
      });
    }

  }
}
