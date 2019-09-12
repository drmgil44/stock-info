import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from '../api.service';
import { Join } from '../api.userinfo';


@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css']
})
export class JoinComponent implements OnInit {
  newjoin: Join = {id: null, password: null, name:null};
  msgalert: String = null;

  constructor(
    private apiService: ApiService,
    private router:Router,
  ) { }

  ngOnInit() {
  }

  tryjoin(form){
    if(this.newjoin.id.length>4 && this.newjoin.password.length>3 && this.newjoin.name.length>2){
      this.apiService.createAccount(this.newjoin).subscribe((result: string)=>{
        console.log(result);
        if(result['status']=='join'){ // if Join successful
          this.router.navigate(["login"]);
        }else if(result['status']=='error'){  // if duplicated id exists
          this.msgalert="Sorry, the ID is aleady taken. Please use different ID";
        }else {      // unexprected error
          this.msgalert="Sorry, unexprected error occured. Please try it again";
        }
      });
    }else{
      if(this.newjoin.id.length<=4) {this.msgalert="ID must be at least five letter";}
      else if(this.newjoin.password.length<=3) {this.msgalert="Password must be at least four letter";}
      else this.msgalert="Name must be at least three letter";
    }
  }
}
